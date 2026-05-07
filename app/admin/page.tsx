'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient, createRawClient } from '@/lib/supabase'
import { Check, X, Eye, Edit, Clock, TrendingUp, FileText, Users, BookOpen, Shield, ChevronDown, Search, Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import type { Article, Profile } from '@/lib/supabase'
import Link from 'next/link'

type Tab = 'pending' | 'published' | 'rejected' | 'all'

export default function AdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, published: 0, users: 0 })
  const [tab, setTab] = useState<Tab>('pending')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionNote, setActionNote] = useState<{ id: string, note: string } | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const supabase = createBrowserClient()
  const db = createRawClient()
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [tab, search])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/masuk'); return }
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!data || !['admin', 'editor'].includes((data as any).role)) { router.push('/'); return }
    setProfile(data as any)
    fetchStats()
    setLoading(false)
  }

  const fetchStats = async () => {
    const [total, pending, published, users] = await Promise.all([
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])
    setStats({ total: total.count || 0, pending: pending.count || 0, published: published.count || 0, users: users.count || 0 })
  }

  const fetchArticles = async () => {
    let query = supabase.from('articles').select('*, profiles(*), categories(*)').order('created_at', { ascending: false })
    if (tab !== 'all') query = query.eq('status', tab)
    if (search) query = query.ilike('title', `%${search}%`)
    const { data } = await query.limit(50)
    setArticles(data as Article[] || [])
  }

  const publishArticle = async (articleId: string) => {
    await db.from('articles').update({ status: 'published', published_at: new Date().toISOString() } as any).eq('id', articleId)
    fetchArticles()
    fetchStats()
  }

  const rejectArticle = async (articleId: string, note: string) => {
    await db.from('articles').update({ status: 'rejected', admin_note: note } as any).eq('id', articleId)
    setActionNote(null)
    fetchArticles()
    fetchStats()
  }

  const toggleHeadline = async (article: Article) => {
    await db.from('articles').update({ is_headline: !article.is_headline }).eq('id', article.id)
    fetchArticles()
  }

  const statusColor = (s: string) => ({
    pending: { bg: '#FAEEDA', text: '#854F0B' },
    published: { bg: '#ECFDF5', text: '#065F46' },
    rejected: { bg: '#FEF2F2', text: '#991B1B' },
    draft: { bg: '#F3F4F6', text: '#374151' },
  }[s] || { bg: '#F3F4F6', text: '#374151' })

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-navy mx-auto mb-4" style={{ borderColor: '#E9ECEF', borderTopColor: '#1B3A6B', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6C757D' }}>Memuat admin panel...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA' }}>
      {/* Admin header */}
      <div style={{ background: '#1B3A6B' }} className="px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.2)' }}>
              <Shield size={16} style={{ color: '#C9A84C' }} />
            </div>
            <div>
              <span style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700 }}>Admin Panel</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} className="ml-2">HUKRA</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
              {profile?.role?.toUpperCase()}
            </span>
            <Link href="/" className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>← Kembali ke Situs</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Artikel', value: stats.total, icon: <FileText size={18} />, color: '#1B3A6B' },
            { label: 'Menunggu Review', value: stats.pending, icon: <Clock size={18} />, color: '#D97706', urgent: stats.pending > 0 },
            { label: 'Dipublikasikan', value: stats.published, icon: <TrendingUp size={18} />, color: '#059669' },
            { label: 'Total Pengguna', value: stats.users, icon: <Users size={18} />, color: '#7C3AED' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 border relative overflow-hidden" style={{ borderColor: s.urgent ? '#FDE68A' : '#E9ECEF' }}>
              {s.urgent && <div className="absolute top-0 right-0 w-3 h-3 rounded-full m-2" style={{ background: '#EF4444' }} />}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6C757D' }}>{s.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15`, color: s.color }}>
                  {s.icon}
                </div>
              </div>
              <div className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Article management */}
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#E9ECEF' }}>
          <div className="p-5 border-b" style={{ borderColor: '#E9ECEF' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 18 }} className="font-bold">Manajemen Artikel</h2>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari artikel..."
                    className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#E9ECEF' }} />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4">
              {(['pending', 'published', 'rejected', 'all'] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{ background: tab === t ? '#1B3A6B' : '#F8F9FA', color: tab === t ? 'white' : '#6C757D' }}>
                  {t === 'pending' ? `Menunggu (${stats.pending})` : t === 'published' ? 'Ditayangkan' : t === 'rejected' ? 'Ditolak' : 'Semua'}
                </button>
              ))}
            </div>
          </div>

          {/* Articles list */}
          <div className="divide-y" >
            {articles.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen size={32} className="mx-auto mb-3" style={{ color: '#E9ECEF' }} />
                <p style={{ color: '#ADB5BD' }}>Tidak ada artikel</p>
              </div>
            ) : articles.map(article => {
              const sc = statusColor(article.status)
              return (
                <div key={article.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'} style={{ fontSize: 9 }}>{article.type}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: sc.bg, color: sc.text }}>
                          {article.status === 'pending' ? 'Menunggu Review' : article.status === 'published' ? 'Ditayangkan' : article.status === 'rejected' ? 'Ditolak' : 'Draft'}
                        </span>
                        {article.is_headline && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FDF8EC', color: '#C9A84C', border: '1px solid #F5E4B4' }}>★ Headline</span>}
                      </div>
                      <h3 className="font-semibold leading-snug mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 15 }}>{article.title}</h3>
                      {article.excerpt && <p className="text-sm line-clamp-2 mb-2" style={{ color: '#6C757D' }}>{article.excerpt}</p>}
                      <div className="flex items-center gap-3 text-xs" style={{ color: '#ADB5BD' }}>
                        <span className="font-medium" style={{ color: '#343A40' }}>{article.profiles?.full_name}</span>
                        <span>·</span>
                        <span>{article.categories?.name || 'Tanpa kategori'}</span>
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: id })}</span>
                        {article.status === 'published' && <><span>·</span><span>{article.view_count} views</span></>}
                      </div>
                      {article.admin_note && (
                        <div className="mt-2 text-xs px-3 py-1.5 rounded-lg" style={{ background: '#FEF2F2', color: '#991B1B' }}>
                          Catatan admin: {article.admin_note}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/artikel/${article.slug}`} target="_blank" className="p-2 rounded-lg transition-all hover:bg-gray-50" title="Preview" style={{ color: '#6C757D' }}>
                        <Eye size={15} />
                      </Link>
                      <Link href={`/admin/edit/${article.id}`} className="p-2 rounded-lg transition-all hover:bg-gray-50" title="Edit" style={{ color: '#6C757D' }}>
                        <Edit size={15} />
                      </Link>
                      {article.status === 'published' && (
                        <button onClick={() => toggleHeadline(article)} className="p-2 rounded-lg transition-all" title={article.is_headline ? 'Hapus dari Headline' : 'Jadikan Headline'}
                          style={{ background: article.is_headline ? '#FDF8EC' : 'transparent', color: article.is_headline ? '#C9A84C' : '#ADB5BD' }}>
                          <Star size={15} />
                        </button>
                      )}
                      {article.status === 'pending' && (
                        <>
                          <button onClick={() => publishArticle(article.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ background: '#ECFDF5', color: '#065F46' }}>
                            <Check size={13} />Publish
                          </button>
                          <button onClick={() => setActionNote({ id: article.id, note: '' })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ background: '#FEF2F2', color: '#991B1B' }}>
                            <X size={13} />Tolak
                          </button>
                        </>
                      )}
                      {article.status === 'rejected' && (
                        <button onClick={() => publishArticle(article.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#ECFDF5', color: '#065F46' }}>
                          <Check size={13} />Publish Sekarang
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reject modal */}
      {actionNote && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 18 }} className="font-bold mb-2">Tolak Artikel</h3>
            <p className="text-sm mb-4" style={{ color: '#6C757D' }}>Berikan alasan penolakan untuk penulis:</p>
            <textarea value={actionNote.note} onChange={e => setActionNote({ ...actionNote, note: e.target.value })}
              placeholder="Contoh: Perlu perbaikan sumber, konten kurang detail, dll."
              rows={4} className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none mb-4" style={{ borderColor: '#E9ECEF' }} />
            <div className="flex gap-3">
              <button onClick={() => setActionNote(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium" style={{ borderColor: '#E9ECEF', color: '#343A40' }}>Batal</button>
              <button onClick={() => rejectArticle(actionNote.id, actionNote.note)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#DC2626', color: 'white' }}>Tolak Artikel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

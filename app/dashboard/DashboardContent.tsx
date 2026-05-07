'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Link from 'next/link'
import { PenSquare, Eye, Heart, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import type { Article, Profile } from '@/lib/supabase'

export default function DashboardContent() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [tab, setTab] = useState<'all' | 'draft' | 'pending' | 'published' | 'rejected'>('all')
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const submitted = searchParams.get('submitted')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/masuk'); return }
      supabase.from('profiles').select('*').eq('id', data.user.id).single()
        .then(({ data: p }) => { setProfile(p as any); setLoading(false) })
    })
  }, [])

  useEffect(() => {
    if (!profile) return
    let q = supabase.from('articles').select('*, categories(*)').eq('author_id', (profile as any).id).order('created_at', { ascending: false })
    if (tab !== 'all') q = (q as any).eq('status', tab)
    q.then(({ data }) => setArticles((data as any[]) || []))
  }, [profile, tab])

  const deleteArticle = async (id: string) => {
    if (!confirm('Yakin hapus artikel ini?')) return
    await supabase.from('articles').delete().eq('id', id)
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  const statusLabel = (s: string) => ({ draft: 'Draft', pending: 'Menunggu Review', published: 'Ditayangkan', rejected: 'Ditolak' }[s] || s)
  const statusColor = (s: string) => ({ draft: '#6B7280', pending: '#D97706', published: '#059669', rejected: '#DC2626' }[s] || '#6B7280')
  const statusIcon = (s: string) => {
    const icons: any = { draft: <Clock size={12}/>, pending: <Clock size={12}/>, published: <CheckCircle size={12}/>, rejected: <XCircle size={12}/> }
    return icons[s]
  }

  const totalViews = articles.reduce((s, a) => s + (a.view_count || 0), 0)
  const totalLikes = articles.reduce((s, a) => s + (a.like_count || 0), 0)
  const published = articles.filter(a => a.status === 'published').length

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div style={{width:32,height:32,borderRadius:'50%',border:'3px solid #E9ECEF',borderTopColor:'#1B3A6B',animation:'spin 1s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {submitted && (
        <div className="mb-6 px-5 py-4 rounded-xl flex items-center gap-3" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <CheckCircle size={18} style={{ color: '#059669' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#065F46' }}>Artikel berhasil dikirim untuk review!</p>
            <p className="text-xs" style={{ color: '#6EE7B7' }}>Admin akan mereview dalam 1-2 hari kerja.</p>
          </div>
        </div>
      )}

      {/* Profile header */}
      <div className="bg-white rounded-2xl border p-6 mb-6 flex items-center justify-between" style={{ borderColor: '#E9ECEF' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>
            {profile?.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 20 }} className="font-bold">{profile?.full_name}</h1>
            <p className="text-sm" style={{ color: '#6C757D' }}>@{profile?.username}</p>
          </div>
        </div>
        <Link href="/tulis" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm" style={{ background: '#1B3A6B', color: 'white' }}>
          <PenSquare size={15} /> Tulis Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Artikel', value: articles.length, icon: <FileText size={16}/>, color: '#1B3A6B' },
          { label: 'Ditayangkan', value: published, icon: <CheckCircle size={16}/>, color: '#059669' },
          { label: 'Total Views', value: totalViews, icon: <Eye size={16}/>, color: '#7C3AED' },
          { label: 'Total Likes', value: totalLikes, icon: <Heart size={16}/>, color: '#DB2777' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#E9ECEF' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#6C757D' }}>{s.label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: s.color }}>{s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Articles table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#E9ECEF' }}>
        <div className="p-5 border-b" style={{ borderColor: '#E9ECEF' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 18 }} className="font-bold">Artikel Saya</h2>
        </div>
        <div className="flex gap-1 px-4 pt-3 border-b" style={{ borderColor: '#E9ECEF' }}>
          {(['all','published','pending','draft','rejected'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-3 py-2 text-xs font-semibold capitalize transition-all"
              style={{ color: tab===t ? '#1B3A6B' : '#6C757D', borderBottom: tab===t ? '2px solid #1B3A6B' : '2px solid transparent' }}>
              {t==='all' ? 'Semua' : statusLabel(t)}
            </button>
          ))}
        </div>

        <div>
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <PenSquare size={32} className="mx-auto mb-3" style={{ color: '#E9ECEF' }} />
              <p style={{ color: '#ADB5BD' }} className="mb-4">Belum ada artikel</p>
              <Link href="/tulis" className="px-5 py-2 rounded-xl text-sm font-semibold" style={{ background: '#1B3A6B', color: 'white' }}>Mulai Menulis</Link>
            </div>
          ) : articles.map(a => (
            <div key={a.id} className="p-4 flex items-start justify-between gap-4 border-b" style={{ borderColor: '#F8F9FA' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={a.type === 'berita' ? 'badge-berita' : 'badge-opini'} style={{ fontSize: 9 }}>{a.type}</span>
                  <div className="flex items-center gap-1 text-xs" style={{ color: statusColor(a.status) }}>
                    {statusIcon(a.status)} {statusLabel(a.status)}
                  </div>
                </div>
                <h3 className="font-medium line-clamp-1 mb-1" style={{ color: '#0d2347', fontFamily: 'Playfair Display, serif' }}>{a.title}</h3>
                <div className="flex items-center gap-3 text-xs" style={{ color: '#ADB5BD' }}>
                  <span>{formatDistanceToNow(new Date(a.created_at), { addSuffix: true, locale: id })}</span>
                  {a.status === 'published' && (
                    <><span className="flex items-center gap-1"><Eye size={10}/>{a.view_count}</span><span className="flex items-center gap-1"><Heart size={10}/>{a.like_count}</span></>
                  )}
                </div>
                {a.status === 'rejected' && (a as any).admin_note && (
                  <p className="text-xs mt-1.5 px-2 py-1 rounded" style={{ background: '#FEF2F2', color: '#991B1B' }}>Alasan: {(a as any).admin_note}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {a.status === 'published' && (
                  <Link href={`/artikel/${a.slug}`} className="text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: '#E9ECEF', color: '#343A40' }}>Lihat</Link>
                )}
                <button onClick={() => deleteArticle(a.id)} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: '#FEF2F2', color: '#DC2626' }}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

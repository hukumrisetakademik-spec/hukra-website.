'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Link from 'next/link'
import { Eye, Heart, MessageCircle, ArrowLeft, Tag } from 'lucide-react'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    const slug = params.slug as string
    if (!slug) return

    supabase
      .from('articles')
      .select('*, profiles(*), categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setLoading(false)
          return
        }
        setArticle(data)
        setLoading(false)

        // increment view
        supabase.rpc('increment_view_count' as any, { article_id: data.id }).then(() => {})

        // get related
        supabase.from('articles').select('id,title,slug,type,cover_image')
          .eq('status', 'published').neq('id', data.id).limit(3)
          .then(({ data: rel }) => setRelated(rel || []))
      })
  }, [params.slug])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E9ECEF', borderTopColor: '#1B3A6B', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!article) return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-4">
      <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#0d2347' }}>Artikel tidak ditemukan</p>
      <Link href="/" style={{ color: '#1B3A6B' }}>← Kembali ke Beranda</Link>
    </div>
  )

  const a = article
  const authorName = a.profiles?.full_name || 'Tim HUKRA'
  const categoryName = a.categories?.name || ''
  const readTime = Math.max(1, Math.ceil((a.content?.split(' ').length || 100) / 200))
  const publishedDate = new Date(a.published_at || a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <article className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70" style={{ color: '#1B3A6B' }}>
            <ArrowLeft size={14} /> Beranda
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className={a.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{a.type}</span>
            {categoryName && <span className="text-sm" style={{ color: '#6C757D' }}>{categoryName}</span>}
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 28, lineHeight: 1.3 }} className="font-bold mb-4">
            {a.title}
          </h1>

          {a.excerpt && (
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#6C757D', fontStyle: 'italic' }}>{a.excerpt}</p>
          )}

          <div className="flex items-center justify-between py-4 border-y mb-6" style={{ borderColor: '#E9ECEF' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>
                {authorName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0d2347' }}>{authorName}</p>
                <p className="text-xs" style={{ color: '#ADB5BD' }}>{publishedDate} · {readTime} menit baca</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: '#ADB5BD' }}>
              <span className="flex items-center gap-1"><Eye size={12} />{a.view_count || 0}</span>
              <span className="flex items-center gap-1"><Heart size={12} />{a.like_count || 0}</span>
            </div>
          </div>

          {a.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-8" style={{ maxHeight: 460 }}>
              <img src={a.cover_image} alt={a.title} className="w-full object-cover" />
            </div>
          )}

          <div className="article-content mb-8" dangerouslySetInnerHTML={{ __html: a.content || '' }} />

          {a.tags && a.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-6 border-t mb-6" style={{ borderColor: '#E9ECEF' }}>
              <Tag size={13} style={{ color: '#ADB5BD' }} />
              {a.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 py-6 border-y mb-8" style={{ borderColor: '#E9ECEF' }}>
            <LikeButton articleId={a.id} initialLikes={a.like_count || 0} />
            <span className="flex items-center gap-2 text-sm" style={{ color: '#6C757D' }}>
              <MessageCircle size={16} /> {a.comment_count || 0} Komentar
            </span>
          </div>

          <div className="rounded-2xl p-6 mb-8" style={{ background: 'linear-gradient(135deg, #EFF4FF, #F8F9FA)', border: '1px solid #C3D3F0' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: '#1B3A6B', color: '#C9A84C' }}>
                {authorName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold" style={{ color: '#0d2347' }}>{authorName}</p>
                {a.profiles?.bio && <p className="text-sm mt-1" style={{ color: '#6C757D' }}>{a.profiles.bio}</p>}
              </div>
            </div>
          </div>

          <CommentSection articleId={a.id} />
        </div>

        <aside className="space-y-6">
          {related.length > 0 && (
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E9ECEF' }}>
              <span className="section-title block mb-4">Artikel Terkait</span>
              <div className="space-y-4 mt-3">
                {related.map(r => (
                  <Link key={r.id} href={`/artikel/${r.slug}`} className="flex gap-3 group">
                    {r.cover_image ? (
                      <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0">
                        <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-14 rounded-lg shrink-0 flex items-center justify-center text-xl" style={{ background: '#EFF4FF' }}>⚖️</div>
                    )}
                    <div>
                      <span className={r.type === 'berita' ? 'badge-berita' : 'badge-opini'} style={{ fontSize: 9, display: 'inline-block', marginBottom: 4 }}>{r.type}</span>
                      <h4 className="text-sm font-medium line-clamp-2 group-hover:underline" style={{ color: '#0d2347' }}>{r.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0d2347)' }}>
            <p className="font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Punya pendapat berbeda?</p>
            <p className="text-sm mb-4 opacity-70">Tulis opini atau tanggapanmu di HUKRA.</p>
            <Link href="/tulis" className="block text-center text-sm font-semibold py-2.5 rounded-lg" style={{ background: '#C9A84C', color: '#1B3A6B' }}>Tulis Sekarang</Link>
          </div>
        </aside>
      </div>
    </article>
  )
}

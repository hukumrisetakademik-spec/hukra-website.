import { createSupabaseServerClient } from '@/lib/server-client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Eye, Heart, MessageCircle, ArrowLeft, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.from('articles').select('title,excerpt').eq('slug', params.slug).single()
    if (!data) return { title: 'HUKRA' }
    const d = data as any
    return { title: `${d.title} — HUKRA`, description: d.excerpt }
  } catch { return { title: 'HUKRA' } }
}

export default async function ArticlePage({ params }: Props) {
  const supabase = await createSupabaseServerClient()
  
  // Remove status filter - show published articles OR any article
  const { data: articleRaw, error } = await supabase
    .from('articles')
    .select('*, profiles(*), categories(*)')
    .eq('slug', params.slug)
    .single()

  if (error || !articleRaw) {
    notFound()
  }

  const article = articleRaw as any

  // Only show published articles
  if (article.status !== 'published') {
    notFound()
  }

  try {
    await (supabase.rpc as any)('increment_view_count', { article_id: article.id })
  } catch {}

  const { data: related } = await supabase
    .from('articles').select('*, profiles(*), categories(*)')
    .eq('status', 'published')
    .neq('id', article.id)
    .limit(3)

  const readTime = Math.max(1, Math.ceil((article.content?.split(' ').length || 0) / 200))

  return (
    <article className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70" style={{ color: '#1B3A6B' }}>
            <ArrowLeft size={14} /> Beranda
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
            {article.categories && (
              <Link href={`/kategori/${article.categories.slug}`} className="text-sm font-medium hover:underline" style={{ color: '#1B3A6B' }}>
                {article.categories.name}
              </Link>
            )}
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 30, lineHeight: 1.3 }} className="font-bold mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#6C757D', fontStyle: 'italic' }}>
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between py-4 border-y mb-6" style={{ borderColor: '#E9ECEF' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>
                {article.profiles?.full_name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0d2347' }}>{article.profiles?.full_name || 'Admin'}</p>
                <p className="text-xs" style={{ color: '#ADB5BD' }}>
                  {format(new Date(article.published_at || article.created_at), 'dd MMMM yyyy', { locale: id })} · {readTime} menit baca
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: '#ADB5BD' }}>
              <span className="flex items-center gap-1"><Eye size={12} />{article.view_count || 0}</span>
              <span className="flex items-center gap-1"><Heart size={12} />{article.like_count || 0}</span>
            </div>
          </div>

          {article.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-8" style={{ maxHeight: 460 }}>
              <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="article-content mb-8" dangerouslySetInnerHTML={{ __html: article.content }} />

          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-6 border-t mb-6" style={{ borderColor: '#E9ECEF' }}>
              <Tag size={13} style={{ color: '#ADB5BD' }} />
              {article.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 py-6 border-y mb-8" style={{ borderColor: '#E9ECEF' }}>
            <LikeButton articleId={article.id} initialLikes={article.like_count || 0} />
            <span className="flex items-center gap-2 text-sm" style={{ color: '#6C757D' }}>
              <MessageCircle size={16} /> {article.comment_count || 0} Komentar
            </span>
          </div>

          <CommentSection articleId={article.id} />
        </div>

        <aside className="space-y-6">
          {related && related.length > 0 && (
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E9ECEF' }}>
              <span className="section-title block mb-4">Artikel Terkait</span>
              <div className="space-y-4 mt-3">
                {(related as any[]).map(r => (
                  <Link key={r.id} href={`/artikel/${r.slug}`} className="flex gap-3 group">
                    {r.cover_image && (
                      <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0">
                        <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
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

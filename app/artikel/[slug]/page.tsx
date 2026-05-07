import { createSupabaseServerClient } from '@/lib/server-client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Eye, Heart, MessageCircle, ArrowLeft, Tag } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'
import type { Article } from '@/lib/supabase'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('articles').select('title,excerpt').eq('slug', params.slug).single()
  if (!data) return { title: 'Artikel tidak ditemukan' }
  const d = data as any
  return { title: `${d.title} — HUKRA`, description: d.excerpt }
}

export default async function ArticlePage({ params }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: articleRaw } = await supabase
    .from('articles').select('*, profiles(*), categories(*)')
    .eq('slug', params.slug).eq('status', 'published').single()
  const article = articleRaw as any

  if (!article) notFound()

  await (supabase.rpc as any)('increment_view_count', { article_id: article.id })

  const { data: related } = await supabase
    .from('articles').select('*, profiles(*), categories(*)')
    .eq('status', 'published').eq('category_id', article.category_id)
    .neq('id', article.id).limit(3)

  const readTime = Math.ceil((article.content?.split(' ').length || 0) / 200)

  return (
    <article className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity" style={{ color: '#1B3A6B' }}>
            <ArrowLeft size={14} /> Beranda
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
            {article.categories && (
              <Link href={`/kategori/${(article as any).categories.slug}`} className="text-sm font-medium hover:underline" style={{ color: '#1B3A6B' }}>
                {(article as any).categories.name}
              </Link>
            )}
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 30, lineHeight: 1.3 }} className="font-bold mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#6C757D', fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between py-4 border-y mb-6" style={{ borderColor: '#E9ECEF' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>
                {(article as any).profiles?.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0d2347' }}>{(article as any).profiles?.full_name}</p>
                <p className="text-xs" style={{ color: '#ADB5BD' }}>
                  {format(new Date(article.published_at || article.created_at), 'dd MMMM yyyy', { locale: id })} · {readTime} menit baca
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: '#ADB5BD' }}>
              <span className="flex items-center gap-1"><Eye size={12} />{article.view_count}</span>
              <span className="flex items-center gap-1"><Heart size={12} />{article.like_count}</span>
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
            <LikeButton articleId={article.id} initialLikes={article.like_count} />
            <span className="flex items-center gap-2 text-sm" style={{ color: '#6C757D' }}>
              <MessageCircle size={16} /> {article.comment_count} Komentar
            </span>
          </div>

          <div className="rounded-2xl p-6 mb-8" style={{ background: 'linear-gradient(135deg, #EFF4FF, #F8F9FA)', border: '1px solid #C3D3F0' }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: '#1B3A6B', color: '#C9A84C' }}>
                {(article as any).profiles?.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: '#0d2347' }}>{(article as any).profiles?.full_name}</p>
                {(article as any).profiles?.bio && <p className="text-sm" style={{ color: '#6C757D' }}>{(article as any).profiles.bio}</p>}
              </div>
            </div>
          </div>

          <CommentSection articleId={article.id} />
        </div>

        <aside className="space-y-6">
          {related && related.length > 0 && (
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E9ECEF' }}>
              <span className="section-title block mb-4">Artikel Terkait</span>
              <div className="space-y-4 mt-3">
                {related.map((r: any) => (
                  <Link key={r.id} href={`/artikel/${r.slug}`} className="flex gap-3 group">
                    {r.cover_image && (
                      <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0">
                        <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div>
                      <span className={r.type === 'berita' ? 'badge-berita' : 'badge-opini'} style={{ fontSize: 9, marginBottom: 4, display: 'inline-block' }}>{r.type}</span>
                      <h4 className="text-sm font-medium line-clamp-2 group-hover:underline" style={{ color: '#0d2347', lineHeight: 1.4 }}>{r.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0d2347)' }}>
            <p className="font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Punya pendapat berbeda?</p>
            <p className="text-sm mb-4 opacity-70">Tulis opini atau tanggapanmu di Hukra.</p>
            <Link href="/tulis" className="block text-center text-sm font-semibold py-2.5 rounded-lg" style={{ background: '#C9A84C', color: '#1B3A6B' }}>Tulis Sekarang</Link>
          </div>
        </aside>
      </div>
    </article>
  )
}

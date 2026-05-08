'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Link from 'next/link'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    const slug = params.slug as string
    if (!slug) return
    supabase.from('articles').select('*, profiles(*), categories(*)')
      .eq('slug', slug).eq('status', 'published').single()
      .then(({ data, error }) => {
        if (error || !data) { setLoading(false); return }
        setArticle(data)
        setLoading(false)
        supabase.rpc('increment_view_count' as any, { article_id: data.id }).then(() => {})
        supabase.from('articles').select('id,title,slug,type,cover_image,profiles(full_name)')
          .eq('status', 'published').neq('id', data.id).limit(4)
          .then(({ data: rel }) => setRelated(rel || []))
      })
  }, [params.slug])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid #E9ECEF', borderTopColor:'#1B3A6B', animation:'spin 1s linear infinite', margin:'0 auto 12px' }} />
        <p style={{ color:'#ADB5BD', fontSize:14 }}>Memuat artikel...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!article) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16 }}>
      <div style={{ fontSize:48 }}>📄</div>
      <p style={{ fontFamily:'Playfair Display,serif', fontSize:20, color:'#0d2347' }}>Berita tidak ditemukan</p>
      <Link href="/" style={{ color:'#1B3A6B', fontWeight:600, textDecoration:'none' }}>← Kembali ke Beranda</Link>
    </div>
  )

  const a = article
  const authorName = a.profiles?.full_name || 'Tim HUKRA'
  const categoryName = a.categories?.name || ''
  const readTime = Math.max(1, Math.ceil((a.content?.split(' ').length || 100) / 200))
  const publishedDate = new Date(a.published_at || a.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })

  return (
    <div style={{ background:'#F8F9FA', minHeight:'100vh' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .article-content{font-family:'DM Sans',system-ui,sans-serif;font-size:1.05rem;line-height:1.85;color:#2d3748}
        .article-content p{margin-bottom:1.25em}
        .article-content h2{font-family:'Playfair Display',serif;color:#0d2347;font-size:1.5rem;margin-top:1.75em;margin-bottom:.5em}
        .article-content h3{font-family:'Playfair Display',serif;color:#0d2347;font-size:1.25rem;margin-top:1.5em;margin-bottom:.5em}
        .article-content blockquote{border-left:4px solid #C9A84C;padding:.75em 1.25em;margin:1.75em 0;background:rgba(201,168,76,.06);font-style:italic;border-radius:0 8px 8px 0}
        .article-content ul{list-style:disc;padding-left:1.5em;margin-bottom:1em}
        .article-content ol{list-style:decimal;padding-left:1.5em;margin-bottom:1em}
        .article-content li{margin-bottom:.35em}
        .article-content img{max-width:100%;border-radius:10px;margin:1.5em 0}
        .article-content a{color:#1B3A6B;text-decoration:underline}
        .article-content strong{font-weight:700;color:#1a1a2e}
        @media(max-width:768px){.article-grid{grid-template-columns:1fr!important}.article-sidebar{display:none}}
      `}</style>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 16px' }}>
        <div className="article-grid" style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:32, alignItems:'start' }}>
          {/* MAIN ARTICLE */}
          <div>
            {/* Breadcrumb */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontSize:13, color:'#6C757D' }}>
              <Link href="/" style={{ color:'#1B3A6B', textDecoration:'none', fontWeight:500 }}>← Beranda</Link>
              {categoryName && <><span>/</span><span>{categoryName}</span></>}
            </div>

            {/* Article card */}
            <div style={{ background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.06)', marginBottom:24 }}>
              {/* Header */}
              <div style={{ padding:'28px 28px 0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
                  <span style={{ display:'inline-flex', padding:'3px 10px', borderRadius:5, fontSize:11, fontWeight:700, background: a.type==='berita'?'#1B3A6B':'#C9A84C', color: a.type==='berita'?'#C9A84C':'#1B3A6B', textTransform:'uppercase', letterSpacing:'.08em' }}>{a.type}</span>
                  {categoryName && <Link href={`/kategori/${a.categories?.slug}`} style={{ fontSize:13, color:'#1B3A6B', textDecoration:'none', fontWeight:500 }}>{categoryName}</Link>}
                </div>

                <h1 style={{ fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:'clamp(22px,4vw,32px)', fontWeight:700, lineHeight:1.25, marginBottom:16 }}>
                  {a.title}
                </h1>

                {a.excerpt && (
                  <p style={{ color:'#4A5568', fontSize:16, lineHeight:1.7, fontStyle:'italic', marginBottom:20, borderLeft:'3px solid #C9A84C', paddingLeft:16 }}>
                    {a.excerpt}
                  </p>
                )}

                {/* Author row */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:20, borderBottom:'1px solid #F1F3F5', flexWrap:'wrap', gap:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#1B3A6B,#2a4f8f)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#C9A84C', flexShrink:0 }}>
                      {authorName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:'#0d2347' }}>{authorName}</div>
                      <div style={{ fontSize:12, color:'#ADB5BD' }}>{publishedDate} · {readTime} menit baca</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:13, color:'#ADB5BD' }}>
                    <span>👁 {a.view_count || 0}</span>
                    <span>❤️ {a.like_count || 0}</span>
                    <span>💬 {a.comment_count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Cover image */}
              {a.cover_image && (
                <div style={{ margin:'20px 0' }}>
                  <img src={a.cover_image} alt={a.title} style={{ width:'100%', maxHeight:420, objectFit:'cover' }} />
                </div>
              )}

              {/* Content */}
              <div style={{ padding:'4px 28px 28px' }}>
                <div className="article-content" dangerouslySetInnerHTML={{ __html: a.content || '' }} />

                {/* Tags */}
                {a.tags && a.tags.length > 0 && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', paddingTop:20, borderTop:'1px solid #F1F3F5', marginTop:20 }}>
                    <span style={{ fontSize:13, color:'#ADB5BD' }}>🏷️</span>
                    {a.tags.map((tag: string) => (
                      <span key={tag} style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:500, background:'#EFF4FF', color:'#1B3A6B', border:'1px solid #C3D3F0' }}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:20, borderTop:'1px solid #F1F3F5', marginTop:20, flexWrap:'wrap' }}>
                  <LikeButton articleId={a.id} initialLikes={a.like_count || 0} />
                  <span style={{ color:'#6C757D', fontSize:14 }}>💬 {a.comment_count || 0} Komentar</span>
                </div>
              </div>
            </div>

            {/* Author box */}
            <div style={{ background:'white', borderRadius:16, padding:24, marginBottom:24, boxShadow:'0 2px 16px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#1B3A6B,#0d2347)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'#C9A84C', flexShrink:0 }}>
                {authorName[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:'#0d2347', marginBottom:4 }}>{authorName}</div>
                {a.profiles?.bio && <p style={{ fontSize:13, color:'#6C757D', lineHeight:1.5 }}>{a.profiles.bio}</p>}
                {!a.profiles?.bio && <p style={{ fontSize:13, color:'#ADB5BD' }}>Kontributor HUKRA</p>}
              </div>
            </div>

            {/* Comments */}
            <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
              <CommentSection articleId={a.id} />
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="article-sidebar" style={{ position:'sticky', top:80 }}>
            {/* Related */}
            {related.length > 0 && (
              <div style={{ background:'white', borderRadius:16, padding:20, marginBottom:20, boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.15em', color:'#1B3A6B', paddingLeft:10, borderLeft:'3px solid #C9A84C', marginBottom:16 }}>Berita Terkait</div>
                {related.map(r => (
                  <Link key={r.id} href={`/artikel/${r.slug}`} style={{ display:'flex', gap:12, paddingBottom:14, marginBottom:14, borderBottom:'1px solid #F8F9FA', textDecoration:'none' }}>
                    <div style={{ width:64, height:52, borderRadius:8, overflow:'hidden', flexShrink:0, background:'#EFF4FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                      {r.cover_image ? <img src={r.cover_image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '⚖️'}
                    </div>
                    <div>
                      <span style={{ display:'inline-block', padding:'1px 7px', borderRadius:3, fontSize:9, fontWeight:700, background:r.type==='berita'?'#1B3A6B':'#C9A84C', color:r.type==='berita'?'#C9A84C':'#1B3A6B', textTransform:'uppercase', marginBottom:5 }}>{r.type}</span>
                      <div style={{ fontSize:13, fontWeight:500, color:'#0d2347', lineHeight:1.4 }}>{r.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* CTA */}
            <div style={{ background:'linear-gradient(135deg,#1B3A6B,#0d2347)', borderRadius:16, padding:20, color:'white' }}>
              <div style={{ fontSize:24, marginBottom:10 }}>✍️</div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:16, fontWeight:700, marginBottom:8 }}>Punya pendapat berbeda?</div>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, lineHeight:1.6, marginBottom:16 }}>Tulis opini atau tanggapanmu di HUKRA.</p>
              <Link href="/tulis" style={{ display:'block', textAlign:'center', padding:'10px', borderRadius:10, background:'#C9A84C', color:'#1B3A6B', fontSize:13, fontWeight:700, textDecoration:'none' }}>Tulis Sekarang</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

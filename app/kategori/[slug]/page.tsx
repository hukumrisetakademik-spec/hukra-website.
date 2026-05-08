'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Link from 'next/link'

export default function KategoriPage() {
  const params = useParams()
  const [category, setCategory] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    const slug = params.slug as string
    if (!slug) return

    supabase.from('categories').select('*').eq('slug', slug).single()
      .then(({ data: cat }) => {
        if (!cat) { setLoading(false); return }
        setCategory(cat)
        supabase.from('articles').select('*, profiles(*), categories(*)')
          .eq('status', 'published').eq('category_id', cat.id)
          .order('published_at', { ascending: false }).limit(24)
          .then(({ data }) => { setArticles(data || []); setLoading(false) })
      })
  }, [params.slug])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #E9ECEF', borderTopColor:'#1B3A6B', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!category) return (
    <div style={{ textAlign:'center', padding:'80px 24px' }}>
      <p style={{ color:'#ADB5BD', fontSize:16 }}>Kategori tidak ditemukan</p>
      <Link href="/" style={{ color:'#1B3A6B', marginTop:12, display:'inline-block' }}>← Kembali</Link>
    </div>
  )

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 24px' }}>
      <div style={{ marginBottom:32, paddingBottom:20, borderBottom:'1px solid #E9ECEF' }}>
        <span style={{ display:'inline-block', padding:'6px 14px', borderRadius:20, fontSize:13, fontWeight:700, background:`${category.color}18`, color:category.color, border:`1px solid ${category.color}35`, marginBottom:12 }}>
          {category.name}
        </span>
        <h1 style={{ fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:28, fontWeight:700 }}>{category.name}</h1>
        {category.description && <p style={{ color:'#6C757D', marginTop:8 }}>{category.description}</p>}
      </div>

      {articles.length > 0 ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
          {articles.map(a => (
            <Link key={a.id} href={`/artikel/${a.slug}`} style={{ background:'white', borderRadius:12, border:'1px solid #E9ECEF', overflow:'hidden', textDecoration:'none', display:'block' }}>
              <div style={{ height:160, background:'linear-gradient(135deg,#EFF4FF,#E9ECEF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>
                {a.cover_image ? <img src={a.cover_image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '⚖️'}
              </div>
              <div style={{ padding:16 }}>
                <span style={{ display:'inline-flex', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700, background: a.type==='berita'?'#1B3A6B':'#C9A84C', color: a.type==='berita'?'#C9A84C':'#1B3A6B', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{a.type}</span>
                <h3 style={{ fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:15, fontWeight:600, lineHeight:1.4, marginBottom:8 }}>{a.title}</h3>
                <p style={{ color:'#ADB5BD', fontSize:12 }}>{a.profiles?.full_name} · {new Date(a.published_at||a.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'60px 20px', background:'white', borderRadius:12, border:'1px solid #E9ECEF' }}>
          <p style={{ color:'#ADB5BD', fontSize:15 }}>Belum ada artikel dalam kategori ini.</p>
          <Link href="/tulis" style={{ color:'#1B3A6B', marginTop:12, display:'inline-block', fontWeight:600 }}>Tulis Artikel Pertama →</Link>
        </div>
      )}
    </div>
  )
}

import { createSupabaseServerClient } from '@/lib/server-client'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const [l, tr, op, ne, ca] = await Promise.all([
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').order('published_at',{ascending:false}).limit(8),
    supabase.from('articles').select('id,title,slug,view_count,type').eq('status','published').order('view_count',{ascending:false}).limit(5),
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').eq('type','opini').order('published_at',{ascending:false}).limit(3),
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').eq('type','berita').order('published_at',{ascending:false}).limit(4),
    supabase.from('categories').select('*').order('name'),
  ])
  const latest=(l.data||[]) as any[]
  const trending=(tr.data||[]) as any[]
  const opinions=(op.data||[]) as any[]
  const news=(ne.data||[]) as any[]
  const cats=(ca.data||[]) as any[]

  const S = {
    hero: { background:'linear-gradient(135deg,#0d2347 0%,#1B3A6B 100%)', padding:'60px 24px' },
    heroInner: { maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr auto', gap:40, alignItems:'center' },
    badge: { display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:20, background:'rgba(201,168,76,0.15)', color:'#C9A84C', border:'1px solid rgba(201,168,76,0.3)', fontSize:12, fontWeight:600, marginBottom:20 },
    h1: { fontFamily:'Playfair Display,serif', color:'white', fontSize:38, lineHeight:1.2, fontWeight:700, marginBottom:16 },
    gold: { color:'#C9A84C' },
    heroDesc: { color:'rgba(255,255,255,0.75)', fontSize:16, lineHeight:1.7, marginBottom:28 },
    btnGold: { display:'inline-block', padding:'12px 24px', borderRadius:10, background:'#C9A84C', color:'#1B3A6B', fontWeight:700, fontSize:14, marginRight:12 },
    btnOutline: { display:'inline-block', padding:'12px 24px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.3)', color:'white', fontWeight:600, fontSize:14 },
    heroLogo: { width:220, height:220, borderRadius:24, objectFit:'cover' as const, border:'3px solid rgba(201,168,76,0.4)', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' },
    main: { maxWidth:1200, margin:'0 auto', padding:'32px 24px', display:'grid', gridTemplateColumns:'1fr 340px', gap:32 },
    sectionTitle: { fontSize:11, fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.15em', color:'#1B3A6B', paddingLeft:10, borderLeft:'3px solid #C9A84C' },
    sectionHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 },
    seeAll: { fontSize:12, fontWeight:600, color:'#1B3A6B' },
    articleRow: { display:'flex', gap:16, background:'white', borderRadius:12, padding:16, border:'1px solid #E9ECEF', marginBottom:12, textDecoration:'none', color:'inherit', transition:'box-shadow .2s' },
    articleThumb: { width:80, height:64, borderRadius:8, overflow:'hidden', flexShrink:0, background:'#EFF4FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 },
    articleMeta: { flex:1, minWidth:0 },
    articleTitle: { fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:14, fontWeight:600, lineHeight:1.4, marginTop:6, marginBottom:4 },
    articleDate: { color:'#ADB5BD', fontSize:12 },
    card: { background:'white', borderRadius:12, border:'1px solid #E9ECEF', overflow:'hidden', textDecoration:'none', color:'inherit', display:'block' },
    cardImg: { height:130, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#EFF4FF,#E9ECEF)', fontSize:36 },
    cardBody: { padding:14 },
    sidebar: { display:'flex', flexDirection:'column' as const, gap:20 },
    sideCard: { background:'white', borderRadius:12, border:'1px solid #E9ECEF', padding:20 },
    badgeBerita: { display:'inline-flex', alignItems:'center', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700, background:'#1B3A6B', color:'#C9A84C', letterSpacing:'0.08em', textTransform:'uppercase' as const },
    badgeOpini: { display:'inline-flex', alignItems:'center', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700, background:'#C9A84C', color:'#1B3A6B', letterSpacing:'0.08em', textTransform:'uppercase' as const },
    empty: { textAlign:'center' as const, padding:'40px 20px', background:'white', borderRadius:12, border:'1px solid #E9ECEF', color:'#ADB5BD', fontSize:14 },
    ctaBox: { background:'linear-gradient(135deg,#1B3A6B,#0d2347)', borderRadius:12, padding:20, color:'white' },
  }

  return (
    <div>
      {/* HERO */}
      <div style={S.hero}>
        <div style={S.heroInner}>
          <div>
            <div style={S.badge}>📚 Platform Hukum & Riset Akademika</div>
            <h1 style={S.h1}>Wadah Riset & Opini <span style={S.gold}>Hukum Indonesia</span></h1>
            <p style={S.heroDesc}>Platform berita dan opini hukum dari mahasiswa Fakultas Syariah UIN Palangka Raya. Tulis, bagikan, dan berkontribusi.</p>
            <div>
              <Link href="/tulis" style={S.btnGold}>✍️ Mulai Menulis</Link>
              <Link href="/berita" style={S.btnOutline}>📖 Baca Artikel</Link>
            </div>
          </div>
          <div className="hide-mobile">
            <img src="/logo-hukra.jpg" alt="HUKRA" style={S.heroLogo} />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={S.main}>
        <div>
          {/* Berita */}
          <section style={{ marginBottom:32 }}>
            <div style={S.sectionHeader}>
              <span style={S.sectionTitle}>Berita Terbaru</span>
              <Link href="/berita" style={S.seeAll}>Lihat semua →</Link>
            </div>
            {news.length > 0 ? news.map((a:any) => (
              <Link key={a.id} href={`/artikel/${a.slug}`} style={S.articleRow}>
                <div style={S.articleThumb}>
                  {a.cover_image ? <img src={a.cover_image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '⚖️'}
                </div>
                <div style={S.articleMeta}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={S.badgeBerita}>Berita</span>
                    {a.categories && <span style={{ color:'#ADB5BD', fontSize:11 }}>{a.categories.name}</span>}
                  </div>
                  <div style={S.articleTitle}>{a.title}</div>
                  <div style={S.articleDate}>{a.profiles?.full_name} · {new Date(a.published_at||a.created_at).toLocaleDateString('id-ID')}</div>
                </div>
              </Link>
            )) : <div style={S.empty}>Belum ada berita. <Link href="/tulis" style={{ color:'#1B3A6B' }}>Jadilah yang pertama!</Link></div>}
          </section>

          {/* Opini */}
          <section style={{ marginBottom:32 }}>
            <div style={S.sectionHeader}>
              <span style={S.sectionTitle}>Opini Terkini</span>
              <Link href="/opini" style={S.seeAll}>Lihat semua →</Link>
            </div>
            {opinions.length > 0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {opinions.map((a:any) => (
                  <Link key={a.id} href={`/artikel/${a.slug}`} style={S.card}>
                    <div style={S.cardImg}>{a.cover_image ? <img src={a.cover_image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '📝'}</div>
                    <div style={S.cardBody}>
                      <span style={S.badgeOpini}>Opini</span>
                      <div style={{ ...S.articleTitle, fontSize:13 }}>{a.title}</div>
                      <div style={S.articleDate}>{a.profiles?.full_name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <div style={S.empty}>Belum ada opini. <Link href="/tulis" style={{ color:'#1B3A6B' }}>Tulis opinimu!</Link></div>}
          </section>

          {/* Terbaru */}
          {latest.length > 0 && (
            <section>
              <div style={S.sectionHeader}><span style={S.sectionTitle}>Semua Terbaru</span></div>
              {latest.slice(0,5).map((a:any) => (
                <Link key={a.id} href={`/artikel/${a.slug}`} style={S.articleRow}>
                  <div style={{ ...S.articleThumb, width:60, height:50, fontSize:18 }}>
                    {a.cover_image ? <img src={a.cover_image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '⚖️'}
                  </div>
                  <div style={S.articleMeta}>
                    <span style={a.type==='berita' ? S.badgeBerita : S.badgeOpini}>{a.type}</span>
                    <div style={{ ...S.articleTitle, fontSize:13 }}>{a.title}</div>
                    <div style={S.articleDate}>{a.profiles?.full_name} · {new Date(a.published_at||a.created_at).toLocaleDateString('id-ID')}</div>
                  </div>
                </Link>
              ))}
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={S.sidebar}>
          {/* Trending */}
          <div style={S.sideCard}>
            <div style={{ ...S.sectionTitle, display:'block', marginBottom:16 }}>🔥 Trending</div>
            {trending.length > 0 ? trending.map((a:any, i:number) => (
              <Link key={a.id} href={`/artikel/${a.slug}`} style={{ display:'flex', gap:12, paddingBottom:12, marginBottom:12, borderBottom:'1px solid #F8F9FA', textDecoration:'none' }}>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color: i===0 ? '#C9A84C' : '#E9ECEF', width:28, flexShrink:0 }}>{String(i+1).padStart(2,'0')}</div>
                <div>
                  <div style={{ color:'#0d2347', fontSize:13, fontWeight:500, lineHeight:1.4 }}>{a.title}</div>
                  <div style={{ color:'#ADB5BD', fontSize:11, marginTop:3 }}>{a.view_count||0} dibaca</div>
                </div>
              </Link>
            )) : <p style={{ color:'#ADB5BD', fontSize:13, textAlign:'center', padding:'12px 0' }}>Belum ada artikel populer</p>}
          </div>

          {/* Kategori */}
          <div style={S.sideCard}>
            <div style={{ ...S.sectionTitle, display:'block', marginBottom:16 }}>Kategori</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
              {cats.map((c:any) => (
                <Link key={c.id} href={`/kategori/${c.slug}`} style={{ padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:600, background:`${c.color}18`, color:c.color, border:`1px solid ${c.color}35`, textDecoration:'none' }}>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Tentang */}
          <div style={{ ...S.ctaBox }}>
            <img src="/logo-hukra.jpg" alt="HUKRA" style={{ width:48, height:48, borderRadius:10, objectFit:'cover', border:'1.5px solid #C9A84C', marginBottom:12 }} />
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:15, fontWeight:700, marginBottom:8 }}>Tentang HUKRA</div>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:12, lineHeight:1.6, marginBottom:14 }}>Komunitas akademik Fakultas Syariah UIN Palangka Raya. Didirikan 21 April 2026.</p>
            <Link href="/tentang" style={{ display:'block', textAlign:'center', padding:'8px', borderRadius:8, background:'#C9A84C', color:'#1B3A6B', fontSize:12, fontWeight:700, textDecoration:'none' }}>Selengkapnya</Link>
          </div>

          {/* CTA */}
          <div style={{ ...S.sideCard, border:'2px solid #1B3A6B' }}>
            <div style={{ fontSize:22, marginBottom:10 }}>✍️</div>
            <div style={{ fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:15, fontWeight:700, marginBottom:8 }}>Punya pemikiran soal hukum?</div>
            <p style={{ color:'#6C757D', fontSize:12, lineHeight:1.6, marginBottom:14 }}>Tulis berita atau opini dan bagikan ke ribuan pembaca.</p>
            <Link href="/tulis" style={{ display:'block', textAlign:'center', padding:'10px', borderRadius:8, background:'#1B3A6B', color:'white', fontSize:13, fontWeight:700, textDecoration:'none' }}>Mulai Menulis</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

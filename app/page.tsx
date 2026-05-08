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

  return (
    <div style={{ background:'#F0F2F5' }}>
      <style>{`
        .home-hero{background:linear-gradient(135deg,#0d2347,#1B3A6B);padding:48px 16px}
        .home-hero-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center}
        .hero-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;background:rgba(201,168,76,0.15);color:#C9A84C;border:1px solid rgba(201,168,76,0.3);font-size:12px;font-weight:600;margin-bottom:16px}
        .hero-title{font-family:'Playfair Display',serif;color:white;font-size:clamp(24px,4vw,36px);font-weight:700;line-height:1.25;margin-bottom:12px}
        .hero-desc{color:rgba(255,255,255,0.75);font-size:15px;line-height:1.7;margin-bottom:24px}
        .hero-btns{display:flex;gap:12px;flex-wrap:wrap}
        .btn-hero-gold{padding:11px 22px;border-radius:10px;background:#C9A84C;color:#1B3A6B;font-weight:700;font-size:14px;text-decoration:none;display:inline-block}
        .btn-hero-outline{padding:11px 22px;border-radius:10px;border:1.5px solid rgba(255,255,255,0.3);color:white;font-weight:600;font-size:14px;text-decoration:none;display:inline-block}
        .hero-logo{width:180px;height:180px;border-radius:20px;object-fit:cover;border:3px solid rgba(201,168,76,0.4);box-shadow:0 16px 48px rgba(0,0,0,0.25)}
        .home-body{max-width:1100px;margin:0 auto;padding:24px 16px;display:grid;grid-template-columns:1fr 300px;gap:24px}
        .section-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .section-title-el{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#1B3A6B;padding-left:10px;border-left:3px solid #C9A84C}
        .see-all{font-size:12px;font-weight:600;color:#1B3A6B;text-decoration:none}
        .news-row{display:flex;gap:14px;background:white;border-radius:12px;padding:14px;border:1px solid #E9ECEF;margin-bottom:10px;text-decoration:none;color:inherit}
        .news-thumb{width:76px;height:60px;border-radius:8px;overflow:hidden;flex-shrink:0;background:#EFF4FF;display:flex;align-items:center;justify-content:center;font-size:22px}
        .news-thumb img{width:100%;height:100%;object-fit:cover}
        .news-title{font-family:'Playfair Display',serif;color:#0d2347;font-size:14px;font-weight:600;line-height:1.4;margin:5px 0 4px}
        .news-meta{color:#ADB5BD;font-size:12px}
        .badge-b{display:inline-flex;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;background:#1B3A6B;color:#C9A84C;text-transform:uppercase;letter-spacing:.08em}
        .badge-o{display:inline-flex;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;background:#C9A84C;color:#1B3A6B;text-transform:uppercase;letter-spacing:.08em}
        .opini-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .opini-card{background:white;border-radius:12px;border:1px solid #E9ECEF;overflow:hidden;text-decoration:none;color:inherit;display:block}
        .opini-img{height:120px;background:linear-gradient(135deg,#EFF4FF,#E9ECEF);display:flex;align-items:center;justify-content:center;font-size:32px;overflow:hidden}
        .opini-img img{width:100%;height:100%;object-fit:cover}
        .opini-body{padding:12px}
        .sidebar-card{background:white;border-radius:14px;border:1px solid #E9ECEF;padding:18px;margin-bottom:18px}
        .trending-item{display:flex;gap:12px;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid #F8F9FA;text-decoration:none;color:inherit}
        .trending-num{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;width:28px;flex-shrink:0}
        .cat-wrap{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
        .cat-chip{padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none}
        .cta-dark{background:linear-gradient(135deg,#1B3A6B,#0d2347);border-radius:14px;padding:20px;color:white}
        .empty-box{text-align:center;padding:36px 16px;background:white;border-radius:12px;border:1px solid #E9ECEF;color:#ADB5BD;font-size:14px}
        @media(max-width:768px){
          .home-hero-inner{grid-template-columns:1fr!important}
          .hero-logo{display:none}
          .home-body{grid-template-columns:1fr!important}
          .home-sidebar{order:2}
          .opini-grid{grid-template-columns:1fr 1fr!important}
          .hero-badge{font-size:11px}
        }
        @media(max-width:480px){
          .opini-grid{grid-template-columns:1fr!important}
          .home-hero{padding:32px 16px!important}
        }
      `}</style>

      {/* HERO */}
      <div className="home-hero">
        <div className="home-hero-inner">
          <div>
            <div className="hero-badge">📚 Platform Hukum & Riset Akademika</div>
            <h1 className="hero-title">Wadah Riset & Opini <span style={{ color:'#C9A84C' }}>Hukum Indonesia</span></h1>
            <p className="hero-desc">Platform berita dan opini hukum. Tulis, bagikan, dan berkontribusi untuk kemajuan hukum Indonesia.</p>
            <div className="hero-btns">
              <Link href="/tulis" className="btn-hero-gold">✍️ Mulai Menulis</Link>
              <Link href="/berita" className="btn-hero-outline">📖 Baca Berita</Link>
            </div>
          </div>
          <img src="/logo-hukra.jpg" alt="HUKRA" className="hero-logo" />
        </div>
      </div>

      {/* BODY */}
      <div className="home-body">
        <div>
          {/* Berita */}
          <section style={{ marginBottom:28 }}>
            <div className="section-hd">
              <span className="section-title-el">📰 Berita Terbaru</span>
              <Link href="/berita" className="see-all">Lihat semua →</Link>
            </div>
            {news.length > 0 ? news.map((a:any) => (
              <Link key={a.id} href={`/artikel/${a.slug}`} className="news-row">
                <div className="news-thumb">{a.cover_image?<img src={a.cover_image} alt=""/>:'⚖️'}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span className="badge-b">Berita</span>
                    {a.categories&&<span style={{ color:'#ADB5BD', fontSize:11 }}>{a.categories.name}</span>}
                  </div>
                  <div className="news-title">{a.title}</div>
                  <div className="news-meta">{a.profiles?.full_name} · {new Date(a.published_at||a.created_at).toLocaleDateString('id-ID')}</div>
                </div>
              </Link>
            )) : <div className="empty-box">Belum ada berita. <Link href="/tulis" style={{ color:'#1B3A6B' }}>Jadilah yang pertama!</Link></div>}
          </section>

          {/* Opini */}
          <section style={{ marginBottom:28 }}>
            <div className="section-hd">
              <span className="section-title-el">📝 Opini Terkini</span>
              <Link href="/opini" className="see-all">Lihat semua →</Link>
            </div>
            {opinions.length > 0 ? (
              <div className="opini-grid">
                {opinions.map((a:any) => (
                  <Link key={a.id} href={`/artikel/${a.slug}`} className="opini-card">
                    <div className="opini-img">{a.cover_image?<img src={a.cover_image} alt=""/>:'📝'}</div>
                    <div className="opini-body">
                      <span className="badge-o">Opini</span>
                      <div style={{ fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:13, fontWeight:600, lineHeight:1.4, marginTop:6 }}>{a.title}</div>
                      <div style={{ color:'#ADB5BD', fontSize:11, marginTop:5 }}>{a.profiles?.full_name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <div className="empty-box">Belum ada opini. <Link href="/tulis" style={{ color:'#1B3A6B' }}>Tulis opinimu!</Link></div>}
          </section>

          {/* Terbaru */}
          {latest.length > 0 && (
            <section>
              <div className="section-hd"><span className="section-title-el">🕐 Semua Terbaru</span></div>
              {latest.slice(0,5).map((a:any) => (
                <Link key={a.id} href={`/artikel/${a.slug}`} className="news-row">
                  <div className="news-thumb" style={{ width:60, height:48, borderRadius:8, overflow:'hidden', flexShrink:0, background:'#EFF4FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                    {a.cover_image?<img src={a.cover_image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>:'⚖️'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <span className={a.type==='berita'?'badge-b':'badge-o'}>{a.type}</span>
                    <div className="news-title" style={{ fontSize:13 }}>{a.title}</div>
                    <div className="news-meta">{a.profiles?.full_name} · {new Date(a.published_at||a.created_at).toLocaleDateString('id-ID')}</div>
                  </div>
                </Link>
              ))}
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="home-sidebar">
          {/* Trending */}
          <div className="sidebar-card">
            <div className="section-title-el" style={{ display:'block', marginBottom:14 }}>🔥 Trending</div>
            {trending.length > 0 ? trending.map((a:any,i:number) => (
              <Link key={a.id} href={`/artikel/${a.slug}`} className="trending-item">
                <div className="trending-num" style={{ color:i===0?'#C9A84C':'#E9ECEF' }}>{String(i+1).padStart(2,'0')}</div>
                <div>
                  <div style={{ color:'#0d2347', fontSize:13, fontWeight:500, lineHeight:1.4 }}>{a.title}</div>
                  <div style={{ color:'#ADB5BD', fontSize:11, marginTop:3 }}>{a.view_count||0} dibaca</div>
                </div>
              </Link>
            )) : <p style={{ color:'#ADB5BD', fontSize:13, textAlign:'center', padding:'12px 0' }}>Belum ada artikel populer</p>}
          </div>

          {/* Kategori */}
          <div className="sidebar-card">
            <div className="section-title-el" style={{ display:'block', marginBottom:4 }}>Kategori</div>
            <div className="cat-wrap">
              {cats.map((c:any) => (
                <Link key={c.id} href={`/kategori/${c.slug}`} className="cat-chip"
                  style={{ background:`${c.color}18`, color:c.color, border:`1px solid ${c.color}35` }}>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Tentang */}
          <div className="cta-dark">
            <img src="/logo-hukra.jpg" alt="" style={{ width:44, height:44, borderRadius:10, objectFit:'cover', border:'1.5px solid #C9A84C', marginBottom:12, display:'block' }} />
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:15, fontWeight:700, marginBottom:8 }}>Tentang HUKRA</div>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:12, lineHeight:1.6, marginBottom:14 }}>Komunitas akademik Fakultas Syariah UIN Palangka Raya. Didirikan 21 April 2026.</p>
            <Link href="/tentang" style={{ display:'block', textAlign:'center', padding:'9px', borderRadius:9, background:'#C9A84C', color:'#1B3A6B', fontSize:13, fontWeight:700, textDecoration:'none' }}>Selengkapnya</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export const metadata = { title: 'Tentang Kami — HUKRA' }
export const viewport = { width: 'device-width', initialScale: 1 }

const team = [
  { name: 'Ahmidi', role: 'Ketua Tim', initial: 'A', color: '#1B3A6B', textColor: '#C9A84C' },
  { name: 'M. Rahman', role: 'Reviewer', initial: 'R', color: '#EFF4FF', textColor: '#1B3A6B' },
  { name: 'M. Ladit', role: 'Editor', initial: 'L', color: '#EFF4FF', textColor: '#1B3A6B' },
  { name: "Muhammad Syar'i", role: 'Editor', initial: 'MS', color: '#EFF4FF', textColor: '#1B3A6B' },
  { name: 'Anharudin Ali Fajri', role: 'Divisi Media Publikasi', initial: 'AF', color: '#EFF4FF', textColor: '#1B3A6B' },
]

export default function TentangPage() {
  return (
    <div style={{ background:'#F8F9FA', minHeight:'100vh' }}>
      <style>{`
        .tentang-hero{background:linear-gradient(135deg,#0d2347,#1B3A6B);padding:60px 16px;text-align:center}
        .tentang-body{max-width:860px;margin:0 auto;padding:40px 16px}
        .tentang-card{background:white;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 2px 16px rgba(0,0,0,0.06);border:1px solid #E9ECEF}
        .team-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}
        .team-card{background:white;border-radius:14px;padding:20px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #E9ECEF}
        .team-avatar{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0;font-family:'Playfair Display',serif}
        .blockquote-box{border-left:4px solid #C9A84C;padding:16px 20px;background:rgba(201,168,76,0.06);border-radius:0 12px 12px 0;margin:24px 0}
        .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0}
        .stat-card{text-align:center;padding:20px 12px;background:white;border-radius:14px;border:1px solid #E9ECEF}
        @media(max-width:600px){
          .team-grid{grid-template-columns:1fr!important}
          .stat-grid{grid-template-columns:1fr 1fr!important}
          .tentang-hero{padding:40px 16px!important}
          .tentang-card{padding:20px!important}
        }
      `}</style>

      {/* Hero */}
      <div className="tentang-hero">
        <img src="/icon.png" alt="HUKRA" style={{ width:80, height:80, borderRadius:20, objectFit:'cover', border:'3px solid #C9A84C', display:'block', margin:'0 auto 16px' }} />
        <h1 style={{ fontFamily:'Playfair Display,serif', color:'white', fontSize:'clamp(24px,5vw,36px)', fontWeight:700, marginBottom:8 }}>Tentang HUKRA</h1>
        <p style={{ color:'#C9A84C', fontSize:12, letterSpacing:3, fontWeight:600, marginBottom:16 }}>HUKUM DAN RISET AKADEMIKA</p>
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:16, maxWidth:600, margin:'0 auto', lineHeight:1.7 }}>
          Komunitas akademik mahasiswa yang berkomitmen membangun budaya literasi dan riset hukum di Indonesia.
        </p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, marginTop:20, flexWrap:'wrap' }}>
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>📅 Didirikan 21 April 2026</span>
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>🏛️ UIN Palangka Raya</span>
        </div>
      </div>

      <div className="tentang-body">
        {/* Stats */}
        <div className="stat-grid">
          {[
            { emoji:'👥', value:'5', label:'Anggota Tim' },
            { emoji:'⚖️', value:'2026', label:'Tahun Berdiri' },
            { emoji:'🎓', label:'Fakultas Syariah', value:'UIN' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize:28, marginBottom:6 }}>{s.emoji}</div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:'#1B3A6B' }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#6C757D', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="tentang-card">
          <h2 style={{ fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:22, fontWeight:700, marginBottom:20 }}>Tentang Kami</h2>
          <p style={{ color:'#4A5568', lineHeight:1.8, marginBottom:16, fontSize:15 }}>
            <strong style={{ color:'#0d2347' }}>Team Hukum Riset Akademik</strong> merupakan komunitas akademik yang dibentuk oleh mahasiswa Fakultas Syariah UIN Palangka Raya yang memiliki minat besar dalam dunia penelitian, penulisan ilmiah, dan publikasi akademik.
          </p>
          <p style={{ color:'#4A5568', lineHeight:1.8, marginBottom:16, fontSize:15 }}>
            Tim ini lahir dari semangat sederhana: <em style={{ color:'#1B3A6B', fontWeight:600 }}>membangun budaya literasi dan riset di kalangan mahasiswa hukum</em> agar mampu menghasilkan karya yang bermanfaat, kritis, dan berkualitas.
          </p>
          <p style={{ color:'#4A5568', lineHeight:1.8, marginBottom:16, fontSize:15 }}>
            Team Hukum Riset Akademik didirikan pada <strong style={{ color:'#0d2347' }}>21 April 2026</strong> sebagai sebuah tim kecil yang terdiri dari beberapa mahasiswa dengan peran masing-masing.
          </p>
          <p style={{ color:'#4A5568', lineHeight:1.8, marginBottom:16, fontSize:15 }}>
            Berawal dari diskusi kecil, proses penulisan sederhana, hingga membantu publikasi karya ilmiah mahasiswa, tim ini terus berkembang hingga sekarang. Dengan semangat kolaborasi dan pengembangan intelektual, Team Hukum Riset Akademik berkomitmen untuk menjadi wadah bagi mahasiswa yang ingin belajar, berkembang, dan berkontribusi dalam bidang riset serta publikasi akademik, khususnya di bidang hukum dan sosial keislaman.
          </p>
          <div className="blockquote-box">
            <p style={{ fontFamily:'Playfair Display,serif', color:'#1B3A6B', fontSize:16, lineHeight:1.7, fontStyle:'italic', margin:0 }}>
              "Kami percaya bahwa tulisan bukan hanya sekadar tugas akademik, tetapi juga alat untuk menyampaikan gagasan, membangun pemikiran kritis, dan memberi dampak nyata bagi masyarakat."
            </p>
          </div>
        </div>

        {/* Team */}
        <div className="tentang-card">
          <h2 style={{ fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:22, fontWeight:700, marginBottom:6 }}>Tim Kami</h2>
          <p style={{ color:'#6C757D', fontSize:14, marginBottom:4 }}>Orang-orang di balik HUKRA</p>
          <div className="team-grid">
            {team.map(m => (
              <div key={m.name} className="team-card">
                <div className="team-avatar" style={{ background:m.color, color:m.textColor }}>{m.initial}</div>
                <div>
                  <div style={{ fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:15, fontWeight:700 }}>{m.name}</div>
                  <div style={{ fontSize:12, color:'#6C757D', marginTop:3, background:'#EFF4FF', padding:'2px 10px', borderRadius:20, display:'inline-block' }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background:'linear-gradient(135deg,#1B3A6B,#0d2347)', borderRadius:16, padding:32, textAlign:'center', color:'white' }}>
          <img src="/icon.png" alt="HUKRA" style={{ width:60, height:60, borderRadius:14, objectFit:'cover', border:'2px solid #C9A84C', display:'block', margin:'0 auto 16px' }} />
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, marginBottom:10 }}>Bergabung dengan HUKRA</h3>
          <p style={{ color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:24, maxWidth:400, margin:'0 auto 24px', fontSize:15 }}>
            Jadilah bagian dari komunitas akademik dan kontribusikan pemikiranmu untuk kemajuan hukum Indonesia!
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="/auth/daftar" style={{ padding:'12px 28px', borderRadius:10, background:'#C9A84C', color:'#1B3A6B', fontWeight:700, fontSize:14, textDecoration:'none' }}>Daftar Sekarang</a>
            <a href="/tulis" style={{ padding:'12px 28px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.3)', color:'white', fontWeight:600, fontSize:14, textDecoration:'none' }}>Mulai Menulis</a>
          </div>
        </div>
      </div>
    </div>
  )
}

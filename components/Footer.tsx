import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #0d2347, #1B3A6B)', marginTop: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 32 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img src="/logo-hukra.jpg" alt="HUKRA" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', border: '1.5px solid #C9A84C' }} />
              <div>
                <div style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>HUKRA</div>
                <div style={{ color: '#C9A84C', fontSize: 7, letterSpacing: 2 }}>HUKUM DAN RISET AKADEMIKA</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7 }}>
              Platform berita dan opini hukum dari mahasiswa Fakultas Syariah UIN Palangka Raya. Didirikan 21 April 2026.
            </p>
          </div>

          {/* Kategori */}
          <div>
            <h4 style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>Kategori</h4>
            {['Hukum Pidana', 'Hukum Perdata', 'Konstitusi', 'HAM', 'Akademik'].map(cat => (
              <div key={cat} style={{ marginBottom: 8 }}>
                <Link href={`/kategori/${cat.toLowerCase().replace(/ /g, '-')}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>{cat}</Link>
              </div>
            ))}
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>Platform</h4>
            {[
              { name: 'Tentang Kami', href: '/tentang' },
              { name: 'Berita', href: '/berita' },
              { name: 'Opini', href: '/opini' },
              { name: 'Tulis Artikel', href: '/tulis' },
            ].map(item => (
              <div key={item.name} style={{ marginBottom: 8 }}>
                <Link href={item.href} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>{item.name}</Link>
              </div>
            ))}
          </div>

          {/* Tim */}
          <div>
            <h4 style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>Tim Kami</h4>
            {[
              { name: 'Ahmidi', role: 'Ketua' },
              { name: 'M. Rahman', role: 'Reviewer' },
              { name: 'M. Ladit', role: 'Editor' },
              { name: 'A. Ali Fajri', role: 'Media' },
            ].map(m => (
              <div key={m.name} style={{ marginBottom: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{m.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginLeft: 6 }}>{m.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>© {new Date().getFullYear()} HUKRA — Hukum dan Riset Akademika</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Fakultas Syariah UIN Palangka Raya</p>
        </div>
      </div>
    </footer>
  )
}

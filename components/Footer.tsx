import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #0d2347 0%, #1B3A6B 100%)' }} className="mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-hukra.jpg" alt="HUKRA" className="w-12 h-12 rounded-xl object-cover" style={{ border: '2px solid #C9A84C' }} />
              <div>
                <div style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>HUKRA</div>
                <div style={{ color: '#C9A84C', fontSize: 8, letterSpacing: 2 }}>HUKUM DAN RISET AKADEMIKA</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Platform berita dan opini hukum Indonesia. Wadah para akademisi, praktisi, dan mahasiswa hukum UIN Palangka Raya.
            </p>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: '#C9A84C', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Kategori</h4>
            <ul className="space-y-2">
              {['Hukum Pidana', 'Hukum Perdata', 'Konstitusi', 'HAM', 'Internasional', 'Akademik'].map(cat => (
                <li key={cat}>
                  <Link href={`/kategori/${cat.toLowerCase().replace(/ /g, '-')}`} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: '#C9A84C', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Platform</h4>
            <ul className="space-y-2">
              {[
                { name: 'Tentang Kami', href: '/tentang' },
                { name: 'Panduan Menulis', href: '/panduan' },
                { name: 'Kebijakan', href: '/kebijakan' },
                { name: 'Kontak', href: '/kontak' },
              ].map(item => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tim */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: '#C9A84C', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Tim Kami</h4>
            <ul className="space-y-2">
              {[
                { name: 'Ahmidi', role: 'Ketua Tim' },
                { name: 'M. Rahman', role: 'Reviewer' },
                { name: 'M. Ladit', role: 'Editor' },
                { name: 'Anharudin Ali Fajri', role: 'Media Publikasi' },
              ].map(m => (
                <li key={m.name} className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{m.name}</span>
                  <span className="text-xs ml-1">— {m.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} HUKRA — Hukum dan Riset Akademika. Didirikan 21 April 2026.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Fakultas Syariah UIN Palangka Raya
          </p>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0d2347' }} className="mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div style={{ background: '#C9A84C', borderRadius: 6 }} className="w-8 h-8 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="2" fill="#1B3A6B"/>
                  <path d="M7 10h10M7 13h10M7 16h6" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>HUKRA</span>
            </div>
            <p style={{ color: '#C9A84C', fontSize: 9, letterSpacing: 3, marginBottom: 12 }}>HUKUM · RISET · AKADEMIK</p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Platform berita dan opini hukum Indonesia. Wadah para akademisi, praktisi, dan mahasiswa hukum.
            </p>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: '#C9A84C', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Kategori</h4>
            <ul className="space-y-2">
              {['Hukum Pidana', 'Hukum Perdata', 'Konstitusi', 'HAM', 'Internasional', 'Akademik'].map(cat => (
                <li key={cat}>
                  <Link href={`/kategori/${cat.toLowerCase().replace(/ /g, '-')}`} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: '#C9A84C', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Platform</h4>
            <ul className="space-y-2">
              {[
                { name: 'Tentang Hukra', href: '/tentang' },
                { name: 'Panduan Menulis', href: '/panduan' },
                { name: 'Kebijakan', href: '/kebijakan' },
                { name: 'Syarat & Ketentuan', href: '/syarat' },
                { name: 'Kontak', href: '/kontak' },
              ].map(item => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontribusi */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: '#C9A84C', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Ikut Berkontribusi</h4>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Tulis berita atau opini hukum dan bagikan pemikiranmu.</p>
            <Link href="/tulis" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: '#C9A84C', color: '#1B3A6B' }}>
              Mulai Menulis
            </Link>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Hukra. Platform Berita dan Opini Hukum Indonesia.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Dibangun dengan ❤️ untuk keadilan
          </p>
        </div>
      </div>
    </footer>
  )
}

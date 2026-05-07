'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Menu, X, Search, PenSquare, ChevronDown, LogOut, User, Settings, Shield } from 'lucide-react'

const categories = [
  { name: 'Berita', href: '/berita' },
  { name: 'Opini', href: '/opini' },
  { name: 'Hukum Pidana', href: '/kategori/hukum-pidana' },
  { name: 'Hukum Perdata', href: '/kategori/hukum-perdata' },
  { name: 'Konstitusi', href: '/kategori/konstitusi' },
  { name: 'Internasional', href: '/kategori/hukum-internasional' },
  { name: 'HAM', href: '/kategori/ham' },
  { name: 'Akademik', href: '/kategori/akademik' },
  { name: 'Tentang Kami', href: '/tentang' },
]

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createBrowserClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('profiles').select('*').eq('id', data.user.id).single()
          .then(({ data: p }) => setProfile(p))
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data: p }) => setProfile(p))
      } else { setProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/cari?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div style={{ background: 'linear-gradient(135deg, #0d2347, #1B3A6B)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          {/* Logo - kecil dan rapi */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0" style={{ border: '1.5px solid #C9A84C' }}>
              <img src="/logo-hukra.jpg" alt="HUKRA" className="w-full h-full object-cover object-top" />
            </div>
            <div className="leading-none">
              <div style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, letterSpacing: 2, lineHeight: 1 }}>HUKRA</div>
              <div style={{ color: '#C9A84C', fontSize: 7, letterSpacing: 2, fontWeight: 500, marginTop: 2 }}>HUKUM DAN RISET AKADEMIKA</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.5)' }} />
              <input type="text" placeholder="Cari artikel..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm rounded-lg outline-none"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} />
            </div>
          </form>

          {/* Right */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/tulis" className="hidden md:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: '#C9A84C', color: '#1B3A6B' }}>
                  <PenSquare size={13} /> Tulis
                </Link>
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C', border: '1.5px solid #C9A84C' }}>
                      {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={13} style={{ color: '#C9A84C' }} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border overflow-hidden z-50" style={{ borderColor: '#E9ECEF' }}>
                      <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F3F5', background: '#F8F9FA' }}>
                        <p className="text-sm font-semibold" style={{ color: '#0d2347' }}>{profile?.full_name}</p>
                        <p className="text-xs" style={{ color: '#6C757D' }}>@{profile?.username}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50" style={{ color: '#343A40' }} onClick={() => setProfileOpen(false)}><User size={13} /> Dashboard</Link>
                      {(profile?.role === 'admin' || profile?.role === 'editor') && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-blue-50" style={{ color: '#1B3A6B' }} onClick={() => setProfileOpen(false)}><Shield size={13} /> Admin Panel</Link>
                      )}
                      <Link href="/profil/edit" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50" style={{ color: '#343A40' }} onClick={() => setProfileOpen(false)}><Settings size={13} /> Pengaturan</Link>
                      <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2.5 text-sm w-full text-left hover:bg-red-50" style={{ color: '#EF4444' }}><LogOut size={13} /> Keluar</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/masuk" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: '#C9A84C', border: '1px solid rgba(201,168,76,0.4)' }}>Masuk</Link>
                <Link href="/auth/daftar" className="hidden md:block text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: '#C9A84C', color: '#1B3A6B' }}>Daftar</Link>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-1" style={{ color: 'white' }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div style={{ background: '#0d2347', borderBottom: '2px solid rgba(201,168,76,0.25)' }} className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex overflow-x-auto">
          {categories.map(cat => (
            <Link key={cat.href} href={cat.href} className="whitespace-nowrap px-3 py-2.5 text-xs font-medium transition-all"
              style={{ color: pathname === cat.href ? '#C9A84C' : 'rgba(255,255,255,0.65)', borderBottom: pathname === cat.href ? '2px solid #C9A84C' : '2px solid transparent' }}>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <form onSubmit={handleSearch} className="p-4 border-b" style={{ borderColor: '#E9ECEF' }}>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari artikel..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#E9ECEF' }} />
            </div>
          </form>
          {categories.map(cat => (
            <Link key={cat.href} href={cat.href} className="block px-4 py-3 text-sm border-b" style={{ color: '#343A40', borderColor: '#F8F9FA' }} onClick={() => setMenuOpen(false)}>{cat.name}</Link>
          ))}
        </div>
      )}
    </header>
  )
}

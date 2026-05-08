'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const supabase = createBrowserClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: p }) => setProfile(p))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data: p }) => setProfile(p))
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
    setMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) { router.push(`/cari?q=${encodeURIComponent(search.trim())}`); setMenuOpen(false) }
  }

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Berita', href: '/berita' },
    { name: 'Opini', href: '/opini' },
    { name: 'Hukum Pidana', href: '/kategori/hukum-pidana' },
    { name: 'HAM', href: '/kategori/ham' },
    { name: 'Akademik', href: '/kategori/akademik' },
    { name: 'Tentang Kami', href: '/tentang' },
  ]

  return (
    <>
      <style>{`
        .nav-top{background:linear-gradient(135deg,#0d2347,#1B3A6B);position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(13,35,71,0.2)}
        .nav-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:56px;gap:12px}
        .nav-logo{display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0}
        .nav-logo img{width:32px;height:32px;border-radius:7px;object-fit:cover;border:1.5px solid #C9A84C}
        .nav-logo-text .name{color:white;font-family:'Playfair Display',serif;font-size:16px;font-weight:700;letter-spacing:2px;display:block;line-height:1}
        .nav-logo-text .sub{color:#C9A84C;font-size:7px;letter-spacing:2px;font-weight:600;display:block;margin-top:2px}
        .nav-search{flex:1;max-width:260px;position:relative}
        .nav-search input{width:100%;padding:7px 12px 7px 30px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);color:white;font-size:13px;outline:none}
        .nav-search input::placeholder{color:rgba(255,255,255,0.5)}
        .nav-search .icon{position:absolute;left:9px;top:50%;transform:translateY(-50%);font-size:12px}
        .nav-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
        .btn-gold{padding:7px 16px;border-radius:8px;background:#C9A84C;color:#1B3A6B;font-weight:700;font-size:13px;text-decoration:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif}
        .btn-outline-nav{padding:7px 14px;border-radius:8px;border:1px solid rgba(201,168,76,0.5);color:#C9A84C;font-size:13px;font-weight:600;text-decoration:none;background:transparent;cursor:pointer}
        .nav-avatar{width:32px;height:32px;border-radius:50%;background:rgba(201,168,76,0.2);border:1.5px solid #C9A84C;color:#C9A84C;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;cursor:pointer;flex-shrink:0}
        .hamburger{background:none;border:none;color:white;font-size:22px;cursor:pointer;padding:4px;display:none}
        .nav-cat{background:#0a1e3d;border-bottom:2px solid rgba(201,168,76,0.2);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
        .nav-cat::-webkit-scrollbar{display:none}
        .nav-cat-inner{max-width:1100px;margin:0 auto;display:flex;padding:0 16px;white-space:nowrap}
        .nav-cat a{padding:9px 14px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.65);border-bottom:2px solid transparent;text-decoration:none;display:inline-block;flex-shrink:0}
        .nav-cat a.active{color:#C9A84C;border-bottom-color:#C9A84C}
        .nav-dropdown{position:absolute;right:0;top:calc(100% + 8px);width:180px;background:white;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.12);border:1px solid #E9ECEF;overflow:hidden;z-index:200}
        .nav-dropdown a,.nav-dropdown button{display:flex;align-items:center;gap:8px;padding:10px 16px;font-size:13px;color:#343A40;text-decoration:none;background:none;border:none;width:100%;text-align:left;cursor:pointer;font-family:'DM Sans',sans-serif}
        .nav-dropdown a:hover,.nav-dropdown button:hover{background:#F8F9FA}
        .mobile-menu{background:white;border-bottom:1px solid #E9ECEF;display:none}
        .mobile-menu.open{display:block}
        .mobile-menu a,.mobile-menu button{display:block;padding:13px 20px;font-size:14px;color:#343A40;border-bottom:1px solid #F8F9FA;text-decoration:none;background:none;border-left:none;border-right:none;border-top:none;width:100%;text-align:left;cursor:pointer;font-family:'DM Sans',sans-serif}
        .mobile-search{padding:12px 16px;border-bottom:1px solid #E9ECEF}
        .mobile-search form{display:flex;gap:8px}
        .mobile-search input{flex:1;padding:9px 14px;border-radius:9px;border:1.5px solid #E9ECEF;font-size:14px;outline:none}
        .mobile-search button{padding:9px 16px;border-radius:9px;background:#1B3A6B;color:white;border:none;font-size:13px;font-weight:600;cursor:pointer}
        @media(max-width:768px){
          .hamburger{display:block!important}
          .nav-search{display:none}
          .hide-desktop-nav{display:none}
          .nav-cat{display:none}
        }
      `}</style>

      <header className="nav-top">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <img src="/logo-hukra.jpg" alt="HUKRA" />
            <div className="nav-logo-text">
              <span className="name">HUKRA</span>
              <span className="sub">HUKUM DAN RISET AKADEMIKA</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="nav-search">
            <span className="icon">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari berita..." />
          </form>

          <div className="nav-right">
            {user ? (
              <>
                <Link href="/tulis" className="btn-gold hide-desktop-nav" style={{ display:'flex', alignItems:'center', gap:6 }}>✍️ Tulis</Link>
                <div style={{ position:'relative' }}>
                  <div className="nav-avatar" onClick={() => setProfileOpen(!profileOpen)}>
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="" style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }} />
                      : profile?.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {profileOpen && (
                    <div className="nav-dropdown">
                      <div style={{ padding:'12px 16px', borderBottom:'1px solid #F1F3F5', background:'#F8F9FA' }}>
                        <div style={{ fontSize:13, fontWeight:700, color:'#0d2347' }}>{profile?.full_name}</div>
                        <div style={{ fontSize:11, color:'#6C757D' }}>@{profile?.username}</div>
                      </div>
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)}>👤 Dashboard</Link>
                      {(profile?.role === 'admin' || profile?.role === 'editor') && (
                        <Link href="/admin" onClick={() => setProfileOpen(false)} style={{ color:'#1B3A6B' }}>🛡️ Admin Panel</Link>
                      )}
                      <button onClick={handleSignOut} style={{ color:'#EF4444' }}>🚪 Keluar</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/masuk" className="btn-outline-nav">Masuk</Link>
                <Link href="/auth/daftar" className="btn-gold hide-desktop-nav">Daftar</Link>
              </>
            )}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Category bar - desktop */}
      <div className="nav-cat">
        <div className="nav-cat-inner">
          {[
            { name:'Beranda', href:'/' },
            { name:'Berita', href:'/berita' },
            { name:'Opini', href:'/opini' },
            { name:'Hukum Pidana', href:'/kategori/hukum-pidana' },
            { name:'Hukum Perdata', href:'/kategori/hukum-perdata' },
            { name:'HAM', href:'/kategori/ham' },
            { name:'Konstitusi', href:'/kategori/konstitusi' },
            { name:'Akademik', href:'/kategori/akademik' },
            { name:'Tentang Kami', href:'/tentang' },
          ].map(l => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? 'active' : ''}>{l.name}</Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-search">
          <form onSubmit={handleSearch} style={{ display:'flex', gap:8 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari berita..." style={{ flex:1, padding:'9px 14px', borderRadius:9, border:'1.5px solid #E9ECEF', fontSize:14, outline:'none' }} />
            <button type="submit" style={{ padding:'9px 16px', borderRadius:9, background:'#1B3A6B', color:'white', border:'none', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cari</button>
          </form>
        </div>
        {[
          { name:'🏠 Beranda', href:'/' },
          { name:'📰 Berita', href:'/berita' },
          { name:'📝 Opini', href:'/opini' },
          { name:'⚖️ Hukum Pidana', href:'/kategori/hukum-pidana' },
          { name:'🤝 HAM', href:'/kategori/ham' },
          { name:'🎓 Akademik', href:'/kategori/akademik' },
          { name:'ℹ️ Tentang Kami', href:'/tentang' },
        ].map(l => (
          <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
            style={{ color: pathname === l.href ? '#1B3A6B' : '#343A40', fontWeight: pathname === l.href ? 700 : 400 }}>
            {l.name}
          </Link>
        ))}
        {user ? (
          <>
            <Link href="/tulis" onClick={() => setMenuOpen(false)} style={{ color:'#1B3A6B', fontWeight:700 }}>✍️ Tulis Berita/Opini</Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>👤 Dashboard Saya</Link>
            {(profile?.role === 'admin' || profile?.role === 'editor') && (
              <Link href="/admin" onClick={() => setMenuOpen(false)}>🛡️ Admin Panel</Link>
            )}
            <button onClick={handleSignOut} style={{ color:'#EF4444', borderTop:'1px solid #F8F9FA' }}>🚪 Keluar</button>
          </>
        ) : (
          <>
            <Link href="/auth/masuk" onClick={() => setMenuOpen(false)} style={{ color:'#1B3A6B', fontWeight:600 }}>🔑 Masuk</Link>
            <Link href="/auth/daftar" onClick={() => setMenuOpen(false)} style={{ color:'#1B3A6B', fontWeight:700 }}>📝 Daftar Sekarang</Link>
          </>
        )}
      </div>
    </>
  )
}

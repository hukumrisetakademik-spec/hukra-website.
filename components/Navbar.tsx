'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Berita', href: '/berita' },
  { name: 'Opini', href: '/opini' },
  { name: 'Hukum Pidana', href: '/kategori/hukum-pidana' },
  { name: 'HAM', href: '/kategori/ham' },
  { name: 'Akademik', href: '/kategori/akademik' },
  { name: 'Tentang Kami', href: '/tentang' },
]

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

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); router.refresh() }
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (search.trim()) router.push(`/cari?q=${encodeURIComponent(search.trim())}`) }

  const S = {
    header: { position:'sticky' as const, top:0, zIndex:50, boxShadow:'0 2px 20px rgba(13,35,71,0.15)' },
    topBar: { background:'linear-gradient(135deg,#0d2347,#1B3A6B)', height:60, display:'flex', alignItems:'center', padding:'0 24px' },
    topInner: { maxWidth:1200, margin:'0 auto', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 },
    logo: { display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 },
    logoImg: { width:34, height:34, borderRadius:8, objectFit:'cover' as const, border:'1.5px solid #C9A84C', flexShrink:0 },
    logoText: { lineHeight:1 },
    logoName: { color:'white', fontFamily:'Playfair Display,serif', fontSize:17, fontWeight:700, letterSpacing:2, display:'block' },
    logoSub: { color:'#C9A84C', fontSize:7, letterSpacing:2, fontWeight:500, display:'block', marginTop:2 },
    searchForm: { flex:1, maxWidth:280 },
    searchInput: { width:'100%', padding:'7px 12px 7px 32px', borderRadius:8, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'white', fontSize:13, outline:'none' },
    rightBtns: { display:'flex', alignItems:'center', gap:8, flexShrink:0 },
    btnGold: { padding:'7px 16px', borderRadius:8, background:'#C9A84C', color:'#1B3A6B', fontWeight:700, fontSize:13, textDecoration:'none', border:'none', cursor:'pointer' },
    btnOutline: { padding:'7px 14px', borderRadius:8, border:'1px solid rgba(201,168,76,0.5)', color:'#C9A84C', fontSize:13, fontWeight:600, textDecoration:'none', background:'transparent', cursor:'pointer' },
    avatar: { width:32, height:32, borderRadius:'50%', background:'rgba(201,168,76,0.2)', border:'1.5px solid #C9A84C', color:'#C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, cursor:'pointer' },
    catBar: { background:'#0a1e3d', borderBottom:'2px solid rgba(201,168,76,0.2)', overflowX:'auto' as const },
    catInner: { maxWidth:1200, margin:'0 auto', display:'flex', padding:'0 24px' },
    catLink: (active: boolean) => ({ padding:'10px 14px', fontSize:12, fontWeight:600, color: active ? '#C9A84C' : 'rgba(255,255,255,0.6)', borderBottom: active ? '2px solid #C9A84C' : '2px solid transparent', textDecoration:'none', whiteSpace:'nowrap' as const, transition:'color .2s' }),
    dropdown: { position:'absolute' as const, right:0, top:'calc(100% + 8px)', width:180, background:'white', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.12)', border:'1px solid #E9ECEF', overflow:'hidden', zIndex:100 },
    dropItem: { display:'flex', alignItems:'center', gap:8, padding:'10px 16px', fontSize:13, color:'#343A40', textDecoration:'none', cursor:'pointer', background:'none', border:'none', width:'100%', textAlign:'left' as const },
  }

  return (
    <header style={S.header}>
      <div style={S.topBar}>
        <div style={S.topInner}>
          {/* Logo */}
          <Link href="/" style={S.logo}>
            <img src="/logo-hukra.jpg" alt="HUKRA" style={S.logoImg} />
            <div style={S.logoText}>
              <span style={S.logoName}>HUKRA</span>
              <span style={S.logoSub}>HUKUM DAN RISET AKADEMIKA</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} style={S.searchForm} className="hide-mobile">
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.4)', fontSize:13 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari artikel..." style={S.searchInput} />
            </div>
          </form>

          {/* Right */}
          <div style={S.rightBtns}>
            {user ? (
              <>
                <Link href="/tulis" style={S.btnGold} className="hide-mobile">✍️ Tulis</Link>
                <div style={{ position:'relative' }}>
                  <div style={S.avatar} onClick={() => setProfileOpen(!profileOpen)}>
                    {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {profileOpen && (
                    <div style={S.dropdown}>
                      <div style={{ padding:'12px 16px', borderBottom:'1px solid #F1F3F5', background:'#F8F9FA' }}>
                        <div style={{ fontSize:13, fontWeight:600, color:'#0d2347' }}>{profile?.full_name}</div>
                        <div style={{ fontSize:11, color:'#6C757D' }}>@{profile?.username}</div>
                      </div>
                      <Link href="/dashboard" style={S.dropItem} onClick={() => setProfileOpen(false)}>👤 Dashboard</Link>
                      {(profile?.role === 'admin' || profile?.role === 'editor') && (
                        <Link href="/admin" style={{ ...S.dropItem, color:'#1B3A6B' }} onClick={() => setProfileOpen(false)}>🛡️ Admin Panel</Link>
                      )}
                      <button onClick={handleSignOut} style={{ ...S.dropItem, color:'#EF4444' }}>🚪 Keluar</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/masuk" style={S.btnOutline}>Masuk</Link>
                <Link href="/auth/daftar" style={S.btnGold} className="hide-mobile">Daftar</Link>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background:'none', border:'none', color:'white', fontSize:20, cursor:'pointer', display:'none' }} className="show-mobile">☰</button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div style={S.catBar} className="hide-mobile">
        <div style={S.catInner}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={S.catLink(pathname === link.href)}>{link.name}</Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background:'white', borderBottom:'1px solid #E9ECEF' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{ display:'block', padding:'12px 20px', fontSize:14, color:'#343A40', borderBottom:'1px solid #F8F9FA', textDecoration:'none' }} onClick={() => setMenuOpen(false)}>{link.name}</Link>
          ))}
          {user && <Link href="/tulis" style={{ display:'block', padding:'12px 20px', fontSize:14, color:'#1B3A6B', fontWeight:700, textDecoration:'none' }} onClick={() => setMenuOpen(false)}>✍️ Tulis Artikel</Link>}
        </div>
      )}
    </header>
  )
}

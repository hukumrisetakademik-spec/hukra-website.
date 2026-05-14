'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'

const KATEGORI_STATIC = [
  { name: 'Hukum Pidana', slug: 'hukum-pidana', color: '#DC2626' },
  { name: 'Hukum Perdata', slug: 'hukum-perdata', color: '#2563EB' },
  { name: 'HAM', slug: 'ham', color: '#7C3AED' },
  { name: 'Konstitusi', slug: 'konstitusi', color: '#059669' },
  { name: 'Akademik', slug: 'akademik', color: '#D97706' },
]

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [kategoriOpen, setKategoriOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState(KATEGORI_STATIC)
  const searchRef = useRef<HTMLDivElement>(null)
  const kategoriRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        supabase.from('profiles').select('*').eq('id', data.user.id).single()
          .then(({ data: p }) => setProfile(p))
      }
    })
    supabase.from('categories').select('*').order('name')
      .then(({ data }) => { if (data && data.length > 0) setCategories(data) })

    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
      if (kategoriRef.current && !kategoriRef.current.contains(e.target as Node)) setKategoriOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      const { data } = await supabase.from('articles')
        .select('id, title, slug, type, excerpt')
        .eq('status', 'published')
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
        .limit(6)
      setSearchResults(data || [])
      setSearching(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearchOpen(false)
    setMobileMenuOpen(false)
    router.push(`/cari?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setProfileOpen(false)
    router.push('/')
    router.refresh()
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'editor'
  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Berita', href: '/berita' },
    { label: 'Opini', href: '/opini' },
  ]

  return (
    <>
      <nav style={{ background:'#0d2347', borderBottom:'1px solid rgba(201,168,76,0.2)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 16px' }}>
          <div style={{ display:'flex', alignItems:'center', height:60, gap:16 }}>

            {/* Logo */}
            <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
              <img src="/icon.png" alt="HUKRA" style={{ width:36, height:36, borderRadius:8, objectFit:'cover', border:'1.5px solid #C9A84C' }} />
              <div className="hide-mobile">
                <div style={{ fontFamily:'Playfair Display,serif', color:'white', fontSize:16, fontWeight:700, lineHeight:1.1 }}>HUKRA</div>
                <div style={{ color:'#C9A84C', fontSize:9, letterSpacing:'0.15em', fontWeight:600 }}>HUKUM DAN RISET AKADEMIKA</div>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:4, marginLeft:8 }}>
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:500, padding:'6px 12px', borderRadius:7 }}>{l.label}</Link>
              ))}

              {/* Kategori Dropdown */}
              <div ref={kategoriRef} style={{ position:'relative' }}>
                <button onClick={() => setKategoriOpen(o => !o)}
                  style={{ display:'flex', alignItems:'center', gap:5, color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:500, padding:'6px 12px', borderRadius:7, background: kategoriOpen ? 'rgba(255,255,255,0.08)' : 'transparent', border:'none', cursor:'pointer' }}>
                  Kategori
                  <span style={{ fontSize:10, transition:'transform .2s', transform: kategoriOpen ? 'rotate(180deg)' : 'rotate(0deg)', display:'inline-block' }}>▼</span>
                </button>
                {kategoriOpen && (
                  <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, background:'white', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', border:'1px solid #E9ECEF', minWidth:220, overflow:'hidden', zIndex:200 }}>
                    <div style={{ padding:'8px 0' }}>
                      <div style={{ padding:'8px 16px 6px', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#ADB5BD' }}>Pilih Kategori</div>
                      {categories.map(c => (
                        <Link key={c.slug} href={`/kategori/${c.slug}`} onClick={() => setKategoriOpen(false)}
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', color:'#0d2347', fontSize:13, fontWeight:500 }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background:(c as any).color || '#1B3A6B', flexShrink:0 }} />
                          {c.name}
                        </Link>
                      ))}
                      <div style={{ borderTop:'1px solid #F1F3F5', margin:'6px 0 0' }}>
                        <Link href="/kategori" onClick={() => setKategoriOpen(false)}
                          style={{ display:'block', padding:'9px 16px', color:'#1B3A6B', fontSize:12, fontWeight:600 }}>
                          Lihat semua kategori →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/tentang" style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:500, padding:'6px 12px', borderRadius:7 }}>Tentang Kami</Link>
            </div>

            <div style={{ flex:1 }} />

            {/* Search */}
            <div ref={searchRef} style={{ position:'relative', flex:'0 1 280px' }} className="hide-mobile">
              <form onSubmit={handleSearch}>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.4)', fontSize:14, pointerEvents:'none' }}>🔍</span>
                  <input type="text" value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Cari berita, opini..."
                    style={{ width:'100%', padding:'8px 12px 8px 34px', borderRadius:9, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:13, outline:'none' }} />
                  {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(''); setSearchResults([]) }}
                      style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:14, padding:0 }}>✕</button>
                  )}
                </div>
              </form>
              {searchOpen && searchQuery.trim() && (
                <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, right:0, background:'white', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', border:'1px solid #E9ECEF', overflow:'hidden', zIndex:200 }}>
                  {searching ? (
                    <div style={{ padding:'16px', textAlign:'center', color:'#ADB5BD', fontSize:13 }}>Mencari...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map(r => (
                        <Link key={r.id} href={`/artikel/${r.slug}`} onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                          style={{ display:'block', padding:'10px 14px', borderBottom:'1px solid #F8F9FA', color:'#0d2347' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:4, background:r.type==='berita'?'#1B3A6B':'#C9A84C', color:r.type==='berita'?'#C9A84C':'#1B3A6B', textTransform:'uppercase', flexShrink:0 }}>{r.type}</span>
                            <span style={{ fontSize:13, fontWeight:500, lineHeight:1.3 }}>{r.title}</span>
                          </div>
                          {r.excerpt && <p style={{ fontSize:11, color:'#ADB5BD', marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.excerpt}</p>}
                        </Link>
                      ))}
                      <Link href={`/cari?q=${encodeURIComponent(searchQuery)}`} onClick={() => setSearchOpen(false)}
                        style={{ display:'block', padding:'9px 14px', textAlign:'center', fontSize:12, fontWeight:600, color:'#1B3A6B', background:'#F8F9FA' }}>
                        Lihat semua hasil untuk "{searchQuery}" →
                      </Link>
                    </>
                  ) : (
                    <div style={{ padding:'16px', textAlign:'center', color:'#ADB5BD', fontSize:13 }}>Tidak ada hasil untuk "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>

            {/* Tulis + Profile */}
            <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
              <Link href="/tulis" style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 16px', borderRadius:9, background:'#C9A84C', color:'#0d2347', fontWeight:700, fontSize:13, textDecoration:'none' }}>
                <span>✍️</span>
                <span className="hide-mobile">Tulis</span>
              </Link>

              {user ? (
                /* Profile Dropdown */
                <div ref={profileRef} style={{ position:'relative' }}>
                  <button onClick={() => setProfileOpen(o => !o)}
                    style={{ width:36, height:36, borderRadius:'50%', background:'#1B3A6B', border:`2px solid ${profileOpen ? '#C9A84C' : 'rgba(201,168,76,0.5)'}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#C9A84C', fontWeight:700, fontSize:13, overflow:'hidden', cursor:'pointer', padding:0, transition:'border-color .2s' }}>
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : (profile?.full_name?.[0] || user.email?.[0] || '?').toUpperCase()
                    }
                  </button>

                  {profileOpen && (
                    <div style={{ position:'absolute', top:'calc(100% + 10px)', right:0, background:'white', borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', border:'1px solid #E9ECEF', minWidth:220, overflow:'hidden', zIndex:200 }}>
                      {/* User info */}
                      <div style={{ padding:'14px 16px', borderBottom:'1px solid #F1F3F5', background:'linear-gradient(135deg,#EFF4FF,#F8F9FA)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:38, height:38, borderRadius:'50%', background:'#1B3A6B', color:'#C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:15, overflow:'hidden', flexShrink:0 }}>
                            {profile?.avatar_url
                              ? <img src={profile.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                              : (profile?.full_name?.[0] || '?').toUpperCase()
                            }
                          </div>
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontWeight:700, fontSize:14, color:'#0d2347', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile?.full_name || 'Pengguna'}</div>
                            <div style={{ fontSize:11, color:'#ADB5BD', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</div>
                          </div>
                        </div>
                        {isAdmin && (
                          <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, background:'rgba(27,58,107,0.1)', border:'1px solid rgba(27,58,107,0.2)' }}>
                            <span style={{ fontSize:10 }}>🛡️</span>
                            <span style={{ fontSize:11, fontWeight:700, color:'#1B3A6B', textTransform:'uppercase', letterSpacing:'.05em' }}>{profile?.role}</span>
                          </div>
                        )}
                      </div>

                      {/* Menu items */}
                      <div style={{ padding:'6px 0' }}>
                        {/* Admin section */}
                        {isAdmin && (
                          <>
                            <div style={{ padding:'6px 16px 4px', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#ADB5BD' }}>Admin</div>
                            <Link href="/admin" onClick={() => setProfileOpen(false)}
                              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', color:'#0d2347', fontSize:13, fontWeight:600, textDecoration:'none' }}>
                              <span style={{ width:28, height:28, borderRadius:7, background:'#1B3A6B', color:'#C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🛡️</span>
                              Admin Panel
                            </Link>
                            <Link href="/admin/artikel" onClick={() => setProfileOpen(false)}
                              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', color:'#0d2347', fontSize:13, textDecoration:'none' }}>
                              <span style={{ width:28, height:28, borderRadius:7, background:'#EFF4FF', color:'#1B3A6B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>📋</span>
                              Kelola Artikel
                            </Link>
                            <div style={{ margin:'6px 0', borderTop:'1px solid #F1F3F5' }} />
                          </>
                        )}

                        {/* User section */}
                        <div style={{ padding:'6px 16px 4px', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#ADB5BD' }}>Akun</div>
                        <Link href="/profil" onClick={() => setProfileOpen(false)}
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', color:'#0d2347', fontSize:13, textDecoration:'none' }}>
                          <span style={{ width:28, height:28, borderRadius:7, background:'#EFF4FF', color:'#1B3A6B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>👤</span>
                          Profil Saya
                        </Link>
                        <Link href="/artikel-saya" onClick={() => setProfileOpen(false)}
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', color:'#0d2347', fontSize:13, textDecoration:'none' }}>
                          <span style={{ width:28, height:28, borderRadius:7, background:'#EFF4FF', color:'#1B3A6B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>✍️</span>
                          Artikel Saya
                        </Link>
                        <Link href="/tulis" onClick={() => setProfileOpen(false)}
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', color:'#0d2347', fontSize:13, textDecoration:'none' }}>
                          <span style={{ width:28, height:28, borderRadius:7, background:'#EFF4FF', color:'#1B3A6B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>📝</span>
                          Tulis Artikel
                        </Link>

                        {/* Logout */}
                        <div style={{ margin:'6px 0 0', borderTop:'1px solid #F1F3F5' }} />
                        <button onClick={handleLogout}
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', color:'#DC2626', fontSize:13, fontWeight:600, background:'none', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
                          <span style={{ width:28, height:28, borderRadius:7, background:'#FEF2F2', color:'#DC2626', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🚪</span>
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/masuk" className="hide-mobile" style={{ padding:'7px 14px', borderRadius:9, border:'1px solid rgba(255,255,255,0.25)', color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:500, textDecoration:'none' }}>
                  Masuk
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileMenuOpen(o => !o)} className="show-mobile"
                style={{ background:'none', border:'none', color:'white', fontSize:20, cursor:'pointer', padding:'4px', lineHeight:1 }}>
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{ background:'#0d2347', borderTop:'1px solid rgba(255,255,255,0.1)', padding:'12px 16px 16px' }}>
            <form onSubmit={handleSearch} style={{ marginBottom:12 }}>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.4)', fontSize:13 }}>🔍</span>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari berita, opini..."
                  style={{ width:'100%', padding:'9px 12px 9px 32px', borderRadius:9, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:13, outline:'none', boxSizing:'border-box' }} />
              </div>
            </form>
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)}
                style={{ display:'block', color:'rgba(255,255,255,0.85)', fontSize:14, fontWeight:500, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                {l.label}
              </Link>
            ))}
            <div style={{ padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:8 }}>Kategori</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {categories.map(c => (
                  <Link key={c.slug} href={`/kategori/${c.slug}`} onClick={() => setMobileMenuOpen(false)}
                    style={{ padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600, background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.15)' }}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/tentang" onClick={() => setMobileMenuOpen(false)}
              style={{ display:'block', color:'rgba(255,255,255,0.85)', fontSize:14, fontWeight:500, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              Tentang Kami
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}
                    style={{ display:'block', color:'#C9A84C', fontSize:14, fontWeight:600, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                    🛡️ Admin Panel
                  </Link>
                )}
                <Link href="/profil" onClick={() => setMobileMenuOpen(false)}
                  style={{ display:'block', color:'rgba(255,255,255,0.85)', fontSize:14, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  👤 Profil Saya
                </Link>
                <button onClick={handleLogout}
                  style={{ display:'block', color:'#FC8181', fontSize:14, padding:'10px 0', background:'none', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
                  🚪 Keluar
                </button>
              </>
            ) : (
              <Link href="/auth/masuk" onClick={() => setMobileMenuOpen(false)}
                style={{ display:'block', marginTop:12, padding:'10px', textAlign:'center', borderRadius:9, border:'1px solid rgba(255,255,255,0.25)', color:'white', fontSize:14, fontWeight:500 }}>
                Masuk
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  )
}

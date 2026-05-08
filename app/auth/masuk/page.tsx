'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createBrowserClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email atau password salah.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    })
  }

  const S = {
    page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#EFF4FF 0%,#F8F9FA 100%)', padding:'40px 16px' },
    box: { width:'100%', maxWidth:420 },
    logoWrap: { textAlign:'center' as const, marginBottom:32 },
    logoImg: { width:64, height:64, borderRadius:16, objectFit:'cover' as const, border:'2px solid #1B3A6B', marginBottom:12 },
    logoName: { fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:700, color:'#0d2347', letterSpacing:3, display:'block' },
    logoSub: { fontSize:10, color:'#C9A84C', letterSpacing:3, fontWeight:600 },
    card: { background:'white', borderRadius:20, boxShadow:'0 4px 32px rgba(27,58,107,0.08)', padding:32, border:'1px solid #E9ECEF' },
    title: { fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:22, fontWeight:700, marginBottom:4 },
    subtitle: { color:'#6C757D', fontSize:14, marginBottom:24 },
    error: { background:'#FEF2F2', color:'#DC2626', border:'1px solid #FECACA', borderRadius:10, padding:'10px 14px', fontSize:13, marginBottom:16 },
    googleBtn: { width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'11px', borderRadius:10, border:'1.5px solid #E9ECEF', background:'white', fontSize:14, fontWeight:600, color:'#343A40', cursor:'pointer', marginBottom:20, transition:'all .2s' },
    divider: { display:'flex', alignItems:'center', gap:12, marginBottom:20 },
    divLine: { flex:1, height:1, background:'#E9ECEF' },
    divText: { color:'#ADB5BD', fontSize:12 },
    label: { display:'block', fontSize:13, fontWeight:600, color:'#343A40', marginBottom:6 },
    inputWrap: { position:'relative' as const, marginBottom:16 },
    input: { width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #E9ECEF', fontSize:14, color:'#343A40', outline:'none', boxSizing:'border-box' as const, transition:'border .2s' },
    submitBtn: { width:'100%', padding:'12px', borderRadius:10, background:'#1B3A6B', color:'white', fontSize:14, fontWeight:700, border:'none', cursor:'pointer', marginTop:8 },
    footer: { textAlign:'center' as const, marginTop:20, fontSize:14, color:'#6C757D' },
    link: { color:'#1B3A6B', fontWeight:700, textDecoration:'none' },
  }

  return (
    <div style={S.page}>
      <div style={S.box}>
        <div style={S.logoWrap}>
          <Link href="/">
            <img src="/logo-hukra.jpg" alt="HUKRA" style={S.logoImg} />
            <span style={S.logoName}>HUKRA</span>
            <span style={S.logoSub}>HUKUM DAN RISET AKADEMIKA</span>
          </Link>
        </div>

        <div style={S.card}>
          <div style={S.title}>Masuk ke HUKRA</div>
          <div style={S.subtitle}>Selamat datang kembali!</div>

          {error && <div style={S.error}>{error}</div>}

          <button onClick={handleGoogle} disabled={googleLoading} style={S.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {googleLoading ? 'Mengarahkan...' : 'Masuk dengan Google'}
          </button>

          <div style={S.divider}><div style={S.divLine}/><span style={S.divText}>atau</span><div style={S.divLine}/></div>

          <form onSubmit={handleLogin}>
            <div>
              <label style={S.label}>Email</label>
              <div style={S.inputWrap}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" required style={S.input}
                  onFocus={e => e.target.style.borderColor='#1B3A6B'} onBlur={e => e.target.style.borderColor='#E9ECEF'} />
              </div>
            </div>
            <div>
              <label style={S.label}>Password</label>
              <div style={{ ...S.inputWrap, position:'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password kamu" required style={{ ...S.input, paddingRight:42 }}
                  onFocus={e => e.target.style.borderColor='#1B3A6B'} onBlur={e => e.target.style.borderColor='#E9ECEF'} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#ADB5BD', fontSize:16 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div style={S.footer}>
            Belum punya akun? <Link href="/auth/daftar" style={S.link}>Daftar sekarang</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

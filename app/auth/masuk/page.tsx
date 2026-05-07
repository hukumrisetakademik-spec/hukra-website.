'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createBrowserClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #F8F9FA 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#1B3A6B' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" fill="rgba(255,255,255,0.1)"/>
                <path d="M7 10h10M7 13h10M7 16h6" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0d2347', letterSpacing: 3 }}>HUKRA</div>
              <div style={{ fontSize: 9, color: '#C9A84C', letterSpacing: 3, fontWeight: 500 }}>HUKUM · RISET · AKADEMIK</div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border" style={{ borderColor: '#E9ECEF' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 22 }} className="font-bold mb-1">Masuk ke Hukra</h1>
          <p className="text-sm mb-6" style={{ color: '#6C757D' }}>Selamat datang kembali</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50 mb-4" style={{ borderColor: '#E9ECEF', color: '#343A40' }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Masuk dengan Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: '#E9ECEF' }} />
            <span className="text-xs" style={{ color: '#ADB5BD' }}>atau</span>
            <div className="flex-1 h-px" style={{ background: '#E9ECEF' }} />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#343A40' }}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" required
                  className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: '#E9ECEF', color: '#343A40' }}
                  onFocus={e => e.target.style.borderColor = '#1B3A6B'}
                  onBlur={e => e.target.style.borderColor = '#E9ECEF'} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#343A40' }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password kamu" required
                  className="w-full pl-9 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: '#E9ECEF', color: '#343A40' }}
                  onFocus={e => e.target.style.borderColor = '#1B3A6B'}
                  onBlur={e => e.target.style.borderColor = '#E9ECEF'} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50" style={{ background: '#1B3A6B', color: 'white' }}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#6C757D' }}>
            Belum punya akun?{' '}
            <Link href="/auth/daftar" style={{ color: '#1B3A6B', fontWeight: 600 }}>Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createBrowserClient()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Password tidak cocok.'); return }
    if (form.password.length < 8) { setError('Password minimal 8 karakter.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #EFF4FF, #F8F9FA)' }}>
        <div className="bg-white rounded-2xl p-10 text-center max-w-sm w-full shadow-lg border" style={{ borderColor: '#E9ECEF' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F0FFF4' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke="#22C55E" strokeWidth="2"/></svg>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 20 }} className="font-bold mb-2">Cek Email Kamu!</h2>
          <p className="text-sm mb-6" style={{ color: '#6C757D' }}>Kami kirim link verifikasi ke <strong style={{ color: '#0d2347' }}>{form.email}</strong>. Klik link tersebut untuk mengaktifkan akun.</p>
          <Link href="/auth/masuk" className="block py-3 rounded-xl font-semibold text-sm text-white" style={{ background: '#1B3A6B' }}>Kembali ke Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #F8F9FA 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#1B3A6B' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M7 10h10M7 13h10M7 16h6" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#0d2347', letterSpacing: 3 }}>HUKRA</div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border" style={{ borderColor: '#E9ECEF' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 22 }} className="font-bold mb-1">Buat Akun Baru</h1>
          <p className="text-sm mb-6" style={{ color: '#6C757D' }}>Bergabung dan mulai berkontribusi</p>

          {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>{error}</div>}

          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50 mb-4" style={{ borderColor: '#E9ECEF', color: '#343A40' }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Daftar dengan Google
          </button>

          <div className="flex items-center gap-3 mb-4"><div className="flex-1 h-px" style={{ background: '#E9ECEF' }}/><span className="text-xs" style={{ color: '#ADB5BD' }}>atau</span><div className="flex-1 h-px" style={{ background: '#E9ECEF' }}/></div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#343A40' }}>Nama Lengkap</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nama kamu" required
                  className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E9ECEF', color: '#343A40' }}
                  onFocus={e => e.target.style.borderColor='#1B3A6B'} onBlur={e => e.target.style.borderColor='#E9ECEF'} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#343A40' }}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@contoh.com" required
                  className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E9ECEF', color: '#343A40' }}
                  onFocus={e => e.target.style.borderColor='#1B3A6B'} onBlur={e => e.target.style.borderColor='#E9ECEF'} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#343A40' }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min. 8 karakter" required
                  className="w-full pl-9 pr-10 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E9ECEF', color: '#343A40' }}
                  onFocus={e => e.target.style.borderColor='#1B3A6B'} onBlur={e => e.target.style.borderColor='#E9ECEF'} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#343A40' }}>Konfirmasi Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                <input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} placeholder="Ulangi password" required
                  className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E9ECEF', color: '#343A40' }}
                  onFocus={e => e.target.style.borderColor='#1B3A6B'} onBlur={e => e.target.style.borderColor='#E9ECEF'} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50" style={{ background: '#1B3A6B', color: 'white' }}>
              {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#6C757D' }}>
            Sudah punya akun? <Link href="/auth/masuk" style={{ color: '#1B3A6B', fontWeight: 600 }}>Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

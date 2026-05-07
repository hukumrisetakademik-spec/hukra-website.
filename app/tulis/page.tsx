'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createBrowserClient, createRawClient } from '@/lib/supabase'
import { Upload, X, Save, Send, Eye, AlertCircle } from 'lucide-react'
import type { Category } from '@/lib/supabase'
import slugify from 'slugify'

const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false, loading: () => <div className="skeleton h-64 rounded-xl" /> })

export default function TulisPage() {
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', type: 'opini' as 'berita' | 'opini',
    category_id: '', tags: '', cover_image: ''
  })
  const [coverPreview, setCoverPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)
  const supabase = createBrowserClient()
  const db = createRawClient()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/masuk'); return }
      setUser(data.user)
    })
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  const uploadCover = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error, data } = await supabase.storage.from('article-images').upload(path, file)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('article-images').getPublicUrl(path)
    return publicUrl
  }

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverPreview(URL.createObjectURL(file))
    try {
      const url = await uploadCover(file)
      setForm(f => ({ ...f, cover_image: url }))
    } catch {
      setError('Gagal upload gambar. Coba lagi.')
    }
  }

  const generateSlug = (title: string) => slugify(title, { lower: true, strict: true, locale: 'id' }) + '-' + Date.now().toString(36)

  const saveDraft = async () => {
    if (!form.title.trim()) { setError('Judul wajib diisi.'); return }
    setSaving(true)
    setError('')
    const slug = generateSlug(form.title)
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = { ...form, slug, tags, author_id: user.id, status: 'draft' as const, excerpt: form.excerpt || form.content.replace(/<[^>]+>/g, '').slice(0, 200) }
    
    let res
    if (savedId) {
      res = await db.from('articles').update(payload as any).eq('id', savedId).select().single()
    } else {
      res = await db.from('articles').insert(payload as any).select().single()
    }
    if (res.error) { setError(res.error.message); setSaving(false); return }
    setSavedId(res.data.id)
    setSuccess('Draft tersimpan!')
    setTimeout(() => setSuccess(''), 3000)
    setSaving(false)
  }

  const submitArticle = async () => {
    if (!form.title.trim()) { setError('Judul wajib diisi.'); return }
    if (!form.content || form.content.replace(/<[^>]+>/g, '').length < 100) { setError('Konten artikel terlalu pendek (min. 100 karakter).'); return }
    setSubmitting(true)
    setError('')
    const slug = generateSlug(form.title)
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = { ...form, slug, tags, author_id: user.id, status: 'pending' as const, excerpt: form.excerpt || form.content.replace(/<[^>]+>/g, '').slice(0, 200) }
    
    let res
    if (savedId) {
      res = await db.from('articles').update({ ...payload, status: 'pending' } as any).eq('id', savedId).select().single()
    } else {
      res = await db.from('articles').insert(payload as any).select().single()
    }
    if (res.error) { setError(res.error.message); setSubmitting(false); return }
    router.push('/dashboard?submitted=true')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 24 }} className="font-bold">Tulis Artikel</h1>
          <p className="text-sm mt-1" style={{ color: '#6C757D' }}>Artikel kamu akan direview admin sebelum ditayangkan</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={saveDraft} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 hover:bg-gray-50" style={{ borderColor: '#E9ECEF', color: '#343A40' }}>
            <Save size={14} />{saving ? 'Menyimpan...' : 'Simpan Draft'}
          </button>
          <button onClick={submitArticle} disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50" style={{ background: '#1B3A6B', color: 'white' }}>
            <Send size={14} />{submitting ? 'Mengirim...' : 'Kirim untuk Review'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl flex items-start gap-2 text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
          <AlertCircle size={14} className="mt-0.5 shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: '#F0FFF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Cover image */}
          <div>
            {coverPreview ? (
              <div className="relative rounded-xl overflow-hidden" style={{ height: 200 }}>
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                <button onClick={() => { setCoverPreview(''); setForm(f => ({ ...f, cover_image: '' })) }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed transition-all hover:border-navy" style={{ borderColor: '#E9ECEF' }}>
                <Upload size={22} style={{ color: '#ADB5BD' }} />
                <span className="text-sm" style={{ color: '#ADB5BD' }}>Klik untuk upload foto sampul</span>
                <span className="text-xs" style={{ color: '#ADB5BD' }}>JPG, PNG (maks. 5MB)</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </div>

          {/* Title */}
          <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Judul artikel kamu..."
            className="w-full px-0 py-2 text-3xl font-bold border-0 border-b outline-none bg-transparent"
            style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', borderColor: '#E9ECEF' }} />

          {/* Excerpt */}
          <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            placeholder="Ringkasan singkat artikel (opsional, auto-generate jika kosong)..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
            style={{ borderColor: '#E9ECEF', color: '#343A40' }}
            onFocus={e => e.target.style.borderColor='#1B3A6B'}
            onBlur={e => e.target.style.borderColor='#E9ECEF'} />

          {/* Editor */}
          <RichEditor content={form.content} onChange={content => setForm(f => ({ ...f, content }))} placeholder="Mulai menulis artikel kamu di sini..." />
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Type */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#E9ECEF' }}>
            <label className="block text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#6C757D' }}>Jenis Tulisan</label>
            <div className="grid grid-cols-2 gap-2">
              {['opini', 'berita'].map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t as any }))}
                  className="py-2.5 rounded-lg text-sm font-semibold capitalize transition-all"
                  style={{ background: form.type === t ? (t === 'opini' ? '#C9A84C' : '#1B3A6B') : '#F8F9FA', color: form.type === t ? (t === 'opini' ? '#1B3A6B' : 'white') : '#6C757D' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#E9ECEF' }}>
            <label className="block text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#6C757D' }}>Kategori</label>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: '#E9ECEF', color: '#343A40' }}>
              <option value="">Pilih kategori...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#E9ECEF' }}>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: '#6C757D' }}>Tag</label>
            <p className="text-xs mb-3" style={{ color: '#ADB5BD' }}>Pisahkan dengan koma</p>
            <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="hukum pidana, MK, konstitusi"
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: '#E9ECEF', color: '#343A40' }}
              onFocus={e => e.target.style.borderColor='#1B3A6B'}
              onBlur={e => e.target.style.borderColor='#E9ECEF'} />
          </div>

          {/* Guide */}
          <div className="rounded-xl p-4" style={{ background: '#EFF4FF', border: '1px solid #C3D3F0' }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: '#1B3A6B' }}>Panduan Menulis</h4>
            <ul className="space-y-1.5">
              {['Gunakan bahasa yang jelas dan faktual', 'Sertakan sumber yang dapat diverifikasi', 'Opini harus berdasarkan analisis', 'Min. 300 kata untuk artikel berita', 'Foto sampul meningkatkan keterbacaan'].map(g => (
                <li key={g} className="text-xs flex items-start gap-1.5" style={{ color: '#2a4f8f' }}>
                  <span className="mt-0.5">✓</span>{g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

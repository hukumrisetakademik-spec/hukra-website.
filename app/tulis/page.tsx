'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createBrowserClient } from '@/lib/supabase'
import { getSupabaseClient } from '@/lib/supabase-client'
import slugify from 'slugify'

const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false, loading: () => (
  <div style={{ border:'1.5px solid #E9ECEF', borderRadius:12, padding:40, textAlign:'center', color:'#ADB5BD' }}>Memuat editor...</div>
)})

export default function TulisPage() {
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState({ title:'', excerpt:'', content:'', type:'opini' as any, category_id:'', tags:'' })
  const [coverPreview, setCoverPreview] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [savedId, setSavedId] = useState<string|null>(null)
  const [showThanks, setShowThanks] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor'|'settings'>('editor')
  const supabase = createBrowserClient()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const db = getSupabaseClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/masuk'); return }
      setUser(data.user)
    })
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data || []))
  }, [])

  const uploadCover = async (file: File) => {
    if (!user) return
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('article-images').upload(path, file)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('article-images').getPublicUrl(path)
    return publicUrl
  }

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverPreview(URL.createObjectURL(file))
    try {
      const url = await uploadCover(file)
      if (url) setCoverUrl(url)
    } catch { setError('Gagal upload gambar.') }
  }

  const generateSlug = (title: string) => slugify(title, { lower:true, strict:true }) + '-' + Date.now().toString(36)

  const save = async (status: 'draft'|'pending') => {
    if (!form.title.trim()) { setError('Judul wajib diisi.'); return }
    if (status === 'pending' && (!form.content || form.content.replace(/<[^>]+>/g,'').length < 50)) { setError('Konten terlalu pendek.'); return }
    
    status === 'draft' ? setSaving(true) : setSubmitting(true)
    setError('')

    // Always get fresh user from auth
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) { setError('Sesi habis, silakan login ulang.'); setSaving(false); setSubmitting(false); return }
    
    const payload = {
      title: form.title, excerpt: form.excerpt || form.content.replace(/<[^>]+>/g,'').slice(0,200),
      content: form.content, type: form.type, category_id: form.category_id || null,
      tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean),
      cover_image: coverUrl || null, author_id: currentUser.id, status,
      slug: generateSlug(form.title),
    }

    let res: any
    if (savedId) {
      res = await (db as any).from('articles').update(payload).eq('id', savedId).select().single()
    } else {
      res = await (db as any).from('articles').insert(payload).select().single()
    }

    if (res.error) { setError(res.error.message); setSaving(false); setSubmitting(false); return }
    if (status === 'draft') { setSavedId(res.data.id); setSuccess('Draft tersimpan!'); setTimeout(()=>setSuccess(''),3000); setSaving(false) }
    else {
      // Reset form dan tampilkan popup terima kasih
      setForm({ title:'', excerpt:'', content:'', type:'opini', category_id:'', tags:'' })
      setCoverPreview('')
      setCoverUrl('')
      setSavedId(null)
      setSubmitting(false)
      setShowThanks(true)
    }
  }

  const S = {
    page: { background:'#F8F9FA', minHeight:'100vh' },
    header: { background:'white', borderBottom:'1px solid #E9ECEF', padding:'16px 24px', position:'sticky' as const, top:0, zIndex:40 },
    headerInner: { maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' as const },
    title: { fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:20, fontWeight:700 },
    subtitle: { color:'#ADB5BD', fontSize:13, marginTop:2 },
    btnRow: { display:'flex', gap:10, flexWrap:'wrap' as const },
    btnDraft: { padding:'8px 18px', borderRadius:9, border:'1.5px solid #E9ECEF', background:'white', color:'#343A40', fontSize:13, fontWeight:600, cursor:'pointer' },
    btnSubmit: { padding:'8px 18px', borderRadius:9, background:'#1B3A6B', color:'white', fontSize:13, fontWeight:700, border:'none', cursor:'pointer' },
    body: { maxWidth:1100, margin:'0 auto', padding:'24px 16px', display:'grid', gridTemplateColumns:'1fr 280px', gap:24 },
    mainCard: { background:'white', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
    sideCard: { background:'white', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:16 },
    sideLabel: { fontSize:11, fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.12em', color:'#6C757D', marginBottom:12 },
    input: { width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #E9ECEF', fontSize:14, outline:'none', boxSizing:'border-box' as const },
    select: { width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #E9ECEF', fontSize:14, outline:'none', boxSizing:'border-box' as const, background:'white' },
    typeBtn: (active: boolean, type: string) => ({ flex:1, padding:'9px', borderRadius:8, border:`1.5px solid ${active?(type==='opini'?'#C9A84C':'#1B3A6B'):'#E9ECEF'}`, background: active?(type==='opini'?'#C9A84C':'#1B3A6B'):'white', color: active?(type==='opini'?'#1B3A6B':'white'):'#6C757D', fontSize:13, fontWeight:700, cursor:'pointer' }),
  }

  if (showThanks) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F9FA', padding:24 }}>
      <div style={{ background:'white', borderRadius:20, padding:40, textAlign:'center', maxWidth:400, boxShadow:'0 4px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h2 style={{ fontFamily:'Playfair Display,serif', color:'#0d2347', fontSize:24, fontWeight:700, marginBottom:12 }}>Terima kasih sudah menulis!</h2>
        <p style={{ color:'#6C757D', lineHeight:1.7, marginBottom:24 }}>Tulisanmu sudah dikirim ke admin untuk direview. Admin akan memeriksa dan mempublikasikannya dalam 1-2 hari kerja.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => setShowThanks(false)} style={{ padding:'12px 24px', borderRadius:10, background:'#1B3A6B', color:'white', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
            ✍️ Tulis Lagi
          </button>
          <a href=/ style={{ padding:'12px 24px', borderRadius:10, border:'1.5px solid #E9ECEF', color:'#343A40', fontWeight:600, fontSize:14, textDecoration:'none', display:'inline-block' }}>
            🏠 Ke Beranda
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <style>{`@media(max-width:768px){.tulis-grid{grid-template-columns:1fr!important}.tulis-side{order:-1}}`}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <div>
            <div style={S.title}>✍️ Tulis Berita/Opini</div>
            <div style={S.subtitle}>Artikel akan direview admin sebelum ditayangkan</div>
          </div>
          <div style={S.btnRow}>
            {success && <span style={{ fontSize:13, color:'#059669', padding:'8px 14px', background:'#ECFDF5', borderRadius:9 }}>✅ {success}</span>}
            {error && <span style={{ fontSize:13, color:'#DC2626', padding:'8px 14px', background:'#FEF2F2', borderRadius:9 }}>⚠️ {error}</span>}
            <button onClick={() => save('draft')} disabled={saving} style={{ ...S.btnDraft, opacity:saving?.5:1 }}>{saving?'Menyimpan...':'💾 Draft'}</button>
            <button onClick={() => save('pending')} disabled={submitting} style={{ ...S.btnSubmit, opacity:submitting?.5:1 }}>{submitting?'Mengirim...':'📤 Kirim Review'}</button>
          </div>
        </div>
      </div>

      <div className="tulis-grid" style={{ ...S.body }}>
        {/* Editor */}
        <div style={S.mainCard}>
          {/* Cover image */}
          <div style={{ marginBottom:20 }}>
            {coverPreview || coverUrl ? (
              <div style={{ position:'relative', borderRadius:12, overflow:'hidden', marginBottom:12 }}>
                <img src={coverPreview || coverUrl} alt="Cover" style={{ width:'100%', height:200, objectFit:'cover' }} />
                <button onClick={() => { setCoverPreview(''); setCoverUrl('') }}
                  style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,0.6)', color:'white', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:12 }}>
                  ✕ Hapus
                </button>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ border:'2px dashed #E9ECEF', borderRadius:12, padding:'28px', textAlign:'center', cursor:'pointer', background:'#F8F9FA' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🖼️</div>
                <div style={{ fontSize:14, color:'#6C757D', fontWeight:500 }}>Klik untuk upload foto sampul</div>
                <div style={{ fontSize:12, color:'#ADB5BD', marginTop:4 }}>JPG, PNG maksimal 5MB</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverFile} style={{ display:'none' }} />

            {/* URL input for image */}
            <div style={{ marginTop:10 }}>
              <input type="url" placeholder="Atau paste URL gambar: https://..." style={{ ...S.input, fontSize:13 }}
                onChange={e => { if(e.target.value) { setCoverPreview(e.target.value); setCoverUrl(e.target.value) } }} />
            </div>
          </div>

          {/* Title */}
          <input type="text" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
            placeholder="Judul berita atau opini kamu..."
            style={{ width:'100%', fontSize:'clamp(18px,3vw,26px)', fontFamily:'Playfair Display,serif', fontWeight:700, color:'#0d2347', border:'none', borderBottom:'2px solid #E9ECEF', padding:'8px 0', outline:'none', marginBottom:16, boxSizing:'border-box' }} />

          {/* Excerpt */}
          <textarea value={form.excerpt} onChange={e=>setForm(f=>({...f,excerpt:e.target.value}))}
            placeholder="Ringkasan singkat (opsional)..."
            rows={2} style={{ ...S.input, resize:'none', marginBottom:16, fontSize:14, color:'#4A5568', fontStyle:'italic' }} />

          {/* Editor */}
          <RichEditor content={form.content} onChange={content=>setForm(f=>({...f,content}))} />
        </div>

        {/* Sidebar */}
        <aside className="tulis-side">
          {/* Type */}
          <div style={S.sideCard}>
            <div style={S.sideLabel}>Jenis Tulisan</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setForm(f=>({...f,type:'opini'}))} style={S.typeBtn(form.type==='opini','opini')}>📝 Opini</button>
              <button onClick={()=>setForm(f=>({...f,type:'berita'}))} style={S.typeBtn(form.type==='berita','berita')}>📰 Berita</button>
            </div>
          </div>

          {/* Category */}
          <div style={S.sideCard}>
            <div style={S.sideLabel}>Kategori</div>
            <select value={form.category_id} onChange={e=>setForm(f=>({...f,category_id:e.target.value}))} style={S.select}>
              <option value="">Pilih kategori...</option>
              {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div style={S.sideCard}>
            <div style={S.sideLabel}>Tag</div>
            <input type="text" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))}
              placeholder="hukum pidana, MK..." style={S.input} />
            <div style={{ fontSize:11, color:'#ADB5BD', marginTop:6 }}>Pisahkan dengan koma</div>
          </div>

          {/* Tips */}
          <div style={{ ...S.sideCard, background:'linear-gradient(135deg,#EFF4FF,#F8F9FA)', border:'1px solid #C3D3F0' }}>
            <div style={{ ...S.sideLabel, color:'#1B3A6B' }}>💡 Tips Menulis</div>
            {['Gunakan bahasa yang jelas','Sertakan sumber terpercaya','Opini perlu argumen kuat','Min. 300 kata untuk berita','Foto sampul menarik pembaca'].map(t=>(
              <div key={t} style={{ fontSize:12, color:'#2a4f8f', marginBottom:6, display:'flex', gap:6 }}>
                <span style={{ color:'#C9A84C' }}>✓</span>{t}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

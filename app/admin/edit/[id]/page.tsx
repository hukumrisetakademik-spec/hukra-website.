'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createBrowserClient } from '@/lib/supabase'
import slugify from 'slugify'
import Link from 'next/link'

const RichEditor = dynamic(() => import('@/components/RichEditor'), {
  ssr: false,
  loading: () => <div style={{ border:'1.5px solid #E9ECEF', borderRadius:12, padding:40, textAlign:'center', color:'#ADB5BD' }}>Memuat editor...</div>
})

export default function AdminEditPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState({ title:'', excerpt:'', content:'', type:'opini', category_id:'', tags:'', status:'pending' })
  const [coverPreview, setCoverPreview] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check admin
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/masuk'); return }
      supabase.from('profiles').select('role').eq('id', data.user.id).single().then(({ data: p }) => {
        if (!p || !['admin','editor'].includes((p as any).role)) { router.push('/'); return }
      })
    })

    // Load article
    const id = params.id as string
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('id', id).single()
      .then(({ data }) => {
        if (!data) { router.push('/admin'); return }
        const a = data as any
        setArticle(a)
        setForm({
          title: a.title || '',
          excerpt: a.excerpt || '',
          content: a.content || '',
          type: a.type || 'opini',
          category_id: a.category_id || '',
          tags: (a.tags || []).join(', '),
          status: a.status || 'pending',
        })
        if (a.cover_image) { setCoverPreview(a.cover_image); setCoverUrl(a.cover_image) }
        setLoading(false)
      })

    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data || []))
  }, [params.id])

  const uploadCover = async (file: File) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    await supabase.storage.from('article-images').upload(path, file)
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

  const save = async (newStatus?: string) => {
    if (!form.title.trim()) { setError('Judul wajib diisi.'); return }
    newStatus ? setPublishing(true) : setSaving(true)
    setError('')

    const payload: any = {
      title: form.title,
      excerpt: form.excerpt || form.content.replace(/<[^>]+>/g,'').slice(0,200),
      content: form.content,
      type: form.type,
      category_id: form.category_id || null,
      tags: form.tags.split(',').map((t:string) => t.trim()).filter(Boolean),
      cover_image: coverUrl || null,
      status: newStatus || form.status,
    }

    if (newStatus === 'published' && !article.published_at) {
      payload.published_at = new Date().toISOString()
    }

    const { error: err } = await (supabase as any).from('articles').update(payload).eq('id', article.id)

    if (err) { setError(err.message); setSaving(false); setPublishing(false); return }
    
    setSuccess(newStatus === 'published' ? 'Artikel dipublikasikan!' : 'Perubahan tersimpan!')
    setTimeout(() => setSuccess(''), 3000)
    if (newStatus) setForm(f => ({ ...f, status: newStatus }))
    setSaving(false)
    setPublishing(false)
  }

  const S = {
    page: { background:'#F8F9FA', minHeight:'100vh' },
    header: { background:'linear-gradient(135deg,#0d2347,#1B3A6B)', padding:'16px 24px' },
    headerInner: { maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:12 },
    body: { maxWidth:1100, margin:'0 auto', padding:'24px 16px', display:'grid', gridTemplateColumns:'1fr 280px', gap:24 },
    card: { background:'white', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
    sideCard: { background:'white', borderRadius:16, padding:18, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:16 },
    label: { fontSize:11, fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'.12em', color:'#6C757D', marginBottom:10, display:'block' },
    input: { width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #E9ECEF', fontSize:14, outline:'none', boxSizing:'border-box' as const },
    select: { width:'100%', padding:'10px 14px', borderRadius:9, border:'1.5px solid #E9ECEF', fontSize:14, outline:'none', background:'white', boxSizing:'border-box' as const },
    btnSave: { padding:'9px 20px', borderRadius:9, border:'1.5px solid #E9ECEF', background:'white', color:'#343A40', fontSize:13, fontWeight:600, cursor:'pointer' },
    btnPublish: { padding:'9px 20px', borderRadius:9, background:'#059669', color:'white', fontSize:13, fontWeight:700, border:'none', cursor:'pointer' },
    btnBack: { padding:'9px 16px', borderRadius:9, border:'1.5px solid rgba(255,255,255,0.3)', color:'white', fontSize:13, fontWeight:600, textDecoration:'none', display:'inline-block' },
  }

  const statusColors: any = { draft:'#6B7280', pending:'#D97706', published:'#059669', rejected:'#DC2626' }
  const statusLabels: any = { draft:'Draft', pending:'Menunggu Review', published:'Ditayangkan', rejected:'Ditolak' }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #E9ECEF', borderTopColor:'#1B3A6B', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={S.page}>
      <style>{`@media(max-width:768px){.edit-grid{grid-template-columns:1fr!important}.edit-side{order:-1}}`}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <div>
            <div style={{ color:'white', fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700 }}>✏️ Edit Artikel</div>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginTop:3 }}>
              Oleh: {article?.profiles?.full_name} · 
              <span style={{ marginLeft:6, padding:'2px 8px', borderRadius:10, background:`${statusColors[form.status]}25`, color:statusColors[form.status], fontSize:11, fontWeight:700 }}>
                {statusLabels[form.status]}
              </span>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            {success && <span style={{ fontSize:13, color:'#059669', padding:'8px 14px', background:'#ECFDF5', borderRadius:9 }}>✅ {success}</span>}
            {error && <span style={{ fontSize:13, color:'#DC2626', padding:'8px 14px', background:'#FEF2F2', borderRadius:9 }}>⚠️ {error}</span>}
            <Link href="/admin" style={S.btnBack}>← Admin</Link>
            <button onClick={() => save()} disabled={saving} style={{ ...S.btnSave, opacity:saving?.6:1 }}>{saving?'Menyimpan...':'💾 Simpan'}</button>
            {form.status !== 'published' && (
              <button onClick={() => save('published')} disabled={publishing} style={{ ...S.btnPublish, opacity:publishing?.6:1 }}>{publishing?'Memproses...':'✅ Publish'}</button>
            )}
            {form.status === 'published' && (
              <button onClick={() => save('rejected')} style={{ padding:'9px 20px', borderRadius:9, background:'#DC2626', color:'white', fontSize:13, fontWeight:700, border:'none', cursor:'pointer' }}>❌ Tarik</button>
            )}
          </div>
        </div>
      </div>

      <div className="edit-grid" style={{ ...S.body }}>
        {/* Main */}
        <div style={S.card}>
          {/* Cover */}
          <div style={{ marginBottom:20 }}>
            {coverPreview ? (
              <div style={{ position:'relative', borderRadius:12, overflow:'hidden', marginBottom:10 }}>
                <img src={coverPreview} alt="Cover" style={{ width:'100%', height:200, objectFit:'cover' }} />
                <button onClick={() => { setCoverPreview(''); setCoverUrl('') }}
                  style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,0.6)', color:'white', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:12 }}>
                  ✕ Hapus
                </button>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ border:'2px dashed #E9ECEF', borderRadius:12, padding:24, textAlign:'center', cursor:'pointer', background:'#F8F9FA' }}>
                <div style={{ fontSize:24, marginBottom:6 }}>🖼️</div>
                <div style={{ fontSize:14, color:'#6C757D' }}>Upload foto sampul</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverFile} style={{ display:'none' }} />
            <input type="url" placeholder="Atau paste URL gambar..." style={{ ...S.input, marginTop:10, fontSize:13 }}
              defaultValue={coverUrl} onChange={e => { if(e.target.value) { setCoverPreview(e.target.value); setCoverUrl(e.target.value) } }} />
          </div>

          {/* Title */}
          <input value={form.title} onChange={e => setForm(f => ({...f,title:e.target.value}))}
            placeholder="Judul artikel..."
            style={{ width:'100%', fontSize:22, fontFamily:'Playfair Display,serif', fontWeight:700, color:'#0d2347', border:'none', borderBottom:'2px solid #E9ECEF', padding:'8px 0', outline:'none', marginBottom:16, boxSizing:'border-box' }} />

          {/* Excerpt */}
          <textarea value={form.excerpt} onChange={e => setForm(f => ({...f,excerpt:e.target.value}))}
            placeholder="Ringkasan singkat..." rows={2}
            style={{ ...S.input, resize:'none', marginBottom:16, fontStyle:'italic', color:'#4A5568' }} />

          {/* Editor */}
          <RichEditor content={form.content} onChange={content => setForm(f => ({...f,content}))} />
        </div>

        {/* Sidebar */}
        <aside className="edit-side">
          {/* Status */}
          <div style={S.sideCard}>
            <span style={S.label}>Status Artikel</span>
            <select value={form.status} onChange={e => setForm(f => ({...f,status:e.target.value}))} style={S.select}>
              <option value="draft">Draft</option>
              <option value="pending">Menunggu Review</option>
              <option value="published">Ditayangkan</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          {/* Type */}
          <div style={S.sideCard}>
            <span style={S.label}>Jenis Tulisan</span>
            <div style={{ display:'flex', gap:8 }}>
              {['opini','berita'].map(t => (
                <button key={t} onClick={() => setForm(f => ({...f,type:t}))}
                  style={{ flex:1, padding:'9px', borderRadius:8, border:`1.5px solid ${form.type===t?(t==='opini'?'#C9A84C':'#1B3A6B'):'#E9ECEF'}`, background:form.type===t?(t==='opini'?'#C9A84C':'#1B3A6B'):'white', color:form.type===t?(t==='opini'?'#1B3A6B':'white'):'#6C757D', fontSize:13, fontWeight:700, cursor:'pointer', textTransform:'capitalize' }}>
                  {t === 'opini' ? '📝' : '📰'} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div style={S.sideCard}>
            <span style={S.label}>Kategori</span>
            <select value={form.category_id} onChange={e => setForm(f => ({...f,category_id:e.target.value}))} style={S.select}>
              <option value="">Pilih kategori...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div style={S.sideCard}>
            <span style={S.label}>Tag</span>
            <input value={form.tags} onChange={e => setForm(f => ({...f,tags:e.target.value}))}
              placeholder="hukum pidana, MK..." style={S.input} />
            <div style={{ fontSize:11, color:'#ADB5BD', marginTop:6 }}>Pisahkan dengan koma</div>
          </div>

          {/* Info */}
          {article && (
            <div style={{ ...S.sideCard, background:'#F8F9FA' }}>
              <span style={S.label}>Info Artikel</span>
              <div style={{ fontSize:13, color:'#6C757D', lineHeight:2 }}>
                <div>👤 {article.profiles?.full_name}</div>
                <div>👁 {article.view_count || 0} views</div>
                <div>❤️ {article.like_count || 0} likes</div>
                <div>💬 {article.comment_count || 0} komentar</div>
                {article.status === 'published' && (
                  <div style={{ marginTop:8 }}>
                    <Link href={`/artikel/${article.slug}`} target="_blank"
                      style={{ color:'#1B3A6B', fontWeight:600, fontSize:13 }}>
                      🔗 Lihat artikel →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

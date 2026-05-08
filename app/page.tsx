import { createSupabaseServerClient } from '@/lib/server-client'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Star, BookOpen, Users, Award } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()

  const [l, tr, op, ne, ca] = await Promise.all([
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').order('published_at',{ascending:false}).limit(10),
    supabase.from('articles').select('id,title,slug,view_count,type').eq('status','published').order('view_count',{ascending:false}).limit(5),
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').eq('type','opini').order('published_at',{ascending:false}).limit(3),
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').eq('type','berita').order('published_at',{ascending:false}).limit(3),
    supabase.from('categories').select('*').order('name'),
  ])

  const latest = (l.data || []) as any[]
  const trending = (tr.data || []) as any[]
  const opinions = (op.data || []) as any[]
  const news = (ne.data || []) as any[]
  const categories = (ca.data || []) as any[]

  return (
    <div style={{ background: '#F8F9FA' }}>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #0d2347 0%, #1B3A6B 60%, #2a4f8f 100%)' }} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
                <BookOpen size={12} /> Platform Hukum & Riset Akademika
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 40, lineHeight: 1.2 }} className="font-bold mb-4">
                Wadah Riset & Opini <span style={{ color: '#C9A84C' }}>Hukum Indonesia</span>
              </h1>
              <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                Platform berita dan opini hukum dari mahasiswa Fakultas Syariah UIN Palangka Raya. Tulis, bagikan, dan berkontribusi untuk kemajuan hukum Indonesia.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/tulis" className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ background: '#C9A84C', color: '#1B3A6B' }}>
                  Mulai Menulis
                </Link>
                <Link href="/berita" className="px-6 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                  Baca Artikel
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {[
                  { icon: <BookOpen size={16}/>, label: `${latest.length}+ Artikel` },
                  { icon: <Users size={16}/>, label: 'Tim Akademik' },
                  { icon: <Award size={16}/>, label: 'UIN Palangka Raya' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ color: '#C9A84C' }}>{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img src="/logo-hukra.jpg" alt="HUKRA" className="w-64 h-64 object-cover rounded-3xl" style={{ border: '3px solid rgba(201,168,76,0.4)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Berita */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <span className="section-title">Berita Terbaru</span>
                <Link href="/berita" className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#1B3A6B' }}>Lihat semua <ArrowRight size={12}/></Link>
              </div>
              {news.length > 0 ? (
                <div className="space-y-4">
                  {news.map((a: any) => (
                    <Link key={a.id} href={`/artikel/${a.slug}`} className="flex gap-4 bg-white rounded-xl p-4 border group transition-all hover:shadow-md" style={{ borderColor: '#E9ECEF' }}>
                      <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center" style={{ background: '#EFF4FF' }}>
                        {a.cover_image ? <img src={a.cover_image} alt={a.title} className="w-full h-full object-cover" /> : <span className="text-2xl">⚖️</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge-berita">Berita</span>
                          {a.categories && <span className="text-xs" style={{ color: '#ADB5BD' }}>{a.categories.name}</span>}
                        </div>
                        <h3 className="font-semibold line-clamp-2 text-sm leading-snug group-hover:underline" style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347' }}>{a.title}</h3>
                        <p className="text-xs mt-1" style={{ color: '#ADB5BD' }}>{a.profiles?.full_name} · {new Date(a.published_at || a.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border" style={{ borderColor: '#E9ECEF' }}>
                  <p style={{ color: '#ADB5BD' }}>Belum ada berita. <Link href="/tulis" style={{ color: '#1B3A6B' }}>Jadilah yang pertama!</Link></p>
                </div>
              )}
            </section>

            {/* Opini */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <span className="section-title">Opini Terkini</span>
                <Link href="/opini" className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#1B3A6B' }}>Lihat semua <ArrowRight size={12}/></Link>
              </div>
              {opinions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {opinions.map((a: any) => (
                    <Link key={a.id} href={`/artikel/${a.slug}`} className="bg-white rounded-xl border overflow-hidden group hover:shadow-md transition-all" style={{ borderColor: '#E9ECEF' }}>
                      <div className="h-32 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EFF4FF, #E9ECEF)' }}>
                        {a.cover_image ? <img src={a.cover_image} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl">📝</span>}
                      </div>
                      <div className="p-3">
                        <span className="badge-opini mb-2 inline-block">Opini</span>
                        <h3 className="text-sm font-semibold line-clamp-2 group-hover:underline" style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347' }}>{a.title}</h3>
                        <p className="text-xs mt-2" style={{ color: '#ADB5BD' }}>{a.profiles?.full_name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border" style={{ borderColor: '#E9ECEF' }}>
                  <p style={{ color: '#ADB5BD' }}>Belum ada opini. <Link href="/tulis" style={{ color: '#1B3A6B' }}>Tulis opinimu!</Link></p>
                </div>
              )}
            </section>

            {/* Semua terbaru */}
            {latest.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <span className="section-title">Semua Terbaru</span>
                </div>
                <div className="space-y-3">
                  {latest.slice(0, 5).map((a: any) => (
                    <Link key={a.id} href={`/artikel/${a.slug}`} className="flex gap-3 bg-white rounded-xl p-4 border group hover:shadow-md transition-all" style={{ borderColor: '#E9ECEF' }}>
                      <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center" style={{ background: '#F8F9FA' }}>
                        {a.cover_image ? <img src={a.cover_image} alt="" className="w-full h-full object-cover" /> : <span className="text-xl">⚖️</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={a.type === 'berita' ? 'badge-berita' : 'badge-opini'} style={{ fontSize: 9 }}>{a.type}</span>
                        </div>
                        <h3 className="text-sm font-medium line-clamp-1 group-hover:underline" style={{ color: '#0d2347', fontFamily: 'Playfair Display, serif' }}>{a.title}</h3>
                        <p className="text-xs mt-1" style={{ color: '#ADB5BD' }}>{a.profiles?.full_name} · {new Date(a.published_at || a.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Trending */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E9ECEF' }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} style={{ color: '#C9A84C' }} />
                <span className="section-title">Trending</span>
              </div>
              {trending.length > 0 ? trending.map((a: any, i: number) => (
                <Link key={a.id} href={`/artikel/${a.slug}`} className="flex gap-3 py-3 border-b group" style={{ borderColor: '#F8F9FA' }}>
                  <div className="text-xl font-bold w-7 shrink-0" style={{ fontFamily: 'Playfair Display, serif', color: i === 0 ? '#C9A84C' : '#E9ECEF' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium line-clamp-2 group-hover:underline" style={{ color: '#0d2347' }}>{a.title}</h4>
                    <p className="text-xs mt-1" style={{ color: '#ADB5BD' }}>{a.view_count || 0} dibaca</p>
                  </div>
                </Link>
              )) : <p className="text-sm text-center py-4" style={{ color: '#ADB5BD' }}>Belum ada artikel populer</p>}
            </div>

            {/* Kategori */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E9ECEF' }}>
              <span className="section-title block mb-4">Kategori</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {categories.map((cat: any) => (
                  <Link key={cat.id} href={`/kategori/${cat.slug}`} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                    style={{ background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}35` }}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tentang */}
            <div className="rounded-xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0d2347)' }}>
              <img src="/logo-hukra.jpg" alt="HUKRA" className="w-12 h-12 rounded-xl object-cover mb-3" style={{ border: '1.5px solid #C9A84C' }} />
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', fontSize: 15 }}>Tentang HUKRA</h3>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                Komunitas akademik mahasiswa Fakultas Syariah UIN Palangka Raya. Didirikan 21 April 2026.
              </p>
              <Link href="/tentang" className="block text-center text-xs font-semibold py-2 rounded-lg" style={{ background: '#C9A84C', color: '#1B3A6B' }}>
                Selengkapnya
              </Link>
            </div>

            {/* CTA Tulis */}
            <div className="rounded-xl p-5 border" style={{ borderColor: '#E9ECEF', background: 'white' }}>
              <Star size={20} style={{ color: '#C9A84C' }} className="mb-3" />
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 15 }}>Punya pemikiran soal hukum?</h3>
              <p className="text-xs mb-4" style={{ color: '#6C757D', lineHeight: 1.6 }}>Tulis berita atau opini dan bagikan ke ribuan pembaca.</p>
              <Link href="/tulis" className="block text-center text-xs font-semibold py-2.5 rounded-lg" style={{ background: '#1B3A6B', color: 'white' }}>
                Mulai Menulis
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

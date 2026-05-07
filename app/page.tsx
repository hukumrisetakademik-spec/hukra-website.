import { createSupabaseServerClient } from '@/lib/server-client'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Star } from 'lucide-react'
import type { Article } from '@/lib/supabase'

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()

  const [h, l, tr, op, ne, ca] = await Promise.all([
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').eq('is_headline',true).order('published_at',{ascending:false}).limit(5),
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').order('published_at',{ascending:false}).limit(10),
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').order('view_count',{ascending:false}).limit(5),
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').eq('type','opini').order('published_at',{ascending:false}).limit(4),
    supabase.from('articles').select('*, profiles(*), categories(*)').eq('status','published').eq('type','berita').order('published_at',{ascending:false}).limit(4),
    supabase.from('categories').select('*').order('name'),
  ])

  const headlines = h.data as Article[] || []
  const latest = l.data as Article[] || []
  const trending = tr.data as Article[] || []
  const opinions = op.data as Article[] || []
  const news = ne.data as Article[] || []
  const categories = ca.data || []

  const mainHeadline = headlines[0] || latest[0]
  const sideHeadlines = headlines.length > 1 ? headlines.slice(1,4) : latest.slice(1,4)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      {/* Hero */}
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {mainHeadline ? <ArticleCard article={mainHeadline} variant="featured" /> : (
              <div className="rounded-2xl flex items-center justify-center h-80" style={{background:'linear-gradient(135deg,#1B3A6B,#0d2347)'}}>
                <div className="text-center text-white p-8">
                  <div className="text-5xl mb-4">⚖️</div>
                  <h2 style={{fontFamily:'Playfair Display,serif',fontSize:24}}>Selamat datang di Hukra</h2>
                  <p className="text-sm mt-2 opacity-70">Platform berita dan opini hukum Indonesia</p>
                  <Link href="/tulis" className="inline-block mt-4 px-6 py-2 rounded-lg font-medium text-sm" style={{background:'#C9A84C',color:'#1B3A6B'}}>Mulai Menulis</Link>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {sideHeadlines.map(a => <ArticleCard key={a.id} article={a} variant="horizontal" />)}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* Berita */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <span className="section-title">Berita Terbaru</span>
              <Link href="/berita" className="flex items-center gap-1 text-xs font-medium" style={{color:'#1B3A6B'}}>Lihat semua <ArrowRight size={12}/></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.length > 0 ? news.map(a => <ArticleCard key={a.id} article={a} />) : (
                <div className="md:col-span-2 text-center py-12 rounded-xl border" style={{borderColor:'#E9ECEF',background:'white'}}>
                  <p style={{color:'#ADB5BD'}} className="text-sm">Belum ada berita. <Link href="/tulis" style={{color:'#1B3A6B'}}>Jadilah yang pertama!</Link></p>
                </div>
              )}
            </div>
          </section>
          {/* Opini */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <span className="section-title">Opini Terkini</span>
              <Link href="/opini" className="flex items-center gap-1 text-xs font-medium" style={{color:'#1B3A6B'}}>Lihat semua <ArrowRight size={12}/></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opinions.length > 0 ? opinions.map(a => <ArticleCard key={a.id} article={a} />) : (
                <div className="md:col-span-2 text-center py-12 rounded-xl border" style={{borderColor:'#E9ECEF',background:'white'}}>
                  <p style={{color:'#ADB5BD'}} className="text-sm">Belum ada opini. <Link href="/tulis" style={{color:'#1B3A6B'}}>Tulis opinimu!</Link></p>
                </div>
              )}
            </div>
          </section>
          {/* Semua terbaru */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <span className="section-title">Semua Terbaru</span>
            </div>
            <div className="space-y-3">{latest.slice(0,6).map(a => <ArticleCard key={a.id} article={a} variant="horizontal" />)}</div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl border p-5" style={{borderColor:'#E9ECEF'}}>
            <div className="flex items-center gap-2 mb-4"><TrendingUp size={14} style={{color:'#C9A84C'}}/><span className="section-title">Trending</span></div>
            {trending.length > 0 ? trending.map((a,i) => (
              <Link key={a.id} href={`/artikel/${a.slug}`} className="flex gap-3 py-3 border-b group" style={{borderColor:'#F1F3F5'}}>
                <div className="text-2xl font-bold w-8 shrink-0" style={{fontFamily:'Playfair Display,serif',color:i===0?'#C9A84C':'#E9ECEF'}}>{String(i+1).padStart(2,'0')}</div>
                <div><h4 className="text-sm font-medium line-clamp-2 group-hover:underline" style={{color:'#0d2347'}}>{a.title}</h4><p className="text-xs mt-1" style={{color:'#ADB5BD'}}>{a.view_count} dibaca</p></div>
              </Link>
            )) : <p className="text-sm text-center py-4" style={{color:'#ADB5BD'}}>Belum ada artikel populer</p>}
          </div>

          <div className="bg-white rounded-xl border p-5" style={{borderColor:'#E9ECEF'}}>
            <span className="section-title block mb-4">Kategori</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((cat:any) => (
                <Link key={cat.id} href={`/kategori/${cat.slug}`} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                  style={{background:`${cat.color}15`,color:cat.color,border:`1px solid ${cat.color}30`}}>{cat.name}</Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-5 text-white" style={{background:'linear-gradient(135deg,#1B3A6B,#0d2347)'}}>
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{background:'rgba(201,168,76,0.2)'}}><Star size={18} style={{color:'#C9A84C'}}/></div>
            <h3 style={{fontFamily:'Playfair Display,serif',fontSize:16}} className="font-bold mb-2">Punya pemikiran soal hukum?</h3>
            <p className="text-sm mb-4 opacity-70">Tulis opini atau berita dan bagikan ke ribuan pembaca.</p>
            <Link href="/tulis" className="block text-center text-sm font-semibold py-2.5 rounded-lg" style={{background:'#C9A84C',color:'#1B3A6B'}}>Mulai Menulis</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

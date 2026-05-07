import { createSupabaseServerClient } from '@/lib/server-client'
import ArticleCard from '@/components/ArticleCard'
import type { Article } from '@/lib/supabase'

export const metadata = { title: 'Berita Hukum — HUKRA' }

export default async function BeritaPage() {
  const supabase = await createSupabaseServerClient()
  const { data: rawArticles } = await supabase
    .from('articles').select('*, profiles(*), categories(*)')
    .eq('status', 'published').eq('type', 'berita')
    .order('published_at', { ascending: false }).limit(24)
  const articles = (rawArticles || []) as any[]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <span className="badge-berita" style={{ fontSize: 11 }}>Berita</span>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 28 }} className="font-bold mt-2">Berita Hukum Terkini</h1>
        <p className="mt-2 text-sm" style={{ color: '#6C757D' }}>Liputan dan laporan terbaru seputar hukum Indonesia</p>
      </div>
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map(a => <ArticleCard key={a.id} article={a as Article} />)}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border" style={{ borderColor: '#E9ECEF', background: 'white' }}>
          <p style={{ color: '#ADB5BD' }}>Belum ada berita tersedia.</p>
        </div>
      )}
    </div>
  )
}

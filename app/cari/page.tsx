import { createSupabaseServerClient } from '@/lib/server-client'
import ArticleCard from '@/components/ArticleCard'
import type { Article } from '@/lib/supabase'
import { Search } from 'lucide-react'

interface Props { searchParams: { q?: string } }

export default async function CariPage({ searchParams }: Props) {
  const q = searchParams.q || ''
  let articles: Article[] = []

  if (q) {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('articles').select('*, profiles(*), categories(*)')
      .eq('status', 'published')
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .order('published_at', { ascending: false }).limit(20)
    articles = data as Article[] || []
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-6">
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 24 }} className="font-bold mb-2">
          {q ? `Hasil: "${q}"` : 'Cari Artikel'}
        </h1>
        {q && <p className="text-sm" style={{ color: '#6C757D' }}>{articles.length} artikel ditemukan</p>}
      </div>
      {!q && (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto mb-4" style={{ color: '#E9ECEF' }} />
          <p style={{ color: '#ADB5BD' }}>Masukkan kata kunci di kolom pencarian</p>
        </div>
      )}
      {q && articles.length === 0 && (
        <div className="text-center py-16 rounded-xl border" style={{ borderColor: '#E9ECEF', background: 'white' }}>
          <Search size={40} className="mx-auto mb-4" style={{ color: '#E9ECEF' }} />
          <p style={{ color: '#ADB5BD' }}>Tidak ada artikel dengan kata kunci "{q}"</p>
        </div>
      )}
      {articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  )
}

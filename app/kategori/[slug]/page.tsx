import { createSupabaseServerClient } from '@/lib/server-client'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'

interface Props { params: { slug: string } }

export default async function KategoriPage({ params }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: categoryRaw } = await supabase.from('categories').select('*').eq('slug', params.slug).single()
  const category = categoryRaw as any
  if (!category) notFound()

  const { data: rawArticles } = await supabase
    .from('articles').select('*, profiles(*), categories(*)')
    .eq('status', 'published').eq('category_id', category.id)
    .order('published_at', { ascending: false }).limit(24)
  const articles = (rawArticles || []) as any[]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8 pb-6 border-b" style={{ borderColor: '#E9ECEF' }}>
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold mb-3"
          style={{ background: `${category.color}15`, color: category.color, border: `1px solid ${category.color}30` }}>
          {category.name}
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 28 }} className="font-bold">{category.name}</h1>
        {category.description && <p className="mt-2 text-sm" style={{ color: '#6C757D' }}>{category.description}</p>}
      </div>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border" style={{ borderColor: '#E9ECEF', background: 'white' }}>
          <p style={{ color: '#ADB5BD' }}>Belum ada artikel dalam kategori ini.</p>
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'
import { Eye, MessageCircle, Heart, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

interface ArticleCardProps {
  article: any
  variant?: 'default' | 'compact' | 'featured' | 'horizontal'
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.published_at || article.created_at), { addSuffix: true, locale: id })
  const readTime = Math.ceil((article.content?.split(' ').length || 0) / 200)
  const authorName = article.profiles?.full_name || 'Penulis'
  const categoryName = article.categories?.name || ''

  if (variant === 'compact') {
    return (
      <Link href={`/artikel/${article.slug}`} className="flex gap-3 py-3 border-b group" style={{ borderColor: '#F1F3F5' }}>
        {article.cover_image && (
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
            <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'} style={{ fontSize: 9, marginBottom: 4, display: 'inline-block' }}>{article.type}</span>
          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-blue-800 transition-colors" style={{ color: '#343A40' }}>{article.title}</h3>
          <p className="text-xs mt-1" style={{ color: '#ADB5BD' }}>{timeAgo}</p>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/artikel/${article.slug}`} className="flex gap-4 bg-white rounded-xl p-4 border group transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: '#E9ECEF' }}>
        {article.cover_image ? (
          <div className="w-28 h-20 rounded-lg overflow-hidden shrink-0">
            <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ) : (
          <div className="w-28 h-20 rounded-lg shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EFF4FF, #E9ECEF)' }}>
            <span style={{ fontSize: 24 }}>⚖️</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
            {categoryName && <span className="text-xs" style={{ color: '#ADB5BD' }}>{categoryName}</span>}
          </div>
          <h3 className="font-semibold leading-snug line-clamp-2 mb-1.5 group-hover:text-blue-900 transition-colors" style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, color: '#0d2347' }}>
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#ADB5BD' }}>
            <span className="font-medium" style={{ color: '#6C757D' }}>{authorName}</span>
            <span>·</span>
            <span>{timeAgo}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Eye size={10} />{article.view_count || 0}</span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/artikel/${article.slug}`} className="relative rounded-2xl overflow-hidden group block" style={{ minHeight: 340 }}>
        {article.cover_image ? (
          <img src={article.cover_image} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0d2347)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,35,71,0.97) 0%, rgba(13,35,71,0.5) 55%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
            {categoryName && <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{categoryName}</span>}
          </div>
          <h2 className="font-bold text-white leading-snug mb-3" style={{ fontFamily: 'Playfair Display, serif', fontSize: 22 }}>{article.title}</h2>
          {article.excerpt && <p className="text-sm line-clamp-2 mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>{article.excerpt}</p>}
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span className="font-semibold" style={{ color: '#C9A84C' }}>{authorName}</span>
            <span>·</span><span>{timeAgo}</span>
            <span>·</span><span className="flex items-center gap-1"><Eye size={10} />{article.view_count || 0}</span>
          </div>
        </div>
      </Link>
    )
  }

  // Default card
  return (
    <Link href={`/artikel/${article.slug}`} className="bg-white rounded-xl border overflow-hidden group block transition-all duration-200 hover:shadow-lg hover:-translate-y-1" style={{ borderColor: '#E9ECEF' }}>
      {article.cover_image ? (
        <div className="h-44 overflow-hidden">
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-36 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EFF4FF, #E9ECEF)' }}>
          <span style={{ fontSize: 40 }}>⚖️</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
          {categoryName && <span className="text-xs" style={{ color: '#ADB5BD' }}>{categoryName}</span>}
        </div>
        <h3 className="font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-blue-900 transition-colors" style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: '#0d2347' }}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm line-clamp-2 mb-3" style={{ color: '#6C757D', lineHeight: 1.6 }}>{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#F1F3F5' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>
              {authorName[0]?.toUpperCase()}
            </div>
            <span className="text-xs font-medium" style={{ color: '#343A40' }}>{authorName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#ADB5BD' }}>
            <span className="flex items-center gap-1"><Eye size={11} />{article.view_count || 0}</span>
            <span className="flex items-center gap-1"><Heart size={11} />{article.like_count || 0}</span>
          </div>
        </div>
        <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#ADB5BD' }}>
          <Clock size={10} />{timeAgo} · {readTime || 1} menit baca
        </p>
      </div>
    </Link>
  )
}

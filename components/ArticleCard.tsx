import Link from 'next/link'
import Image from 'next/image'
import { Eye, MessageCircle, Heart, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import type { Article } from '@/lib/supabase'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'compact' | 'featured' | 'horizontal'
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.published_at || article.created_at), { addSuffix: true, locale: id })
  const readTime = Math.ceil((article.content?.split(' ').length || 0) / 200)

  if (variant === 'compact') {
    return (
      <Link href={`/artikel/${article.slug}`} className="flex gap-3 py-3 border-b group" style={{ borderColor: '#F1F3F5' }}>
        {article.cover_image && (
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
            <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'} style={{ fontSize: 9 }}>{article.type}</span>
          </div>
          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-navy transition-colors" style={{ fontFamily: 'DM Sans, sans-serif', color: '#343A40' }}>
            {article.title}
          </h3>
          <p className="text-xs mt-1" style={{ color: '#ADB5BD' }}>{timeAgo}</p>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/artikel/${article.slug}`} className="flex gap-4 bg-white rounded-xl p-4 border group transition-shadow hover:shadow-md" style={{ borderColor: '#E9ECEF' }}>
        {article.cover_image && (
          <div className="w-28 h-20 rounded-lg overflow-hidden shrink-0">
            <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
            {article.categories && (
              <span className="text-xs" style={{ color: '#ADB5BD' }}>{article.categories.name}</span>
            )}
          </div>
          <h3 className="font-medium leading-snug line-clamp-2 group-hover:text-navy-dark transition-colors mb-1" style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: '#0d2347' }}>
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-xs" style={{ color: '#ADB5BD' }}>
            {article.profiles && <span>{article.profiles.full_name}</span>}
            <span>·</span>
            <span>{timeAgo}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Eye size={10} />{article.view_count}</span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/artikel/${article.slug}`} className="relative rounded-2xl overflow-hidden group block" style={{ minHeight: 320 }}>
        {article.cover_image ? (
          <img src={article.cover_image} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0d2347)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,35,71,0.97) 0%, rgba(13,35,71,0.6) 50%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
            {article.categories && (
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{article.categories.name}</span>
            )}
          </div>
          <h2 className="font-bold text-white leading-snug mb-3" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20 }}>
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-sm line-clamp-2 mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>{article.excerpt}</p>
          )}
          <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {article.profiles && <span className="font-medium" style={{ color: '#C9A84C' }}>{article.profiles.full_name}</span>}
            <span>·</span>
            <span>{timeAgo}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Eye size={10} />{article.view_count}</span>
          </div>
        </div>
      </Link>
    )
  }

  // Default card
  return (
    <Link href={`/artikel/${article.slug}`} className="bg-white rounded-xl border overflow-hidden group block transition-all duration-200 hover:shadow-md animate-fade-in-up" style={{ borderColor: '#E9ECEF' }}>
      {article.cover_image && (
        <div className="h-44 overflow-hidden">
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      {!article.cover_image && (
        <div className="h-32 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EFF4FF, #E9ECEF)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L4 7v5c0 4.4 3.4 8.5 8 9.8 4.6-1.3 8-5.4 8-9.8V7L12 3z" stroke="#1B3A6B" strokeWidth="1.5" fill="none" opacity="0.4"/>
            <path d="M8 12l2.5 2.5L16 9.5" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
          {article.categories && (
            <span className="text-xs" style={{ color: '#ADB5BD' }}>{article.categories.name}</span>
          )}
        </div>
        <h3 className="font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-navy transition-colors" style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: '#0d2347' }}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm line-clamp-2 mb-3" style={{ color: '#6C757D', lineHeight: 1.6 }}>{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#F1F3F5' }}>
          <div className="flex items-center gap-2">
            {article.profiles && (
              <>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>
                  {article.profiles.full_name?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs font-medium" style={{ color: '#343A40' }}>{article.profiles.full_name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2.5 text-xs" style={{ color: '#ADB5BD' }}>
            <span className="flex items-center gap-1"><Eye size={11} />{article.view_count}</span>
            <span className="flex items-center gap-1"><Heart size={11} />{article.like_count}</span>
            <span className="flex items-center gap-1"><MessageCircle size={11} />{article.comment_count}</span>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: '#ADB5BD' }}>
          <Clock size={10} className="inline mr-1" />{timeAgo} · {readTime} menit baca
        </p>
      </div>
    </Link>
  )
}

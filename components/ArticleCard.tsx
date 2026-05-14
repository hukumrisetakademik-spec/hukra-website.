import Link from 'next/link'
import { Eye, Heart, Clock } from 'lucide-react'
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
          <div style={{ width:56, height:44, borderRadius:8, overflow:'hidden', flexShrink:0 }}>
            <img src={article.cover_image} alt={article.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'} style={{ fontSize: 9, marginBottom: 4, display: 'inline-block' }}>{article.type}</span>
          <h3 style={{ fontSize:13, fontWeight:500, lineHeight:1.35, color:'#343A40', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{article.title}</h3>
          <p style={{ fontSize:11, color:'#ADB5BD', marginTop:3 }}>{timeAgo}</p>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/artikel/${article.slug}`} style={{ display:'flex', gap:14, background:'white', borderRadius:12, padding:14, border:'1px solid #E9ECEF', textDecoration:'none', color:'inherit', transition:'box-shadow .2s' }}>
        {article.cover_image ? (
          <div style={{ width:100, height:72, borderRadius:9, overflow:'hidden', flexShrink:0 }}>
            <img src={article.cover_image} alt={article.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
        ) : (
          <div style={{ width:100, height:72, borderRadius:9, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#EFF4FF,#E9ECEF)', fontSize:24 }}>⚖️</div>
        )}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
            <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
            {categoryName && <span style={{ fontSize:11, color:'#ADB5BD' }}>{categoryName}</span>}
          </div>
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:13, fontWeight:600, lineHeight:1.4, color:'#0d2347', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:5 }}>{article.title}</h3>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#ADB5BD' }}>
            <span style={{ fontWeight:500, color:'#6C757D' }}>{authorName}</span>
            <span>·</span><span>{timeAgo}</span>
            <span>·</span><span style={{ display:'flex', alignItems:'center', gap:3 }}><Eye size={10} />{article.view_count || 0}</span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/artikel/${article.slug}`} style={{ position:'relative', borderRadius:16, overflow:'hidden', display:'block', minHeight:300, textDecoration:'none' }}>
        {article.cover_image ? (
          <img src={article.cover_image} alt={article.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#1B3A6B,#0d2347)' }} />
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(13,35,71,0.97) 0%, rgba(13,35,71,0.45) 55%, transparent 100%)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
            {categoryName && <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>{categoryName}</span>}
          </div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:'white', lineHeight:1.3, marginBottom:8 }}>{article.title}</h2>
          {article.excerpt && <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:8 }}>{article.excerpt}</p>}
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(255,255,255,0.6)' }}>
            <span style={{ fontWeight:600, color:'#C9A84C' }}>{authorName}</span>
            <span>·</span><span>{timeAgo}</span>
            <span>·</span><span style={{ display:'flex', alignItems:'center', gap:3 }}><Eye size={10} />{article.view_count || 0}</span>
          </div>
        </div>
      </Link>
    )
  }

  // Default card — gambar lebih kecil & proporsional
  return (
    <Link href={`/artikel/${article.slug}`} style={{ background:'white', borderRadius:12, border:'1px solid #E9ECEF', overflow:'hidden', display:'block', textDecoration:'none', transition:'transform .2s, box-shadow .2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
      {/* Gambar diperkecil: h-36 (144px) bukan h-44 */}
      {article.cover_image ? (
        <div style={{ height:148, overflow:'hidden' }}>
          <img src={article.cover_image} alt={article.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s' }}
            onMouseEnter={e => (e.currentTarget.style.transform='scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')} />
        </div>
      ) : (
        <div style={{ height:110, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#EFF4FF,#E9ECEF)', fontSize:36 }}>⚖️</div>
      )}
      <div style={{ padding:'12px 14px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:7 }}>
          <span className={article.type === 'berita' ? 'badge-berita' : 'badge-opini'}>{article.type}</span>
          {categoryName && <span style={{ fontSize:11, color:'#ADB5BD' }}>{categoryName}</span>}
        </div>
        <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:14, fontWeight:600, lineHeight:1.4, color:'#0d2347', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:6 }}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p style={{ fontSize:12, color:'#6C757D', lineHeight:1.55, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:10 }}>{article.excerpt}</p>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid #F1F3F5' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background:'#EFF4FF', color:'#1B3A6B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
              {authorName[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize:11, fontWeight:500, color:'#343A40' }}>{authorName}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:11, color:'#ADB5BD' }}>
            <span style={{ display:'flex', alignItems:'center', gap:2 }}><Eye size={10} />{article.view_count || 0}</span>
            <span style={{ display:'flex', alignItems:'center', gap:2 }}><Heart size={10} />{article.like_count || 0}</span>
          </div>
        </div>
        <p style={{ fontSize:11, color:'#ADB5BD', marginTop:6, display:'flex', alignItems:'center', gap:4 }}>
          <Clock size={10} />{timeAgo} · {readTime || 1} menit baca
        </p>
      </div>
    </Link>
  )
}

'use client'
import { useState } from 'react'

interface Props {
  title: string
  excerpt?: string
  slug: string
  coverImage?: string
}

export default function ShareButton({ title, excerpt, slug, coverImage }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hukra-website-production.up.railway.app'
  const url = `${siteUrl}/artikel/${slug}`
  const shortText = excerpt ? excerpt.slice(0, 100) + '...' : title
  const shareText = `📰 *${title}*\n\n${shortText}\n\n🔗 Baca selengkapnya: ${url}`

  const shareWA = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
    setShowMenu(false)
  }

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`📰 ${title}\n\n${shortText}`)}`, '_blank')
    setShowMenu(false)
  }

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`📰 ${title}`)}&url=${encodeURIComponent(url)}`, '_blank')
    setShowMenu(false)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setShowMenu(false)
  }

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title, text: shortText, url })
    } else {
      setShowMenu(!showMenu)
    }
  }

  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <button onClick={shareNative}
        style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:10, border:'1.5px solid #E9ECEF', background:'white', color:'#343A40', fontSize:14, fontWeight:600, cursor:'pointer' }}>
        🔗 Bagikan
      </button>

      {showMenu && (
        <>
          <div onClick={() => setShowMenu(false)} style={{ position:'fixed', inset:0, zIndex:40 }} />
          <div style={{ position:'absolute', bottom:'calc(100% + 8px)', left:0, background:'white', borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', border:'1px solid #E9ECEF', zIndex:50, minWidth:220, overflow:'hidden' }}>
            {/* Preview */}
            <div style={{ padding:'14px 16px', background:'#F8F9FA', borderBottom:'1px solid #E9ECEF' }}>
              {coverImage && (
                <img src={coverImage} alt="" style={{ width:'100%', height:80, objectFit:'cover', borderRadius:8, marginBottom:8 }} />
              )}
              <div style={{ fontSize:13, fontWeight:600, color:'#0d2347', lineHeight:1.4, marginBottom:4 }}>{title}</div>
              <div style={{ fontSize:11, color:'#6C757D', lineHeight:1.5 }}>{shortText}</div>
            </div>

            {/* Share options */}
            <button onClick={shareWA} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', width:'100%', border:'none', background:'none', cursor:'pointer', fontSize:14, color:'#343A40', textAlign:'left', borderBottom:'1px solid #F8F9FA' }}>
              <span style={{ fontSize:20 }}>💬</span>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>WhatsApp</div>
                <div style={{ fontSize:11, color:'#ADB5BD' }}>Bagikan ke WA</div>
              </div>
            </button>

            <button onClick={shareTelegram} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', width:'100%', border:'none', background:'none', cursor:'pointer', fontSize:14, color:'#343A40', textAlign:'left', borderBottom:'1px solid #F8F9FA' }}>
              <span style={{ fontSize:20 }}>✈️</span>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>Telegram</div>
                <div style={{ fontSize:11, color:'#ADB5BD' }}>Bagikan ke Telegram</div>
              </div>
            </button>

            <button onClick={shareTwitter} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', width:'100%', border:'none', background:'none', cursor:'pointer', fontSize:14, color:'#343A40', textAlign:'left', borderBottom:'1px solid #F8F9FA' }}>
              <span style={{ fontSize:20 }}>🐦</span>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>Twitter/X</div>
                <div style={{ fontSize:11, color:'#ADB5BD' }}>Bagikan ke Twitter</div>
              </div>
            </button>

            <button onClick={copyLink} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', width:'100%', border:'none', background:'none', cursor:'pointer', fontSize:14, color:'#343A40', textAlign:'left' }}>
              <span style={{ fontSize:20 }}>{copied ? '✅' : '📋'}</span>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{copied ? 'Link tersalin!' : 'Salin Link'}</div>
                <div style={{ fontSize:11, color:'#ADB5BD' }}>Copy URL artikel</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

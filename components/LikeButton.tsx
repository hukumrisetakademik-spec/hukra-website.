'use client'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'

interface Props {
  articleId: string
  initialLikes: number
}

export default function LikeButton({ articleId, initialLikes }: Props) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initialLikes)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase.from('likes').select('id').eq('article_id', articleId).eq('user_id', data.user.id).single()
        .then(({ data: like }) => setLiked(!!like))
    })
  }, [])

  const toggle = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth/masuk'; return }
    setLoading(true)
    if (liked) {
      await supabase.from('likes').delete().eq('article_id', articleId).eq('user_id', user.id)
      await supabase.from('articles').update({ like_count: count - 1 }).eq('id', articleId)
      setLiked(false)
      setCount(c => c - 1)
    } else {
      await supabase.from('likes').insert({ article_id: articleId, user_id: user.id })
      await supabase.from('articles').update({ like_count: count + 1 }).eq('id', articleId)
      setLiked(true)
      setCount(c => c + 1)
    }
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
      style={{ background: liked ? '#FDF2F8' : '#F8F9FA', color: liked ? '#DB2777' : '#6C757D', border: `1.5px solid ${liked ? '#FBCFE8' : '#E9ECEF'}` }}>
      <Heart size={16} fill={liked ? '#DB2777' : 'none'} />
      {count} Suka
    </button>
  )
}

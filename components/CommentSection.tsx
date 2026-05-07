'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import type { Comment } from '@/lib/supabase'

export default function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchComments()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments').select('*, profiles(*)')
      .eq('article_id', articleId).eq('is_approved', true)
      .order('created_at', { ascending: false })
    setComments(data as Comment[] || [])
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { window.location.href = '/auth/masuk'; return }
    if (!newComment.trim()) return
    setLoading(true)
    const { error } = await supabase.from('comments').insert({ article_id: articleId, author_id: user.id, content: newComment.trim() })
    if (!error) {
      setNewComment('')
      await supabase.from('articles').update({ comment_count: comments.length + 1 }).eq('id', articleId)
      fetchComments()
    }
    setLoading(false)
  }

  return (
    <div>
      <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#0d2347', fontSize: 20 }} className="font-bold mb-6">
        Komentar ({comments.length})
      </h3>

      {/* Comment form */}
      <form onSubmit={submitComment} className="mb-8">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>
            {user ? user.user_metadata?.full_name?.[0]?.toUpperCase() || 'U' : '?'}
          </div>
          <div className="flex-1">
            <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
              placeholder={user ? 'Tulis komentar kamu...' : 'Masuk untuk berkomentar'}
              disabled={!user} rows={3}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ borderColor: '#E9ECEF', color: '#343A40' }}
              onFocus={e => e.target.style.borderColor = '#1B3A6B'}
              onBlur={e => e.target.style.borderColor = '#E9ECEF'} />
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={!user || loading || !newComment.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all"
                style={{ background: '#1B3A6B', color: 'white' }}>
                <Send size={13} />{loading ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: '#ADB5BD' }}>Belum ada komentar. Jadilah yang pertama!</p>
        ) : comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: '#EFF4FF', color: '#1B3A6B' }}>
              {comment.profiles?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold" style={{ color: '#0d2347' }}>{comment.profiles?.full_name}</span>
                <span className="text-xs" style={{ color: '#ADB5BD' }}>
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: id })}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#343A40' }}>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr'

export type Profile = {
  id: string; full_name: string | null; username: string | null; avatar_url: string | null
  bio: string | null; role: 'user' | 'editor' | 'admin'; is_verified: boolean
  article_count: number; created_at: string; updated_at: string
}

export type Category = {
  id: string; name: string; slug: string; description: string | null; color: string; created_at: string
}

export type Article = {
  id: string; title: string; slug: string; excerpt: string | null; content: string
  cover_image: string | null; type: 'berita' | 'opini'; status: 'draft' | 'pending' | 'published' | 'rejected'
  author_id: string; category_id: string | null; tags: string[]; view_count: number
  like_count: number; comment_count: number; is_headline: boolean; is_featured: boolean
  admin_note: string | null; published_at: string | null; created_at: string; updated_at: string
  profiles?: Profile
  categories?: Category
}

export type Comment = {
  id: string; article_id: string; author_id: string; content: string; is_approved: boolean; created_at: string
  profiles?: Profile
}

// Simple untyped client — avoids 'never' inference issues with Supabase generics
export const createBrowserClient = () =>
  createSSRBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Alias for mutation-heavy components
export const createRawClient = createBrowserClient

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For server-side code
export type Database = { public: { Tables: { [key: string]: any } } }

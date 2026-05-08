import { createSupabaseServerClient } from '@/lib/server-client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, status, slug')
      .limit(5)
    
    return NextResponse.json({ 
      success: !error,
      error: error?.message,
      articles: data,
      env_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + '...',
      env_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20) + '...',
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message })
  }
}

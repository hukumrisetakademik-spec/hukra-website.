import { createClient } from '@supabase/supabase-js'

// This client properly handles auth sessions in browser
let client: any = null

export function getSupabaseClient() {
  if (client) return client
  client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'hukra-auth',
      }
    }
  )
  return client
}

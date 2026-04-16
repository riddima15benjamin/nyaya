import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim()

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const invalidConfig =
  !supabaseUrl ||
  !supabaseAnonKey ||
  !supabaseUrl.startsWith('https://') ||
  !supabaseUrl.includes('.supabase.co')

if (invalidConfig) {
  throw new Error(
    'Supabase configuration is invalid. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseConfig = {
  url: supabaseUrl,
}

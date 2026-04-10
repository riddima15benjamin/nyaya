import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://faiqquprkipugzptsrnc.supabase.co'
const supabaseAnonKey = 'sb_publishable_AVU2xjNBA2I8AE7rhxLFUQ_4TnfElHA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

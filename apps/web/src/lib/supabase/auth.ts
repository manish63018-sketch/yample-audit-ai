import { getSupabaseBrowserClient } from './client'

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const supabase = getSupabaseBrowserClient()
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
    },
  })
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseBrowserClient()
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient()
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

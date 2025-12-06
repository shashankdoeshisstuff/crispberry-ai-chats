'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string || '',
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/signup?message=' + encodeURIComponent(error.message))
  }

  redirect('/login?message=' + encodeURIComponent('Check your email for confirmation link'))
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const callbackUrl = formData.get('callbackUrl') as string || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${callbackUrl}/reset-password`,
  })

  if (error) {
    redirect('/forgot-password?message=' + encodeURIComponent(error.message))
  }

  redirect('/forgot-password?message=' + encodeURIComponent('Check your email for the reset link'))
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect('/reset-password?message=' + encodeURIComponent(error.message))
  }

  redirect('/login?message=' + encodeURIComponent('Password updated successfully'))
}

export async function logout() {
  const supabase = await createClient()
  
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
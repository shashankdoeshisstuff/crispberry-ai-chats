import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export async function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(redirectTo)
  }

  return <>{children}</>
}
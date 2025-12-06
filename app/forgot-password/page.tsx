import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { forgotPassword } from '@/app/auth/actions'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const success = searchParams.message?.includes('Check your email')
  
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            {success ? 'Check Your Email' : 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-center">
            {success 
              ? 'We sent you a reset link' 
              : 'Enter your email to reset your password'
            }
          </CardDescription>
        </CardHeader>
        
        <form>
          <CardContent className="space-y-4">
            {searchParams.message && (
              <Alert variant={success ? "default" : "destructive"}>
                {success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {decodeURIComponent(searchParams.message)}
                </AlertDescription>
              </Alert>
            )}
            
            {!success && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="transition-all"
                />
                <input 
                  type="hidden" 
                  name="callbackUrl" 
                  value={process.env.NEXT_PUBLIC_SITE_URL} 
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            {!success ? (
              <>
                <Button 
                  formAction={forgotPassword}
                  type="submit"
                  className="w-full transition-all hover:scale-[1.02]"
                >
                  Send Reset Link
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link 
                    href="/login" 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              </>
            ) : (
              <Link href="/login" className="w-full">
                <Button 
                  type="button"
                  className="w-full transition-all hover:scale-[1.02]"
                >
                  Return to Login
                </Button>
              </Link>
            )}
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
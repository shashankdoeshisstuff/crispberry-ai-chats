import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Eye, EyeOff } from "lucide-react"
import SignupForm from './signup-form'


export default async function SignupPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const params = await searchParams

  return (
    <main className='w-full h-screen flex flex-col items-center justify-center p-4'>
      {/* <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form> */}

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter information to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignupForm message={params.message}/>
        </CardContent>

        <CardFooter className='grid gap-4 p-0'>
          <div className="relative w-full my-0">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <p className='text-muted-foreground text-center text-sm'>
            Already have an account?{' '}
            <Link href='/login' className='text-card-foreground hover:underline'>
              Login
            </Link>
          </p>
        </CardFooter>

      </Card>
    </main>
  )
}
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import LoginForm from './login-form'

export default async function LoginPage({
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
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm message={params.message} />
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
            New on our platform?{' '}
            <Link href='/signup' className='text-card-foreground hover:underline'>
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
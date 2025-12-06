'use client'

import { forgotPassword } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Mail } from "lucide-react"
import { useState } from 'react'

interface ForgotPasswordFormProps {
  message?: string
}

export default function ForgotPasswordForm({ message }: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      await forgotPassword(formData)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // If we have a success message from server, show success state
  const success = message?.includes('Check your email') || isSubmitted

  return (
    <>
      {message && !success && (
        <Alert variant="destructive" className='mb-6'>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {decodeURIComponent(message)}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className='mb-6 border-green-200 bg-green-50 text-green-800'>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            {decodeURIComponent(message || 'Check your email for the reset link')}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {!success ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type="hidden" 
                  name="callbackUrl" 
                  value={process.env.NEXT_PUBLIC_SITE_URL} 
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter the email address associated with your account
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">
                We sent password reset instructions to:
              </p>
              <p className="font-medium text-sm mt-1">{email}</p>
            </div>
            
            <div className="space-y-3 pt-4">
              <p className="text-xs text-muted-foreground">
                Didn't receive the email? Check your spam folder or 
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail('')
                }}
              >
                Try Another Email
              </Button>
            </div>
          </div>
        )}

        {!success && (
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link 
                href="/login" 
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        )}
      </form>
    </>
  )
}
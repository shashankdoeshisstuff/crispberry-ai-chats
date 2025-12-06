'use client'

import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Eye, EyeOff, Check, X } from "lucide-react"
import { useState, useRef } from 'react'

interface SignupFormProps {
  message?: string
}

export default function SignupForm({ message }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const formRef = useRef<HTMLFormElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const validatePasswords = () => {
    const password = passwordRef.current?.value
    const confirmPassword = confirmPasswordRef.current?.value

    if (!password || !confirmPassword) {
      setPasswordError('Both password fields are required')
      return false
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      return false
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return false
    }

    setPasswordError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validatePasswords()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      await signup(formData)
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkPasswordMatch = () => {
    const password = passwordRef.current?.value
    const confirmPassword = confirmPasswordRef.current?.value
    
    if (!password || !confirmPassword) return null
    
    if (password === confirmPassword) {
      return 'match'
    } else {
      return 'mismatch'
    }
  }

  return (
    <>
      {message && (
        <Alert variant={message.includes('Check') ? "default" : "destructive"} className='mb-4'>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {decodeURIComponent(message)}
          </AlertDescription>
        </Alert>
      )}

      {passwordError && (
        <Alert variant="destructive" className='mb-4'>
          <X className="h-4 w-4" />
          <AlertDescription>{passwordError}</AlertDescription>
        </Alert>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className='space-y-4'>
        <div className="flex flex-col gap-6">
          {/* Full Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name='full_name'
              type="text"
              placeholder="John Doe"
              required
              autoComplete="name"
            />
          </div>

          {/* Email Field */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name='email'
              type="email"
              placeholder="m@example.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                minLength={6}
                autoComplete="new-password"
                className="pr-10"
                ref={passwordRef}
                onChange={validatePasswords}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              {checkPasswordMatch() === 'match' && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="h-3 w-3" />
                  Passwords match
                </span>
              )}
              {checkPasswordMatch() === 'mismatch' && confirmPasswordRef.current?.value && (
                <span className="flex items-center gap-1 text-xs text-red-600">
                  <X className="h-3 w-3" />
                  Passwords don't match
                </span>
              )}
            </div>
            <div className="relative">
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                required 
                minLength={6}
                autoComplete="new-password"
                className="pr-10"
                ref={confirmPasswordRef}
                onChange={validatePasswords}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || passwordError !== null}
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </form>
    </>
  )
}
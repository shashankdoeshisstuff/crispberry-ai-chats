'use client'

import { resetPassword } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock } from "lucide-react"
import { useState, useEffect } from 'react'

interface ResetPasswordFormProps {
  message?: string
}

export default function ResetPasswordForm({ message }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Calculate password strength
  useEffect(() => {
    let strength = 0
    if (password.length >= 6) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }, [password])

  const validateForm = () => {
    if (!password || !confirmPassword) {
      setError('Both password fields are required')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    setError(null)
    return true
  }

  const getStrengthColor = (strength: number) => {
    if (strength < 50) return 'bg-red-500'
    if (strength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = (strength: number) => {
    if (strength < 50) return 'Weak'
    if (strength < 75) return 'Medium'
    return 'Strong'
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      await resetPassword(formData)
    } catch (error) {
      console.error('Reset password error:', error)
      setError('Failed to reset password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (error && confirmPassword && value !== confirmPassword) {
      setError('Passwords do not match')
    } else if (error) {
      setError(null)
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (error && password && password !== value) {
      setError('Passwords do not match')
    } else if (error) {
      setError(null)
    }
  }

  return (
    <>
      {/* Error/Success Messages */}
      {(message || error) && (
        <Alert variant={error ? "destructive" : "default"} className='mb-6'>
          {error ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {error || (message && decodeURIComponent(message))}
          </AlertDescription>
        </Alert>
      )}

      {/* Password Requirements */}
      <div className="mb-6 space-y-2">
        <h3 className="text-sm font-medium">Password Requirements:</h3>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li className={`flex items-center ${password.length >= 6 ? 'text-green-600' : ''}`}>
            <div className={`h-1.5 w-1.5 rounded-full mr-2 ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
            At least 6 characters
          </li>
          <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
            <div className={`h-1.5 w-1.5 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
            At least one uppercase letter
          </li>
          <li className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-600' : ''}`}>
            <div className={`h-1.5 w-1.5 rounded-full mr-2 ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
            At least one number
          </li>
        </ul>
      </div>

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="pl-10 pr-10"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Password strength:</span>
                <span className={`font-medium ${
                  passwordStrength < 50 ? 'text-red-600' :
                  passwordStrength < 75 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              className="pl-10 pr-10"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
          
          {/* Password Match Indicator */}
          {password && confirmPassword && (
            <div className="flex items-center text-xs mt-1">
              {password === confirmPassword ? (
                <span className="text-green-600 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Passwords match
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Passwords do not match
                </span>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit"
          className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
          disabled={isSubmitting || passwordStrength < 50 || password !== confirmPassword}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Updating Password...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>

        {/* Back to Login Link */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <Link 
              href="/login" 
              className="text-primary font-medium hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </form>
    </>
  )
}
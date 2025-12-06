'use client'

import { login } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { useState } from 'react'

interface LoginFormProps {
  message?: string
}

export default function LoginForm({ message }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className='space-y-4'>
      {message && (
        <Alert variant={message.includes('Check') ? "default" : "destructive"} className='mb-4'>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {decodeURIComponent(message)}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-6">
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
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              autoComplete="current-password"
              className="pr-10"
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
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" formAction={login} className="w-full">
          Login
        </Button>
      </div>
    </form>
  )
}
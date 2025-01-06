'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface User {
  id: number
  name: string
  image: string
}

interface InviteFormProps {
  users: User[]
  selectedUser: User | null
  onInvite: (email: string) => void
  onSelectUser: (userId: string) => void
}

export function InviteForm({ users, selectedUser, onInvite, onSelectUser }: InviteFormProps) {
  const [email, setEmail] = React.useState('')
  const [errors, setErrors] = React.useState<{ email?: string }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})

    // Validate email if provided
    if (email && !validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    // If no email is provided and no user is selected
    if (!email && !selectedUser) {
      setErrors({ email: 'Please enter an email or select a user' })
      return
    }

    // If validation passes, proceed with invite
    onInvite(email)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Invite to Circle</h1>
        
        <div className="space-y-2">
          <Label htmlFor="email">Invite by Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm font-medium text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Or select an existing user:</Label>
          <Select value={selectedUser?.id.toString()} onValueChange={onSelectUser}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please correct the errors above before proceeding.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={Object.keys(errors).length > 0}
      >
        Next
      </Button>
    </form>
  )
}


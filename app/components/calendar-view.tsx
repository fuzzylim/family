'use client'

import { useState, useEffect } from 'react'
import { UserDropdown } from './user-dropdown'
import { CircleGrid } from './circle-grid'
import { EventList } from './event-list'
import { StatusUpdate } from './status-update'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'

interface User {
  id: number;
  name: string;
}

interface Circle {
  id: number;
  name: string;
  icon: string;
  streak: number;
  total: number;
  color: string;
}

const users: User[] = [
  { id: 1, name: 'You' },
  { id: 2, name: 'Family' },
  { id: 3, name: 'Friends' },
  { id: 4, name: 'Coworkers' },
]

const circles: Circle[] = [
  { id: 1, name: 'Dog Walking', icon: '🐕', streak: 5, total: 150, color: 'bg-blue-500' },
  { id: 2, name: 'Gymnastics', icon: '🤸', streak: 3, total: 48, color: 'bg-purple-500' },
  { id: 3, name: 'Golf', icon: '⛳', streak: 1, total: 25, color: 'bg-green-500' },
  { id: 4, name: 'Reading', icon: '📚', streak: 7, total: 210, color: 'bg-yellow-500' },
]

export function CalendarView() {
  const [selectedUser, setSelectedUser] = useState<User>(users[0])
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null)
  const [simulatedUser, setSimulatedUser] = useState<User | null>(null)
  const { toast } = useToast()

  const simulateLogin = () => {
    if (selectedCircle) {
      const availableUsers = users.filter(user => user.id !== selectedUser.id)
      const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)]
      setSimulatedUser(randomUser)

      toast({
        title: "Simulating Login",
        description: `${randomUser.name} is logging in...`,
      })

      setTimeout(() => {
        toast({
          title: "Login Successful",
          description: `${randomUser.name} has logged in to the ${selectedCircle.name} circle.`,
        })
      }, 2000)

      setTimeout(() => {
        setSimulatedUser(null)
        toast({
          title: "Simulation Ended",
          description: `${randomUser.name} has logged out.`,
        })
      }, 10000)
    } else {
      toast({
        title: "Error",
        description: "Please select a circle before simulating login.",
        variant: "destructive",
      })
    }
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setSimulatedUser(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shared Calendar</h1>
        <UserDropdown 
          users={users} 
          selectedUser={selectedUser} 
          onSelectUser={handleUserSelect}
          onSimulateLogin={simulateLogin}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CircleGrid 
            circles={circles} 
            selectedCircle={selectedCircle} 
            onSelectCircle={setSelectedCircle}
            selectedUser={simulatedUser || selectedUser}
          />
          <EventList 
            selectedCircle={selectedCircle} 
            selectedUser={simulatedUser || selectedUser}
          />
        </div>
        <div>
          <StatusUpdate 
            selectedCircle={selectedCircle} 
            selectedUser={simulatedUser || selectedUser}
          />
        </div>
      </div>
      <Toaster />
    </div>
  )
}


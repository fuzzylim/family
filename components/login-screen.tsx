import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { InvitationModal } from './InvitationModal'

interface User {
  id: number;
  name: string;
  image: string;
  email?: string;
  invitationStatus?: 'pending' | 'accepted' | 'declined';
}

interface Circle {
  id: number;
  name: string;
  icon: string;
}

interface Invitation {
  invitedBy: User;
  circle: Circle;
}

interface LoginScreenProps {
  users: User[];
  invitedUsers: User[];
  invitations: Record<number, Invitation>;
  onLogin: (user: User) => void;
  onCreateAccount: () => void;
  onAcceptInvitation: (user: User, newName: string) => void;
  onDeclineInvitation: (user: User) => void;
  onLaterInvitation: (user: User) => void;
}

export function LoginScreen({ 
  users, 
  invitedUsers, 
  invitations, 
  onLogin, 
  onCreateAccount, 
  onAcceptInvitation, 
  onDeclineInvitation,
  onLaterInvitation
}: LoginScreenProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showInvitation, setShowInvitation] = useState(false)
  const [newName, setNewName] = useState('')
  const [showInvitationModal, setShowInvitationModal] = useState(false)

  const handleLogin = () => {
    if (selectedUser) {
      const isInvited = invitedUsers.some(user => user.id === selectedUser.id)
      if (isInvited) {
        setShowInvitationModal(true)
      } else {
        onLogin(selectedUser)
      }
    }
  }

  const handleAccept = () => {
    if (selectedUser && newName.trim()) {
      onAcceptInvitation(selectedUser, newName.trim())
      setShowInvitation(false)
      setSelectedUser(null)
    }
  }

  const handleDecline = () => {
    if (selectedUser) {
      onDeclineInvitation(selectedUser)
      setShowInvitation(false)
      setSelectedUser(null)
    }
  }

  const handleLater = () => {
    if (selectedUser) {
      onLaterInvitation(selectedUser)
      setShowInvitation(false)
      onLogin(selectedUser)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        {invitedUsers.map((user) => (
          <div key={`invited-user-${user.id}`} className="mb-4 p-4 border rounded-lg bg-primary/10">
            <p className="font-semibold mb-2">You've been invited!</p>
            {invitations[user.id] && (
              <div className="mb-4">
                <p>
                  <strong>{invitations[user.id].invitedBy.name}</strong> has invited you to join the{' '}
                  <strong>{invitations[user.id].circle.icon} {invitations[user.id].circle.name}</strong> group.
                </p>
              </div>
            )}
            <Button
              onClick={() => setSelectedUser(user)}
              variant="default"
              className="w-full justify-start"
            >
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {user.email} (Invited)
            </Button>
          </div>
        ))}
        {showInvitation && selectedUser ? (
          <div className="mb-4 p-4 border rounded-lg">
            <p className="font-semibold mb-2">You've been invited!</p>
            {invitations[selectedUser.id] && (
              <div className="mb-4">
                <p>
                  <strong>{invitations[selectedUser.id].invitedBy.name}</strong> has invited you to join the{' '}
                  <strong>{invitations[selectedUser.id].circle.icon} {invitations[selectedUser.id].circle.name}</strong> group.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="newName">Enter your name</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="flex space-x-2 mt-4">
              <Button onClick={handleAccept} variant="default">
                Accept
              </Button>
              <Button onClick={handleDecline} variant="outline">
                Decline
              </Button>
              <Button onClick={handleLater} variant="secondary">
                Later
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Button
                key={`user-${user.id}`}
                variant={selectedUser?.id === user.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedUser(user)}
              >
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                {user.name}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {!showInvitation && (
          <>
            <Button 
              onClick={handleLogin} 
              className="w-full" 
              disabled={!selectedUser}
            >
              Login
            </Button>
            <Button 
              onClick={onCreateAccount} 
              variant="outline" 
              className="w-full"
            >
              Create New Account
            </Button>
          </>
        )}
      </CardFooter>
      {selectedUser && invitations[selectedUser.id] && (
        <InvitationModal
          isOpen={showInvitationModal}
          onClose={() => setShowInvitationModal(false)}
          invitation={invitations[selectedUser.id]}
          onAccept={() => {
            setShowInvitationModal(false)
            onAcceptInvitation(selectedUser, selectedUser.name)
          }}
          onDecline={() => {
            setShowInvitationModal(false)
            onDeclineInvitation(selectedUser)
          }}
        />
      )}
    </Card>
  )
}


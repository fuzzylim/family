import { Invitation, InvitationService } from './interfaces';

export class MockInvitationService implements InvitationService {
  private invitations: Record<number, Invitation> = {};

  async getInvitations(): Promise<Record<number, Invitation>> {
    return this.invitations;
  }

  async createInvitation(userId: number, invitation: Invitation): Promise<void> {
    this.invitations[userId] = invitation;
  }

  async deleteInvitation(userId: number): Promise<void> {
    delete this.invitations[userId];
  }}
}

Now, let's update the CalendarView component to use these services:

```typescript file="components/calendar-view.tsx"
'use client'

import { useState, useEffect } from 'react'
import { UserNav } from './user-nav'
import { SidePanel } from './side-panel'
import { EventList } from './event-list'
import { ModeToggle } from './mode-toggle'
import OnboardingWizard from './onboarding-wizard'
import { Button } from '@/components/ui/button'
import { LoginScreen } from './login-screen'
import { InvitedUserStatus } from './invited-user-status'
import { User, Circle, Interest, Event, Invitation } from '../services/interfaces'
import { MockUserService } from '../services/mockUserService'
import { MockCircleService } from '../services/mockCircleService'
import { MockInterestService } from '../services/mockInterestService'
import { MockEventService } from '../services/mockEventService'
import { MockInvitationService } from '../services/mockInvitationService'

const userService = new MockUserService()
const circleService = new MockCircleService()
const interestService = new MockInterestService()
const eventService = new MockEventService()
const invitationService = new MockInvitationService()

export function CalendarView() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null)
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [circles, setCircles] = useState<Circle[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [showWizard, setShowWizard] = useState(false)
  const [interests, setInterests] = useState<Interest[]>([])
  const [invitedUsers, setInvitedUsers] = useState<User[]>([])
  const [invitedUserStatus, setInvitedUserStatus] = useState<'pending' | 'accepted' | 'declined'>('pending')
  const [invitations, setInvitations] = useState<Record<number, Invitation>>({})

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedUsers, fetchedCircles, fetchedInterests, fetchedEvents, fetchedInvitations] = await Promise.all([
        userService.getUsers(),
        circleService.getCircles(),
        interestService.getInterests(),
        eventService.getEvents(),
        invitationService.getInvitations()
      ])
      setUsers(fetchedUsers)
      setCircles(fetchedCircles)
      setInterests(fetchedInterests)
      setEvents(fetchedEvents)
      setInvitations(fetchedInvitations)
    }
    fetchData()
  }, [])

  const onSelectCircle = (circle: Circle) => {
    setSelectedCircle(circle)
    setIsSidePanelOpen(false)
  }

  const visibleCircles = circles.filter(circle => 
    circle.members.includes(selectedUser?.id || 0) || 
    (circle.isFamily && users.find(u => u.id === selectedUser?.id)?.familyId === users.find(u => circle.members.includes(u.id))?.familyId)
  )

  const userInterests = interests.filter(interest => selectedUser?.interests.includes(interest.id) || false)
  const userCircles = visibleCircles.filter(circle => !circle.isPersonal || circle.members[0] === selectedUser?.id)

  const familyMembers = users.filter(user => user.familyId === selectedUser?.familyId)

  const promoteToMember = async (eventId: number, userId: number) => {
    await eventService.addParticipant(eventId, userId)
    const updatedEvent = await eventService.getEvent(eventId)
    if (updatedEvent) {
      await circleService.addMember(updatedEvent.circleId, userId)
    }
    const [updatedEvents, updatedCircles] = await Promise.all([
      eventService.getEvents(),
      circleService.getCircles()
    ])
    setEvents(updatedEvents)
    setCircles(updatedCircles)
  }

  const handleLogin = (user: User) => {
    // Simulate SSO login
    setTimeout(() => {
      setSelectedUser(user)
    }, 1000)
  }

  const handleCreateAccount = () => {
    setSelectedUser(null)
    setShowWizard(true)
  }

  const handleLogout = () => {
    setSelectedUser(null)
  }

  const handleAcceptInvitation = async (user: User, newName: string) => {
    const invitation = invitations[user.id]
    if (invitation) {
      await circleService.addMember(invitation.circle.id, user.id)
      const updatedUser = await userService.updateUser(user.id, { 
        name: newName, 
        circles: [...user.circles, invitation.circle.id] 
      })
      await invitationService.deleteInvitation(user.id)
      
      const [updatedUsers, updatedCircles, updatedInvitations] = await Promise.all([
        userService.getUsers(),
        circleService.getCircles(),
        invitationService.getInvitations()
      ])
      
      setUsers(updatedUsers)
      setCircles(updatedCircles)
      setInvitations(updatedInvitations)
      setSelectedUser(updatedUser)
    }
  }

  const handleDeclineInvitation = async (user: User) => {
    await invitationService.deleteInvitation(user.id)
    const [updatedUsers, updatedInvitations] = await Promise.all([
      userService.getUsers(),
      invitationService.getInvitations()
    ])
    setUsers(updatedUsers)
    setInvitations(updatedInvitations)
  }

  const handleWizardComplete = async (
    newUser: Omit<User, 'id'>,
    newGoal: Omit<Interest, 'id'>,
    newCircle: Omit<Circle, 'id' | 'interestId' | 'members'>,
    newEvent: Omit<Event, 'id' | 'organizer' | 'participants' | 'invited' | 'likes' | 'comments' | 'shares'>,
    invitedUser: User | null,
    invitedEmail: string
  ) => {
    const createdUser = await userService.createUser(newUser)
    const createdInterest = await interestService.createInterest(newGoal)
    const createdCircle = await circleService.createCircle({
      ...newCircle,
      interestId: createdInterest.id,
      members: [createdUser.id],
      invited: []
    })
    const createdEvent = await eventService.createEvent({
      ...newEvent,
      circleId: createdCircle.id,
      organizer: createdUser.id,
      participants: [createdUser.id],
      invited: [],
      likes: 0,
      comments: 0,
      shares: 0
    })

    if (invitedUser) {
      await circleService.inviteMember(createdCircle.id, invitedUser.id)
      await eventService.inviteParticipant(createdEvent.id, invitedUser.id)
      await invitationService.createInvitation(invitedUser.id, {
        invitedBy: createdUser,
        circle: createdCircle
      })
    } else if (invitedEmail) {
      const newInvitedUser = await userService.createUser({
        name: invitedEmail.split('@')[0],
        email: invitedEmail,
        image: `https://api.dicebear.com/6.x/avataaars/svg?seed=${invitedEmail}`,
        interests: [],
        circles: [],
        familyId: createdUser.id
      })
      await circleService.inviteMember(createdCircle.id, newInvitedUser.id)
      await eventService.inviteParticipant(createdEvent.id, newInvitedUser.id)
      await invitationService.createInvitation(newInvitedUser.id, {
        invitedBy: createdUser,
        circle: createdCircle
      })
    }

    const [updatedUsers, updatedCircles, updatedInterests, updatedEvents, updatedInvitations] = await Promise.all([
      userService.getUsers(),
      circleService.getCircles(),
      interestService.getInterests(),
      eventService.getEvents(),
      invitationService.getInvitations()
    ])

    setUsers(updatedUsers)
    setCircles(updatedCircles)
    setInterests(updatedInterests)
    setEvents(updatedEvents)
    setInvitations(updatedInvitations)
    setSelectedUser(createdUser)
    setShowWizard(false)
  }

  if (showWizard || (!selectedUser && users.length === 0)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <OnboardingWizard 
          onComplete={handleWizardComplete} 
          circles={circles} 
          availableUsers={users}
        />
      </div>
    )
  }

  if (!selectedUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoginScreen
          users={users}
          invitedUsers={invitedUsers}
          invitations={invitations}
          onLogin={handleLogin}
          onCreateAccount={handleCreateAccount}
          onAcceptInvitation={handleAcceptInvitation}
          onDeclineInvitation={handleDeclineInvitation}
        />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidePanel
        interests={interests.filter(interest => selectedUser.interests.includes(interest.id))}
        circles={circles.filter(circle => selectedUser.circles.includes(circle.id))}
        selectedInterest={selectedInterest}
        selectedCircle={selectedCircle}
        onSelectInterest={setSelectedInterest}
        onSelectCircle={onSelectCircle}
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <button 
              onClick={() => setIsSidePanelOpen(true)}
              className="text-muted-foreground hover:text-foreground mr-4"
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold mr-4">Shared Calendar</h1>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav 
                users={users.filter(user => user.familyId === selectedUser.familyId)} 
                selectedUser={selectedUser} 
                onSelectUser={setSelectedUser} 
                onLogout={handleLogout}
              />
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <EventList 
            selectedCircle={selectedCircle} 
            selectedUser={selectedUser}
            circles={circles.filter(circle => selectedUser.circles.includes(circle.id))}
            interests={interests.filter(interest => selectedUser.interests.includes(interest.id))}
            events={events}
            users={users}
            promoteToMember={promoteToMember}
          />
          {invitedUsers.length > 0 && (
            <InvitedUserStatus 
              name={invitedUsers[0].name}
              status={invitedUserStatus}
              onAccept={handleAcceptInvitation}
              onDecline={handleDeclineInvitation}
            />
          )}
        </main>
      </div>
    </div>
  )
}


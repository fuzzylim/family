"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { UserNav } from './user-nav';
import { SidePanel } from './side-panel';
import { EventList } from './event-list';
import { ModeToggle } from './mode-toggle';
import { LoginScreen } from './login-screen';
import { InvitedUserStatus } from './invited-user-status';
import { useAppContext } from '../contexts/AppContext';
import { User, Circle, Interest, Event, Invitation } from '../types/interfaces';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import OnboardingWizard from './onboarding-wizard';
import ErrorBoundary from './ErrorBoundary';
import { generateEventUpdate } from '../services/aiUpdateBot';
import { ErrorModal } from './ErrorModal';
import { AlertCircle } from 'lucide-react';

// Mock API functions (replace these with actual API calls in a real application)
const fetchUsers = async () => {
  // Simulating API call
  return new Promise<User[]>((resolve) => {
    setTimeout(() => resolve([
      { id: 1, name: 'You', image: 'https://github.com/shadcn.png', interests: [1, 2], circles: [0, 1, 2, 5], familyId: 1 },
      { id: 2, name: 'Alice', image: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Alice', interests: [1, 3], circles: [0, 1, 4, 5], familyId: 1 },
      { id: 3, name: 'Bob', image: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Bob', interests: [2, 3], circles: [0, 2, 3, 5], familyId: 1 },
      { id: 4, name: 'Charlie', image: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Charlie', interests: [1, 2, 3], circles: [0, 2, 3, 4], familyId: 2 },
    ]), 500);
  });
};

const fetchCircles = async () => {
  // Simulating API call
  return new Promise<Circle[]>((resolve) => {
    setTimeout(() => resolve([
      { id: 0, name: 'Personal', icon: '👤', interestId: 0, members: [1, 2, 3, 4], invited: [] },
      { id: 1, name: 'Morning Jog', icon: '🏃', interestId: 1, members: [1, 2], invited: [] },
      { id: 2, name: 'Gym Buddies', icon: '💪', interestId: 1, members: [1, 3, 4], invited: [] },
      { id: 3, name: 'Book Club', icon: '📖', interestId: 2, members: [1, 3, 4], invited: [] },
      { id: 4, name: 'Golf League', icon: '🏌️', interestId: 3, members: [2, 4], invited: [] },
      { id: 5, name: 'Family', icon: '👨‍👩‍👧‍👦', interestId: 0, members: [1, 2, 3], invited: [] },
    ]), 500);
  });
};

const fetchInterests = async () => {
  // Simulating API call
  return new Promise<Interest[]>((resolve) => {
    setTimeout(() => resolve([
      { id: 1, name: 'Fitness', icon: '🏋️', goal: 150, progress: 75 },
      { id: 2, name: 'Reading', icon: '📚', goal: 52, progress: 20 },
      { id: 3, name: 'Golf', icon: '⛳', goal: 20, progress: 5 },
    ]), 500);
  });
};

const fetchEvents = async () => {
  // Simulating API call
  return new Promise<Event[]>((resolve) => {
    setTimeout(() => resolve([
      { id: 1, name: 'Morning Run', date: '2023-06-15', circleId: 1, organizer: 1, participants: [1, 2], invited: [3], likes: 5, comments: 2, shares: 1 },
      { id: 2, name: 'Gym Session', date: '2023-06-16', circleId: 2, organizer: 3, participants: [1, 3], invited: [2, 4], likes: 3, comments: 1, shares: 0 },
      { id: 3, name: 'Book Discussion', date: '2023-06-18', circleId: 3, organizer: 4, participants: [3, 4], invited: [1, 2], likes: 8, comments: 4, shares: 2 },
      { id: 4, name: 'Golf Practice', date: '2023-06-20', circleId: 4, organizer: 2, participants: [2, 4], invited: [1, 3], likes: 6, comments: 3, shares: 1 },
      { id: 5, name: 'Family Dinner', date: '2023-06-22', circleId: 5, organizer: 1, participants: [1, 2, 3], invited: [], likes: 3, comments: 1, shares: 0 },
    ]), 500);
  });
};

const fetchInvitations = async () => {
  // Simulating API call
  return new Promise<Record<number, Invitation>>((resolve) => {
    setTimeout(() => resolve({}), 500);
  });
};

export function CalendarView() {
  const { setUsers, setCircles, setInterests, setEvents, setInvitations } = useAppContext();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);
  const [invitedUserStatus, setInvitedUserStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useQuery('users', fetchUsers, {
    onSuccess: (data) => setUsers(data),
    onError: (err) => setError(err as Error),
  });

  const { data: circles, isLoading: isLoadingCircles } = useQuery('circles', fetchCircles, {
    onSuccess: (data) => setCircles(data),
    onError: (err) => setError(err as Error),
  });

  const { data: interests, isLoading: isLoadingInterests } = useQuery('interests', fetchInterests, {
    onSuccess: (data) => setInterests(data),
    onError: (err) => setError(err as Error),
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery('events', fetchEvents, {
    onSuccess: (data) => setEvents(data),
    onError: (err) => setError(err as Error),
  });

  const { data: invitations, isLoading: isLoadingInvitations } = useQuery('invitations', fetchInvitations, {
    onSuccess: (data) => setInvitations(data),
    onError: (err) => setError(err as Error),
  });

  const isLoading = isLoadingUsers || isLoadingCircles || isLoadingInterests || isLoadingEvents || isLoadingInvitations;

  const createEventMutation = useMutation(
    async (newEvent: Omit<Event, 'id'>) => {
      const createdEvent = { ...newEvent, id: (events?.length || 0) + 1 };
      const updateMessage = await generateEventUpdate(createdEvent.name, 'invite', selectedUser?.name || 'Someone');
      return { event: createdEvent, updateMessage };
    },
    {
      onSuccess: ({ event, updateMessage }) => {
        queryClient.setQueryData('events', (oldEvents: Event[] | undefined) => 
          oldEvents ? [...oldEvents, event] : [event]
        );
        // TODO: Implement toast functionality
        console.log("Event Created:", updateMessage);
      },
      onError: (err) => setError(err as Error),
    }
  );

  const promoteToMemberMutation = useMutation(
    async ({ eventId, userId }: { eventId: number, userId: number }) => {
      // Simulating API call to promote user to member
      const event = events?.find(e => e.id === eventId);
      const user = users?.find(u => u.id === userId);
      if (event && user) {
        const updatedEvent = {
          ...event,
          participants: [...event.participants, userId],
          invited: event.invited.filter(id => id !== userId),
        };
        const updateMessage = await generateEventUpdate(event.name, 'accept', user.name);
        return { updatedEvent, updateMessage };
      }
      throw new Error("Event or user not found");
    },
    {
      onSuccess: ({ updatedEvent, updateMessage }) => {
        queryClient.setQueryData('events', (oldEvents: Event[] | undefined) =>
          oldEvents ? oldEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e) : [updatedEvent]
        );
        // TODO: Implement toast functionality
        console.log("Joined Event:", updateMessage);
      },
      onError: (err) => setError(err as Error),
    }
  );

  const handleLogin = useCallback((user: User) => {
    setSelectedUser(user);
    
    const userInvitation = invitations?.[user.id];
    if (userInvitation) {
      setInvitedUsers([user]);
      setInvitedUserStatus('pending');
    } else {
      setInvitedUsers([]);
      setInvitedUserStatus('pending');
    }
  }, [invitations]);

  const handleLogout = useCallback(() => {
    setSelectedUser(null);
  }, []);

  const handleCreateAccount = useCallback(() => {
    setShowWizard(true);
  }, []);

  const handleAcceptInvitation = useCallback(async (user: User, newName: string) => {
    try {
      const invitation = invitations?.[user.id];
      if (invitation) {
        const updatedUser = { 
          ...user, 
          name: newName, 
          circles: [...user.circles, invitation.circle.id] 
        };
        
        // Update the user in the database
        await queryClient.setQueryData('users', (oldUsers: User[] | undefined) => 
          oldUsers ? oldUsers.map(u => u.id === user.id ? updatedUser : u) : [updatedUser]
        );

        // Add the user to the circle
        await queryClient.setQueryData('circles', (oldCircles: Circle[] | undefined) =>
          oldCircles ? oldCircles.map(c => c.id === invitation.circle.id
            ? { ...c, members: [...c.members, user.id], invited: c.invited.filter(id => id !== user.id) }
            : c
          ) : []
        );

        // Remove the invitation
        await queryClient.setQueryData('invitations', (oldInvitations: Record<number, Invitation> | undefined) => {
          if (oldInvitations) {
            const { [user.id]: _, ...restInvitations } = oldInvitations;
            return restInvitations;
          }
          return {};
        });

        setSelectedUser(updatedUser);
        setInvitedUsers([]);
        setInvitedUserStatus('accepted');
      }
    } catch (err) {
      setError(err as Error);
    }
  }, [invitations, queryClient]);

  const handleDeclineInvitation = useCallback(async (user: User) => {
    try {
      const invitation = invitations?.[user.id];
      if (invitation) {
        // Remove the user from the circle's invited list
        await queryClient.setQueryData('circles', (oldCircles: Circle[] | undefined) =>
          oldCircles ? oldCircles.map(c => c.id === invitation.circle.id
            ? { ...c, invited: c.invited.filter(id => id !== user.id) }
            : c
          ) : []
        );

        // Remove the invitation
        await queryClient.setQueryData('invitations', (oldInvitations: Record<number, Invitation> | undefined) => {
          if (oldInvitations) {
            const { [user.id]: _, ...restInvitations } = oldInvitations;
            return restInvitations;
          }
          return {};
        });

        setInvitedUsers([]);
        setInvitedUserStatus('declined');
      }
    } catch (err) {
      setError(err as Error);
    }
  }, [invitations, queryClient]);

  const handleLaterInvitation = useCallback((user: User) => {
    setSelectedUser(user);
    setInvitedUsers([]);
    setInvitedUserStatus('pending');
  }, []);

  const onSelectCircle = useCallback((circle: Circle) => {
    setSelectedCircle(circle);
    setIsSidePanelOpen(false);
  }, []);

  const handleWizardComplete = useCallback(async (
    newUserData: Omit<User, 'id'>,
    newGoal: Omit<Interest, 'id'>,
    newCircle: Omit<Circle, 'id' | 'interestId' | 'members' | 'invited'>,
    newEvent: Omit<Event, 'id' | 'organizer' | 'participants' | 'invited' | 'likes' | 'comments' | 'shares'>,
    invitedUser: User | null,
    invitedEmail: string
  ) => {
    try {
      // Create new interest
      const createdInterest: Interest = {
        ...newGoal,
        id: (interests?.length || 0) + 1,
      };

      // Create new circle
      const createdCircle: Circle = {
        ...newCircle,
        id: (circles?.length || 0) + 1,
        interestId: createdInterest.id,
        members: [],
        invited: [],
      };

      // Create new user
      const createdUser: User = {
        ...newUserData,
        id: Date.now(),
        image: `https://api.dicebear.com/6.x/initials/svg?seed=${newUserData.name}`,
        interests: [createdInterest.id],
        circles: [createdCircle.id],
        familyId: Date.now(),
      };

      // Update circle with the new user
      createdCircle.members = [createdUser.id];

      // Create new event
      const createdEvent: Event = {
        ...newEvent,
        id: (events?.length || 0) + 1,
        circleId: createdCircle.id,
        organizer: createdUser.id,
        participants: [createdUser.id],
        invited: [],
        likes: 0,
        comments: 0,
        shares: 0,
      };

      // Update the queries with new data
      queryClient.setQueryData('users', (oldUsers: User[] | undefined) => 
        oldUsers ? [...oldUsers, createdUser] : [createdUser]
      );
      queryClient.setQueryData('interests', (oldInterests: Interest[] | undefined) => 
        oldInterests ? [...oldInterests, createdInterest] : [createdInterest]
      );
      queryClient.setQueryData('circles', (oldCircles: Circle[] | undefined) => 
        oldCircles ? [...oldCircles, createdCircle] : [createdCircle]
      );
      queryClient.setQueryData('events', (oldEvents: Event[] | undefined) => 
        oldEvents ? [...oldEvents, createdEvent] : [createdEvent]
      );

      // Handle invited user or email
      if (invitedUser) {
        await queryClient.setQueryData('circles', (oldCircles: Circle[] | undefined) =>
          oldCircles ? oldCircles.map(c => c.id === createdCircle.id
            ? { ...c, invited: [...c.invited, invitedUser.id] }
            : c
          ) : []
        );
        await queryClient.setQueryData('invitations', (oldInvitations: Record<number, Invitation> | undefined) => ({
          ...oldInvitations,
          [invitedUser.id]: {
            invitedBy: createdUser,
            circle: createdCircle,
          },
        }));
      } else if (invitedEmail) {
        // Create a new user for the invited email
        const invitedNewUser: User = {
          id: Date.now() + 1, // Generate a temporary ID
          name: invitedEmail.split('@')[0],
          email: invitedEmail,
          image: `https://api.dicebear.com/6.x/initials/svg?seed=${invitedEmail}`,
          interests: [],
          circles: [],
          familyId: createdUser.familyId,
        };
        await queryClient.setQueryData('users', (oldUsers: User[] | undefined) => 
          oldUsers ? [...oldUsers, invitedNewUser] : [invitedNewUser]
        );
        await queryClient.setQueryData('circles', (oldCircles: Circle[] | undefined) =>
          oldCircles ? oldCircles.map(c => c.id === createdCircle.id
            ? { ...c, invited: [...c.invited, invitedNewUser.id] }
            : c
          ) : []
        );
        await queryClient.setQueryData('invitations', (oldInvitations: Record<number, Invitation> | undefined) => ({
          ...oldInvitations,
          [invitedNewUser.id]: {
            invitedBy: createdUser,
            circle: createdCircle,
          },
        }));
      }

      setSelectedUser(createdUser);
      setShowWizard(false);
    } catch (err) {
      setError(err as Error);
    }
  }, [interests, circles, events, queryClient]);

  const memoizedSidePanel = useMemo(() => (
    <SidePanel
      interests={interests?.filter(interest => selectedUser?.interests.includes(interest.id)) || []}
      circles={circles?.filter(circle => selectedUser?.circles.includes(circle.id)) || []}
      selectedInterest={selectedInterest}
      selectedCircle={selectedCircle}
      onSelectInterest={setSelectedInterest}
      onSelectCircle={onSelectCircle}
      isOpen={isSidePanelOpen}
      onClose={() => setIsSidePanelOpen(false)}
    />
  ), [interests, circles, selectedUser, selectedInterest, selectedCircle, isSidePanelOpen, onSelectCircle]);

  const memoizedEventList = useMemo(() => (
    <EventList 
      selectedCircle={selectedCircle} 
      selectedUser={selectedUser}
      circles={circles?.filter(circle => selectedUser?.circles.includes(circle.id)) || []}
      interests={interests?.filter(interest => selectedUser?.interests.includes(interest.id)) || []}
      events={events || []}
      users={users || []}
      promoteToMember={(eventId, userId) => promoteToMemberMutation.mutate({ eventId, userId })}
      onCreateEvent={(newEvent) => createEventMutation.mutate(newEvent)}
    />
  ), [selectedCircle, selectedUser, circles, interests, events, users, promoteToMemberMutation, createEventMutation]);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (showWizard) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <OnboardingWizard 
          onComplete={handleWizardComplete}
          circles={circles || []}
          availableUsers={users || []}
        />
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoginScreen
          users={users || []}
          invitedUsers={invitedUsers}
          invitations={invitations || {}}
          onLogin={handleLogin}
          onCreateAccount={handleCreateAccount}
          onAcceptInvitation={handleAcceptInvitation}
          onDeclineInvitation={handleDeclineInvitation}
          onLaterInvitation={handleLaterInvitation}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden">
        {memoizedSidePanel}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b">
            <div className="flex h-16 items-center px-4">
              <button 
                onClick={() => setIsSidePanelOpen(true)}
                className="text-muted-foreground hover:text-foreground mr-4"
                aria-label="Toggle sidebar"
                type="button"
              >
                ☰
              </button>
              <h1 className="text-2xl font-bold mr-4">Shared Calendar</h1>
              <div className="ml-auto flex items-center space-x-4">
                <Button
                  onClick={() => setIsErrorModalOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Mindful Moment
                </Button>
                <UserNav 
                  users={users?.filter(user => user.familyId === selectedUser.familyId) || []}
                  selectedUser={selectedUser}
                  onSelectUser={setSelectedUser}
                  onLogout={handleLogout}
                />
                <ModeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4" role="main">
            {selectedUser && memoizedEventList}
            {invitedUsers.length > 0 && (
              <InvitedUserStatus 
                name={invitedUsers[0].name}
                status={invitedUserStatus}
                onAccept={() => handleAcceptInvitation(invitedUsers[0], invitedUsers[0].name)}
                onDecline={() => handleDeclineInvitation(invitedUsers[0])}
              />
            )}
          </main>
        </div>
      </div>
      <ErrorModal
        isOpen={isErrorModalOpen || !!error}
        onClose={() => {
          setIsErrorModalOpen(false);
          setError(null);
        }}
        error={error}
      />
    </ErrorBoundary>
  );
}


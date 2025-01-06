'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { OnboardingTaskList } from './onboarding-task-list'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  interests: number[];
  circles: number[];
  familyId: number;
}

interface Interest {
  id: number;
  name: string;
  icon: string;
  goal: number;
  progress: number;
}

interface Circle {
  id: number;
  name: string;
  icon: string;
  interestId: number;
  members: number[];
}

interface Event {
  id: number;
  name: string;
  date: string;
  circleId: number;
  organizer: number;
  participants: number[];
  invited: number[];
  likes: number;
  comments: number;
  shares: number;
}

interface OnboardingWizardProps {
  onComplete: (
    user: User,
    goal: Omit<Interest, 'id'>,
    circle: Omit<Circle, 'id' | 'interestId' | 'members'>,
    event: Omit<Event, 'id' | 'organizer' | 'participants' | 'invited' | 'likes' | 'comments' | 'shares'>,
    invitedUser: User | null,
    invitedEmail: string
  ) => void;
  circles: Circle[];
  availableUsers: User[];
}

interface Task {
  title: string;
  description: string;
  tip: string;
  completed: boolean;
}

const OnboardingWizard = ({ onComplete, circles, availableUsers }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState<Partial<User>>({})
  const [newGoal, setNewGoal] = useState<Partial<Interest>>({ id: 1 })
  const [newCircle, setNewCircle] = useState<Partial<Circle>>({ id: 1 })
  const [newEvent, setNewEvent] = useState<Partial<Event>>({})
  const [invitedUser, setInvitedUser] = useState<User | null>(null)
  const [invitedEmail, setInvitedEmail] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const steps: Task[] = [
    { 
      title: 'Create Account', 
      description: 'Start your journey by setting up your personal account.',
      tip: 'Use an email you check regularly for important updates.',
      completed: false
    },
    { 
      title: 'Add Goal', 
      description: 'Set a meaningful goal to track your progress.',
      tip: 'Start with something achievable to build momentum.',
      completed: false
    },
    { 
      title: 'Create Circle', 
      description: 'Form a group to share and collaborate on your goals.',
      tip: 'Choose a name that reflects the group\'s purpose.',
      completed: false
    },
    { 
      title: 'Invite to Circle', 
      description: 'Grow your circle by inviting others to join.',
      tip: 'Select a user from the list to invite them to your new circle.',
      completed: false
    },
    { 
      title: 'Set Up Event', 
      description: 'Schedule your first event to kickstart your goal.',
      tip: 'Choose a date and time that works for most members.',
      completed: false
    },
    { 
      title: 'Complete Setup', 
      description: 'Review and finalize your settings to get started.',
      tip: 'Double-check all details before finishing.',
      completed: false
    },
  ];

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {}

    switch (step) {
      case 0:
        if (!userData.name) newErrors.name = 'Name is required'
        if (!userData.email) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Invalid email format'
        break
      case 1:
        if (!newGoal.name) newErrors.goalName = 'Goal name is required'
        if (!newGoal.goal) newErrors.goalTarget = 'Goal target is required'
        break
      case 2:
        if (!newCircle.name) newErrors.circleName = 'Circle name is required'
        break
      case 3:
        if (!invitedUser && !invitedEmail) {
          newErrors.invitedEmail = 'Please enter an email or select a user to invite'
        } else if (invitedEmail && !/\S+@\S+\.\S+/.test(invitedEmail)) {
          newErrors.invitedEmail = 'Please enter a valid email address'
        } else {
          // Clear the error when validation passes
          delete newErrors.invitedEmail
        }
        break
      case 4:
        if (!newEvent.name) newErrors.eventName = 'Event name is required'
        if (!newEvent.date) newErrors.eventDate = 'Event date is required'
        if (!newEvent.circleId) newErrors.eventCircle = 'Circle is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (step === steps.length - 1) {
        const newUser: User = {
          id: Date.now(), // Generate a temporary ID
          name: userData.name || '',
          email: userData.email || '',
          image: `https://api.dicebear.com/6.x/initials/svg?seed=${userData.name}`,
          interests: [newGoal.id || 0],
          circles: [newCircle.id || 0],
          familyId: Date.now(), // Generate a temporary family ID
        };

        onComplete(
          newUser,
          {
            name: newGoal.name || '',
            icon: '🎯',
            goal: newGoal.goal || 0,
            progress: 0,
          },
          {
            name: newCircle.name || '',
            icon: newCircle.icon || '⭕',
          },
          {
            name: newEvent.name || '',
            date: newEvent.date || '',
            circleId: newEvent.circleId || 0,
          },
          invitedUser,
          invitedEmail
        );
        return;  // Exit the function after calling onComplete
      } else {
        if (step === 3) {
          setNewEvent({ ...newEvent, circleId: newCircle.id || 0 });
        }
        steps[step].completed = true;
        setStep(step + 1);
      }
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userData.name || ''}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email || ''}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
          </>
        )
      case 1:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                value={newGoal.name || ''}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="E.g., Read 12 books this year"
                required
              />
              {errors.goalName && <p className="text-sm text-red-500">{errors.goalName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalTarget">Target</Label>
              <Input
                id="goalTarget"
                type="number"
                value={newGoal.goal || ''}
                onChange={(e) => setNewGoal({ ...newGoal, goal: parseInt(e.target.value, 10) || 0 })}
                placeholder="Enter a number, e.g., 12"
                required
              />
              {errors.goalTarget && <p className="text-sm text-red-500">{errors.goalTarget}</p>}
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="circleName">Group Name</Label>
              <Input
                id="circleName"
                value={newCircle.name || ''}
                onChange={(e) => setNewCircle({ ...newCircle, name: e.target.value })}
                placeholder="E.g., Book Club, Running Group"
                required
              />
              {errors.circleName && <p className="text-sm text-red-500">{errors.circleName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="circleIcon">Group Icon</Label>
              <Input
                id="circleIcon"
                value={newCircle.icon || ''}
                onChange={(e) => setNewCircle({ ...newCircle, icon: e.target.value })}
                placeholder="Enter an emoji, e.g., 📚 or 🏃‍♂️"
                required
              />
            </div>
          </>
        )
      case 3:
        return (
          <div className="space-y-2">
            <Label htmlFor="inviteEmail">Invite by Email</Label>
            <Input
              id="inviteEmail"
              type="email"
              value={invitedEmail}
              onChange={(e) => {
                setInvitedEmail(e.target.value);
                // Clear errors when the input changes
                if (errors.invitedEmail) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.invitedEmail;
                    return newErrors;
                  });
                }
              }}
              placeholder="friend@example.com"
              required
            />
            {errors.invitedEmail && <p className="text-sm text-red-500">{errors.invitedEmail}</p>}
            <p className="text-sm text-muted-foreground mt-2">Or select an existing user:</p>
            <Select
              value={invitedUser?.id.toString() || ''}
              onValueChange={(value) => {
                setInvitedUser(availableUsers.find(u => u.id.toString() === value) || null);
                // Clear email-related errors when a user is selected
                if (errors.invitedEmail) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.invitedEmail;
                    return newErrors;
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user to invite" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 4:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={newEvent.name || ''}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                placeholder="E.g., Book Discussion: 1984"
                required
              />
              {errors.eventName && <p className="text-sm text-red-500">{errors.eventName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={newEvent.date || ''}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
              {errors.eventDate && <p className="text-sm text-red-500">{errors.eventDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventCircle">Group</Label>
              <Select
                value={newEvent.circleId?.toString() || ''}
                onValueChange={(value) => setNewEvent({ ...newEvent, circleId: parseInt(value, 10) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={newCircle.id?.toString() || ''}>
                    {newCircle.icon} {newCircle.name}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.eventCircle && <p className="text-sm text-red-500">{errors.eventCircle}</p>}
            </div>
          </>
        )
      case 5:
        return (
          <div className="text-center">
            <p>Great job! You've completed your first event.</p>
            <p>Click "Finish" to start using the app.</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <OnboardingTaskList
        tasks={steps.map((s, i) => ({ title: s.title, completed: s.completed }))}
        currentStep={step}
      />
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{steps[step].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Please correct the errors above before proceeding.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleNext} 
              className="w-full"
              disabled={Object.keys(errors).length > 0}
            >
              {step === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default OnboardingWizard


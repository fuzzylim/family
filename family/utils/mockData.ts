import { User, Circle, Interest, Event, Invitation } from '../types/interfaces';

export const mockUsers: User[] = [
  { id: 1, name: 'You', image: 'https://github.com/shadcn.png', interests: [1, 2], circles: [0, 1, 2, 5], familyId: 1 },
  { id: 2, name: 'Alice', image: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Alice', interests: [1, 3], circles: [0, 1, 4, 5], familyId: 1 },
  { id: 3, name: 'Bob', image: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Bob', interests: [2, 3], circles: [0, 2, 3, 5], familyId: 1 },
  { id: 4, name: 'Charlie', image: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Charlie', interests: [1, 2, 3], circles: [0, 2, 3, 4], familyId: 2 },
];

export const mockCircles: Circle[] = [
  { id: 0, name: 'Personal', icon: '👤', interestId: 0, members: [1, 2, 3, 4] },
  { id: 1, name: 'Morning Jog', icon: '🏃', interestId: 1, members: [1, 2] },
  { id: 2, name: 'Gym Buddies', icon: '💪', interestId: 1, members: [1, 3, 4] },
  { id: 3, name: 'Book Club', icon: '📖', interestId: 2, members: [1, 3, 4] },
  { id: 4, name: 'Golf League', icon: '🏌️', interestId: 3, members: [2, 4] },
  { id: 5, name: 'Family', icon: '👨‍👩‍👧‍👦', interestId: 0, members: [1, 2, 3] },
];

export const mockInterests: Interest[] = [
  { id: 1, name: 'Fitness', icon: '🏋️', goal: 150, progress: 75 },
  { id: 2, name: 'Reading', icon: '📚', goal: 52, progress: 20 },
  { id: 3, name: 'Golf', icon: '⛳', goal: 20, progress: 5 },
];

export const mockEvents: Event[] = [
  { id: 1, name: 'Morning Run', date: '2023-06-15', circleId: 1, organizer: 1, participants: [1, 2], invited: [3], likes: 5, comments: 2, shares: 1 },
  { id: 2, name: 'Gym Session', date: '2023-06-16', circleId: 2, organizer: 3, participants: [1, 3], invited: [2, 4], likes: 3, comments: 1, shares: 0 },
  { id: 3, name: 'Book Discussion', date: '2023-06-18', circleId: 3, organizer: 4, participants: [3, 4], invited: [1, 2], likes: 8, comments: 4, shares: 2 },
  { id: 4, name: 'Golf Practice', date: '2023-06-20', circleId: 4, organizer: 2, participants: [2, 4], invited: [1, 3], likes: 6, comments: 3, shares: 1 },
  { id: 5, name: 'Family Dinner', date: '2023-06-22', circleId: 5, organizer: 1, participants: [1, 2, 3], invited: [], likes: 3, comments: 1, shares: 0 },
];

export const mockInvitations: Record<number, Invitation> = {};


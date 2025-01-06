export interface User {
  id: number;
  name: string;
  image: string;
  email?: string;
  interests: number[];
  circles: number[];
  familyId: number;
}

export interface Interest {
  id: number;
  name: string;
  icon: string;
  goal: number;
  progress: number;
}

export interface Circle {
  id: number;
  name: string;
  icon: string;
  interestId: number;
  members: number[];
  invited?: number[];
  isPersonal?: boolean;
  isFamily?: boolean;
}

export interface Event {
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

export interface Invitation {
  invitedBy: User;
  circle: Circle;
}

export interface UserService {
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | null>;
  createUser(user: Omit<User, 'id'>): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
}

export interface InterestService {
  getInterests(): Promise<Interest[]>;
  getInterest(id: number): Promise<Interest | null>;
  createInterest(interest: Omit<Interest, 'id'>): Promise<Interest>;
  updateInterest(id: number, interest: Partial<Interest>): Promise<Interest>;
  deleteInterest(id: number): Promise<void>;
}

export interface CircleService {
  getCircles(): Promise<Circle[]>;
  getCircle(id: number): Promise<Circle | null>;
  createCircle(circle: Omit<Circle, 'id'>): Promise<Circle>;
  updateCircle(id: number, circle: Partial<Circle>): Promise<Circle>;
  deleteCircle(id: number): Promise<void>;
  addMember(circleId: number, userId: number): Promise<void>;
  removeMember(circleId: number, userId: number): Promise<void>;
  inviteMember(circleId: number, userId: number): Promise<void>;
}

export interface EventService {
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | null>;
  createEvent(event: Omit<Event, 'id'>): Promise<Event>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;
  addParticipant(eventId: number, userId: number): Promise<void>;
  removeParticipant(eventId: number, userId: number): Promise<void>;
  inviteParticipant(eventId: number, userId: number): Promise<void>;
}

export interface InvitationService {
  getInvitations(): Promise<Record<number, Invitation>>;
  createInvitation(userId: number, invitation: Invitation): Promise<void>;
  deleteInvitation(userId: number): Promise<void>;
}


// ... (keep existing interfaces)

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
  location?: string;
  description?: string;
}

export interface Invitation {
  invitedBy: User;
  circle: Circle;
}

// ... (keep other interfaces unchanged)


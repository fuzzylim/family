import { Event, EventService } from './interfaces';

const initialEvents: Event[] = [
  { id: 1, name: 'Morning Run', date: '2023-06-15', circleId: 1, organizer: 1, participants: [1, 2], invited: [3], likes: 5, comments: 2, shares: 1 },
  { id: 2, name: 'Gym Session', date: '2023-06-16', circleId: 2, organizer: 3, participants: [1, 3], invited: [2, 4], likes: 3, comments: 1, shares: 0 },
  { id: 3, name: 'Book Discussion', date: '2023-06-18', circleId: 3, organizer: 4, participants: [3, 4], invited: [1, 2], likes: 8, comments: 4, shares: 2 },
  { id: 4, name: 'Golf Practice', date: '2023-06-20', circleId: 4, organizer: 2, participants: [2, 4], invited: [1, 3], likes: 6, comments: 3, shares: 1 },
  { id: 5, name: 'Family Dinner', date: '2023-06-22', circleId: 5, organizer: 1, participants: [1, 2, 3], invited: [], likes: 3, comments: 1, shares: 0 },
];

export class MockEventService implements EventService {
  private events: Event[] = [...initialEvents];

  async getEvents(): Promise<Event[]> {
    return this.events;
  }

  async getEvent(id: number): Promise<Event | null> {
    return this.events.find(event => event.id === id) || null;
  }

  async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    const newEvent = { ...event, id: Math.max(...this.events.map(e => e.id)) + 1 };
    this.events.push(newEvent);
    return newEvent;
  }

  async updateEvent(id: number, eventUpdate: Partial<Event>): Promise<Event> {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) throw new Error('Event not found');
    this.events[index] = { ...this.events[index], ...eventUpdate };
    return this.events[index];
  }

  async deleteEvent(id: number): Promise<void> {
    const index = this.events.findIndex(event => event.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  async addParticipant(eventId: number, userId: number): Promise<void> {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.participants = [...new Set([...event.participants, userId])];
      event.invited = event.invited.filter(id => id !== userId);
    }
  }

  async removeParticipant(eventId: number, userId: number): Promise<void> {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.participants = event.participants.filter(id => id !== userId);
    }
  }

  async inviteParticipant(eventId: number, userId: number): Promise<void> {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.invited = [...new Set([...event.invited, userId])];
    }
  }
}


import { Circle, CircleService } from './interfaces';

const initialCircles: Circle[] = [
  { id: 0, name: 'Personal', icon: '👤', interestId: 0, members: [1, 2, 3, 4], isPersonal: true },
  { id: 1, name: 'Morning Jog', icon: '🏃', interestId: 1, members: [1, 2] },
  { id: 2, name: 'Gym Buddies', icon: '💪', interestId: 1, members: [1, 3, 4] },
  { id: 3, name: 'Book Club', icon: '📖', interestId: 2, members: [1, 3, 4] },
  { id: 4, name: 'Golf League', icon: '🏌️', interestId: 3, members: [2, 4] },
  { id: 5, name: 'Family', icon: '👨‍👩‍👧‍👦', interestId: 0, members: [1, 2, 3], isFamily: true },
];

export class MockCircleService implements CircleService {
  private circles: Circle[] = [...initialCircles];

  async getCircles(): Promise<Circle[]> {
    return this.circles;
  }

  async getCircle(id: number): Promise<Circle | null> {
    return this.circles.find(circle => circle.id === id) || null;
  }

  async createCircle(circle: Omit<Circle, 'id'>): Promise<Circle> {
    const newCircle = { ...circle, id: Math.max(...this.circles.map(c => c.id)) + 1 };
    this.circles.push(newCircle);
    return newCircle;
  }

  async updateCircle(id: number, circleUpdate: Partial<Circle>): Promise<Circle> {
    const index = this.circles.findIndex(circle => circle.id === id);
    if (index === -1) throw new Error('Circle not found');
    this.circles[index] = { ...this.circles[index], ...circleUpdate };
    return this.circles[index];
  }

  async deleteCircle(id: number): Promise<void> {
    const index = this.circles.findIndex(circle => circle.id === id);
    if (index !== -1) {
      this.circles.splice(index, 1);
    }
  }

  async addMember(circleId: number, userId: number): Promise<void> {
    const circle = this.circles.find(c => c.id === circleId);
    if (circle) {
      circle.members = [...new Set([...circle.members, userId])];
    }
  }

  async removeMember(circleId: number, userId: number): Promise<void> {
    const circle = this.circles.find(c => c.id === circleId);
    if (circle) {
      circle.members = circle.members.filter(id => id !== userId);
    }
  }

  async inviteMember(circleId: number, userId: number): Promise<void> {
    const circle = this.circles.find(c => c.id === circleId);
    if (circle) {
      circle.invited = [...new Set([...(circle.invited || []), userId])];
    }
  }
}


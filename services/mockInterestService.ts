import { Interest, InterestService } from './interfaces';

const initialInterests: Interest[] = [
  { id: 1, name: 'Fitness', icon: '🏋️', goal: 150, progress: 75 },
  { id: 2, name: 'Reading', icon: '📚', goal: 52, progress: 20 },
  { id: 3, name: 'Golf', icon: '⛳', goal: 20, progress: 5 },
];

export class MockInterestService implements InterestService {
  private interests: Interest[] = [...initialInterests];

  async getInterests(): Promise<Interest[]> {
    return this.interests;
  }

  async getInterest(id: number): Promise<Interest | null> {
    return this.interests.find(interest => interest.id === id) || null;
  }

  async createInterest(interest: Omit<Interest, 'id'>): Promise<Interest> {
    const newInterest = { ...interest, id: Math.max(...this.interests.map(i => i.id)) + 1 };
    this.interests.push(newInterest);
    return newInterest;
  }

  async updateInterest(id: number, interestUpdate: Partial<Interest>): Promise<Interest> {
    const index = this.interests.findIndex(interest => interest.id === id);
    if (index === -1) throw new Error('Interest not found');
    this.interests[index] = { ...this.interests[index], ...interestUpdate };
    return this.interests[index];
  }

  async deleteInterest(id: number): Promise<void> {
    const index = this.interests.findIndex(interest => interest.id === id);
    if (index !== -1) {
      this.interests.splice(index, 1);
    }
  }
}


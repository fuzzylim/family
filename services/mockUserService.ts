import { User, UserService } from './interfaces';

const initialUsers: User[] = [
  { id: 1, name: 'You', image: 'https://github.com/shadcn.png', interests: [1, 2], circles: [0, 1, 2, 5], familyId: 1 },
  { id: 2, name: 'Alice', image: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Alice', interests: [1, 3], circles: [0, 1, 4, 5], familyId: 1 },
  { id: 3, name: 'Bob', image: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Bob', interests: [2, 3], circles: [0, 2, 3, 5], familyId: 1 },
  { id: 4, name: 'Charlie', image: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Charlie', interests: [1, 2, 3], circles: [0, 2, 3, 4], familyId: 2 },
];

export class MockUserService implements UserService {
  private users: User[] = [...initialUsers];

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUser(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const newUser = { ...user, id: Math.max(...this.users.map(u => u.id)) + 1 };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, userUpdate: Partial<User>): Promise<User> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    this.users[index] = { ...this.users[index], ...userUpdate };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<void> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}


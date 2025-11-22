
import { User, Region } from './types';

const STORAGE_KEY = 'nexus_users_db_v1';

// Initial seed data to ensure leaderboard isn't completely empty for first-time viewers
// (Optional: You can remove this if you want it 100% empty)
const SEED_USERS: User[] = [];

export const UserService = {
  // Fetch all users from local storage
  getAllUsers: (): User[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return SEED_USERS;
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load users', e);
      return [];
    }
  },

  // Check if a Discord ID is already registered (Case insensitive)
  checkDiscordExists: (discordId: string): boolean => {
    const users = UserService.getAllUsers();
    return users.some(u => u.discordUsername.toLowerCase().trim() === discordId.toLowerCase().trim());
  },

  // Save a new user or update existing
  registerUser: (user: User): void => {
    const users = UserService.getAllUsers();
    const existingIndex = users.findIndex(u => u.discordUsername === user.discordUsername);
    
    if (existingIndex >= 0) {
      // Update existing user
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      // Add new user
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  // Calculate rank based on score
  getRankedUsers: (region?: Region): User[] => {
    let users = UserService.getAllUsers();
    
    if (region) {
      users = users.filter(u => u.region === region);
    }

    return users
      .sort((a, b) => b.mindshareScore - a.mindshareScore)
      .map((u, index) => ({ ...u, rank: index + 1 }));
  }
};
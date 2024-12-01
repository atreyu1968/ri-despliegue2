import { create } from 'zustand';
import type { User } from '../types/user';
import { mockUsers } from '../data/mockUsers';

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  users: mockUsers,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
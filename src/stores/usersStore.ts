import { create } from 'zustand';
import type { User } from '../types/user';
import type { RegistrationCode } from '../types/registrationCode';

interface UsersState {
  users: User[];
  registrationCodes: RegistrationCode[];
  setUsers: (users: User[]) => void;
  setRegistrationCodes: (codes: RegistrationCode[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  addRegistrationCode: (code: RegistrationCode) => void;
  updateRegistrationCode: (id: string, code: Omit<RegistrationCode, 'id'>) => void;
  deleteRegistrationCode: (id: string) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  registrationCodes: [],
  
  setUsers: (users) => set({ users }),
  setRegistrationCodes: (codes) => set({ registrationCodes: codes }),
  
  addUser: (user) => set((state) => ({
    users: [...state.users, user],
  })),
  
  updateUser: (id, userData) => set((state) => ({
    users: state.users.map((user) =>
      user.id === id ? { ...user, ...userData } : user
    ),
  })),
  
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((user) => user.id !== id),
  })),
  
  addRegistrationCode: (code) => set((state) => ({
    registrationCodes: [...state.registrationCodes, code],
  })),
  
  updateRegistrationCode: (id, codeData) => set((state) => ({
    registrationCodes: state.registrationCodes.map((code) =>
      code.id === id ? { ...code, ...codeData } : code
    ),
  })),
  
  deleteRegistrationCode: (id) => set((state) => ({
    registrationCodes: state.registrationCodes.filter((code) => code.id !== id),
  })),
}));
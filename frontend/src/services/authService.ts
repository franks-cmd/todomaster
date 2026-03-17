import { api } from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  login(email: string, password: string) {
    return api.post<AuthResponse>('/auth/login', { email, password });
  },

  register(email: string, password: string, name: string) {
    return api.post<AuthResponse>('/auth/register', { email, password, name });
  },

  getMe() {
    return api.get<{ user: User }>('/auth/me');
  },
};

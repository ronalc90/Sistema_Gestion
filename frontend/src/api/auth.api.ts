import api from './client';
import type { User } from '../types';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface MeResponse {
  success: boolean;
  data: { user: User };
}

export const authApi = {
  login: (email: string, password: string, captchaToken?: string) =>
    api.post<LoginResponse>('/auth/login', { email, password, captchaToken }).then((r) => r.data),

  me: () =>
    api.get<MeResponse>('/auth/me').then((r) => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth.api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string, captchaToken?: string) => Promise<boolean>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      login: async (email: string, password: string, captchaToken?: string) => {
        try {
          const result = await authApi.login(email, password, captchaToken);
          if (result.success && result.data) {
            const { user, token } = result.data;
            localStorage.setItem('auth_token', token);
            set({ user, token, isAuthenticated: true, isInitialized: true });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      initialize: async () => {
        if (get().isInitialized) return;
        const token = localStorage.getItem('auth_token') || get().token;
        if (!token) {
          set({ isInitialized: true });
          return;
        }
        // Ensure token is in localStorage for the interceptor
        if (token) localStorage.setItem('auth_token', token);
        try {
          const result = await authApi.me();
          if (result.success && result.data?.user) {
            set({ user: result.data.user, token, isAuthenticated: true, isInitialized: true });
          } else {
            localStorage.removeItem('auth_token');
            set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
          }
        } catch {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

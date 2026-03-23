import api from './client';
import type { User, RolUsuario, EstadoUsuario } from '../types';

interface UsersResponse {
  success: boolean;
  data: User[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface UserResponse {
  success: boolean;
  data: User;
}

export interface CreateUserData {
  nombre: string;
  email: string;
  password: string;
  rol: RolUsuario;
  estado?: EstadoUsuario;
}

export interface UpdateUserData {
  nombre?: string;
  email?: string;
  rol?: RolUsuario;
  estado?: EstadoUsuario;
  password?: string;
}

export const usersApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<UsersResponse>('/users', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<UserResponse>(`/users/${id}`).then((r) => r.data),

  create: (data: CreateUserData) =>
    api.post<UserResponse>('/users', data).then((r) => r.data),

  update: (id: string, data: UpdateUserData) =>
    api.put<UserResponse>(`/users/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/users/${id}`).then((r) => r.data),

  updateStatus: (id: string, estado: EstadoUsuario) =>
    api.put<UserResponse>(`/users/${id}/status`, { estado }).then((r) => r.data),

  getMetrics: () =>
    api.get('/users/metrics').then((r) => r.data),
};

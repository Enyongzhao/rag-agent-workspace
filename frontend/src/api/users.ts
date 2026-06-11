import { apiClient } from './client'
import type {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
} from '../types/user'


export async function getUsers(): Promise<AdminUser[]> {
  const response = await apiClient.get<AdminUser[]>('/api/users')
  return response.data
}


export async function createUser(
    data: CreateUserRequest
): Promise<AdminUser> {
  const response = await apiClient.post<AdminUser>('/api/users', data)
  return response.data
}


export async function updateUser(
    id: number,
    data: UpdateUserRequest
): Promise<AdminUser> {
  const response = await apiClient.patch<AdminUser>(`/api/users/${id}`, data)
  return response.data
}


export async function deleteUser(
  userId: number,
): Promise<void> {
  await apiClient.delete(`/api/users/${userId}`)
}

import { apiClient } from './client'
import type {
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  TokenResponse,
  User,
} from '../types/auth'

/* 封装api 以后页面里只用调用函数*/
export async function registerUser(
  data: RegisterRequest,
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/api/auth/register',
    data,
  )

  return response.data
}

export async function loginUser(
  data: LoginRequest,
): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>(
    '/api/auth/login',
    data,
  )

  return response.data
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>(
    '/api/auth/me',
  )

  return response.data
}
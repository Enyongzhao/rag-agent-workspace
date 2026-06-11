export type UserRole = 'user' | 'admin'

export interface AdminUser {
  id: number
  username: string
  email: string
  role: UserRole
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  password?: string
  role?: UserRole
}
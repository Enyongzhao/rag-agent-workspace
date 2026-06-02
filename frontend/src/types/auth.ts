export interface User {
  id: number
  username: string
  email: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: 'bearer'
}

export interface MessageResponse {
  message: string
}
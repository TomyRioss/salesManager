export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  surname: string
  code: string
}

export interface SessionUser {
  id: string
  email: string
  name: string
  surname: string
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: SessionUser
}

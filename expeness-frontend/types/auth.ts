export interface User {
  id: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

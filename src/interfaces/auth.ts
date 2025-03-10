// @/interfaces/auth.ts

/* Auth response info */

export interface AuthUser {
  id: number;
  nickname: string;
  username: string;
  role: string;
  message: string;
}
export interface AuthResponse {
  Authorization: string;
  user: AuthUser;
}
export interface AuthLoginUser {
  id: number;
  nickname: any;
  username: any;
  role: string;
  message: string;
  is_fresh: number;
}
export interface AuthLoginResponse {
  Authorization: string;
  user: AuthLoginUser;
}

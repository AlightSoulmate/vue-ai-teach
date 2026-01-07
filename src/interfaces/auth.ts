// @/interfaces/auth.ts

/* Auth response info */

export interface AuthUser {
  id: number;
  nickname: string;
  username: string;
  cno: string;
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
  cno: string;
  role: string;
  message: string;
  is_fresh: number;
}
export interface AuthLoginResponse {
  Authorization: string;
  user: AuthLoginUser;
}

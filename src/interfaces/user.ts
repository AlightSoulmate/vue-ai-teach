// @/interfaces/user.ts

/* user info */

export interface User {
  id: number;
  nickname: any;
  username: any;
  role: string;
  token: string;
}

export interface queryUser {
  id: number;
  nickname: string;
  username: string;
  role: string;
  message: string;
}

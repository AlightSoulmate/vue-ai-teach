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

// 学生列表
export interface Student {
  id: number;
  nickname: string;
  username: string;
}

// 教师列表
export interface Teacher {
  id: number;
  nickname: string;
  username: string;
}

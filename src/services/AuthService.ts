// src/services/AuthService.ts
import axios from "axios";
import type { AxiosResponse } from "axios";

interface User {
  id: number;
  username: string;
  role: string;
  message: string;
}

interface AuthResponse {
  Authorization: string;
  user: User;
}

interface ErrorResponse {
  message: string;
}

const API_URL = "/api/user";

// 注册函数
export const registerUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      `${API_URL}/register`,
      {
        username,
        password,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// 登录函数
export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      `${API_URL}/login`,
      {
        username,
        password,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

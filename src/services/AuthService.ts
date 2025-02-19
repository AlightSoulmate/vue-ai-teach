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

// 请求拦截器：在每次请求发送前，打印请求的 URL 和请求数据
// axios.interceptors.request.use(
//   (config) => {
//     console.log("Request URL:", config.url); // 打印请求的 URL
//     console.log("Request data:", config.data); // 打印请求的请求体数据
//     return config; // 返回配置，继续发送请求
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post("/api/user/login", {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

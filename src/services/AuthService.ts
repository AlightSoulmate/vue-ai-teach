// src/services/AuthService.ts
import { ElMessage } from "element-plus";
import type { AuthResponse, AuthLoginResponse } from "@/interfaces";
import service from "./config";

/* Authentication & User Actions 
  - Registration 
  - Login
  - User update info
*/

// Register
export const register = async (
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> => {
  try {
    if (role !== "admin") {
      const response = await service.post("/user/register", {
        username,
        password,
        role,
      });
      return response.data;
    } else {
      ElMessage({
        message: "管理员不允许注册！",
        type: "warning",
      });
      throw new Error("管理员不允许注册");
    }
  } catch (error: any) {
    console.log(error);
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Login
export const login = async (
  username: string,
  password: string,
  role: string
): Promise<AuthLoginResponse> => {
  try {
    if (role === "admin") {
      const response = await service.post("/auth/login", {
        username,
        password,
        role,
      });
      console.log(response.data);
      return response.data;
    } else {
      const response = await service.post("/user/login", {
        username,
        password,
        role,
      });
      return response.data;
    }
  } catch (error: any) {
    console.log(error);
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// User update info
export const change = async (
  Authorization: string,
  nickname: string,
  old_password: string,
  password: string,
  username: string
): Promise<AuthResponse> => {
  try {
    const response = await service.put("/user", {
      Authorization,
      old_password,
      password,
      nickname,
      username,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

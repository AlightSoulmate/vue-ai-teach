// services/adminServices.ts
import axios from "axios";

/* Admin Operations 
  - User Management
  - Tool Management
*/

// Get users
export const GetUsers = async (Authorization: string) => {
  try {
    const response = await axios.post("/api/auth", Authorization);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Update users' info ( nickname | username |  password )
export const UpdateUser = async (
  id: number,
  role: string,
  Authorization: string,
  password: string,
  nickname: string,
  username: string
) => {
  try {
    const response = await axios.put(
      "/api/auth",
      {
        Authorization,
        password,
        nickname,
        username,
      },
      {
        params: {
          id,
          role,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Delete users
export const DeleteUser = async (
  id: number,
  role: string,
  Authorization: string
) => {
  try {
    const response = await axios.post(
      "/api/auth",
      {
        Authorization,
      },
      {
        params: {
          id,
          role,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Add users
export const AddUser = async (
  Authorization: string,
  nickname: string,
  username: string,
  password: string,
  role: string
) => {
  const user = {
    nickname,
    username,
    password,
  };
  try {
    const response = await axios.post(
      "/api/auth",
      {
        Authorization,
        user,
      },
      {
        params: {
          role,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Query users
export const QueryUser = async (
  Authorization: string,
  username: string,
  role: string
) => {
  try {
    const response = await axios.post(
      "/api/auth",
      {
        Authorization,
      },
      {
        params: {
          username,
          role,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

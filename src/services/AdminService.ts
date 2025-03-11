// services/adminServices.ts
import axios from "axios";

/* Admin Operations 
  - User Management
  - Tool Management
*/

// Get users
export const getUsers = async (Authorization: string) => {
  try {
    const response = await axios.post("/api/auth", Authorization);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Update users info ( nickname | username |  password )
export const updateUser = async (
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

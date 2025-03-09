// services/adminServices.ts
import axios from "axios";

export const getUsers = async (Authorization: string) => {
  try {
    const response = await axios.post("/api/auth", Authorization);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

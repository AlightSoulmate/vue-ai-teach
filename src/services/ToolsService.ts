// src/services/ToolsService.ts
import axios from "axios";

// Get categories
export const getCategories = async (): Promise<{ categories: string[] }> => {
  try {
    const response = await axios.get("/api/tools/categories");
    // const response = await axios.get(
    //   "https://frp-man.com:49044/tools/categories"
    // );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};
// Get tools data
export const getTools = async (category: string): Promise<{ tools: [] }> => {
  try {
    const response = await axios.get(`/api/tools?category=${category}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

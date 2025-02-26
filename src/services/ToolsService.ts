// src/services/ToolsService.ts
import axios from "axios";

// 获取所有工具类别
export const getCategories = async (): Promise<{ categories: string[] }> => {
  try {
    const response = await axios.get("/api/tools/categories");
    // .get("https://frp-man.com:49044/tools/categories")
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};
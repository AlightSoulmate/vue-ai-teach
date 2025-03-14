import Mock from "mockjs";
import { isMockEnabled } from "@/utils/env";

interface MockConfig {
  timeout: string | number;
  responseType?: "json" | "text" | "xml";
}

const mockConfig: MockConfig = {
  timeout: "100-500",
  responseType: "json",
};

Mock.setup(mockConfig);

export const initMockService = async (): Promise<void> => {
  if (!isMockEnabled()) {
    return;
  }

  try {
    await import("./mockData");
    console.log("Mock 服务启动成功");
  } catch (error) {
    console.error("Mock 服务启动失败:", error);
    throw new Error("Mock 服务初始化失败");
  }
};

if (import.meta.env.DEV) {
  initMockService();
}

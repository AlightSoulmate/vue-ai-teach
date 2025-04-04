import Mock from "mockjs";
import { isMockEnabled, isDevMode } from "@/utils/env";

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
  if (!isDevMode() || !isMockEnabled()) {
    console.error("Mock服务已禁用");
    return;
  }

  try {
    await import("./mockData");
    console.log("🚀 Mock start up success");
  } catch (error) {
    console.error("🚫 Mock start up failed:", error);
  }
};

if (isDevMode() && isMockEnabled()) {
  initMockService();
}

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

// 兼容 axios 上传进度：Mock.XHR 默认未实现 upload.addEventListener
// 避免在使用 onUploadProgress 时抛出 request.upload.addEventListener is not a function
// 仅在开发且启用 Mock 时生效
try {
  // @ts-ignore
  const XHR = (Mock as any).XHR;
  if (XHR) {
    if (!XHR.prototype.upload) {
      // @ts-ignore
      XHR.prototype.upload = {};
    }
    if (!XHR.prototype.upload.addEventListener) {
      // @ts-ignore
      XHR.prototype.upload.addEventListener = function () {};
    }
  }
} catch (e) {
  // 忽略补丁失败
}

export const initMockService = async (): Promise<void> => {
  if (!isDevMode() || !isMockEnabled()) {
    console.error("Mock服务已禁用");
    return;
  }

  try {
    await import("./mockData");
    console.log("Mock start up success");
  } catch (error) {
    console.error("Mock start up failed:", error);
  }
};

if (isDevMode() && isMockEnabled()) {
  initMockService();
}

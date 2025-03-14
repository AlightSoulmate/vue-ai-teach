import Mock from "mockjs";
import { isMockEnabled } from "@/utils/env";

Mock.setup({
  timeout: "100-500",
});

// 判断启用 Mock
if (isMockEnabled()) {
  (async () => {
    await import("./mockData");
    console.log("Mock 服务已启动");
  })();
}

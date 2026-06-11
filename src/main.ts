import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import { useThemeStore } from "./stores/useThemeStore";
import { setupRuntimeMonitoring } from "./utils/monitoring";

import "element-plus/dist/index.css";
import "@/styles/light-theme.scss";
import "@/styles/dark-theme.scss";

const shouldUseMock =
  (import.meta.env.DEV && import.meta.env.VITE_APP_MOCK_ENABLE === "true") ||
  import.meta.env.VITE_APP_DEMO_MODE === "true";

if (shouldUseMock) {
  import("@/mock");
}

const app = createApp(App);
app.use(createPinia()).use(router).use(ElementPlus);
useThemeStore().initTheme();
setupRuntimeMonitoring();
app.mount("#app");

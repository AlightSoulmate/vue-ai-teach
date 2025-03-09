import { createApp } from "vue";
import { createPinia } from "pinia";
import { useThemeStore } from "./stores/useThemeStore";

import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// () => import("element-plus/dist/index.css");
if (import.meta.env.MODE === "development") {
  import("@/mock/mockData")
    .then(() => {
      console.log("Mock.js 已启用");
    })
    .catch((err) => {
      console.error("Mock.js 加载失败:", err);
    });
}
import "@/styles/_variables.scss";
import "@/styles/light-theme.scss";
import "@/styles/dark-theme.scss";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);

const themeStore = useThemeStore();
themeStore.initTheme();

app.mount("#app");

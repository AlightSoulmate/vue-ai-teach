import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import { useThemeStore } from "./stores/useThemeStore";

import "element-plus/dist/index.css";
import "@/styles/light-theme.scss";
import "@/styles/dark-theme.scss";

if (import.meta.env.MODE === "development") {
  import("@/mock/mockData")
    .then(() => console.log("Mock √"))
    .catch((e) => console.error("Mock X", e));
}

const app = createApp(App);
app.use(createPinia()).use(router).use(ElementPlus);
useThemeStore().initTheme();
app.mount("#app");

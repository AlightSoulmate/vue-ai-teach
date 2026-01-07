import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import { useThemeStore } from "./stores/useThemeStore";
import { isMockEnabled, isDevMode } from "./utils/env";

import "element-plus/dist/index.css";
import "@/styles/light-theme.scss";
import "@/styles/dark-theme.scss";

if (isDevMode() && isMockEnabled()) import("@/mock");

const app = createApp(App);
app.use(createPinia()).use(router).use(ElementPlus);
useThemeStore().initTheme();
app.mount("#app");

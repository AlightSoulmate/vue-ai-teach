import { createApp } from "vue";
import { createPinia } from "pinia";
import { useThemeStore } from "./stores/themeStore";

import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./mock/mockData";
import "@/styles/_variables.scss";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);

const themeStore = useThemeStore();
themeStore.initTheme();

app.mount("#app");

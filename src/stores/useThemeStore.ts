import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDarkTheme = ref<boolean>(false);

  const toggleTheme = (): void => {
    isDarkTheme.value = !isDarkTheme.value;
    const newTheme = isDarkTheme.value ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const initTheme = (): void => {
    // 检查系统偏好
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    // 优先使用本地存储的主题
    const savedTheme =
      localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
    isDarkTheme.value = savedTheme === "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  };

  return {
    isDarkTheme,
    toggleTheme,
    initTheme,
  };
});

import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDarkTheme = ref<boolean>(false);

  const toggleTheme = (): void => {
    isDarkTheme.value = !isDarkTheme.value;
    const theme = isDarkTheme.value ? "dark" : "light";
    console.log(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  const initTheme = (): void => {
    const savedTheme = localStorage.getItem("theme") || "light";
    isDarkTheme.value = savedTheme === "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  };

  return {
    isDarkTheme,
    toggleTheme,
    initTheme,
  };
});

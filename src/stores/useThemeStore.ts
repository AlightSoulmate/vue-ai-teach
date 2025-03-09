import { defineStore } from "pinia";
import { ref, nextTick } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDarkTheme = ref<boolean>(false);

  const toggleTheme = (): void => {
    isDarkTheme.value = !isDarkTheme.value;
    const newTheme = isDarkTheme.value ? "dark" : "light";
    console.log(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const initTheme = (): void => {
    const savedTheme = localStorage.getItem("theme") ?? "light";
    isDarkTheme.value = savedTheme === "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  };

  return {
    isDarkTheme,
    toggleTheme,
    initTheme,
  };
});

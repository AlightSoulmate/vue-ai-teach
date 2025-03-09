<template>
  <div :data-theme="themeStore.isDarkTheme">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from "@/stores/useThemeStore";

const themeStore = useThemeStore();
</script>

<style lang="scss">
@use "./styles/light-theme.scss" as light;
@use "./styles/dark-theme.scss" as dark;

/* 全局样式 */
html {
  /* 默认使用浅色主题变量 */
  --background-color: light.$background-color;
  --text-color: light.$text-color;
  background-color: var(--background-color);
  color: var(--text-color);
}
::-webkit-scrollbar {
  display: none;
}

html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 16px;
  --color: rgba(114, 114, 114, 0.3);
  // background-color: var(--background-color);
}

html[data-theme="dark"] {
  --background-color: dark.$background-color;
  --text-color: dark.$text-color;
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>

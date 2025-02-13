<template>
  <div>
    <router-view></router-view>
    <!-- <button @click="themeStore.toggleTheme" class="index">切换主题</button> -->
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from './stores/themeStore';

const themeStore = useThemeStore();
// themeStore.initTheme();
</script>

<style lang="scss">
/* 引入主题文件 */
@use './styles/light-theme.scss' as light;
@use './styles/dark-theme.scss' as dark;

/* 全局样式 */
html {
  /* 默认使用浅色主题变量 */
  --background-color: light.$background-color;
  --text-color: light.$text-color;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
}

html[data-theme="dark"] {
  /* 当data-theme为 dark 时，使用深色主题变量 */
  --background-color: dark.$background-color;
  --text-color: dark.$text-color;
}

/* 清理其他样式 */
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  font-size: 16px;
}
</style>

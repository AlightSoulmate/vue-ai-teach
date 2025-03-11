<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from "@/stores/useThemeStore";

const themeStore = useThemeStore();
</script>

<style lang="scss">
/* 全局样式 */
::-webkit-scrollbar {
  display: none;
}

html {
  --background-color: light.$background-color;
  --text-color: light.$text-color;
  --card-background: light.$card-background;
  background-color: var(--background-color);
  color: var(--text-color);
}

html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: $standard-font-size;
  background-color: var(--background-color);
  color: var(--text-color);
}

// html[data-theme="dark"] {
//   --background-color: dark.$background-color;
//   --text-color: dark.$text-color;
//   --card-background: dark.$card-background;
//   background-color: var(--background-color);
//   color: var(--text-color);
// }
</style>

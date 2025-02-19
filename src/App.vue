<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
@use "./styles/light-theme.scss" as light;
@use "./styles/dark-theme.scss" as dark;

/* 全局样式 */
// html {
//   /* 默认使用浅色主题变量 */
//   --background-color: light.$background-color;
//   --text-color: light.$text-color;
// }
::-webkit-scrollbar {
  display: none;
}
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 16px;
  color: var(--text-color);
  width: 100%;
  height: 100vh;
  --color: rgba(114, 114, 114, 0.3);
  background-color: var(--background-color);
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    );
  background-size: 55px 55px;
}

html[data-theme="dark"] {
  --background-color: dark.$background-color;
  --text-color: dark.$text-color;
}
</style>

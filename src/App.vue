<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts" setup></script>

<style lang="scss">
@use "./styles/light-theme.scss" as light;
@use "./styles/dark-theme.scss" as dark;

/* 全局样式 */
html {
  /* 默认使用浅色主题变量 */
  --background-color: light.$background-color;
  --text-color: light.$text-color;
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
  background-color: var(--background-color);
}

html[data-theme="dark"] {
  --background-color: dark.$background-color;
  --text-color: dark.$text-color;
}
</style>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: $standard-font-size;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.el-container,
.el-main,
.card,
.nav,
.glass-effect,
.el-menu,
.el-menu-item,
.el-sub-menu__title {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease, box-shadow 0.3s ease;
}

p,
span,
h1,
h2,
h3,
h4,
h5,
h6,
div:not(.card) {
  transition: color 0.2s ease;
}

/* * {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease, box-shadow 0.3s ease;
} */
</style>

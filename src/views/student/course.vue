<template>
  <div class="crouse-page">
    <h1 class="title">敬请期待</h1>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.crouse-page {
  background-color: var(--background-color);
  min-height: 100%;
}

.title {
  color: var(--text-color);
  margin: 11px 0 20px 45px;
  font-size: $mains-title-font-size;
  font-weight: $mains-title-font-weight;
}
</style>

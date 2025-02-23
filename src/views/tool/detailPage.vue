<template>
  <nav class="top-nav">
    <TopNav />
  </nav>
  <div class="detail-main">
    <Main />
  </div>
</template>
<script lang="ts" setup>
import TopNav from "@/components/topNav/main/index.vue";
import Main from "@/components/detail/index.vue";
</script>
<style scope>
.top-nav {
  position: fixed;
  top: 0;
  width: 100%;
}
.detail-main {
  margin-top: 55px;
}
</style>

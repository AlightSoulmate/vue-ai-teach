<template>
  <div v-if="isLoading">
    <Loading />
  </div>
  <div v-else>
    <nav class="top-nav">
      <TopNav />
    </nav>
    <div class="detail-main">
      <Main />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import TopNav from "@/components/topNav/main/index.vue";
import Main from "@/components/detail/index.vue";
import Loading from "@/components/use/loading.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
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

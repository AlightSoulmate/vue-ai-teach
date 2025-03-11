<template>
  <div v-if="isLoading">
    <Loading />
  </div>
  <div v-else class="login-container">
    <EnterDialog />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Loading from "@/components/use/loading.vue";
import EnterDialog from "@/components/use/enter.vue";

const isLoading = ref<boolean>(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>
<style scoped>
.login-container {
  width: 50%;
  position: fixed;
  top: 20%;
  margin: 0 auto;
  left: 35%;
}
</style>

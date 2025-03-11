<template>
  <div v-if="isLoading">
    <Loading />
  </div>
  <div v-else>
    <nav class="top-nav">
      <TopNav />
    </nav>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'" class="menus">
        <Menus @collapse="handleCollapse" />
      </el-aside>
      <el-container>
        <el-main>
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TopNav from "@/components/topNav/main/index.vue";
import Menus from "@/components/menus/index.vue";
import Loading from "@/components/use/loading.vue";

const isLoading = ref<boolean>(true);
const isCollapse = ref<boolean>(false);

const handleCollapse = (val: boolean): void => {
  isCollapse.value = val;
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);
});
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.top-nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.el-container {
  width: 100%;
  display: flex;
  min-height: 100vh;
}

.el-aside {
  margin-top: $top-nav-height;
  transition: all 0.3s;
  background-color: var(--background-color);
  min-height: calc(100vh - #{$top-nav-height});
  flex-shrink: 0;
  overflow: visible;
}

.el-main {
  margin-top: $top-nav-height;
  background-color: var(--background-color);
  flex: 1;
  overflow-x: hidden;
  min-height: calc(100vh - #{$top-nav-height});
  transition: all 0.3s;
}

:deep(.el-menu) {
  border-right: none;
}
</style>

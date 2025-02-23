<template>
  <nav class="top-nav">
    <TopNav />
  </nav>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'" class="menus">
      <Menus @collapse="handleCollapse" />
    </el-aside>
    <el-main>
      <router-view v-slot="{ Component }">
        <keep-alive :include="[]">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import TopNav from "@/components/topNav/main/index.vue";
import Menus from "@/components/menus/index.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const isCollapse = ref(false);

// 监听菜单组件的折叠状态
const handleCollapse = (val: boolean) => {
  isCollapse.value = val;
};

onMounted(async () => {
  try {
    // 确保用户信息已加载
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      authStore.user = JSON.parse(userInfo);
      authStore.isAuthenticated = true;
    }
  } catch (error) {
    console.error("Failed to initialize main page:", error);
    router.push("/");
  }
});
</script>

<style scoped lang="scss">
@use "@/styles/_variables.scss" as *;

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
  border-right: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
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

<script lang="ts" setup>
import { ref } from "vue";
import { Expand, Fold } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { computed } from "vue";
import { defaultRouteByRole, getMenusByRole, isAppRole } from "@/constants/permissions";

const authStore = useAuthStore();
const menus = computed(() => getMenusByRole(authStore.user.role || authStore.currentRole));
const activeMenu = computed(() => {
  const role = authStore.user.role || authStore.currentRole;
  return isAppRole(role) ? defaultRouteByRole[role] : "/home";
});
const isCollapse = ref<boolean>(false);

const toggleCollapse = (): void => {
  isCollapse.value = !isCollapse.value;
  emit("collapse", isCollapse.value);
};

const emit = defineEmits(["collapse"]);
</script>

<template>
  <div class="menu-container">
    <div class="collapse-trigger">
      <el-button class="collapse-btn" type="primary" @click="toggleCollapse" text>
        <el-icon class="collapse-icon" v-if="isCollapse" title="展开">
          <Expand />
        </el-icon>
        <el-icon class="collapse-icon" v-else title="折叠">
          <Fold />
        </el-icon>
      </el-button>
    </div>
    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse" router>
      <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <span class="menu-label">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.menu-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background-color: var(--background-color);
  border-right: 1px solid var(--border-color);
  z-index: 100;
}

.collapse-trigger {
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 100;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
  background-color: transparent;
  z-index: 100;
}

.collapse-btn:hover {
  background-color: var(--collapse-hover-color) !important;
  color: var(--active-text-color) !important;
}

.collapse-icon {
  font-size: 27px !important;
}

.el-icon {
  font-size: 20px;
  vertical-align: middle;
  color: var(--text-color);
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  background-color: var(--background-color);
}

.el-menu {
  background-color: var(--background-color);
}

::deep(.el-menu-item) {
  color: var(--text-color) !important;
  background-color: var(--background-color);
  overflow: hidden;
}

::deep(.el-menu-item:hover) {
  background-color: var(--hover-color);
}

::deep(.el-menu-item.is-active) {
  color: var(--el-color-primary) !important;
  background-color: var(--active-background-color);
}

::deep(.el-sub-menu__title) {
  color: var(--text-color) !important;
  background-color: var(--background-color);
}

::deep(.el-sub-menu__title:hover) {
  background-color: var(--hover-color) !important;
}

::deep(.el-menu--collapse) {
  background-color: var(--background-color);
}

::deep(.el-menu-item .el-icon),
::deep(.el-sub-menu__title .el-icon) {
  color: var(--text-color);
  margin-right: 8px;
}

::deep(.el-menu-item.is-active .el-icon) {
  color: var(--el-color-primary);
}

::deep(.el-aside) {
  overflow: hidden !important;
}

/* 折叠态：隐藏文字、图标居中，避免重叠 */
::deep(.el-menu--collapse .el-menu-item) {
  justify-content: center;
}

::deep(.el-menu--collapse .el-menu-item .el-icon) {
  margin-right: 0;
}

::deep(.el-menu--collapse .el-menu-item .menu-label) {
  display: none;
}
</style>

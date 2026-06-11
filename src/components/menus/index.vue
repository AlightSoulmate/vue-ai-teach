<script lang="ts" setup>
import { ref } from "vue";
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
    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse" router>
      <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <span class="menu-label">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
    <div class="collapse-trigger" :class="{ collapsed: isCollapse }">
      <button
        class="collapse-btn"
        type="button"
        :title="isCollapse ? '展开' : '收起'"
        @click="toggleCollapse"
      >
        <span class="collapse-mark" :class="{ collapsed: isCollapse }"></span>
        <span v-if="!isCollapse" class="collapse-text">收起</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - #{$top-nav-height});
  background-color: var(--background-color);
  border-right: 1px solid var(--border-color);
  z-index: 100;
}

.collapse-trigger {
  flex: 0 0 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  margin-top: auto;
  // border-top: 1px solid var(--border-color);
}

.collapse-trigger.collapsed {
  padding-inline: 0;
}

.collapse-btn {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  background-color: var(--background-color);
}

.collapse-btn:hover {
  background-color: var(--hover-color) !important;
  color: var(--el-color-primary) !important;
}

.collapse-trigger.collapsed .collapse-btn {
  width: 40px;
  padding: 0;
}

.collapse-mark {
  width: 9px;
  height: 9px;
  display: inline-block;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
}

.collapse-mark.collapsed {
  transform: rotate(225deg);
}

.collapse-text {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
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
  border-right: 1px solid var(--border-color);
}

.el-menu-vertical-demo.el-menu--collapse {
  width: 64px;
}

.el-menu {
  flex: 1 1 auto;
  background-color: var(--background-color);
  overflow-x: hidden;
  overflow-y: auto;
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
  width: 64px !important;
  justify-content: center;
  padding: 0 !important;
}

::deep(.el-menu--collapse .el-menu-item .el-icon) {
  margin-right: 0;
}

::deep(.el-menu--collapse .el-menu-item span) {
  display: none;
}

::deep(.el-menu--collapse .el-menu-item .menu-label) {
  display: none;
}
</style>

<script lang="ts" setup>
import { ref } from "vue";
import Icon from "../use/icon.vue";
import Theme from "../use/theme.vue";
import { useThemeStore } from "@/stores/useThemeStore";

const themeStore = useThemeStore();
const logo = ref("https://a1.x914.com/alight/i/AITeach/white-zisu-logo.png");
const logoDark = ref(
  "https://a1.x914.com/alight/i/AITeach/black-zisu-logo.png"
);
</script>

<template>
  <div class="nav">
    <div class="glass-effect">
      <div class="nav-left">
        <Icon />
        <img
          :src="themeStore.isDarkTheme ? logoDark : logo"
          alt="logo"
          class="logo"
        />
      </div>
      <div class="nav-right">
        <Theme />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav {
  height: 60px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--navbar-bottom-border-color);
  position: relative;
}
.glass-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 5000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  padding: 1px 10px 0 10px;
  width: 190px;
}

:deep(.el-button) {
  background: #fff;
  color: #409eff;
  font-weight: 500;
  border: 1px solid #409eff;
}

:deep(.el-button--text) {
  font-size: 14px;
}

:deep(.el-button--text.active) {
  color: var(--el-color-primary);
}

:deep(.el-button--primary:not(.el-button--text)) {
  border-radius: 20px;
  padding: 8px 24px;
}

:deep(.el-button--primary:not(.el-button--text).active) {
  background-color: var(--el-color-primary);
  color: #fff;
}
</style>

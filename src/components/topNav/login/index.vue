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
        <Illustrate />
        <Github />
        <div class="auth-buttons">
          <el-button
            type="primary"
            text
            @click="handleLogin"
            :class="{ active: authStore.isLogin }"
          >
            登录
          </el-button>
          <el-button
            type="primary"
            @click="handleLogin"
            :class="{ active: !authStore.isLogin }"
          >
            注册
          </el-button>
          <!-- <el-button
            type="primary"
            text
            @click="authStore.switchToLogin"
            :class="{ active: authStore.isLogin }"
          >
            登录
          </el-button>
          <el-button
            type="primary"
            @click="authStore.switchToRegister"
            :class="{ active: !authStore.isLogin }"
          >
            注册
          </el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Icon from "../use/icon.vue";
import Illustrate from "../use/illustrate.vue";
import Theme from "../use/theme.vue";
import Github from "../use/github.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const logo = ref("https://a1.x914.com/alight/i/AITeach/white-zisu-logo.png");
const logoDark = ref(
  "https://a1.x914.com/alight/i/AITeach/black-zisu-logo.png"
);

const handleLogin = () => {
  router.push("/form");
};
</script>

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
  padding: 0 10px;
  /* background: rgba(255, 255, 255, 0.1); */
  /* backdrop-filter: blur(10px); */
  /* -webkit-backdrop-filter: blur(10px); */
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.2); */
  z-index: 1000;
  transition: all 0.3s ease-in-out;
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

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
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

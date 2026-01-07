<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Icon from "../use/icon.vue";
import Mine from "../use/mine.vue";
import Illustrate from "../use/illustrate.vue";
import Theme from "../use/theme.vue";
import Github from "../use/github.vue";

const router = useRouter();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const logo = ref("https://a1.x914.com/alight/i/AITeach/white-zisu-logo.png");
const logoDark = ref(
  "https://a1.x914.com/alight/i/AITeach/black-zisu-logo.png"
);

const handleSchoolLogoClick = () => {
  window.open("https://www.zisu.edu.cn/", "_blank");
};

const goToLogin = (role: string) => {
  router.push(`/auth/${role}`);
};
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
          @click="handleSchoolLogoClick"
        />
      </div>
      <div class="nav-right">
        <Illustrate />
        <Github />
        <Theme />
        <div v-if="!authStore.isAuthenticated" class="login-buttons">
          <button class="login-btn student" @click="goToLogin('student')">
            <i class='bx bxs-user'></i>
            <span>学生登录</span>
          </button>
          <button class="login-btn teacher" @click="goToLogin('teacher')">
            <i class='bx bxs-user-badge'></i>
            <span>教师登录</span>
          </button>
          <button class="login-btn admin" @click="goToLogin('admin')">
            <i class='bx bxs-shield-alt-2'></i>
            <span>管理员登录</span>
          </button>
        </div>
        <Mine v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5000;
  position: relative;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  padding: 1px 10px 0 10px;
  width: 190px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.02);
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

:deep(.dark) .glass-effect {
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.login-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-btn i {
  font-size: 18px;
}

.login-btn.student,
.login-btn.teacher,
.login-btn.admin {
  background: #66b2ff; /* 浅蓝，统一视觉 */
}

.login-btn.student:hover,
.login-btn.teacher:hover,
.login-btn.admin:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 178, 255, 0.35);
  background: #5aa7ff; /* 略深的悬停色 */
}

@media (max-width: 768px) {
  .nav {
    padding: 0 16px;
  }

  .glass-effect {
    padding: 0 16px;
  }

  .nav-left,
  .nav-right {
    gap: 12px;
  }

  .logo {
    width: 160px;
  }

  .login-buttons {
    gap: 6px;
  }

  .login-btn span {
    display: none;
  }

  .login-btn {
    padding: 8px 12px;
  }
}
</style>

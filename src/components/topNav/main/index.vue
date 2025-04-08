<script lang="ts" setup>
import { ref } from "vue";
import { useThemeStore } from "@/stores/useThemeStore";
import Icon from "../use/icon.vue";
import Mine from "../use/mine.vue";
import Illustrate from "../use/illustrate.vue";
import Theme from "../use/theme.vue";
import Github from "../use/github.vue";

const themeStore = useThemeStore();
const logo = ref("https://a1.x914.com/alight/i/AITeach/white-zisu-logo.png");
const logoDark = ref(
  "https://a1.x914.com/alight/i/AITeach/black-zisu-logo.png"
);

const handleSchoolLogoClick = () => {
  window.open("https://www.zisu.edu.cn/", "_blank");
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
        <Mine />
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
}
</style>

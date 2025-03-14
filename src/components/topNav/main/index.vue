<script lang="ts" setup>
import { ref } from "vue";
import { useThemeStore } from "@/stores/useThemeStore";
import Icon from "../use/icon.vue";
import Search from "../use/search.vue";
import Mine from "../use/mine.vue";
import Illustrate from "../use/illustrate.vue";
import Theme from "../use/theme.vue";
import Github from "../use/github.vue";

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
        <Search />
      </div>
      <div class="nav-right">
        <Theme />
        <Illustrate />
        <Github />
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
.glass-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 5000;
  transition: all 0.3s ease-in-out;
}
</style>

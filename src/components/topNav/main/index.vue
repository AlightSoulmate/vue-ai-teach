<template>
  <div class="nav">
    <div class="glass-effect">
    <!-- 左侧：Logo + 搜索 -->
    <div class="nav-left">
      <Icon />
      <img
        :src="themeStore.isDarkTheme ? logo : logoDark"
        alt="logo"
        class="logo"
      />
      <Search />
    </div>

    <!-- 右侧：主题 + 说明 + 个人中心 -->
    <div class="nav-right">
      <Theme />
      <Illustrate />
      <Mine />
    </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useThemeStore } from "@/stores/useThemeStore";
import Icon from "../use/icon.vue";
import Search from "../use/search.vue";
import Mine from "../use/mine.vue";
import Illustrate from "../use/illustrate.vue";
import Theme from "../use/theme.vue";

const themeStore = useThemeStore();
const logo = ref("https://a1.x914.com/alight/i/AITeach/white-zisu-logo.png");
const logoDark = ref(
  "https://a1.x914.com/alight/i/AITeach/black-zisu-logo.png"
);
</script>

<style scoped>
.nav {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background: var(--background-color); */
  /* box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); */
  /* border-bottom: 3px solid #2d2d2d; */
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
  background: rgba(255, 255, 255, 0.1);  /* 半透明背景 */
  backdrop-filter: blur(10px);  /* 磨砂效果 */
  -webkit-backdrop-filter: blur(10px);  /* Safari 支持 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  transition: all 0.3s ease-in-out;
}

</style>

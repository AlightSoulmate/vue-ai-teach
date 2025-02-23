<template>
  <div class="grid-content">
    <img
      :src="logoUrl"
      alt="切换主题"
      class="theme-img"
      @click="handleToggleTheme"
    />
    <div class="theme-container" @click="handleToggleTheme">切换主题</div>
  </div>
</template>
<script lang="ts" setup>
import { ref,onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useThemeStore } from "@/stores/themeStore";

const themeStore = useThemeStore();
const lightThemeLogoUrl =
  "https://a1.x914.com/alight/i/AITeach/global-theme-checkout-black.png";
const darkThemeLogoUrl =
  "https://a1.x914.com/alight/i/AITeach/global-theme-checkout.png";
const logoUrl = ref(lightThemeLogoUrl);

const handleToggleTheme = () => {
  if (themeStore.isDarkTheme) {
    logoUrl.value = darkThemeLogoUrl;
  } else {
    logoUrl.value = lightThemeLogoUrl;
  }
  localStorage.setItem('themeLogo',logoUrl.value)
  themeStore.toggleTheme();
};
onMounted(() => {
  logoUrl.value = localStorage.getItem('themeLogo') || lightThemeLogoUrl;
})
</script>
<style scoped>
.grid-content {
  min-height: 55px;
  display: flex;
}
.theme-img {
  cursor: pointer;
  padding: 12.5px;
  height: 30px;
}
.theme-container {
  cursor: pointer;
  line-height: 55px;
  color: var(--text-color);
  font-weight: bold;
}
</style>

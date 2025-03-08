<template>
  <div class="grid-content" @click="goBackHome">
    <img
      :src="themeStore.isDarkTheme ? logoSrc : logoSrcDark"
      alt="logo"
      class="logo name"
    />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { ref } from "vue";
const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const logoSrc = ref("https://a1.x914.com/alight/i/AITeach/white-logo_1.png");
const logoSrcDark = ref(
  "https://a1.x914.com/alight/i/AITeach/new-black-logo.png"
);

const goBackHome = () => {
  const path = authStore.isAuthenticated ? "/home" : "/";
  router.push(path);
};
</script>
<style scoped>
.grid-content {
  min-height: 55px;
  line-height: 55px;
  position: relative;
}
.grid-content .name {
  font-size: 22px;
  font-weight: bold;
  color: var(--text-color);
  text-align: left;
  padding-left: 5px;
  position: relative;
}
.grid-content .name:hover {
  cursor: pointer;
}
.logo {
  height: 50px;
  margin-top: 15px;
}
</style>

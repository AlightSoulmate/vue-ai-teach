<template>
  <nav class="top-nav">
    <TopNav />
  </nav>
  <div class="page-container">
    <!-- 左侧内容区 -->
    <div class="left-section">
      <div class="content-wrapper">
        <div class="big-logo">
          <video :src="videoSrc" autoplay loop muted>{{ videoSrcTxt }}</video>
        </div>
        <h1 class="h1-title">{{ h1Title }}</h1>
        <h2 class="h2-title">{{ h2Title }}</h2>
        <!-- <div class="enter" @click="authStore.openDialog">
          <Button />
        </div> -->
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="right-section">
      <div class="login-container">
        <StuEnterDialog />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import TopNav from "@/components/topNav/login/index.vue";
import Button from "@/components/use/button.vue";
import StuEnterDialog from "@/components/use/enter.vue";

const h1Title = ref("AITe👋ach");
const h2Title = ref("AI驱动的直观教学反馈与改进，以智能化评估帮助教师完成创新");
const videoSrc = ref("https://a1.x914.com/alight/i/2025/02/02/app.mp4");
const videoSrcTxt = ref("您的浏览器不支持 HTML5 视频标签");
const router = useRouter();
const authStore = useAuthStore();
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  min-height: 80vh;
  padding-top: 60px; // 为顶部导航留出空间
}

.left-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  // background-color: var(--background-color);
}

.content-wrapper {
  max-width: 600px;
}

.right-section {
  width: 450px;
  // background-color: #fff;
  // box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 380px;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
  margin-right: 5rem;
}

.h1-title {
  font-size: 3.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.h2-title {
  font-size: 1.3rem;
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.big-logo {
  width: 100%;
  height: 200px;
  margin-bottom: 2rem;
}

.big-logo video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 响应式设计
@media (max-width: 968px) {
  .page-container {
    flex-direction: column;
  }

  .right-section {
    width: 100%;
    min-height: 500px;
  }
}
</style>

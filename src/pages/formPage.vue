<template>
  <div class="form-page">
    <div class="background-effects">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="circle circle-4"></div>
    </div>
    <div v-if="isLoading" class="loader-container">
      <Loading />
    </div>
    <div v-else class="content-container">
      <div class="brand-section">
        <div class="logo">
          <span class="logo-icon">🎓</span>
        </div>
        <h1 class="brand-title">
          欢迎回来
          <span v-if="currentUsername">，{{ currentUsername }}</span>
          <span v-else class="username-placeholder">，____</span>
        </h1>
        <p class="brand-subtitle">登录您的账户以体验所有功能</p>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">✨</span>
            <span class="feature-text">优质的学习资源</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📚</span>
            <span class="feature-text">便捷的课程管理</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔍</span>
            <span class="feature-text">详尽的学习分析</span>
          </div>
        </div>
      </div>
      <!-- <div class="form-section"> -->
      <EnterDialog class="form-section" @username-change="updateUsername" />
      <!-- </div> -->
    </div>
    <footer class="page-footer">
      <p>© 2025 AITEACH · 保留所有权利</p>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Loading from "@/components/use/loading.vue";
import EnterDialog from "@/components/use/enter.vue";

const isLoading = ref<boolean>(true);
const currentUsername = ref<string>("");
let debounceTimer: number | null = null;

const updateUsername = (username: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    currentUsername.value = username;
    debounceTimer = null;
  }, 300) as unknown as number;
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>
<style lang="scss" scoped>
.form-page {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0f172a;
  position: relative;
  overflow: hidden;
}

.background-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}

.circle-1 {
  width: 300px;
  height: 300px;
  left: -100px;
  top: -100px;
  background: rgba(99, 102, 241, 0.15);
}

.circle-2 {
  width: 400px;
  height: 400px;
  right: -150px;
  bottom: -150px;
  background: rgba(139, 92, 246, 0.15);
}

.circle-3 {
  width: 200px;
  height: 200px;
  right: 30%;
  top: 20%;
  background: rgba(14, 165, 233, 0.15);
}

.circle-4 {
  width: 250px;
  height: 250px;
  left: 20%;
  bottom: 10%;
  background: rgba(236, 72, 153, 0.1);
}

.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.content-container {
  display: flex;
  max-width: 1100px;
  width: 90%;
  margin: 0 auto;
  z-index: 1;
  position: relative;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.brand-section {
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.9),
    rgba(15, 23, 42, 0.9)
  );
  color: white;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
    z-index: -1;
  }
}

.logo {
  margin-bottom: 2rem;
  display: inline-block;
}

.logo-icon {
  font-size: 3rem;
  background: linear-gradient(to right, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  transition: all 0.5s ease;

  span {
    display: inline-block;
    font-weight: 700;
    background: linear-gradient(to right, #f472b6, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeIn 0.5s ease-out;
    margin-left: 0.5rem;
    position: relative;
    transition: all 0.5s ease;

    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(to right, #f472b6, #ec4899);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
  }

  &:hover span::before {
    transform: scaleX(1);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 50px;
    height: 4px;
    background: linear-gradient(to right, #a78bfa, #60a5fa);
    border-radius: 2px;
  }

  .username-placeholder {
    opacity: 0.6;
    font-style: italic;
    background: linear-gradient(to right, #9ca3af, #6b7280);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: pulse 1.5s infinite alternate ease-in-out;
    transition: all 0.5s ease;
  }
}

.brand-subtitle {
  font-size: 1.1rem;
  color: rgba(226, 232, 240, 0.8);
  margin-bottom: 2rem;
  max-width: 80%;
}

.feature-list {
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.feature-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  opacity: 0.9;
}

.feature-text {
  font-size: 1rem;
  color: rgba(226, 232, 240, 0.8);
}

.form-section {
  width: 480px;
}

// .form-section {
//   flex: 1.2;
//   padding: 0;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }


.page-footer {
  position: absolute;
  bottom: 1rem;
  width: 100%;
  text-align: center;
  color: rgba(226, 232, 240, 0.5);
  font-size: 0.85rem;
  z-index: 1;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
    width: 95%;
    margin-top: 2rem;
    margin-bottom: 4rem;
  }

  .brand-section {
    padding: 2rem;
    text-align: center;

    .brand-title::after {
      left: 50%;
      transform: translateX(-50%);
    }

    .brand-subtitle {
      max-width: 100%;
      margin: 0 auto 1.5rem;
    }

    .feature-item {
      justify-content: center;
    }
  }

  .page-footer {
    bottom: 0.5rem;
  }
}
</style>

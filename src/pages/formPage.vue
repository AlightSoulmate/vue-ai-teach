<template>
  <div class="form-page">
    <div class="background-effects">
      <div class="circle circle-1"></div>
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
          <span v-if="currentUsername"> {{ currentUsername }}</span>
          <span v-else class="username-placeholder"> ____</span>
        </h1>
        <p class="brand-subtitle">登录账户以体验完整功能</p>
      </div>
      <EnterDialog class="form-section" @username-change="updateUsername" />
    </div>
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
  border-radius: 20px;
  overflow: hidden;
}

.brand-section {
  flex: 1;
  padding-left: 5rem;
  margin-top: -10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  color: white;
}

.logo {
  display: inline-block;
}

.logo-icon {
  font-size: 3rem;
  background: linear-gradient(to right, #a78bfa, #60a5fa);
  background-clip: text;
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
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  transition: all 0.5s ease;

  span {
    display: inline-block;
    font-weight: 700;
    background: linear-gradient(to right, #f472b6, #ec4899);
    background-clip: text;
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
    background-clip: text;
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

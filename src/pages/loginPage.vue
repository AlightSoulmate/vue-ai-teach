<template>
  <div class="login-page">
    <nav class="top-nav">
      <TopNav />
    </nav>
    <div class="hero-section">
      <div class="decorative-elements">
        <div class="circle circle-1"></div>
      </div>
      <div class="hero-content">
        <div class="title">
          <div class="front">{{ TitleFront }}</div>
          <div class="end">{{ TitleEnd }}</div>
        </div>
        <div class="enter">
          <Enter class="enter-inner" @click="handleLogin" />
        </div>
      </div>
      <div class="hero-image">
        <div class="carousel">
          <Carousel class="carousel-inner" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import TopNav from "@/components/topNav/login/index.vue";
import Enter from "@/components/use/newButton.vue";
import Carousel from "@/components/use/carousel.vue";

const router = useRouter();
const TitleFront = ref("浙江外国语学院");
const TitleEnd = ref("AI智能教学平台");

const handleLogin = () => {
  router.push("/form");
};
</script>
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

::-webkit-scrollbar {
  display: none;
}

.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-color) 0%, #f5f7fa 100%);
  position: relative;
  overflow: hidden;
}

.decorative-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg,
      rgba(255, 121, 45, 0.1),
      rgba(255, 77, 77, 0.1));
  animation: float 6s ease-in-out infinite;

  &.circle-1 {
    width: 300px;
    height: 300px;
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }
}

.top-nav {
  position: relative;
  z-index: 10;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 92vh;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  gap: 4rem;
  position: relative;
  z-index: 1;
}

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding-right: 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;

  .front {
    font-size: 4rem;
    font-weight: 800;
    color: var(--text-color);
    letter-spacing: -1px;
    animation: slideUp 0.8s ease-out;
    line-height: 1.2;
    text-align: center;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, #ff792d, #ff4d4d);
      border-radius: 2px;
      animation: widthGrow 1s ease-out forwards;
    }
  }

  .end {
    font-size: 4rem;
    font-weight: 800;
    color: #ff792d;
    letter-spacing: -1px;
    animation: slideUp 1s ease-out;
    background: linear-gradient(45deg, #ff792d, #ff4d4d);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    text-align: center;
  }
}

.slip {
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  animation: fadeIn 1s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.enter {
  margin: 2rem auto;
  animation: fadeIn 1.2s ease-out;
  width: auto;
  display: flex;
  justify-content: center;

  .enter-inner {
    transform: scale(1);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.carousel {
  width: 100%;
  max-width: 600px;
  animation: fadeIn 1.4s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }

  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

@keyframes widthGrow {
  from {
    width: 0;
    opacity: 0;
  }

  to {
    width: 60px;
    opacity: 1;
  }
}

@media (max-width: 1200px) {
  .hero-section {
    gap: 2rem;
    padding: 1.5rem;
  }

  .title {

    .front,
    .end {
      font-size: 3.5rem;
    }
  }
}

@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }

  .hero-content {
    align-items: center;
    padding-right: 0;
    text-align: center;
  }

  .title {
    align-items: center;
    text-align: center;
  }

  .carousel {
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .title {

    .front,
    .end {
      font-size: 2.5rem;
    }
  }

  .hero-section {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .title {

    .front,
    .end {
      font-size: 2rem;
    }
  }

  .hero-section {
    padding: 0.5rem;
  }
}
</style>

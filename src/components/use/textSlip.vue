<style scoped>
.card {
  /* color used to softly clip top and bottom of the .words container */
  /* --bg-color: #212121; */
  background-color: var(--background-color);
  padding: 1rem 2rem;
  border-radius: 1.25rem;
}
.loader {
  /* color: rgb(124, 124, 124); */
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 30px;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  height: 40px;
  padding: 10px 10px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  border-radius: 8px;
}
.title {
  margin-top: 0;
  margin-right: 5px;
}
.words {
  overflow: hidden;
  position: relative;
}
/* .words::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--background-color) 10%,
    transparent 30%,
    transparent 70%,
    var(--background-color) 90%
  );
  z-index: 20;
} */

.word {
  display: block;
  height: 100%;
  padding-left: 6px;
  color: #956afa;
  animation: spin_4991 6s infinite;
}

@keyframes spin_4991 {
  10% {
    -webkit-transform: translateY(-102%);
    transform: translateY(-102%);
  }

  25% {
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
  }

  35% {
    -webkit-transform: translateY(-202%);
    transform: translateY(-202%);
  }

  50% {
    -webkit-transform: translateY(-200%);
    transform: translateY(-200%);
  }

  60% {
    -webkit-transform: translateY(-302%);
    transform: translateY(-302%);
  }

  75% {
    -webkit-transform: translateY(-300%);
    transform: translateY(-300%);
  }

  85% {
    -webkit-transform: translateY(-402%);
    transform: translateY(-402%);
  }

  100% {
    -webkit-transform: translateY(-400%);
    transform: translateY(-400%);
  }
}
</style>
<script setup></script>
<template>
  <div class="card">
    <div class="loader">
      <p class="title">登录，即刻体验</p>
      <div class="words">
        <span class="word">一站式工具集</span>
        <span class="word">AI智能推荐</span>
        <span class="word">数据驱动决策</span>
        <span class="word">提升工作效率</span>
        <span class="word">安全加密保障</span>
        <span class="word">响应式UI组件</span>
        <span class="word">贡献开源代码</span>
      </div>
    </div>
  </div>
</template>

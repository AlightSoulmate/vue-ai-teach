<template>
  <div class="grid-content">
    <div class="name">AITeach</div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.grid-content {
  min-height: 55px;
  position: relative;
}
.grid-content .name {
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
  padding-left: 40px;
  position: relative;
}
.grid-content .name:hover {
  cursor: pointer;
}
.grid-content .name::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background-image: url(https://a1.x914.com/alight/i/2025/02/02/logo.png);
  background-size: cover;
}
</style>

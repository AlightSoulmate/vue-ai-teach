<template>
  <div class="grid-content">
    <div class="search-container" @click="fakeSearch">
      <button class="search-button" type="button">
        <span class="fake-input">Search</span>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';

const fakeSearch = () => {
  ElMessage({
    message: '模块尚未开发',
    type: 'warning',
  })
};
</script>
<style scoped>
.grid-content {
  min-height: 55px;
}
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
  cursor: pointer;
  margin-right: 30px;
}

.search-button {
  width: 160px;
  height: 35px;
  background-color: rgba(48, 47, 47, 0.651);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  box-sizing: content-box;
}
.search-button:hover {
  border: 1px solid rgba(255, 147, 15, 0.9);
  transform: matrix(1.1, 0, 0, 1.1, 0.1, 0.1);
}

.fake-input {
  width: 150px;
  height: 30px;
  line-height: 30px;
  font-size: 17px;
  color: #ffffff61;
  font-weight: lighter;
}
.search-button:hover .fake-input {
  color: #ffffff;
  font-weight: bold;
}
.fake-input::before {
  content: "";
  width: 20px;
  height: 20px;
  background-image: url(https://a1.x914.com/alight/i/2025/02/02/search.png);
  background-size: cover;
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
}
</style>

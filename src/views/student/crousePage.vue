<template>
  <div class="crouse-page">
    <h1 class="title">学生-我的课程</h1>

    <div class="upload-section">
      <div class="file-input">
        <label>获取老师上传的作业批改标准文件：</label>
        <div class="input-wrapper">
          <input
            type="file"
            accept=".docx"
            @click.prevent="(e) => scoreStore.handleSystemFileChange(e)"
          />
          <span class="file-name">{{ scoreStore.systemFileName || "未选择文件" }}</span>
        </div>
      </div>

      <div class="file-input">
        <label>作业文件：</label>
        <div class="input-wrapper">
          <input
            type="file"
            accept=".docx"
            @change="(e) => scoreStore.handleUserFileChange(e)"
          />
          <span class="file-name">{{ scoreStore.userFileName || "未选择文件" }}</span>
        </div>
      </div>

      <el-button
        type="primary"
        @click="scoreStore.handleUpload"
        :loading="scoreStore.uploading"
        class="upload-btn"
      >
        上传文件
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScoreStore } from "@/stores/useScoreStore";

const scoreStore = useScoreStore();
</script>

<style scoped lang="scss">
@use "../../styles/variables.scss" as *;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.crouse-page {
  background-color: var(--background-color);
  min-height: 100%;
}

.title {
  color: var(--text-color);
  margin: $mains-title-margin;
  font-size: $mains-title-font-size;
  font-weight: $mains-title-font-weight;
}

.upload-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: var(--box-shadow);
}

.file-input {
  margin-bottom: 24px;
}

.file-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
}

.input-wrapper {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  background-color: var(--background-color);
  cursor: pointer;
}

.input-wrapper:hover {
  border-color: var(--active-text-color);
  background-color: var(--active-background-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
}

.input-wrapper:active {
  transform: translateY(0);
}

.input-wrapper input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.file-name {
  color: var(--text-color);
  font-size: 14px;
  transition: all 0.3s ease;
}

.input-wrapper:hover .file-name {
  color: var(--active-text-color);
}

.upload-btn {
  width: 100%;
  margin-top: 20px;
  height: 40px;
  background-color: var(--active-text-color);
  border-color: var(--active-text-color);
}

.upload-btn:hover {
  background-color: var(--active-text-color);
  opacity: 0.9;
  border-color: var(--active-text-color);
}

:deep(.el-button--primary) {
  --el-button-hover-bg-color: var(--active-text-color);
  --el-button-hover-border-color: var(--active-text-color);
}
</style>

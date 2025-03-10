<template>
  <div class="upload-container">
    <div class="header">
      <el-icon><Upload /></el-icon>
      <span>提交评价报告</span>
    </div>

    <div class="content">
      <div class="description">
        在这里，你可以提交关于该AI工具的详细评价报告，请确保您的报告包含完整的使用体验，建议根据评分模块的类目分别进行评价。
      </div>

      <div class="upload-section">
        <div class="file-input">
          <div
            class="input-wrapper"
            :class="{ 'has-file': scoreStore.userFileName }"
          >
            <el-icon class="upload-icon"><UploadFilled /></el-icon>
            <input
              type="file"
              accept=".docx"
              @change="(e) => scoreStore.handleUserFileChange(e)"
            />
            <span class="file-name">
              {{ scoreStore.userFileName || "点击或拖拽文件到此处上传" }}
            </span>
            <span class="file-hint">支持 .docx/.doc/.pdf 格式</span>
          </div>
        </div>

        <el-button
          type="primary"
          @click="scoreStore.handleUpload"
          :loading="scoreStore.uploading"
          class="upload-btn"
        >
          <el-icon><Upload /></el-icon>
          {{ scoreStore.uploading ? "上传中..." : "开始上传" }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScoreStore } from "@/stores/useScoreStore";
import { Upload, UploadFilled } from "@element-plus/icons-vue";

const scoreStore = useScoreStore();
</script>

<style scoped lang="scss">
.upload-container {
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eaeaea;

  .el-icon {
    font-size: 24px;
    color: var(--el-color-primary);
  }
}

.content {
  padding: 10px;
}

.description {
  color: var(--text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 14px;
}

.upload-section {
  background-color: var(--el-fill-color-blank);
  border-radius: 8px;
  padding: 10px 20px;
}

.input-wrapper {
  position: relative;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--el-color-primary);
    background-color: var(--el-fill-color-light);
  }

  &.has-file {
    border-color: var(--el-color-success);
    background-color: var(--el-color-success-light);
  }

  .upload-icon {
    font-size: 48px;
    color: var(--el-text-color-secondary);
    margin-bottom: 16px;
  }

  input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
}

.file-name {
  display: block;
  color: var(--el-text-color-primary);
  font-size: 16px;
  margin-bottom: 8px;
}

.file-hint {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.upload-btn {
  width: 100%;
  margin-top: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .el-icon {
    font-size: 16px;
  }
}
</style>

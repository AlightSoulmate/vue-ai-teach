<script setup lang="ts">
import { ref } from "vue";
import { Upload, UploadFilled } from "@element-plus/icons-vue";
import { useScoreStore } from "@/stores/useScoreStore";

const scoreStore = useScoreStore();
const description = ref<string>(
  "在这里，你可以提交关于该AI工具的详细评价报告，请确保您的报告包含完整的使用体验，建议根据评分模块的类目分别进行评价。"
);
const uploadFileSupport = ref<string[]>([".docx", ".doc"]);
const FilenameDefault = ref<string>("点击或拖拽文件到此处上传");
</script>

<template>
  <div class="upload-container">
    <div class="header">
      <el-icon><Upload /></el-icon>
      <span>提交评价报告</span>
    </div>

    <!-- 上传评价内容 -->
    <div class="content">
      <div class="description">
        {{ description }}
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
              {{ scoreStore.userFileName || FilenameDefault }}
            </span>
            <span class="file-hint">
              支持 {{ uploadFileSupport.join(", ") }} 格式, 单个文件上限为2MB
            </span>
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

  <!-- 添加进度弹窗 -->
  <el-dialog
    v-model="scoreStore.uploading"
    title="文件上传进度"
    width="30%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="progress-content">
      <el-progress
        :percentage="scoreStore.progress"
        :status="scoreStore.progress === 100 ? 'success' : ''"
        :stroke-width="15"
      />
      <p class="progress-text" v-if="scoreStore.progress < 100">
        正在上传文件: {{ scoreStore.progress }}%
      </p>
      <p class="progress-text" v-else>评估处理中，请耐心等待...</p>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
$border-radius: 16px;
$border-radius-sm: 12px;
$transition-duration: 0.3s;
$primary-color: #409eff;
$gradient-start: #3498db;
$gradient-end: #2c3e50;
$box-shadow: 0 8px 20px rgba($gradient-start, 0.08);

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-container {
  padding: 25px 30px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba($gradient-start, 0.1);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100px;
    height: 2px;
    background: linear-gradient(to right, $gradient-start, $gradient-end);
  }

  .el-icon {
    font-size: 24px;
    color: $gradient-start;
  }
}

.content {
  padding: 10px;
}

.description {
  color: var(--text-color-secondary);
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 20px;
  padding: 15px 18px;
  background: rgba($gradient-start, 0.03);
  border-radius: $border-radius-sm;
  border-left: 3px solid $gradient-start;
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    left: 8px;
    top: 0;
    font-size: 40px;
    line-height: 1;
    color: rgba($gradient-start, 0.2);
  }
}

.upload-section {
  background-color: var(--background-color);
  border-radius: $border-radius-sm;
  padding: 20px;
  box-shadow: $box-shadow;
  border: 1px solid rgba($gradient-start, 0.05);
  transition: all $transition-duration ease;

  &:hover {
    box-shadow: 0 12px 28px rgba($gradient-start, 0.12);
    transform: translateY(-3px);
  }
}

.input-wrapper {
  position: relative;
  border: 2px dashed rgba($gradient-start, 0.3);
  border-radius: $border-radius-sm;
  padding: 40px 20px;
  text-align: center;
  transition: all $transition-duration ease;
  cursor: pointer;
  background: rgba($gradient-start, 0.02);

  &:hover {
    border-color: $gradient-start;
    background-color: rgba($gradient-start, 0.05);
  }

  &.has-file {
    border-color: #67c23a;
    background-color: rgba(#67c23a, 0.05);
    border-style: solid;
  }

  .upload-icon {
    font-size: 60px;
    color: rgba($gradient-start, 0.6);
    margin-bottom: 20px;
    transition: all $transition-duration ease;

    &:hover {
      transform: scale(1.05);
      color: $gradient-start;
    }
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
  color: var(--text-color);
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 12px;
}

.file-hint {
  display: block;
  color: var(--text-color-secondary);
  font-size: 13px;
  background: rgba($gradient-start, 0.05);
  padding: 5px 12px;
  border-radius: 30px;
  display: inline-block;
  margin-top: 8px;
}

.upload-btn {
  width: 100%;
  margin-top: 24px;
  height: 46px;
  @include flex-center;
  gap: 10px;
  border: none;
  background: linear-gradient(135deg, $gradient-start, $gradient-end);
  color: white;
  font-weight: 600;
  border-radius: $border-radius-sm;
  font-size: 16px;
  transition: all $transition-duration ease;
  box-shadow: 0 6px 12px rgba($gradient-start, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba($gradient-start, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  .el-icon {
    font-size: 18px;
  }
}

.progress-content {
  padding: 20px;
  text-align: center;

  .progress-text {
    margin-top: 15px;
    color: #606266;
    font-size: 14px;
  }
}

.el-progress {
  margin: 10px 0;
}
</style>

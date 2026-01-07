<script setup lang="ts">
import { ref, watch, h, onMounted } from "vue";
import { Upload, UploadFilled } from "@element-plus/icons-vue";
import { useScoreStore } from "@/stores/useScoreStore";
import { ElNotification } from 'element-plus';

const scoreStore = useScoreStore();
const description = ref<string>(
  "在这里，你可以提交关于该AI工具的详细评价报告，请确保您的报告包含完整的使用体验，建议根据评分模块的类目分别进行评价。此外，对于每个工具，只能上传2次作业，请谨慎提交！"
);
const uploadFileSupport = ref<string[]>([".docx", ".doc"]);
const FilenameDefault = ref<string>("点击或拖拽文件到此处上传");

const isThatTenTools = ref<boolean>(false);
// 检查是否是十个工具之一
const checkIfThatTenTools = (toolId: number) => {
  const tenTools = [
    25, 26, 60, 61, 98,
    99, 138, 139, 157, 158
  ];
  isThatTenTools.value = tenTools.includes(toolId);
};
onMounted(() => {
  let toolId = JSON.parse(localStorage.getItem("selectedTool") || "{}").id;
  checkIfThatTenTools(Number(toolId));
})
// 添加notification的引用
import type { NotificationHandle } from 'element-plus'
const uploadNotification = ref<NotificationHandle | null>(null)

// 监听上传进度的变化
watch(
  () => scoreStore.uploading,
  (newValue) => {
    if (newValue) {
      // 开始上传时显示notification
      uploadNotification.value = ElNotification({
        title: '文件上传进度',
        message: h('div', { class: 'upload-progress-notification' }, [
          h('el-progress', {
            percentage: scoreStore.progress,
            status: scoreStore.progress === 100 ? 'success' : '',
            strokeWidth: 8,
          }),
          h('p', { class: 'progress-text' },
            scoreStore.progress < 100
              ? `正在上传文件: ${scoreStore.progress}%`
              : '等待结果返回，请稍后...'
          )
        ]),
        duration: 0,
        position: 'bottom-right',
        showClose: false,
      })
    } else if (uploadNotification.value) {
      // 上传完成后关闭notification
      uploadNotification.value.close()
    }
  }
)

const isUploadLimitReached = ref(false)
const toolId = ref(0)

onMounted(() => {
  toolId.value = Number(JSON.parse(localStorage.getItem("selectedTool") || "{}").id)
  checkIfThatTenTools(toolId.value)
  // 检查上传次数
  isUploadLimitReached.value = !scoreStore.checkUploadCount(toolId.value)
})

// 修改上传处理方法
const handleUpload = async () => {
  if (isUploadLimitReached.value) {
    ElNotification({
      title: '上传失败',
      message: '您已达到该工具的最大上传次数(2次)',
      type: 'error',
    })
    return
  }

  try {
    await scoreStore.handleUpload()
    // 上传成功后记录次数
    scoreStore.recordUpload(toolId.value)
    // 重新检查上传限制
    isUploadLimitReached.value = !scoreStore.checkUploadCount(toolId.value)
  } catch (error) {
    console.error('上传失败:', error)
  }
}
</script>

<template>
  <div class="upload-container">
    <div class="header">
      <el-icon>
        <Upload />
      </el-icon>
      <span>提交评价报告</span>
    </div>

    <!-- 上传评价内容 -->
    <div class="content">
      <div class="description">
        {{ description }}
      </div>

      <div class="upload-section">
        <!-- 添加提示信息 -->
        <div v-if="!isThatTenTools" class="upload-warning">
          当前工具不在开放作业上传的工具列表中，请使用以下工具：<a href="https://a1.x914.com/alight/i/2025/06/06/41le.png"
            target="_blank">查看开放工具列表</a>
        </div>

        <div class="file-input" :class="{ 'disabled': !isThatTenTools }">
          <div class="input-wrapper" :class="{ 'has-file': scoreStore.userFileName }">
            <el-icon class="upload-icon">
              <UploadFilled />
            </el-icon>
            <input type="file" accept=".docx" @change="(e) => scoreStore.handleUserFileChange(e)" />
            <span class="file-name">
              {{ scoreStore.userFileName || FilenameDefault }}
            </span>
            <span class="file-hint">
              支持 {{ uploadFileSupport.join(", ") }} 格式, 单个文件上限为2MB
            </span>
          </div>
        </div>

        <!-- 修改上传按钮禁用条件 -->
        <el-button type="primary" @click="handleUpload" :loading="scoreStore.uploading"
          :disabled="!isThatTenTools || isUploadLimitReached" class="upload-btn">
          <el-icon>
            <Upload />
          </el-icon>
          {{ !isThatTenTools
            ? "当前工具不开放上传作业"
            : (isUploadLimitReached
              ? "达到单个工具作业上传次数限制，后续不可上传"
              : (scoreStore.uploading ? "上传中..." : "开始上传"))
          }}
        </el-button>
      </div>
    </div>
  </div>
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
    transform: translateY(-1px);
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
    box-shadow: 0 8px 16px rgba($gradient-start, 0.4);
  }

  .el-icon {
    font-size: 18px;
  }
}

// 添加notification相关样式
:deep(.upload-progress-notification) {
  .el-progress {
    margin: 10px 0;
  }

  .progress-text {
    margin-top: 8px;
    font-size: 13px;
    color: #606266;
  }
}

// 添加提示信息样式
.upload-warning {
  color: #f56c6c;
  background: rgba(#f56c6c, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  border-left: 3px solid #f56c6c;
}

.file-input.disabled .input-wrapper {
  opacity: 0.6;
  cursor: not-allowed;

  &:hover {
    border-color: rgba($gradient-start, 0.3);
    background-color: rgba($gradient-start, 0.02);
  }

  input[type="file"] {
    pointer-events: none;
  }
}
</style>

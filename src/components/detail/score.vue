<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { Checked, ChatDotRound, Microphone } from "@element-plus/icons-vue";
import { useScoreStore } from "@/stores/useScoreStore";
import { useDebounceStore } from "@/stores/useDebounceStore";
import type { ScrollbarInstance } from "element-plus";
import type { SpeechRecognitionEvent } from "@/interfaces";

interface SelectedTool {
  id: string | number;
  [key: string]: any;
}

const max = ref(0);
const value = ref(0);
const inputLess = ref(false);
const scrollHeight = ref<number>(390);
const innerRef = ref<HTMLDivElement>();
const scrollbarRef = ref<ScrollbarInstance>();
const submitRef = ref();
const scoreStore = useScoreStore();
const debounceStore = useDebounceStore();
const selectedToolId = ref<SelectedTool>({ id: "" });
const lastSubmitDate = ref("");

const MIN_COMMENT_LENGTH = 10;
const DEBOUNCE_DELAY = 500;
const MAX_COMMENT_LENGTH = 500;
const RATE_COLORS = ["#C6D1DE", "#409EFF", "#67C23A"];
const RATE_MAX = 5;

const getToolFromStorage = (): SelectedTool => {
  try {
    return JSON.parse(localStorage.getItem("selectedTool") || '{"id": ""}');
  } catch (error) {
    console.error("解析工具数据失败:", error);
    return { id: "" };
  }
};

const showMessage = (
  message: string,
  type: "success" | "error" | "warning" | "info" = "success"
) => {
  ElMessage({
    message,
    type,
    duration: 3000,
    showClose: true,
  });
};

const toNumber = (value: string | number): number => {
  return typeof value === "string" ? parseInt(value, 10) : value;
};

const canSubmit = computed(() => {
  const toolId = selectedToolId.value?.id;
  return (
    toolId &&
    !debounceStore.dailySubmitManager.checkDailySubmit(toolId) &&
    !debounceStore.isSubmitting
  );
});

const submitButtonText = computed(() => {
  if (debounceStore.isSubmitting) return "提交中...";

  const toolId = selectedToolId.value?.id;
  if (toolId && debounceStore.dailySubmitManager.checkDailySubmit(toolId)) {
    return "今日已提交";
  }
  return "提交评分";
});

const handleSubmitRating = async () => {
  try {
    await debounceStore.withSubmitLock(async () => {
      const tool = getToolFromStorage();
      selectedToolId.value = tool;

      if (!tool.id) {
        throw new Error("未找到工具ID");
      }

      const toolId = toNumber(tool.id);
      await scoreStore.evaluationTransmission(toolId);
      debounceStore.dailySubmitManager.recordSubmit(toolId);
      lastSubmitDate.value =
        debounceStore.dailySubmitManager.getLastSubmitDate(toolId);

      showMessage("评分提交成功，感谢您的参与！", "success");
    });
  } catch (error) {
    console.error("提交评分失败:", error);
    showMessage("提交失败，请稍后重试", "error");
  }
};

const inputSlider = (value: number) => {
  scrollbarRef.value?.setScrollTop(value);
};

const scroll = ({ scrollTop }: { scrollTop: number }) => {
  value.value = scrollTop;
};

const formatTooltip = (value: number) => `${value} px`;

const startSpeechRecognition = () => {
  if (!canSubmit.value) {
    showMessage("您今天已经提交过评分，请换个工具尝试或明天再来！", "warning");
    return;
  }

  if (!("webkitSpeechRecognition" in window)) {
    showMessage("您的浏览器不支持 Web Speech API，请使用 Chrome！", "warning");
    return;
  }

  const recognition = new (window as any).webkitSpeechRecognition();
  recognition.lang = "zh-CN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    console.log("语音识别开始...");
    showMessage("请开始说话...", "info");
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const result = event.results[0][0].transcript;
    console.log("识别结果:", result);
    if (result.length > MAX_COMMENT_LENGTH) {
      scoreStore.rate.comment = result.slice(0, MAX_COMMENT_LENGTH);
      showMessage("评论已超过最大长度限制，已自动截断", "warning");
    } else {
      scoreStore.rate.comment = result;
    }
  };

  recognition.onerror = (event: any) => {
    console.error("语音识别错误:", event.error);
    showMessage("语音识别失败，请重试", "error");
  };

  recognition.onend = () => {
    console.log("语音识别结束");
    showMessage("语音识别已完成", "success");
  };

  recognition.start();
};

onMounted(async () => {
  try {
    const tool = getToolFromStorage();
    selectedToolId.value = tool;

    if (tool.id) {
      const toolId = toNumber(tool.id);
      await scoreStore.ToolsDetailGet(toolId);
      lastSubmitDate.value =
        debounceStore.dailySubmitManager.getLastSubmitDate(toolId);
    }

    await nextTick();
    if (innerRef.value) {
      max.value = Math.max(0, innerRef.value.clientHeight - scrollHeight.value);
    }
  } catch (error) {
    console.error("初始化失败:", error);
    showMessage("初始化失败，请刷新页面重试", "error");
  }
});

watch(
  () => scoreStore.rate.comment?.length,
  (newLength) => {
    inputLess.value = (newLength ?? 0) < MIN_COMMENT_LENGTH;
  }
);

const submitRating = debounceStore.debounce(handleSubmitRating, DEBOUNCE_DELAY);
</script>

<template>
  <div class="main-container">
    <div class="main-score-container">
      <div class="title">
        <el-icon><Checked /></el-icon>评分模块
      </div>
      <div class="content">
        <div class="rating-container">
          <el-popover
            v-for="(standard, index) in scoreStore.rateStandards"
            :key="index"
            :width="400"
            placement="right"
            trigger="hover"
          >
            <template #reference>
              <div class="rating-item">
                <span class="rating-title">{{ standard.name }}：</span>
                <el-rate
                  v-model="standard.score"
                  :max="RATE_MAX"
                  allow-half
                  :colors="RATE_COLORS"
                />
                <span class="score-label">{{ standard.score }} 分</span>
              </div>
            </template>
            <template #default>
              <div class="criteria-container">
                <div class="criteria-header">评分标准</div>
                <ul class="criteria-list">
                  <li v-for="(criteria, idx) in standard.criteria" :key="idx">
                    {{ criteria }}
                  </li>
                </ul>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="comment">
          <el-input
            type="textarea"
            placeholder="留下您的宝贵评价，帮助其他用户了解此工具（每个工具每日仅限一次评价）..."
            class="comment-input"
            :autosize="{ minRows: 3, maxRows: 6 }"
            maxlength="500"
            v-model="scoreStore.rate.comment"
            :disabled="!canSubmit"
          />
          <p v-if="inputLess" class="input-less">
            输入的字符数少于{{ MIN_COMMENT_LENGTH }}个!
          </p>
        </div>
        <div class="submit-wrapper">
          <div class="submit-buttons">
            <el-icon @click="startSpeechRecognition" class="mic-icon"
              ><Microphone
            /></el-icon>
            <el-button
              type="primary"
              @click="submitRating"
              class="submit-btn"
              :disabled="!canSubmit"
              :loading="debounceStore.isSubmitting"
              ref="submitRef"
            >
              {{ submitButtonText }}
            </el-button>
          </div>
          <div v-if="lastSubmitDate" class="submit-info">
            上次提交日期: {{ lastSubmitDate }}
          </div>
        </div>
      </div>
    </div>
    <div class="main-upload-container">
      <div class="score-title title">
        <el-icon><ChatDotRound /></el-icon>用户评价
      </div>
      <el-scrollbar
        class="tool-details"
        always
        @scroll="scroll"
        ref="scrollbarRef"
        :height="`${scrollHeight}px`"
      >
        <div ref="innerRef">
          <div
            class="score-content"
            v-for="score in scoreStore.toolsDetail.rates"
            :key="score.id"
          >
            <div class="score-content-item">
              <div class="score-header">
                <div class="score-content-item-title">
                  <el-avatar :size="26" class="user-avatar">
                    {{ score.user.charAt(0) }}
                  </el-avatar>
                  <span class="user-nickname">@{{ score.user }}</span>
                </div>
                <div class="score-content-item-score">
                  <span>评分：</span>{{ score.rating }} ⭐
                </div>
              </div>
              <div class="score-content-item-content">
                {{ score.comment }}
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <el-slider
        v-if="max > 0"
        v-model="value"
        :max="max"
        :format-tooltip="formatTooltip"
        @input="inputSlider"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
$border-radius: 12px;
$box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
$hover-box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
$transition-duration: 0.3s;
$primary-color: #409eff;
$warning-color: #ff9800;
$text-secondary: #909399;

@mixin flex-center {
  display: flex;
  align-items: center;
}

@mixin hover-effect {
  transition: all $transition-duration ease;
  &:hover {
    box-shadow: $hover-box-shadow;
  }
}

@mixin card-style {
  background: var(--background-color);
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-container {
  margin: 20px 30px 10px;
  padding: 15px 20px;
  display: flex;
  gap: 30px;
}

.main-score-container {
  flex: 0.6;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 290px;

  .content {
    width: 100%;
  }
}

.title {
  @include flex-center;
  gap: 8px;
  font-style: italic;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eaeaea;
  width: 100%;

  .el-icon {
    font-size: $xxlarge-font-size;
    color: var(--text-color);
  }
}

.rating-container {
  width: 100%;
  padding: 5px 0 5px 5px;
  @include card-style;
  margin-bottom: 20px;
  @include hover-effect;

  .rating-item {
    @include flex-center;
    gap: 12px;
    margin: 6px 0;
    padding: 6px 8px;
    border-bottom: 1px dashed #eaeaea;

    &:last-child {
      border-bottom: none;
    }

    .rating-title {
      min-width: 80px;
      font-weight: 500;
      font-size: $medium-font-size;
      color: var(--text-color);
    }

    .score-label {
      font-size: $medium-font-size;
      color: $primary-color;
      font-weight: 500;
    }
  }
}

.criteria-container {
  color: var(--text-color);
  background-color: var(--background-color);
}

.criteria-header {
  font-weight: bold;
  margin-bottom: 10px;
  color: $primary-color;
  border-bottom: 1px solid #eaeaea;
}

.criteria-list {
  width: 100%;
  padding-left: 20px;
  font-size: $small-font-size;

  li {
    margin-bottom: 8px;
    text-align: left;
    line-height: 1.4;
  }
}

.comment {
  margin: 20px 0;
  width: 100%;

  .comment-input {
    width: 100%;

    ::v-deep(.el-textarea__inner) {
      border-radius: 8px;
      padding: 12px;
      transition: all $transition-duration ease;

      &:focus {
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
      }
    }
  }

  .input-less {
    font-size: 12px;
    padding: 4px 0 0 2px;
    margin-bottom: -6px;
    color: $warning-color;
  }
}

.submit-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 15px;

  .el-icon {
    font-size: 22px;
    color: $primary-color;
    margin: 5px;
    cursor: pointer;
  }

  .submit-btn {
    padding: 10px 24px;
    font-size: 15px;
    border-radius: 8px;
    transition: all $transition-duration ease;

    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($primary-color, 0.3);
    }
  }

  .submit-info {
    margin-top: 10px;
    font-size: 13px;
    color: $text-secondary;
  }
}

.main-upload-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .score-title {
    font-size: 20px;
  }

  .tool-details {
    width: 100%;
    padding: 10px 20px;
    @include card-style;

    .score-content {
      white-space: wrap;
      margin-bottom: 10px;
      background-color: var(--background-color);
      padding: 8px 6px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
      @include hover-effect;

      &:last-child {
        margin-bottom: 0;

        &::after {
          content: "没有更多评论了~";
          margin: 0 auto;
          display: flex;
          align-items: center;
          padding-top: 10px;
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  .score-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .score-content-item-title {
      @include flex-center;
      gap: 8px;
      font-weight: 600;
      color: var(--text-color);

      .user-avatar {
        background-color: $primary-color;
        color: white;
        transform: scale(1.1);
        font-size: 12px;
      }

      .user-nickname {
        font-size: 12px;
        margin-top: -15px;
      }
    }

    .score-content-item-score {
      font-size: 14px;
      color: $warning-color;
      font-weight: bold;
      margin-top: -15px;

      span {
        color: $text-secondary;
        font-weight: normal;
      }
    }
  }

  .score-content-item-content {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    color: var(--text-color);
    padding: 0 30px;
    margin-top: -10px;
    margin-left: 5px;
    white-space: wrap;
    width: 100%;
  }
}

.el-popper {
  background-color: var(--background-color) !important;
}

:deep(.el-popover.el-popper) {
  max-width: none;
  width: 300px !important;
  border-radius: 8px;
  background-color: var(--background-color) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
</style>

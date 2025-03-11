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
            placement="right"
            :width="400"
            trigger="hover"
          >
            <template #reference>
              <div class="rating-item">
                <span class="rating-title">{{ standard.name }}：</span>
                <el-rate
                  v-model="standard.score"
                  :max="5"
                  allow-half
                  :colors="['#C6D1DE', '#409EFF', '#67C23A']"
                />
                <span class="score-label">{{ standard.score }} 分</span>
              </div>
            </template>
            <template #default class="criteria-container">
              <div class="criteria-header">评分标准</div>
              <ul class="criteria-list">
                <li v-for="(criteria, idx) in standard.criteria" :key="idx">
                  {{ criteria }}
                </li>
              </ul>
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
          <p v-if="inputLess" class="input-less">输入的字符数少于10个!</p>
        </div>
        <div class="submit-wrapper">
          <div style="display: flex">
            <el-icon @click="startSpeechRecognition"><Microphone /></el-icon>
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
                  <el-avatar :size="26" class="user-avatar">{{
                    score.user.charAt(0)
                  }}</el-avatar>
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
        v-model="value"
        :max="max"
        :format-tooltip="formatTooltip"
        @input="inputSlider"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import { Checked, ChatDotRound, Microphone } from "@element-plus/icons-vue";
import { useScoreStore } from "@/stores/useScoreStore";
import { useDebounceStore } from "@/stores/useDebounceStore";
import type { ScrollbarInstance } from "element-plus";
type Arrayable<T> = T | T[];

const max = ref(0);
const value = ref(0);
const comment = ref<string>();
const inputLess = ref(false);
const scrollHeight = ref<number>(390);
// const fixScrollHeightForHorizon = ref<number>(0);
const innerRef = ref<HTMLDivElement>();
const scrollbarRef = ref<ScrollbarInstance>();
const submitRef = ref();
const scoreStore = useScoreStore();
const debounceStore = useDebounceStore();
const selectedToolId = ref<any>({});
const lastSubmitDate = ref("");

const commentProcess = (Value: () => string) => {
  comment.value = Value();
  let len = Value().length;
  if (len > 10) scoreStore.rate.comment = comment.value;
  else inputLess.value = true;
};

// 计算是否可以提交
const canSubmit = computed(() => {
  if (!selectedToolId.value?.id) return false;
  return (
    !debounceStore.dailySubmitManager.checkDailySubmit(
      selectedToolId.value.id
    ) && !debounceStore.isSubmitting
  );
});

// 提交按钮文本
const submitButtonText = computed(() => {
  if (debounceStore.isSubmitting) return "提交中...";
  if (
    selectedToolId.value?.id &&
    debounceStore.dailySubmitManager.checkDailySubmit(selectedToolId.value.id)
  ) {
    return "今日已提交";
  }
  return "提交评分";
});

// 处理提交评分
const handleSubmitRating = async () => {
  await debounceStore.withSubmitLock(async () => {
    selectedToolId.value = JSON.parse(
      localStorage.getItem("selectedTool") as any
    );
    await scoreStore.evaluationTransmission(selectedToolId.value.id);
    // 记录提交时间
    debounceStore.dailySubmitManager.recordSubmit(selectedToolId.value.id);
    lastSubmitDate.value = debounceStore.dailySubmitManager.getLastSubmitDate(
      selectedToolId.value.id
    );
    ElMessage({
      message: "评分提交成功，感谢您的参与！",
      type: "success",
    });
  });
};

// 使用防抖包装提交函数
const submitRating = debounceStore.debounce(handleSubmitRating, 500);

onMounted(() => {
  selectedToolId.value = JSON.parse(
    localStorage.getItem("selectedTool") as any
  );
  scoreStore.ToolsDetailGet(selectedToolId.value.id);
  // 获取上次提交日期
  if (selectedToolId.value?.id) {
    lastSubmitDate.value = debounceStore.dailySubmitManager.getLastSubmitDate(
      selectedToolId.value.id
    );
  }
  setTimeout(() => {
    nextTick(() => {
      if (innerRef.value) {
        max.value = innerRef.value.clientHeight - scrollHeight.value;
      } else {
        console.warn("innerRef.clientHeight is 0 !");
      }
    });
  }, 1000);
});
watch(
  () => scoreStore.rate.comment?.length,
  (newLength) => {
    inputLess.value = (newLength ?? 0) < 10;
  }
);

const inputSlider = (value: Arrayable<number>) => {
  scrollbarRef.value!.setScrollTop(value as number);
};
const scroll = ({ scrollTop }: { scrollTop: number }) => {
  value.value = scrollTop;
};
const formatTooltip = (value: number) => `${value} px`;

// 语音识别
const startSpeechRecognition = () => {
  if (!canSubmit.value) {
    ElMessage({
      message: "您今天已经提交过评分，请换个工具尝试或明天再来！",
      type: "warning",
    });
    return;
  }

  if (!("webkitSpeechRecognition" in window)) {
    alert("您的浏览器不支持 Web Speech API，请使用 Chrome！");
    return;
  }

  const recognition = new (window as any).webkitSpeechRecognition(); // 兼容 Chrome
  recognition.lang = "zh-CN"; // 设定语言
  recognition.continuous = false; // 语音识别结束后自动停止
  recognition.interimResults = false; // 仅返回最终结果

  recognition.onstart = () => console.log("语音识别开始...");
  recognition.onresult = (event: any) => {
    const result = event.results[0][0].transcript;
    console.log("识别结果:", result);
    scoreStore.rate.comment = result ?? "未访问到声音";
  };
  recognition.onerror = (event: any) =>
    console.error("语音识别错误:", event.error);
  recognition.onend = () => console.log("语音识别结束");

  recognition.start();
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-container {
  margin: 20px 30px 10px 30px;
  padding: 15px 20px;
  display: flex;
  flex-direction: row;
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
  display: flex;
  align-items: center;
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
  background: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  .rating-item {
    display: flex;
    align-items: center;
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
      color: #409eff;
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
  color: #409eff;
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
      transition: all 0.3s ease;

      &:focus {
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }
  }

  .input-less {
    font-size: 12px;
    padding: 4px 0 0 2px;
    margin-bottom: -6px;
    color: rgb(255, 140, 0);
  }
}

.submit-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 15px;

  .el-icon {
    font-size: 22px;
    color: #409eff;
    margin: 5px;
    cursor: pointer;
  }

  .submit-btn {
    padding: 10px 24px;
    font-size: 15px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }
  }

  .submit-info {
    margin-top: 10px;
    font-size: 13px;
    color: #909399;
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
    background-color: var(--background-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .score-content {
      white-space: wrap;
      margin-bottom: 10px;
      background-color: var(--background-color);
      padding: 8px 6px;
      border-radius: 10px;
      // border: 1px #ccc solid;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      &:last-child {
        margin-bottom: 0;
      }

      &:last-child::after {
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

  .score-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .score-content-item-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--text-color);

      .user-avatar {
        background-color: #409eff;
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
      color: #ff9800;
      font-weight: bold;
      margin-top: -15px;

      span {
        color: #909399;
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
    // white-space: pre-wrap; //保留空白符
    // word-break: break-word; //允许拆分单词换行
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

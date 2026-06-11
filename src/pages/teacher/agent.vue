<template>
  <div class="grading-page">
    <section class="overview">
      <div>
        <p class="eyebrow">AI Grading Center</p>
        <h2>AI 批改中心</h2>
        <p class="summary">集中跟踪单份/批量作业批改、轮询进度、超时兜底和异常任务恢复。</p>
      </div>
      <el-button type="primary" @click="$router.push('/home/teacherAssignments')">进入作业管理</el-button>
    </section>

    <section class="metrics">
      <div class="metric">
        <span>运行中任务</span>
        <strong>{{ runningCount }}</strong>
      </div>
      <div class="metric">
        <span>批量任务状态</span>
        <strong>{{ batchStatus }}</strong>
      </div>
      <div class="metric">
        <span>轮询策略</span>
        <strong>3s / 100 次</strong>
      </div>
      <div class="metric">
        <span>异常兜底</span>
        <strong>重试 + 超时</strong>
      </div>
    </section>

    <section class="pipeline">
      <h3>处理链路</h3>
      <div class="steps">
        <div v-for="item in steps" :key="item.title" class="step">
          <el-icon><component :is="item.icon" /></el-icon>
          <div>
            <strong>{{ item.title }}</strong>
            <span>{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { UploadFilled, Cpu, DataAnalysis, Warning } from "@element-plus/icons-vue";
import { useAiGradingStore } from "@/stores/useAiGradingStore";

const aiGradingStore = useAiGradingStore();

const runningCount = computed(() => {
  return Object.values(aiGradingStore.singleTasks).filter((task) => {
    return task.status === "pending" || task.status === "running";
  }).length;
});

const batchStatus = computed(() => aiGradingStore.batchTask?.message || "暂无批量任务");

const steps = [
  { title: "提交任务", desc: "单个或批量提交学生作业记录", icon: UploadFilled },
  { title: "AI 批改", desc: "后端异步处理长耗时批改任务", icon: Cpu },
  { title: "状态同步", desc: "轮询刷新分数、进度和完成状态", icon: DataAnalysis },
  { title: "异常兜底", desc: "失败重试、超时提醒、刷新恢复", icon: Warning },
];
</script>

<style scoped lang="scss">
.grading-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--background-color);
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--el-color-primary);
  font-size: 13px;
  font-weight: 600;
}

h2,
h3,
.summary {
  margin: 0;
}

.summary {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--background-color);
}

.metric span,
.step span {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.metric strong {
  font-size: 22px;
}

.pipeline {
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--background-color);
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.step {
  display: flex;
  gap: 12px;
  min-height: 88px;
  padding: 16px;
  border-radius: 8px;
  background: var(--background-color);
}

.step .el-icon {
  flex: 0 0 auto;
  color: var(--el-color-primary);
  font-size: 22px;
}

.step div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>

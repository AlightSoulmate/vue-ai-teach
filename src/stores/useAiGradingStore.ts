import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { createTaskState, parseProgress, pollTask, type TaskState } from "@/utils/asyncTask";
import { useTeacherStore } from "@/stores/useTeacherStore";

interface ReviewResult {
  submit_record_id?: number;
  score?: number;
  message?: string;
  result?: ReviewResult[];
  status?: number;
}

export const useAiGradingStore = defineStore("aiGrading", () => {
  const teacherStore = useTeacherStore();
  const singleTasks = reactive<Record<number, TaskState<ReviewResult>>>({});
  const batchTask = ref<TaskState<ReviewResult> | null>(null);

  const isBatchRunning = computed(() => {
    return batchTask.value?.status === "pending" || batchTask.value?.status === "running";
  });

  const ensureSingleTask = (submitRecordId: number) => {
    if (!singleTasks[submitRecordId]) {
      singleTasks[submitRecordId] = createTaskState(String(submitRecordId));
    }
    return singleTasks[submitRecordId];
  };

  const isDone = (result: ReviewResult) => {
    return result?.score !== undefined && result?.score !== null;
  };

  const submitSingle = async (submitRecordId: number) => {
    const task = ensureSingleTask(submitRecordId);
    if (task.status === "pending" || task.status === "running") {
      ElMessage.warning("该作业正在批改中，请勿重复提交");
      return null;
    }

    task.status = "pending";
    task.progress = 5;
    task.message = "正在提交 AI 批改任务";
    task.startedAt = Date.now();

    try {
      const missionUid = await teacherStore.submitToAIReview(submitRecordId);
      if (!missionUid) throw new Error("AI 批改任务创建失败");

      task.status = "running";
      task.progress = 20;
      task.message = "AI 正在批改";

      const result = await pollTask<ReviewResult>({
        request: () => teacherStore.pollReviewStatus(missionUid),
        isDone,
        maxAttempts: 80,
        intervalMs: 3000,
        onTick: (_, attempt) => {
          task.progress = Math.min(95, 20 + attempt);
          task.updatedAt = Date.now();
        },
      });

      task.status = "success";
      task.progress = 100;
      task.message = "批改完成";
      task.result = result;
      return result;
    } catch (error: any) {
      const message = error?.message || "批改失败";
      task.status = error?.message?.includes("超时") ? "timeout" : "failed";
      task.error = message;
      task.message = message;
      ElMessage.error(message);
      return null;
    }
  };

  const submitBatch = async (submitRecordIds: number[]) => {
    if (!submitRecordIds.length) {
      ElMessage.warning("请先选择要批改的学生");
      return null;
    }

    batchTask.value = createTaskState<ReviewResult>(`batch-${Date.now()}`, "正在提交批量任务");
    batchTask.value.status = "pending";
    batchTask.value.startedAt = Date.now();

    try {
      const missionUid = await teacherStore.submitBatchToAIReview(submitRecordIds);
      if (!missionUid) throw new Error("批量 AI 任务创建失败");

      batchTask.value.status = "running";
      batchTask.value.message = `批改进度 0/${submitRecordIds.length}`;

      const result = await pollTask<ReviewResult>({
        request: () => teacherStore.pollBatchReviewStatus(missionUid),
        isDone: (resp) => {
          const progress = parseProgress(resp?.message);
          return Boolean(progress && progress.done >= progress.total);
        },
        maxAttempts: 100,
        intervalMs: 3000,
        onTick: (resp) => {
          const progress = parseProgress(resp?.message);
          if (!batchTask.value || !progress) return;
          batchTask.value.progress = Math.round((progress.done / Math.max(progress.total, 1)) * 100);
          batchTask.value.message = `批改进度 ${progress.done}/${progress.total}`;
          batchTask.value.result = resp;
          batchTask.value.updatedAt = Date.now();
        },
      });

      if (batchTask.value) {
        batchTask.value.status = "success";
        batchTask.value.progress = 100;
        batchTask.value.message = "批量批改完成";
        batchTask.value.result = result;
      }
      return result;
    } catch (error: any) {
      if (batchTask.value) {
        const message = error?.message || "批量批改失败";
        batchTask.value.status = error?.message?.includes("超时") ? "timeout" : "failed";
        batchTask.value.error = message;
        batchTask.value.message = message;
      }
      ElMessage.error(error?.message || "批量批改失败");
      return null;
    }
  };

  const resetBatch = () => {
    batchTask.value = null;
  };

  return {
    singleTasks,
    batchTask,
    isBatchRunning,
    submitSingle,
    submitBatch,
    resetBatch,
  };
});

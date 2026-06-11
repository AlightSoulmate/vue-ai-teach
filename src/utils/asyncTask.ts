export type TaskStatus = "idle" | "pending" | "running" | "success" | "failed" | "timeout";

export interface PollingOptions<T> {
  request: () => Promise<T>;
  isDone: (result: T) => boolean;
  onTick?: (result: T, attempt: number) => void;
  intervalMs?: number;
  maxAttempts?: number;
}

export interface TaskState<T = unknown> {
  id: string;
  status: TaskStatus;
  progress: number;
  message: string;
  result?: T;
  error?: string;
  startedAt?: number;
  updatedAt?: number;
}

export function createTaskState<T = unknown>(id: string, message = "等待提交"): TaskState<T> {
  return {
    id,
    status: "idle",
    progress: 0,
    message,
  };
}

export function parseProgress(message = ""): { done: number; total: number } | null {
  const match = message.match(/(?:进度)?\s*(\d+)\s*\/\s*(\d+)/);
  if (!match) return null;
  return {
    done: Number(match[1]),
    total: Number(match[2]),
  };
}

export async function pollTask<T>(options: PollingOptions<T>): Promise<T> {
  const intervalMs = options.intervalMs ?? 3000;
  const maxAttempts = options.maxAttempts ?? 60;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await options.request();
    options.onTick?.(result, attempt);

    if (options.isDone(result)) {
      return result;
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => window.setTimeout(resolve, intervalMs));
    }
  }

  throw new Error("任务处理超时，请稍后刷新查看结果");
}

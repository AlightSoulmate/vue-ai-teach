export interface FileChunk {
  index: number;
  start: number;
  end: number;
  blob: Blob;
}

export interface UploadProgress {
  uploadedChunks: number;
  totalChunks: number;
  percentage: number;
}

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
}

export const DEFAULT_CHUNK_SIZE = 2 * 1024 * 1024;

export function splitFileIntoChunks(file: File, chunkSize = DEFAULT_CHUNK_SIZE): FileChunk[] {
  if (chunkSize <= 0) {
    throw new Error("chunkSize 必须大于 0");
  }

  const chunks: FileChunk[] = [];
  let start = 0;
  let index = 1;

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    chunks.push({
      index,
      start,
      end,
      blob: file.slice(start, end),
    });
    start = end;
    index += 1;
  }

  return chunks;
}

export async function calculateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export function aggregateUploadProgress(uploadedChunks: number, totalChunks: number): UploadProgress {
  const safeTotal = Math.max(totalChunks, 1);
  return {
    uploadedChunks,
    totalChunks,
    percentage: Math.min(100, Math.round((uploadedChunks / safeTotal) * 100)),
  };
}

export async function withRetry<T>(
  task: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const retries = options.retries ?? 2;
  const delayMs = options.delayMs ?? 600;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => window.setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

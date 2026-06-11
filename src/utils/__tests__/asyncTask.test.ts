import { describe, expect, it } from "vitest";
import { parseProgress } from "@/utils/asyncTask";

describe("asyncTask", () => {
  it("parses backend progress text", () => {
    expect(parseProgress("本次轮询查找到2个已经完成的任务,进度12/40")).toEqual({
      done: 12,
      total: 40,
    });
  });

  it("returns null for text without progress", () => {
    expect(parseProgress("正在处理")).toBeNull();
  });
});

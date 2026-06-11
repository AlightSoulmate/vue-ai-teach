import { describe, expect, it } from "vitest";
import { aggregateUploadProgress, splitFileIntoChunks } from "@/utils/fileUpload";

describe("fileUpload", () => {
  it("splits file by chunk size", () => {
    const file = new File(["123456789"], "demo.txt");
    const chunks = splitFileIntoChunks(file, 4);

    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toMatchObject({ index: 1, start: 0, end: 4 });
    expect(chunks[2]).toMatchObject({ index: 3, start: 8, end: 9 });
  });

  it("aggregates upload progress safely", () => {
    expect(aggregateUploadProgress(2, 4).percentage).toBe(50);
    expect(aggregateUploadProgress(2, 0).percentage).toBe(100);
  });
});

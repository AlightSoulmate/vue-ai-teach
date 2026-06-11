import { describe, expect, it } from "vitest";
import { calculateWeightedScore } from "@/utils/scoring";

describe("scoring", () => {
  it("calculates weighted score with one decimal", () => {
    expect(
      calculateWeightedScore([
        { score: 9, percent: 0.3 },
        { score: 8, percent: 0.25 },
        { score: 7, percent: 0.25 },
        { score: 10, percent: 0.1 },
        { score: 6, percent: 0.1 },
      ]),
    ).toBe(8.1);
  });
});

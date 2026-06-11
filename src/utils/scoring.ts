export interface WeightedScoreItem {
  score: number;
  percent?: number;
}

export function calculateWeightedScore(items: WeightedScoreItem[]): number {
  const total = items.reduce((sum, item) => sum + item.score * (item.percent ?? 0), 0);
  return Number((total + 1e-8).toFixed(1));
}

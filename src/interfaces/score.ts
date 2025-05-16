// @/interfaces/score.ts

export interface Eval {
  username: string;
  tool: string;
  category: string;
  averageScore: number;
  comment: string;
}
export interface ReportHistory {
  id: number;
  fileName: string;
  uploadTime: string;
  toolName: string;
  evaluationResult: string;
  downloadUrl: string;
}
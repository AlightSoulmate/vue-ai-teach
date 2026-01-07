// 作业相关接口定义

// 作业状态枚举
export enum AssignmentStatus {
  DRAFT = 'draft',        // 草稿
  PUBLISHED = 'published', // 已发布
  CLOSED = 'closed'       // 已关闭
}

// 作业类型枚举
export enum AssignmentType {
  UPLOAD = 'upload',      // 文件上传
  TEXT = 'text',          // 文本作业
  EVALUATION = 'evaluation' // 工具评价
}

// 作业基本信息
export interface Assignment {
  id: number;
  title: string;                    // 作业标题
  description: string;              // 作业描述
  type: AssignmentType;            // 作业类型
  status: AssignmentStatus;         // 作业状态
  courseId: number;                // 所属课程ID
  courseName: string;              // 课程名称
  classId: number;                // 所属班级ID
  className: string;               // 班级名称
  teacherId: number;               // 发布教师ID
  teacherName: string;             // 教师姓名
  createdAt: string;               // 创建时间
  updatedAt: string;               // 更新时间
  publishAt?: string;              // 发布时间
  dueDate?: string;                // 截止时间
  maxScore: number;                // 满分
  requirements: string;            // 作业要求
  attachments?: AssignmentAttachment[]; // 附件列表
}

// 作业附件
export interface AssignmentAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadTime: string;
}

// 学生作业提交记录
export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName: string;
  studentUsername: string;
  submitTime: string;
  content: string;                 // 提交内容
  attachments: SubmissionAttachment[];
  score?: number;                 // 得分
  feedback?: string;              // 教师反馈
  status: SubmissionStatus;        // 提交状态
}

// 提交附件
export interface SubmissionAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadTime: string;
}

// 提交状态枚举
export enum SubmissionStatus {
  SUBMITTED = 'submitted',        // 已提交
  GRADED = 'graded',              // 已评分
  LATE = 'late'                   // 迟交
}

// 创建作业请求
export interface CreateAssignmentRequest {
  title: string;
  description: string;
  type: AssignmentType;
  courseId: number;
  classId: number;
  dueDate?: string;
  maxScore: number;
  requirements: string;
  attachments?: File[];
}

// 更新作业请求
export interface UpdateAssignmentRequest {
  id: number;
  title?: string;
  description?: string;
  type?: AssignmentType;
  dueDate?: string;
  maxScore?: number;
  requirements?: string;
  status?: AssignmentStatus;
}

// 作业评分请求
export interface GradeAssignmentRequest {
  submissionId: number;
  score: number;
  feedback: string;
}

// 作业统计信息
export interface AssignmentStats {
  totalAssignments: number;
  publishedAssignments: number;
  draftAssignments: number;
  closedAssignments: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
}


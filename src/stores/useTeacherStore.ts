// @/stores/useTeacherlStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { 
  getAllClasses, 
  getAllCourses, 
  addCourse, 
  updateCourse, 
  getHomeworkStudents, 
  getHistoryByClass,
  getHomeworks,
  createAssignment,
  submitHomeworkForAIReview,
  pollHomeworkReview,
  submitBatchHomeworkForAIReview,
  pollBatchHomeworkReview,
  submitHomeworkStandardFile,
} from "@/services";
import { useAuthStore } from "./useAuthStore";
import { ElMessage } from "element-plus";
import router from "@/router";
import { tr } from "element-plus/es/locales.mjs";

export const useTeacherStore = defineStore("teacherCourse", () => {
  const authStore = useAuthStore();
  const classList = ref<any[]>([]);
  const fetchClassList = async () => {
    const resp = await getAllClasses();
    classList.value = resp;
    return resp;
  };
  interface Course {
    id: number;
    course: string;
    description: string;
    // cno: string[];
    cno: string;
  }
  const courseList = ref<Course[]>([]);
  const fetchCourseList = async () => {
    const token = authStore.user.token || "";
    if (!token) {
      ElMessage.error("Token失效，请重新登录");
      localStorage.removeItem("user");
      router.push("/form");
      return;
    }
    const resp = await getAllCourses(token);
    courseList.value = resp;
    console.log("课程列表", courseList.value);
    return resp;
  };

  const createCourse = async (
    course: string,
    description: string,
    cno: string
  ) => {
    const token = authStore.user.token || "";
    if (!token) {
      ElMessage.error("Token失效，请重新登录");
      localStorage.removeItem("user");
      router.push("/form");
      return;
    }
    const resp = await addCourse(token, course, description, cno);
    return resp;
  };

  // 3.5 update course
  const changeCourse = async (
    course_id: number,
    course: string,
    description: string,
    cno: string
  ) => {
    const token = authStore.user.token || "";
    if (!token) {
      ElMessage.error("Token失效，请重新登录");
      localStorage.removeItem("user");
      router.push("/form");
      return;
    }
    const resp = await updateCourse(token, course_id, course, description, cno);
    return resp;
  }

  const rates = ref<any[]>([]);
  // 3.12 获得该课程班级学生的所有历史评价记录
  const fetchRateHistory = async (course_id: number): Promise<any> => {
    // const token = authStore.user.token || "";
    // if (!token) {
    //   ElMessage.error("Token失效，请重新登录");
    //   localStorage.removeItem("user");
    //   router.push("/form");
    //   return;
    // }
    // const resp = await getRateRecords(token, course_id);
    // if (resp?.rates) {
    //   rates.value = resp.rates;
    //   await formatHistoryRates();
    // } else {
    //   ElMessage.error("获取历史评分记录失败");
    // }
    // return resp;
  };
  const formatHistoryRates = async () => {
    // try {
    //   await Promise.all(
    //     rates.value.map(async (rate) => {
    //       rate.rate_time = rate.rate_time.replace("T", " ");
    //       const toolDetail = await getDetail(Number(rate.tool_id)) as { name?: string; category?: string };
    //       rate.tool_name = toolDetail.name || "未知工具";
    //       rate.tool_category = toolDetail.category || "未知类别";
    //       return {
    //         ...rate
    //       };
    //     })
    //   );
    // } catch (error) {
    //   ElMessage.error("格式化历史评分记录失败");
    // }
  };
  // 1.14 获取班级内学生的评价和报告数量
  const fetchHistoryByClass = async (cno1: number) => {
    const token = authStore.user.token || "";
    if (!token) {
      ElMessage.error("Token失效，请重新登录");
      localStorage.removeItem("user");
      router.push("/form");
      return;
    }
    try {
      const resp = await getHistoryByClass(token, cno1);
      if (resp.message === "查询成功") {
        console.log("班级内学生的评价和报告数量", resp.users);
        rates.value = resp.users;
      }
    } catch (error) {
      ElMessage.error("获取成功");
    }
  }
  // 筛选班级id
  const filterClassId = (className: string) => {
    console.log("filterClassName", className);
    let thisClass = classList.value.filter((item) => item.name === className);
    let ID = thisClass[0]?.id || 100;
    return ID;
  };

  // ================= 作业管理 =================
  interface AssignmentItem {
    id: number;
    title: string;
    description: string;
    type: string;
    status: string;
    courseId: number;
    courseName?: string;
    classId: number;
    className?: string;
    dueDate?: string;
    maxScore: number;
    requirements: string;
    createdAt?: string;
    updatedAt?: string;
  }

  const assignments = ref<AssignmentItem[]>([]);
  const assignmentStats = ref<any>({});

  // const fetchAssignments = async () => {
  //   const token = authStore.user.token || "";
  //   if (!token) {
  //     ElMessage.error("Token失效，请重新登录");
  //     localStorage.removeItem("user");
  //     router.push("/form");
  //     return;
  //   }
  //   const resp = await getTeacherAssignments(token);
  //   // 后端返回结构兼容处理
  //   assignments.value = resp.assignments || resp || [];
  //   return assignments.value;
  // };

  // const fetchAssignmentStats = async () => {
  //   const token = authStore.user.token || "";
  //   if (!token) {
  //     ElMessage.error("Token失效，请重新登录");
  //     localStorage.removeItem("user");
  //     router.push("/form");
  //     return;
  //   }
  //   const resp = await getAssignmentStats(token);
  //   // 如果后端暂无实现，前端基于 assignments 计算统计
  //   if (!resp || Object.keys(resp).length === 0) {
  //     const list = assignments.value || [];
  //     const totalAssignments = list.length;
  //     const publishedAssignments = list.filter((a: any) => String(a.status).includes("发布")).length;
  //     const draftAssignments = list.filter((a: any) => String(a.status).includes("草稿")).length;
  //     const closedAssignments = list.filter((a: any) => String(a.status).includes("关闭") || String(a.status).includes("已截止")).length;
  //     const totalSubmissions = list.reduce((sum: number, a: any) => sum + (Number((a as any).submissionCount) || 0), 0);
  //     const gradedSubmissions = list.reduce((sum: number, a: any) => sum + (Number((a as any).gradedCount) || 0), 0);
  //     assignmentStats.value = {
  //       totalAssignments,
  //       publishedAssignments,
  //       draftAssignments,
  //       closedAssignments,
  //       totalSubmissions,
  //       gradedSubmissions,
  //     };
  //   } else {
  //     assignmentStats.value = resp;
  //   }
  //   return assignmentStats.value;
  // };

  // 发布作业（对齐文档 5.1）
  const publishAssignment = async (
    courseId: number,
    title: string,
    description: string,
    pushDate: string,
    endDate: string,
    // className?: string,
    file : File
  ) => {
    const token = authStore.user.token || "";
    if (!token) {
      ElMessage.error("Token失效，请重新登录");
      localStorage.removeItem("user");
      router.push("/form");
      return;
    }
    const formData = new FormData();
    const info = {
      'course_id':courseId,
      'homework':{
        'title': title,
        'description': description,
        'push_date': pushDate,
        'end_date': endDate
      }
    }
    formData.append("homework_data", JSON.stringify(info));
    formData.append("standard_file", file);
    console.log(file)
    const resp = await createAssignment(formData,token);
    if(resp.ok){
      ElMessage.success("作业发布成功");
    }
    // 发布成功后刷新作业列表
    await fetchHomeworks(courseId);
  };

  // 查看已发布作业
  const homeworks= ref<any[]>([]);
const fetchHomeworks = async(courseId?: number)=>{
  const token = authStore.user.token||"";
  if(!token){
    ElMessage.error("请重新登录");
    localStorage.removeItem("user");
    router.push("/form");
    return;
  }
  try{
    const resp = await getHomeworks(token, courseId);
    if(resp.message === "查询成功"){
      homeworks.value=resp.homeworks||[];
      return homeworks.value;
    } 
  } catch (error){
    ElMessage.error("获取作业列表失败");
  }
  };
  // 查看具体作业提交情况
const homeworkStudents = ref<any[]>([]);
const fetchHomeworkStudents = async (homeworkId: number) => {
  const token = authStore.user.token || "";
  if (!token) {
    ElMessage.error("Token失效，请重新登录");
    localStorage.removeItem("user");
    router.push("/form");
    return;
  }
  try{
    const resp = await getHomeworkStudents(token, homeworkId);
    if(resp.message === "查询成功"){
      homeworkStudents.value = resp.students || [];
      return homeworkStudents.value;
    }
  }catch(error){
    ElMessage.error("获取作业提交情况失败");
  }
}

// 5.6 提交作业到 AI 批改
const submitToAIReview = async (submit_record_id: number): Promise<string | null> => {
  const token = authStore.user.token || "";
  if (!token) {
    ElMessage.error("Token失效，请重新登录");
    localStorage.removeItem("user");
    router.push("/form");
    return null;
  }
  
  try {
    const resp = await submitHomeworkForAIReview(token, submit_record_id);
    const message: string = resp?.message || "";
    if ((message && message.includes("已提交至ai")) || resp?.uuid) {
      ElMessage.success("作业已提交至 AI 批改");
      return resp.uuid;
    }
    return null;
  } catch (error) {
    ElMessage.error("提交失败");
    return null;
  }
};

// 5.7 轮询作业批改情况
const pollReviewStatus = async (mission_uid: string): Promise<any> => {
  const token = authStore.user.token || "";
  if (!token) {
    ElMessage.error("Token失效，请重新登录");
    localStorage.removeItem("user");
    router.push("/form");
    return null;
  }
  
  try {
    const resp = await pollHomeworkReview(token, mission_uid);
    return resp;
  } catch (error) {
    return null;
  }
};

// 5.8 批量提交作业到 AI 批改
const submitBatchToAIReview = async (
  submit_record_ids: number[]
): Promise<string | null> => {
  const token = authStore.user.token || "";
  if (!token) {
    ElMessage.error("Token失效，请重新登录");
    localStorage.removeItem("user");
    router.push("/form");
    return null;
  }
  
  try {
    const resp = await submitBatchHomeworkForAIReview(token, submit_record_ids);
    const message: string = resp?.message || "";
    if ((message && message.includes("已提交至ai")) || resp?.uuid) {
      ElMessage.success("批量作业已提交至 AI 批改");
      return resp.uuid; // 返回 uuid 用于后续轮询
    }
    return null;
  } catch (error: any) {
    ElMessage.error(error?.message || "批量提交失败");
    return null;
  }
};

// 5.9 轮询批量作业批改情况
const pollBatchReviewStatus = async (mission_uid: string): Promise<any> => {
  const token = authStore.user.token || "";
  if (!token) {
    ElMessage.error("Token失效，请重新登录");
    localStorage.removeItem("user");
    router.push("/form");
    return null;
  }
  
  try {
    const resp = await pollBatchHomeworkReview(token, mission_uid);
    return resp;
  } catch (error) {
    return null;
  }
};

// 提交作业标准文件（对齐文档 5.10）
  const publishStandardFileAssignment = async (
    homeworkId : number,
    file : File
  ) => {
    const token = authStore.user.token || "";
    if (!token) {
      ElMessage.error("Token失效，请重新登录");
      localStorage.removeItem("user");
      router.push("/form");
      return;
    }
    await submitHomeworkStandardFile(token, file, homeworkId);
    ElMessage.success("作业发布成功");
    // // 发布成功后刷新作业列表
    // await fetchHomeworks(courseId);
  };


  return { 
    fetchHistoryByClass, 
    classList, 
    courseList, 
    fetchClassList, 
    fetchCourseList, 
    changeCourse, 
    createCourse, 
    filterClassId, 
    fetchRateHistory, 
    rates,
    assignments,
    assignmentStats,
    publishAssignment,
    homeworks,
    fetchHomeworks,
    homeworkStudents,
    fetchHomeworkStudents,
    submitToAIReview,
    pollReviewStatus,
    submitBatchToAIReview,
    pollBatchReviewStatus,
  };
});

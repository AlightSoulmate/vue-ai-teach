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
} from "@/services";
import { useAuthStore } from "./useAuthStore";
import { ElMessage } from "element-plus";
import router from "@/router";

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
        rates.value = resp.users;
      }
    } catch (error) {
      ElMessage.error("获取班级历史数据失败");
    }
  }
  // 筛选班级id
  const filterClassId = (className: string) => {
    const matchedClass = classList.value.find((item) => item.name === className);
    return matchedClass?.id || 100;
  };

  // ================= 作业管理 =================
  // 发布作业（对齐文档 5.1）
  const publishAssignment = async (
    courseId: number,
    title: string,
    description: string,
    pushDate: string,
    endDate: string,
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

  return { 
    fetchHistoryByClass, 
    classList, 
    courseList, 
    fetchClassList, 
    fetchCourseList, 
    changeCourse, 
    createCourse, 
    filterClassId, 
    rates,
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

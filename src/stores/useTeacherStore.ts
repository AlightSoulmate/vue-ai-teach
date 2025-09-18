// @/stores/useTeacherlStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { getAllClasses, getAllCourses, addCourse, updateCourse, getRateRecords, getHistoryByClass } from "@/services";
import { useAuthStore } from "./useAuthStore";
import { getDetail } from "@/services";
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
  const fetchHistoryByClass = async (cno: number) => {
    const token = authStore.user.token || "";
    if (!token) {
      ElMessage.error("Token失效，请重新登录");
      localStorage.removeItem("user");
      router.push("/form");
      return;
    }
    try {
      const resp = await getHistoryByClass(token, cno);
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
  return { fetchHistoryByClass, classList, courseList, fetchClassList, fetchCourseList, changeCourse, createCourse, filterClassId, fetchRateHistory, rates };
});

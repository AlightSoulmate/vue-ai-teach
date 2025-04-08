// src/stores/useAdminStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import {
  GetUsers,
  UpdateUser,
  DeleteUser,
  AddUser,
  QueryUser,
  UpdateTool,
  DeleteTool,
  AddTool,
} from "@/services";
import type { User, queryUser, Student, Teacher } from "@/interfaces";
import { ElMessage } from "element-plus";
import { useAuthStore } from "./useAuthStore";

export const useAdminStore = defineStore("admin", () => {
  const students = ref<Student[]>([]);
  const teachers = ref<Teacher[]>([]);
  const tools = ref<[]>([]);
  const totalStudents = ref<number>(0);
  const totalTeachers = ref<number>(0);
  const totalTools = ref<number>(0);
  const authStore = useAuthStore();

  // Get Users
  const fetchStudents = async () => {
    try {
      const token = authStore.user.token;

      console.log("开始获取学生列表...");
      const data = await GetUsers(token);

      if (data && data.student) {
        students.value = data.student;
        countSize(students.value, "student");
        console.log("学生列表，数量:", students.value.length);
        ElMessage.success("获取学生列表成功");
      } else {
        console.error("学生列表返回数据格式有误:", data);
        ElMessage.warning("获取学生列表失败");
      }
    } catch (error) {
      console.error("学生列表获取异常:", error);
      ElMessage.error("获取学生列表失败，请检查网络或服务状态");
    }
  };

  // Get Teachers
  const fetchTeachers = async () => {
    try {
      const token = authStore.user.token;
      const data = await GetUsers(token);
      teachers.value = data.teachers;
      // countSize(teachers.value, "teacher");
    } catch {
      console.error("教师列表获取异常");
    }
  };
  const countSize = (Users: Student[] | Teacher[], role: string) => {
    role === "student"
      ? (totalStudents.value = Users.length)
      : (totalTeachers.value = Users.length);
  };

  // Update A user's info
  const updateUserInfo = async (
    id: number,
    role: string,
    password: string,
    nickname: string,
    username: string
  ) => {
    const token = authStore.user.token;
    try {
      const response = await UpdateUser(
        id,
        role,
        token,
        password ?? "",
        nickname,
        username
      );
      console.log(response);
      ElMessage({
        type: "success",
        message: "修改成功",
      });
    } catch (e: any) {
      console.error(e);
    }
  };

  // Delete A user
  const deleteUser = async (id: number, role: string) => {
    const token = authStore.user.token;
    try {
      const response = await DeleteUser(id, role, token);
      console.log(response.message);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      // 如果是删除学生，刷新学生列表
      if (role === "student") {
        fetchStudents();
      } else if (role === "teacher") {
        fetchTeachers();
      }
    } catch (e: any) {
      console.error(e);
      ElMessage({
        type: "error",
        message: e.message || "删除失败，请重试",
      });
    }
  };

  // Add A user
  const addUser = async (
    nickname: string,
    username: string,
    password: string,
    role: string
  ) => {
    const token = authStore.user.token;
    try {
      const response = await AddUser(token, nickname, username, password, role);
      console.log(response.message);
      ElMessage({
        type: "success",
        message: "添加成功",
      });
    } catch (e: any) {
      console.error(e);
    }
  };

  // Query A user (by username)
  const userFound = ref<queryUser>({
    id: 0,
    nickname: "",
    username: "",
    role: "",
    message: "",
  });
  const queryUser = async (username: string, role: string) => {
    const token = authStore.user.token;
    try {
      const response = await QueryUser(token, username, role);
      console.log(response);
      ElMessage({
        type: "success",
        message: "查询成功",
      });
      userFound.value = response.user;
    } catch (e: any) {
      console.error(e);
    }
  };

  // Update A tool's info
  const updateToolInfo = async (
    toolId: number,
    name: string,
    category: string,
    url: string,
    logo_url: string,
    description: string
  ) => {
    const token = authStore.user.token;
    const tool = {
      name: name,
      category: category,
      url: url,
      logo_url: logo_url,
      description: description,
    };
    try {
      const response = await UpdateTool(token, tool, toolId);
      ElMessage({
        type: "success",
        message: "修改成功",
      });
    } catch (e: any) {
      console.error(e);
    }
  };

  // Delete A tool
  const deleteTool = async (toolId: number) => {
    const token = authStore.user.token;
    try {
      const response = await DeleteTool(token, toolId);
      console.log(response.message);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    } catch (e: any) {
      console.error(e);
    }
  };

  // Add A tool
  const addTool = async (
    name: string,
    category: string,
    url: string,
    logo_url: string,
    description: string
  ) => {
    const token = authStore.user.token;
    try {
      const response = await AddTool(
        token,
        name,
        category,
        url,
        logo_url,
        description
      );
      console.log(response.message);
      ElMessage({
        type: "success",
        message: "工具添加成功",
      });
      return response;
    } catch (e: any) {
      console.error(e);
      ElMessage({
        type: "error",
        message: e.message || "添加失败，请重试",
      });
      throw e;
    }
  };

  return {
    students,
    teachers,
    tools,
    totalStudents,
    totalTeachers,
    totalTools,
    userFound,
    fetchStudents,
    fetchTeachers,
    countSize,
    updateUserInfo,
    deleteUser,
    addUser,
    queryUser,
    updateToolInfo,
    deleteTool,
    addTool,
  };
});

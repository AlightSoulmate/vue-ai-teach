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
import type { queryUser, Student, Teacher } from "@/interfaces";
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
      const data = await GetUsers(token);

      if (data && data.student) {
        students.value = data.student;
        countSize(students.value, "student");
      } else {
        ElMessage.warning("返回数据格式有误");
      }
    } catch (error) {
      ElMessage.error("数据获取失败");
    }
  };

  // Get Teachers
  const fetchTeachers = async () => {
    try {
      const token = authStore.user.token;
      const data = await GetUsers(token);
      teachers.value = data.teachers;
    } catch {
      ElMessage.error("教师列表获取异常");
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
      await UpdateUser(
        id,
        role,
        token,
        password ?? "",
        nickname,
        username,
      );
      ElMessage.success("修改成功");
    } catch (error: any) {
      ElMessage.error(error?.message);
    }
  };

  // Delete A user
  const deleteUser = async (id: number, role: string) => {
    const token = authStore.user.token;
    try {
      await DeleteUser(id, role, token);
      ElMessage.success("修改成功");
      if (role === "student") {
        fetchStudents();
      } else if (role === "teacher") {
        fetchTeachers();
      }
    } catch (e: any) {
      ElMessage.error("删除失败");
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
      ElMessage.success("添加成功");
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
    cno: "",
    message: "",
  });
  const queryUser = async (username: string, role: string) => {
    const token = authStore.user.token;
    try {
      const response = await QueryUser(token, username, role);
      ElMessage.success("查询成功");
      userFound.value = response.user;
    } catch (error: any) {
      ElMessage.error(error?.message);
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
      ElMessage.success("修改成功");
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  // Delete A tool
  const deleteTool = async (toolId: number) => {
    const token = authStore.user.token;
    try {
      const response = await DeleteTool(token, toolId);
      ElMessage.success("删除成功");
    } catch (error: any) {
      ElMessage.error(error);
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
      ElMessage.success("工具添加成功");
      return response;
    } catch (error: any) {
      ElMessage.error("工具添加失败");
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

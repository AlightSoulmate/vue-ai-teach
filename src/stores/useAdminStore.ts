// src/stores/useAdminStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import {
  GetUsers,
  UpdateUser,
  DeleteUser,
  AddUser,
  QueryUser,
} from "@/services";
import type { User, queryUser } from "@/interfaces";
import { ElMessage } from "element-plus";

export const useAdminStore = defineStore("admin", () => {
  const students = ref<User[]>([]);
  const teachers = ref<User[]>([]);
  const tools = ref<[]>([]);
  const totalStudents = ref<number>(0);
  const totalTeachers = ref<number>(0);
  const totalTools = ref<number>(0);

  // Get Users
  const fetchStudents = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user") as any).token;
      const data = await GetUsers(token);
      students.value = data.students;
      countSize(students.value, "student");
    } catch {
      console.error("学生列表获取异常");
    }
  };

  // Get Teachers
  const fetchTeachers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user") as any).token;
      const data = await GetUsers(token);
      teachers.value = data.teachers;
      countSize(teachers.value, "teacher");
    } catch {
      console.error("学生列表获取异常");
    }
  };
  const countSize = (Users: User[], role: string) => {
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
    const token = JSON.parse(localStorage.getItem("user") as any).token;
    try {
      const pwd = password || "";
      const response = await UpdateUser(
        id,
        role,
        token,
        pwd,
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
    const token = JSON.parse(localStorage.getItem("user") as any).token;
    try {
      const response = await DeleteUser(id, role, token);
      console.log(response.message);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    } catch (e: any) {
      console.error(e);
    }
  };

  // Add A user
  const addUser = async (
    nickname: string,
    username: string,
    password: string,
    role: string
  ) => {
    const token = JSON.parse(localStorage.getItem("user") as any).token;

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
    const token = JSON.parse(localStorage.getItem("user") as any).token;
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
  return {
    students,
    teachers,
    tools,
    userFound,
    fetchStudents,
    fetchTeachers,
    countSize,
    updateUserInfo,
    deleteUser,
    addUser,
    queryUser,
  };
});

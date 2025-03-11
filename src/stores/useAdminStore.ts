// src/stores/useAdminStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { getUsers, updateUser } from "@/services";
import type { User } from "@/interfaces";

export const useAdminStore = defineStore("admin", () => {
  const students = ref<User[]>([]);
  const teachers = ref<User[]>([]);
  const tools = ref<[]>([]);
  const totalStudents = ref<number>(0);
  const totalTeachers = ref<number>(0);
  const totalTools = ref<number>(0);

  const fetchStudents = async () => {
    try {
      const Authorization = localStorage.getItem("Authorization") as string;
      const data = await getUsers(Authorization);
      students.value = data.students;
      countSize(students.value, "student");
    } catch {
      console.error("学生列表获取异常");
    }
  };
  const fetchTeachers = async () => {
    try {
      const Authorization = localStorage.getItem("Authorization") as string;
      const data = await getUsers(Authorization);
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

  // Update users' info
  const UpdateUserInfo = async (
    id: number,
    role: string,
    password: string,
    nickname: string,
    username: string
  ) => {
    const token = (localStorage.getItem("user") as any).token;
    try {
      const pwd = password || "";
      const response = await updateUser(
        id,
        role,
        token,
        pwd,
        nickname,
        username
      );
      console.log(response);
    } catch (e: any) {
      console.error(e);
    }
  };

  return {
    students,
    teachers,
    tools,
    fetchStudents,
    fetchTeachers,
    countSize,
    UpdateUserInfo,
  };
});

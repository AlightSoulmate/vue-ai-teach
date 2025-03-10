// src/stores/useAdminStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { getUsers } from "@/services/AdminService";
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
  return {
    students,
    teachers,
    tools,
    fetchStudents,
    fetchTeachers,
    countSize,
  };
});

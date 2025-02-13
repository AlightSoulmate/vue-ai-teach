// src/stores/useAuthStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { registerUser, loginUser } from "../services/AuthService";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";

interface User {
  id: number | null;
  username: string;
  role: string;
  token: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User>({
    id: null,
    username: "",
    role: "",
    token: "",
  });

  const errorMessage = ref<string>("");
  const isAuthenticated = ref<boolean>(false);
  const router = useRouter();

  const register = async (username: string, password: string) => {
    try {
      const data = await registerUser(username, password);
      user.value.id = data.user.id;
      user.value.username = data.user.username;
      user.value.role = data.user.role;
      user.value.token = data.Authorization;
      isAuthenticated.value = true;
      errorMessage.value = "";
      localStorage.setItem("user", JSON.stringify(user.value));

      router.push("/home");
      setTimeout(() => {
        router.push("/home");
        ElNotification({
          title: "注册成功",
          message: "注册成功",
          type: "success",
        });
      }, 1000);
    } catch (error: any) {
      errorMessage.value = error.message || "注册失败";
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const data = await loginUser(username, password);
      user.value.id = data.user.id;
      user.value.username = data.user.username;
      user.value.role = data.user.role;
      user.value.token = data.Authorization;
      isAuthenticated.value = true;
      errorMessage.value = "";
      localStorage.setItem("user", JSON.stringify(user.value));

      router.push("/home");
      setTimeout(() => {
        router.push("/home");
        ElNotification({
          title: "登录成功",
          message: "登录成功",
          type: "success",
        });
      }, 1000);
    } catch (error: any) {
      errorMessage.value = error.message || "登录失败";
    }
  };

  const logout = () => {
    user.value.id = null;
    user.value.username = "";
    user.value.role = "";
    user.value.token = "";
    isAuthenticated.value = false;
    localStorage.removeItem("user");
    router.push("/");
  };

  const checkAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      Object.assign(user.value, JSON.parse(storedUser));
      isAuthenticated.value = true;
    }
  };

  return {
    user,
    errorMessage,
    isAuthenticated,
    register,
    login,
    logout,
    checkAuth,
  };
});

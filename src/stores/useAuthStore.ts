// src/stores/useAuthStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { registerUser, loginUser } from "../services/AuthService";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import {
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElInput,
  ElButton,
} from "element-plus";
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

      setTimeout(() => {
        router.push("/home");
        ElNotification({
          title: "登录成功",
          message: "登录成功",
          type: "success",
        });
      }, 800);
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

  //其他登录的函数
  const username = ref<string>("ycy");
  const password = ref<string>("123456");
  const dialogVisible = ref(false);
  const isLogin = ref(true);
  const roles = ref<string[]>(["管理员", "教师", "学生"]);
  const rolesColor = ref<string[]>(["#f59e0b", "#256cdd", "#a78bfa"]);
  const currentRole = ref<string>("学生");

  const open = () => {
    ElMessageBox.alert("Contact 18868717143@163.com", "找回密码", {
      confirmButtonText: "好的",
      center: true,
    });
  };

  const loginForm = ref({
    username,
    password,
  });

  const registerForm = ref({
    username,
    password,
    confirmPassword: "",
  });

  const openDialog = () => {
    dialogVisible.value = true;
    console.log(dialogVisible.value);
  };

  // 添加表单验证状态
  const loginErrors = ref({
    username: "",
    password: "",
  });

  const registerErrors = ref({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // 验证登录表单
  const validateLoginForm = () => {
    let isValid = true;
    loginErrors.value.username = "";
    loginErrors.value.password = "";

    if (!loginForm.value.username) {
      loginErrors.value.username = "请输入用户名";
      isValid = false;
    }

    if (!loginForm.value.password) {
      loginErrors.value.password = "请输入密码";
      isValid = false;
    }

    return isValid;
  };

  // 验证注册表单
  const validateRegisterForm = () => {
    let isValid = true;
    registerErrors.value.username = "";
    registerErrors.value.password = "";
    registerErrors.value.confirmPassword = "";

    if (!registerForm.value.username) {
      registerErrors.value.username = "请输入用户名";
      isValid = false;
    }

    if (!registerForm.value.password) {
      registerErrors.value.password = "请输入密码";
      isValid = false;
    } else if (
      registerForm.value.password.length < 6 ||
      registerForm.value.password.length > 18
    ) {
      registerErrors.value.password = "密码长度必须在6-18位之间";
      isValid = false;
    }

    if (!registerForm.value.confirmPassword) {
      registerErrors.value.confirmPassword = "请确认密码";
      isValid = false;
    } else if (
      registerForm.value.confirmPassword !== registerForm.value.password
    ) {
      registerErrors.value.confirmPassword = "两次输入的密码不一致";
      isValid = false;
    }

    return isValid;
  };

  // 修改登录操作
  const enterLogin = async () => {
    if (!validateLoginForm()) return;

    console.log("登录中", loginForm.value);
    const resp = await login(
      loginForm.value.username,
      loginForm.value.password
    );
    console.log(resp);
    dialogVisible.value = false;
  };

  // 修改注册操作
  const enterRegister = async () => {
    if (!validateRegisterForm()) return;

    console.log("注册中", registerForm.value);
    await register(registerForm.value.username, registerForm.value.password);
    dialogVisible.value = false;
  };

  // 切换到注册页面
  const switchToRegister = () => {
    isLogin.value = false;
  };

  // 切换到登录页面
  const switchToLogin = () => {
    isLogin.value = true;
  };

  // 重置表单
  const resetForm = () => {
    loginForm.value.username = "";
    loginForm.value.password = "";
    registerForm.value.username = "";
    registerForm.value.password = "";
  };

  const switchRole = () => {
    currentRole.value =
      roles.value[
        roles.value.indexOf(currentRole.value) - 1 >= 0
          ? roles.value.indexOf(currentRole.value) - 1
          : 2
      ];
  };

  return {
    user,
    errorMessage,
    isAuthenticated,
    register,
    login,
    logout,
    checkAuth,
    resetForm,
    switchToLogin,
    switchToRegister,
    openDialog,
    registerForm,
    loginForm,
    open,
    isLogin,
    dialogVisible,
    password,
    username,
    enterLogin,
    enterRegister,
    loginErrors,
    registerErrors,
    validateLoginForm,
    validateRegisterForm,
    switchRole,
    roles,
    currentRole,
   };
});

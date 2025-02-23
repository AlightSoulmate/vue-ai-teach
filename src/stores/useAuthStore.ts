// src/stores/useAuthStore.ts
import { defineStore } from "pinia";
import { ref, nextTick } from "vue";
import { registerUser, loginUser } from "../services/AuthService";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { ElMessageBox } from "element-plus";
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
      const data = await registerUser(username, password, currentRole.value);
      user.value.id = data.user.id;
      user.value.username = data.user.username;
      user.value.role = data.user.role;
      user.value.token = data.Authorization;
      isAuthenticated.value = true;
      errorMessage.value = "";
      localStorage.setItem("user", JSON.stringify(user.value));
      currentRole.value = data.user.role;

      ElNotification({
        title: `欢迎你，${user.value.username}`,
        message: "注册成功",
        type: "success",
      });

      router.push("/index/home");
    } catch (error: any) {
      errorMessage.value = error.message || "注册失败";
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log("登录中", username, password, currentRole.value);
      const data = await loginUser(username, password, currentRole.value);

      // 先更新状态
      user.value = {
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        token: data.Authorization,
      };
      isAuthenticated.value = true;
      errorMessage.value = "";
      currentRole.value = data.user.role;
      // 保存到本地存储
      localStorage.setItem("user", JSON.stringify(user.value));

      // 显示通知
      ElNotification({
        title: `欢迎回来，${user.value.username}`,
        message: "登录成功",
        type: "success",
      });

      // 确保状态已更新后再跳转
      await nextTick();
      await router.push("/index/home");
    } catch (error: any) {
      errorMessage.value = error.message || "登录失败";
    }
  };

  const logout = async () => {
    // 先清除状态
    user.value = {
      id: null,
      username: "",
      role: "",
      token: "",
    };
    isAuthenticated.value = false;
    localStorage.removeItem("user");

    // 最后再跳转
    await router.push("/");
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
  const isLogin = ref(true);
  const roles = ref<string[]>(["管理员", "教师", "学生"]);
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
  };

  // 修改注册操作
  const enterRegister = async () => {
    if (!validateRegisterForm()) return;

    console.log("注册中", registerForm.value);
    await register(registerForm.value.username, registerForm.value.password);
  };

  const switchToRegister = () => {
    isLogin.value = false;
  };

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
    console.log(currentRole.value);
  };

  return {
    user,
    roles,
    isLogin,
    password,
    username,
    loginForm,
    loginErrors,
    currentRole,
    errorMessage,
    registerForm,
    registerErrors,
    isAuthenticated,
    open,
    login,
    logout,
    register,
    checkAuth,
    resetForm,
    enterLogin,
    switchRole,
    switchToLogin,
    enterRegister,
    switchToRegister,
    validateLoginForm,
    validateRegisterForm,
  };
});

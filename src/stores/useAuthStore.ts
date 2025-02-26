// src/stores/useAuthStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { registerUser, loginUser } from "@/services/AuthService";
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
  const router = useRouter();
  const errorMessage = ref<string>("");
  const isAuthenticated = ref<boolean>(false); // 记录登录状态
  const username = ref<string>("ycy");
  const password = ref<string>("123456");
  const isLogin = ref(true);
  const roles = ref<string[]>(["管理员", "教师", "学生"]);
  const currentRole = ref<string>("学生");
  const user = ref<User>({
    id: null,
    username: "",
    role: "",
    token: "",
  });
  const loginForm = ref({
    username,
    password,
  });
  const registerForm = ref({
    username,
    password,
    confirmPassword: "",
  });
  const loginErrors = ref({
    username: "",
    password: "",
  });
  const registerErrors = ref({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // 注册
  const register = async (username: string, password: string) => {
    try {
      const data = await registerUser(username, password, currentRole.value);
      user.value = {
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        token: data.Authorization,
      };
      isAuthenticated.value = true;
      errorMessage.value = "";
      currentRole.value = data.user.role;
      localStorage.setItem("user", JSON.stringify(user.value));

      ElNotification({
        title: `欢迎你，${user.value.username}`,
        message: "注册成功",
        type: "success",
      });
      router.push("/");
    } catch (error: any) {
      errorMessage.value = error.message || "注册失败";
    }
  };

  // 登录
  const login = async (username: string, password: string) => {
    if (currentRole.value !== "管理员" && !validateLoginForm()) return;

    try {
      const data = await loginUser(username, password, currentRole.value);
      user.value = {
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        token: data.Authorization,
      };
      isAuthenticated.value = true;
      errorMessage.value = "";
      currentRole.value = data.user.role;
      localStorage.setItem("user", JSON.stringify(user.value));

      ElNotification({
        title: `欢迎回来，${user.value.username}${user.value.role}`,
        message: "登录成功",
        type: "success",
      });

      await router.push("/");
    } catch (error: any) {
      errorMessage.value = error.message || "登录失败";
    }
  };

  // 退出登录
  const logout = async () => {
    user.value = {
      id: null,
      username: "",
      role: "",
      token: "",
    };
    isAuthenticated.value = false;
    localStorage.removeItem("user");

    await router.push("/login");
  };

  // 检查登录状态
  const checkAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      Object.assign(user.value, JSON.parse(storedUser));
      isAuthenticated.value = true;
    }
  };

  // 找回密码
  const open = () => {
    ElMessageBox.alert("Contact 18868717143@163.com", "找回密码", {
      confirmButtonText: "好的",
      center: true,
    });
  };

  // 修改密码
  const changePassword = () => {
    ElMessageBox.prompt("请输入新密码", "修改密码", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
      inputErrorMessage: "密码长度必须在8-16位之间，且包含大小写字母和数字",
    })
      .then(({ value }) => {
        console.log(value);
      })
      .catch(() => {
        console.log("取消修改密码");
      });
  };

  // 登录表单校验
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

  // 注册表单校验
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

  // 登录操作
  const enterLogin = async () => {
    if (currentRole.value !== "管理员" && !validateLoginForm()) return;

    const resp = await login(
      loginForm.value.username,
      loginForm.value.password
    );
    console.log(resp);
  };

  // 修改注册操作
  const enterRegister = async () => {
    if (!validateRegisterForm()) return;

    console.log("注册中 enterRegister", registerForm.value);
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
    localStorage.setItem("currentRole", currentRole.value);
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
    changePassword,
    switchToRegister,
    validateLoginForm,
    validateRegisterForm,
  };
});

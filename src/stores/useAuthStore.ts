// src/stores/useAuthStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { register, login, change, getAllClasses } from "@/services";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import type { User } from "@/interfaces";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const isAuthenticated = ref<boolean>(false);
  const username = ref<string>("");
  const password = ref<string>("");
  const isLogin = ref<boolean>(true);
  const isFresh = ref<number>(0);
  const roles = ref<string[]>(["admin", "teacher", "student"]);
  const currentRole = ref<string>("student");
  const currentRoleCN = computed(() => {
    return currentRole.value === "admin"
      ? "管理员"
      : currentRole.value === "teacher"
        ? "教师"
        : "学生";
  });
  const user = ref<User>({
    id: 0,
    nickname: "",
    username: "",
    role: "",
    cno: "",
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

  const logout = async () => {
    user.value = {
      id: 0,
      nickname: "",
      username: "",
      role: "",
      cno: "",
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

  // 找回密码等
  const open = (Value: () => string) => {
    ElMessageBox.alert("Contact 18868717143@163.com", Value(), {
      confirmButtonText: "好的",
      center: true,
    });
  };

  // 修改昵称
  const changeUserNickname = () => {
    ElMessageBox.prompt("请输入新昵称", "修改昵称", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /^.{2,10}$/,
      inputErrorMessage: "昵称长度在2-10位之间",
    })
      .then(async ({ value }) => {
        const data = await change(
          user.value.token,
          value,
          "",
          "",
          user.value.username,
        );
        user.value.nickname = data.user.nickname;
        localStorage.setItem("user", JSON.stringify(user.value));
        ElMessage.success("修改昵称成功");
      })
      .catch(() => {
        ElMessage.info("取消修改");
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

  const classList = ref<any[]>([]);
  // 获取班级列表
  const fetchClassList = async () => {
    const resp = await getAllClasses();
    classList.value = resp;
    return resp;
  }

  // 登录
  const enterLogin = async () => {
    if (currentRole.value !== "admin" && !validateLoginForm()) return;
    try {
      const data = await login(
        loginForm.value.username,
        loginForm.value.password,
        currentRole.value
      );
      user.value = {
        id: data.user.id,
        nickname: data.user.nickname?.trim() || "未设置昵称",
        username: data.user.username,
        role: data.user.role,
        cno: data.user.cno,
        token: data.Authorization,
      };
      isAuthenticated.value = true;
      isFresh.value = data.user.is_fresh;
      currentRole.value = user.value.role;
      localStorage.setItem("user", JSON.stringify(user.value));
      localStorage.setItem("isFresh", JSON.stringify(isFresh.value));
      ElMessage.success("登录成功");

      await router.push("/");
    } catch (error: any) {
      console.error("登陆失败");
    }
  };

  // 注册
  const enterRegister = async () => {
    if (!validateRegisterForm()) return;
    try {
      const data = await register(
        registerForm.value.username,
        registerForm.value.password,
        currentRole.value
      );
      user.value = {
        id: data.user.id,
        nickname: data.user.nickname?.trim() || "未设置昵称",
        username: data.user.username,
        role: data.user.role,
        cno: "未归属班级",
        token: data.Authorization,
      };
      isAuthenticated.value = true;
      currentRole.value = data.user.role;
      localStorage.setItem("user", JSON.stringify(user.value));

      ElMessage.success("注册成功");
      router.push("/");
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  const switchToRegister = () => {
    isLogin.value = false;
  };

  const switchToLogin = () => {
    isLogin.value = true;
  };

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
  };

  const setRole = (role: string) => {
    if (roles.value.includes(role)) {
      currentRole.value = role;
      localStorage.setItem("currentRole", currentRole.value);
    }
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
    currentRoleCN,
    isFresh,
    classList,
    registerForm,
    registerErrors,
    isAuthenticated,
    open,
    logout,
    checkAuth,
    resetForm,
    enterLogin,
    switchRole,
    setRole,
    switchToLogin,
    enterRegister,
    fetchClassList,
    changeUserNickname,
    switchToRegister,
    validateLoginForm,
    validateRegisterForm,
  };
});

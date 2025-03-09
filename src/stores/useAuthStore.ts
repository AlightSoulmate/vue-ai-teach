// src/stores/useAuthStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { register, login, change } from "@/services/AuthService";
import { useRouter } from "vue-router";
import { ElNotification, ElMessageBox } from "element-plus";
interface User {
  id: number | null;
  nickname: string;
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
  const isFresh = ref(true); //临时变量，用于判断是否需要强制被批量导入的学生在首登时修改密码
  const roles = ref<string[]>(["管理员", "教师", "学生"]);
  const currentRole = ref<string>("学生");
  const user = ref<User>({
    id: null,
    nickname: "",
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

  // 退出登录
  const logout = async () => {
    user.value = {
      id: null,
      nickname: "",
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
  const open = (Value: () => string) => {
    ElMessageBox.alert("Contact 18868717143@163.com", Value(), {
      confirmButtonText: "好的",
      center: true,
    });
  };

  // 修改密码
  const changeUserPassword = () => {};
  // 修改昵称
  const changeUserNickname = () => {
    ElMessageBox.prompt("请输入新昵称", "修改昵称", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /^.{2,10}$/,
      inputErrorMessage: "昵称长度必须在2-10位之间",
    })
      .then(async ({ value }) => {
        console.log(value);
        const data = await change(
          user.value.token,
          value,
          "",
          "",
          user.value.username
        );
        user.value.nickname = data.user.nickname;
        localStorage.setItem("user", JSON.stringify(user.value));
        ElNotification({
          title: "修改昵称成功",
          message: "昵称修改成功",
          type: "success",
        });
        console.log(data.user.nickname);
      })
      .catch(() => {
        console.log("取消修改昵称");
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

  // 登录
  const enterLogin = async () => {
    if (currentRole.value !== "管理员" && !validateLoginForm()) return;
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
        token: data.Authorization,
      };
      isAuthenticated.value = true;
      errorMessage.value = "";
      currentRole.value = data.user.role;
      localStorage.setItem("user", JSON.stringify(user.value));

      ElNotification({
        title: `欢迎登入，${data.user.nickname?.trim() || "未设置昵称"}${
          ["student", "teacher"].includes(user.value.role)
            ? user.value.role === "student"
              ? "同学"
              : "老师"
            : "管理员"
        }`,
        message: "登录成功",
        type: "success",
      });

      await router.push("/");
    } catch (error: any) {
      errorMessage.value = error.message || "登录失败";
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
        token: data.Authorization,
      };
      isAuthenticated.value = true;
      errorMessage.value = "";
      currentRole.value = data.user.role;
      localStorage.setItem("user", JSON.stringify(user.value));

      ElNotification({
        title: `欢迎你，新${user.value.role === "student" ? "同学" : "老师"}`,
        message: "注册成功",
        type: "success",
      });
      router.push("/");
    } catch (error: any) {
      errorMessage.value = error.message || "注册失败";
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
    logout,
    checkAuth,
    resetForm,
    enterLogin,
    switchRole,
    switchToLogin,
    enterRegister,
    changeUserNickname,
    changeUserPassword,
    switchToRegister,
    validateLoginForm,
    validateRegisterForm,
  };
});

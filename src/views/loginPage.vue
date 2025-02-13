<template>
  <nav class="top-nav">
    <TopNav />
  </nav>
  <div class="main-container">
    <div class="bigLogo">
      <video :src="videoSrc" autoplay loop muted>{{ videoSrcTxt }}</video>
    </div>
    <h1 id="h1Title">{{ h1Title }}</h1>
    <h2 id="h2Title">{{ h2Title }}</h2>
    <div class="enter" @click="openDialog">
      <span>{{ startUse }}</span>
    </div>

    <!-- 登录注册弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="登录/注册"
      width="400px"
      @close="resetForm"
    >
      <template #default>
        <div v-if="isLogin">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            style="margin-bottom: 20px"
          />
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            style="margin-bottom: 20px"
          />
          <el-button type="primary" @click="login" style="width: 100%"
            >登录</el-button
          >
          <div style="margin-top: 10px">
            <span
              @click="switchToRegister"
              style="cursor: pointer; color: #409eff"
              >没有账号？注册</span
            >
          </div>
        </div>
        <div v-else>
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            style="margin-bottom: 20px"
          />
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            style="margin-bottom: 20px"
          />
          <el-button type="primary" @click="register" style="width: 100%"
            >注册</el-button
          >
          <div style="margin-top: 10px">
            <span @click="switchToLogin" style="cursor: pointer; color: #409eff"
              >已有账号？登录</span
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";
import TopNav from "@/components/topNav/login/index.vue";
import { ElDialog, ElInput, ElButton, ElNotification } from "element-plus";

const h1Title = ref("AITe👋ach");
const h2Title = ref("AI驱动的直观教学反馈与改进，以智能化评估帮助教师完成创新");
const videoSrc = ref("https://a1.x914.com/alight/i/2025/02/02/app.mp4");
const videoSrcTxt = ref("您的浏览器不支持 HTML5 视频标签");
const startUse = ref("开始使用");
const router = useRouter();
const authStore = useAuthStore();
const username = ref<string>("");
const password = ref<string>("");

// 弹窗控制
const dialogVisible = ref(false);
const isLogin = ref(true);

// 登录表单数据
const loginForm = ref({
  username: "ycy",
  password: "123456",
});

// 注册表单数据
const registerForm = ref({
  username: "",
  password: "",
});

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
};

// 登录操作
const login = async () => {
  console.log("登录中", loginForm.value);

  const resp = await authStore.login(username.value, password.value);
  console.log(resp);

  dialogVisible.value = false; // 登录成功后关闭弹窗
};

// 注册操作
const register = async () => {
  console.log("注册中", registerForm.value);
  await authStore.register(username.value, password.value);
  dialogVisible.value = false; // 注册成功后关闭弹窗
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
</script>

<style scoped lang="scss">
// @use "@/styles/light-theme.scss" as light;
// @use "@/styles/dark-theme.scss" as dark;
* {
  text-align: center;
  margin: 0 auto;
}
body {
  // background-color: var(--background-color);
  background-color: blue;
}
.top-nav {
  position: fixed;
  top: 0;
  width: 100%;
}
.main-container {
  margin-top: 80px;
}
#h1Title {
  font-size: 4rem;
  color: var(--text-color);
}
#h2Title {
  font-size: 1.5rem;
  color: #000;
  margin: 10px 0;
  color: var(--text-color);
}
.bigLogo {
  width: 100%;
  height: 200px;
}
.bigLogo video {
  width: 100%;
  height: 100%;
}
.enter {
  margin-top: 30px;
  margin-bottom: 20px;
  padding: 5px 0;
  width: 130px;
  height: 35px;
  line-height: 35px;
  font-size: 20px;
  font-weight: bolder;
  border-radius: 20px;
  cursor: pointer;
  color: #000000d2;
  background-color: #91adf1;
}
</style>

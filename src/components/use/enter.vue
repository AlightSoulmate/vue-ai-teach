<template>
  <div class="form-container">
    <div v-if="authStore.isLogin" class="auth-section">
      <p class="title" :title="authStore.currentRole">
        {{ authStore.currentRoleCN }}登录
      </p>
      <form class="form" @submit.prevent="authStore.enterLogin">
        <div class="input-group">
          <label for="username">账号</label>
          <div class="input-wrapper">
            <i class="icon icon-user"></i>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="输入账号"
              :title="authStore.currentRole"
              v-model="authStore.loginForm.username"
            />
          </div>
          <span class="error-message" v-if="authStore.loginErrors.username">{{
            authStore.loginErrors.username
          }}</span>
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <div class="input-wrapper">
            <i class="icon icon-lock"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              name="password"
              id="password"
              placeholder="输入密码"
              :title="authStore.currentRole"
              v-model="authStore.loginForm.password"
            />
            <i
              class="icon password-toggle"
              :class="showPassword ? 'icon-eye' : 'icon-eye-slash'"
              @click="togglePassword"
            ></i>
          </div>
          <span class="error-message" v-if="authStore.loginErrors.password">{{
            authStore.loginErrors.password
          }}</span>
          <div class="forgot">
            <a
              rel="noopener noreferrer"
              plain
              @click="authStore.open(() => '找回密码')"
              >忘记密码</a
            >
          </div>
        </div>
        <button
          type="button"
          class="sign"
          @click.prevent="authStore.enterLogin"
          :title="authStore.currentRole"
        >
          登 录
        </button>
      </form>
      <p class="signup">
        还没有账号?
        <a
          @click.prevent="authStore.switchToRegister"
          href="javascript:void(0)"
          class="switch-link"
          >点击注册</a
        >
      </p>
    </div>
    <div v-else class="auth-section">
      <p class="title">{{ authStore.currentRoleCN }}注册</p>
      <form class="form" @submit.prevent="authStore.enterRegister">
        <div class="input-group">
          <label for="username">账号</label>
          <div class="input-wrapper">
            <i class="icon icon-user"></i>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="输入账号"
              :title="authStore.currentRole"
              v-model="authStore.registerForm.username"
            />
          </div>
          <span
            class="error-message"
            v-if="authStore.registerErrors.username"
            >{{ authStore.registerErrors.username }}</span
          >
        </div>
        <div class="input-group">
          <label for="password"
            >密码 <span class="password-hint">(6-18位)</span></label
          >
          <div class="input-wrapper">
            <i class="icon icon-lock"></i>
            <input
              type="password"
              name="password"
              id="password"
              show-password
              placeholder="输入密码"
              :title="authStore.currentRole"
              v-model="authStore.registerForm.password"
            />
          </div>
          <span
            class="error-message"
            v-if="authStore.registerErrors.password"
            >{{ authStore.registerErrors.password }}</span
          >
        </div>
        <div class="input-group">
          <label for="confirm-password">确认密码</label>
          <div class="input-wrapper">
            <i class="icon icon-lock"></i>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              show-password
              placeholder="确认密码"
              :title="authStore.currentRole"
              v-model="authStore.registerForm.confirmPassword"
            />
          </div>
          <span
            class="error-message"
            v-if="authStore.registerErrors.confirmPassword"
            >{{ authStore.registerErrors.confirmPassword }}</span
          >
        </div>
        <button
          type="button"
          class="sign"
          @click.prevent="authStore.enterRegister"
          :title="authStore.currentRole"
        >
          注 册
        </button>
      </form>
      <p class="signup">
        已有账号?
        <a
          @click.prevent="authStore.switchToLogin"
          href="javascript:void(0)"
          class="switch-link"
          >点击登录</a
        >
      </p>
    </div>

    <div class="role-selector">
      <div class="role-selector-label">选择身份：</div>
      <div class="role-options">
        <div
          class="role-option"
          :class="{ active: authStore.currentRole === 'student' }"
          @click="selectRole('student')"
        >
          <div class="role-icon student-icon"></div>
          <span>学生</span>
        </div>
        <div
          class="role-option"
          :class="{ active: authStore.currentRole === 'teacher' }"
          @click="selectRole('teacher')"
        >
          <div class="role-icon teacher-icon"></div>
          <span>老师</span>
        </div>
        <div
          class="role-option"
          :class="{ active: authStore.currentRole === 'admin' }"
          @click="selectRole('admin')"
        >
          <div class="role-icon admin-icon"></div>
          <span>管理员</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { watch, defineEmits, onMounted, ref } from "vue";

const emit = defineEmits(["usernameChange"]);
const authStore = useAuthStore();

const showPassword = ref<boolean>(false);

const selectRole = (role: string) => {
  authStore.setRole(role);
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

watch(
  () => authStore.loginForm.username,
  (newUsername) => {
    emit("usernameChange", newUsername);
  }
);

watch(
  () => authStore.registerForm.username,
  (newUsername) => {
    emit("usernameChange", newUsername);
  }
);
</script>
<style lang="scss" scoped>
.form-container {
  text-align: left;
  width: inherit;
  border-radius: 16px;
  background-color: rgba(26, 31, 54, 0.7);
  padding: 2.5rem 3rem;
  color: #fff;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.6s ease-out;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
}

.auth-section {
  position: relative;
  z-index: 2;
}

.role-selector {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
  position: relative;
  z-index: 2;
}

.role-selector-label {
  font-size: 0.95rem;
  color: rgba(209, 213, 219, 0.9);
  margin-bottom: 0.75rem;
  text-align: center;
}

.role-options {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
}

.role-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  animation: slideIn 0.3s ease-out forwards;

  span {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(209, 213, 219, 0.8);
    transition: all 0.2s ease;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);

    span {
      color: white;
    }
  }

  &.active {
    span {
      color: white;
      font-weight: 600;
    }
  }

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }
}

.role-option.active[class*="student"] {
  background-color: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);

  .role-icon {
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  }
}

.role-option.active[class*="teacher"] {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);

  .role-icon {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }
}

.role-option.active[class*="admin"] {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);

  .role-icon {
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
  }
}

.role-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    font-size: 1.5rem;
    position: absolute;
  }
}

.student-icon {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);

  &::before {
    content: "👨‍🎓";
  }
}

.teacher-icon {
  background: linear-gradient(135deg, #60a5fa, #2563eb);

  &::before {
    content: "👨‍🏫";
  }
}

.admin-icon {
  background: linear-gradient(135deg, #fbbf24, #d97706);

  &::before {
    content: "👨‍💼";
  }
}

.title {
  text-align: center;
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: 700;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #ffffff;
  letter-spacing: 1px;
  margin-bottom: 2rem;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 3px;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.3s ease;
  }
}

.title[title="student"]::after {
  background-color: #a78bfa;
}
.title[title="teacher"]::after {
  background-color: #3b82f6;
}
.title[title="admin"]::after {
  background-color: #f59e0b;
}

.form {
  margin-top: 1.5rem;
  margin-inline: 40px;
}

.input-group {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;

  label {
    display: block;
    color: rgba(209, 213, 219, 1);
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 1rem;
  }
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .icon {
    position: absolute;
    left: 12px;
    color: #6b7280;
    font-size: 1.25rem;
    display: inline-block;
    width: 20px;
    height: 20px;
  }

  .password-toggle {
    left: auto;
    right: 12px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #a78bfa;
    }
  }

  .icon-user::before {
    content: "👤";
  }

  .icon-lock::before {
    content: "🔒";
  }

  .icon-eye::before {
    content: "◐";
    font-size: 1.1rem;
  }

  .icon-eye-slash::before {
    content: "◑";
    font-size: 1.1rem;
  }
}

.input-group input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgba(75, 85, 99, 1);
  outline: 0;
  background-color: rgba(31, 41, 55, 0.8);
  padding: 0.85rem 1rem 0.85rem 2.5rem;
  color: rgba(243, 244, 246, 1);
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(156, 163, 175, 0.7);
  }

  &:hover {
    border-color: rgba(107, 114, 128, 1);
  }
}

.input-group input[title="student"]:focus {
  border-color: rgba(167, 139, 250, 1);
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.25);
}
.input-group input[title="teacher"]:focus {
  border-color: rgba(59, 130, 246, 1);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}
.input-group input[title="admin"]:focus {
  border-color: rgba(245, 158, 11, 1);
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
}

.forgot {
  display: flex;
  justify-content: flex-end;
  font-size: 0.85rem;
  line-height: 1rem;
  color: rgba(156, 163, 175, 1);
  margin: 10px 4px 0 0;
  cursor: pointer;
}

.forgot a,
.signup a {
  color: rgba(209, 213, 219, 1);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
  }
}

.switch-link {
  font-weight: 600;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
}

.sign {
  display: block;
  width: 100%;
  margin-top: 2rem;
  padding: 0.85rem;
  text-align: center;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
}

.sign[title="student"] {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}
.sign[title="teacher"] {
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}
.sign[title="admin"] {
  background: linear-gradient(135deg, #fbbf24, #d97706);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);
}

.signup {
  text-align: center;
  font-size: 0.95rem;
  line-height: 1rem;
  color: rgba(156, 163, 175, 1);
  margin-top: 1.5rem;
}

.error-message {
  color: #f87171;
  font-size: 0.8rem;
  margin-top: 6px;
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.password-hint {
  color: rgba(156, 163, 175, 1);
  font-size: 0.8rem;
  margin-left: 4px;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

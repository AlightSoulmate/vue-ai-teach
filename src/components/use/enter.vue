<template>
  <div class="form-container">
    <div class="card-head">
      <p class="eyebrow">{{ authStore.isLogin ? "账号登录" : "账号注册" }}</p>
      <h2>{{ authStore.currentRoleCN }}{{ authStore.isLogin ? "登录" : "注册" }}</h2>
      <span>{{ authStore.isLogin ? "请选择身份并输入账号信息" : "请填写账号信息完成注册" }}</span>
    </div>

    <div class="role-selector">
      <button
        v-for="role in roleOptions"
        :key="role.value"
        type="button"
        class="role-option"
        :class="{ active: authStore.currentRole === role.value }"
        @click="selectRole(role.value)"
      >
        <span class="role-dot"></span>
        {{ role.label }}
      </button>
    </div>

    <div v-if="showDevLoginTip && authStore.isLogin" class="dev-login-tip">
      <div>
        <strong>本地开发账号</strong>
        <span>{{ currentDevAccount.username }} / {{ currentDevAccount.password }}</span>
      </div>
      <button type="button" @click="fillDevAccount">填入示例</button>
    </div>

    <transition name="form-fade" mode="out-in">
    <div v-if="authStore.isLogin" class="auth-section" key="login">
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
    <div v-else class="auth-section" key="register">
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
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { watch, defineEmits, ref, computed } from "vue";
import { isDemoMode, isDevMode, isMockEnabled } from "@/utils/env";

const emit = defineEmits(["usernameChange"]);
const authStore = useAuthStore();

const showPassword = ref<boolean>(false);
const roleOptions = [
  { label: "学生", value: "student" },
  { label: "教师", value: "teacher" },
  { label: "管理员", value: "admin" },
];
const devAccounts: Record<string, { username: string; password: string }> = {
  student: { username: "23080501001", password: "123456" },
  teacher: { username: "23080501011", password: "123456" },
  admin: { username: "admin", password: "123456" },
};
const showDevLoginTip = (isDevMode() && isMockEnabled()) || isDemoMode();
const currentDevAccount = computed(() => {
  return devAccounts[authStore.currentRole] || devAccounts.student;
});

const selectRole = (role: string) => {
  authStore.setRole(role);
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const fillDevAccount = () => {
  authStore.loginForm.username = currentDevAccount.value.username;
  authStore.loginForm.password = currentDevAccount.value.password;
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
  width: 100%;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.88);
  padding: 30px;
  color: #111827;
  position: relative;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  backdrop-filter: blur(18px);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
  animation: cardEnter 0.42s ease-out both;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 30px 80px rgba(15, 23, 42, 0.15);
  }
}

.card-head {
  margin-bottom: 22px;

  .eyebrow {
    margin: 0 0 8px;
    color: #2563eb;
    font-size: 13px;
    font-weight: 800;
  }

  h2 {
    margin: 0;
    color: #0f172a;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 800;
  }

  span {
    display: block;
    margin-top: 8px;
    color: #64748b;
    font-size: 14px;
  }
}

.auth-section {
  position: relative;
  z-index: 2;
}

.role-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 6px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  position: relative;
  z-index: 2;
}

.role-option {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  min-height: 38px;
  padding: 0 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;

  &:hover {
    color: #2563eb;
    background-color: rgba(255, 255, 255, 0.72);
  }

  &.active {
    color: #0f172a;
    background: #ffffff;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  }
}

.role-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #93c5fd;
}

.dev-login-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -4px 0 18px;
  padding: 12px 13px;
  border: 1px solid rgba(37, 99, 235, 0.14);
  border-radius: 8px;
  background: rgba(239, 246, 255, 0.72);

  strong,
  span {
    display: block;
  }

  strong {
    color: #1e3a8a;
    font-size: 13px;
    margin-bottom: 4px;
  }

  span {
    color: #475569;
    font-size: 13px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  button {
    flex: 0 0 auto;
    height: 32px;
    padding: 0 12px;
    border: 1px solid rgba(37, 99, 235, 0.18);
    border-radius: 8px;
    background: #ffffff;
    color: #2563eb;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;

    &:hover {
      background: #f8fbff;
      transform: translateY(-1px);
    }
  }
}

.form {
  margin: 0;
}

.input-group {
  margin-top: 16px;
  font-size: 0.875rem;
  line-height: 1.25rem;

  label {
    display: block;
    color: #334155;
    margin-bottom: 7px;
    font-weight: 500;
    font-size: 14px;
  }
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .icon {
    position: absolute;
    left: 14px;
    color: #94a3b8;
    font-size: 1rem;
    display: inline-block;
    width: 20px;
    height: 20px;
  }

  .password-toggle {
    left: auto;
    right: 14px;
    width: 34px;
    height: 20px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #2563eb;
    }
  }

  .icon-user::before {
    content: "";
    display: block;
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-radius: 50%;
  }

  .icon-lock::before {
    content: "";
    display: block;
    width: 14px;
    height: 10px;
    margin-top: 5px;
    border: 2px solid currentColor;
    border-radius: 3px;
  }

  .icon-eye::before {
    content: "显示";
    font-size: 12px;
    font-style: normal;
    white-space: nowrap;
  }

  .icon-eye-slash::before {
    content: "隐藏";
    font-size: 12px;
    font-style: normal;
    white-space: nowrap;
  }
}

.input-group input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #dbe4ef;
  outline: 0;
  background-color: #ffffff;
  padding: 0.86rem 4rem 0.86rem 2.6rem;
  color: #0f172a;
  font-size: 15px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:hover {
    border-color: #bfdbfe;
  }
}

.input-group input[title="student"]:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}
.input-group input[title="teacher"]:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12);
}
.input-group input[title="admin"]:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.12);
}

.forgot {
  display: flex;
  justify-content: flex-end;
  font-size: 0.85rem;
  line-height: 1rem;
  color: #64748b;
  margin: 10px 0 0;
  cursor: pointer;
}

.forgot a,
.signup a {
  color: #2563eb;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    color: #1d4ed8;
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
  font-weight: 700;
  cursor: pointer;
  font-size: 15px;
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
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
}
.sign[title="teacher"] {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  box-shadow: 0 12px 24px rgba(14, 165, 233, 0.22);
}
.sign[title="admin"] {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 12px 24px rgba(217, 119, 6, 0.22);
}

.sign:hover {
  transform: translateY(-1px);
}

.signup {
  text-align: center;
  font-size: 0.95rem;
  line-height: 1rem;
  color: #64748b;
  margin-top: 1.5rem;
}

.error-message {
  color: #dc2626;
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
  color: #94a3b8;
  font-size: 0.8rem;
  margin-left: 4px;
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.form-fade-enter-from,
.form-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 560px) {
  .form-container {
    padding: 22px;
  }

  .role-selector {
    grid-template-columns: 1fr;
  }

  .dev-login-tip {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

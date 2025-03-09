<template>
  <div class="form-container">
    <div
      class="role-convert"
      @click="authStore.switchRole"
      :title="authStore.currentRole"
    >
      <span class="role-name">我是{{ authStore.currentRole }}</span>
    </div>
    <div v-if="authStore.isLogin">
      <p class="title" :title="authStore.currentRole">
        {{ authStore.currentRole }}登录
      </p>
      <form class="form" @submit.prevent="authStore.enterLogin">
        <div class="input-group">
          <label for="username">账号</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder=""
            :title="authStore.currentRole"
            v-model="authStore.loginForm.username"
          />
          <span class="error-message" v-if="authStore.loginErrors.username">{{
            authStore.loginErrors.username
          }}</span>
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder=""
            :title="authStore.currentRole"
            v-model="authStore.loginForm.password"
          />
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
          class=""
          >点击注册</a
        >
      </p>
    </div>
    <div v-else>
      <p class="title">{{ authStore.currentRole }}注册</p>
      <form class="form" @submit.prevent="authStore.enterRegister">
        <div class="input-group">
          <label for="username">账号</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder=""
            :title="authStore.currentRole"
            v-model="authStore.registerForm.username"
          />
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
          <input
            type="password"
            name="password"
            id="password"
            placeholder=""
            :title="authStore.currentRole"
            v-model="authStore.registerForm.password"
          />
          <span
            class="error-message"
            v-if="authStore.registerErrors.password"
            >{{ authStore.registerErrors.password }}</span
          >
        </div>
        <div class="input-group">
          <label for="confirm-password">确认密码</label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder=""
            :title="authStore.currentRole"
            v-model="authStore.registerForm.confirmPassword"
          />
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
          class=""
          >点击登录</a
        >
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
</script>
<style scoped>
.form-container {
  text-align: left;
  width: inherit;
  border-radius: 0.75rem;
  background-color: rgba(17, 24, 39, 1);
  padding: 2rem;
  color: rgba(243, 244, 246, 1);
  margin-top: -20px !important;
  position: relative;
  overflow: hidden;
}
.role-convert {
  position: absolute;
  width: 10rem;
  height: 10rem;
  right: -5rem;
  top: -5rem;
  border-radius: 0 0.75rem 0 0;
  transform: rotate(45deg);
  display: grid;
  align-items: end;
  cursor: pointer;
}
.role-name {
  vertical-align: bottom;
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #f3f4f6;
  transition: role 0.5s ease-in-out;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.role-convert[title="学生"] {
  background-color: #a78bfa;
}
.role-convert[title="教师"] {
  background-color: #256cdd;
}
.role-convert[title="管理员"] {
  background-color: #c27d06;
}

.title {
  text-align: center;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #f0f0f0;
}

.form {
  margin-top: 1.5rem;
}

.input-group {
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.input-group label {
  display: block;
  color: rgba(156, 163, 175, 1);
  margin-bottom: 4px;
}

.input-group input {
  width: 90%;
  border-radius: 0.375rem;
  border: 1px solid rgba(55, 65, 81, 1);
  outline: 0;
  background-color: rgba(17, 24, 39, 1);
  padding: 0.75rem 1rem;
  color: rgba(243, 244, 246, 1);
}

.input-group input[title="学生"]:focus {
  border-color: rgba(167, 139, 250);
  animation: student-border 0.25s ease-in-out;
}
.input-group input[title="教师"]:focus {
  border-color: rgba(37, 108, 221);
  animation: teacher-border 0.25s ease-in-out;
}
.input-group input[title="管理员"]:focus {
  border-color: rgba(194, 125, 6);
  animation: admin-border 0.25s ease-in-out;
}
@keyframes student-border {
  from {
    border-color: rgba(55, 65, 81, 1);
  }
  to {
    border-color: rgba(167, 139, 250);
  }
}
@keyframes teacher-border {
  from {
    border-color: rgba(55, 65, 81, 1);
  }
  to {
    border-color: rgba(37, 108, 221);
  }
}
@keyframes admin-border {
  from {
    border-color: rgba(55, 65, 81, 1);
  }
  to {
    border-color: rgba(194, 125, 6);
  }
}

.forgot {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgba(156, 163, 175, 1);
  margin: 6px 4px 0 0;
  cursor: pointer;
}

.forgot a,
.signup a {
  color: rgba(243, 244, 246, 1);
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline rgba(167, 139, 250, 1);
  }
}

.sign {
  display: block;
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.75rem;
  text-align: center;
  color: rgba(17, 24, 39, 1);
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
}
.sign[title="学生"] {
  background-color: #a78bfa;
}
.sign[title="教师"] {
  background-color: #256cdd;
}
.sign[title="管理员"] {
  background-color: #f59e0b;
}

.social-message {
  display: flex;
  align-items: center;
  padding-top: 1rem;
}

.line {
  height: 1px;
  flex: 1 1 0%;
  background-color: rgba(55, 65, 81, 1);
}

.social-message .message {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(156, 163, 175, 1);
}

.social-icons {
  display: flex;
  justify-content: center;
}

.social-icons .icon {
  border-radius: 0.125rem;
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  margin-left: 8px;
}

.social-icons .icon svg {
  height: 1.25rem;
  width: 1.25rem;
  fill: #fff;
}

.signup {
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgba(156, 163, 175, 1);
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.password-hint {
  color: rgba(156, 163, 175, 1);
  font-size: 12px;
  margin-left: 4px;
}
</style>

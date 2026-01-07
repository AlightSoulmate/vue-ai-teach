<template>
  <div class="login-container">
    <div class="container" :class="{ active: !isLogin }">
      <div class="form-box login">
        <form @submit.prevent="handleLogin">
          <h1>login</h1>
          <div class="input-box">
            <input 
              type="text" 
              v-model="loginForm.username" 
              placeholder="Username" 
              required
            >
            <i class='bx bxs-user'></i>
          </div>
          <div class="input-box">
            <input 
              type="password" 
              v-model="loginForm.password" 
              placeholder="Password" 
              required
            >
            <i class='bx bxs-lock-alt'></i>
          </div>
          <div class="forgot-link">
            <a href="#" @click.prevent="handleForgotPassword">Forgot password?</a>
          </div>
          <button type="submit" class="btn" :disabled="isLoading">
            {{ isLoading ? 'logining...' : 'login' }}
          </button>
        </form>
      </div>

      <div class="form-box register">
        <form @submit.prevent="handleRegister">
          <h1>Registration
          </h1>
          <div class="input-box">
            <input 
              type="text" 
              v-model="registerForm.username" 
              placeholder="Username " 
              required
            >
            <i class='bx bxs-user'></i>
          </div>
          <div class="input-box">
            <input 
              type="password" 
              v-model="registerForm.password" 
              placeholder="Password " 
              required
            >
            <i class='bx bxs-lock-alt'></i>
          </div>
          <div class="input-box">
            <input 
              type="password" 
              v-model="registerForm.confirmPassword" 
              placeholder="Confirm Password" 
              required
            >
            <i class='bx bxs-lock-alt'></i>
          </div>
          <button type="submit" class="btn" :disabled="isLoading">
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
          <p>or register with social platforms</p>
          <div class="social-icons">
            <a href="#" @click.prevent><i class='bx bxl-google'></i></a>
            <a href="#" @click.prevent><i class='bx bxl-facebook'></i></a>
            <a href="#" @click.prevent><i class='bx bxl-github'></i></a>
            <a href="#" @click.prevent><i class='bx bxl-linkedin'></i></a>
          </div>
        </form>
      </div>

      <div class="toggle-box">
        <div class="toggle-panel toggle-left">
          <h1>Hello, ZISU!</h1>
          <p>Don't have an account?</p>
          <button class="btn register-btn" @click="switchToRegister">
            register
          </button>
        </div>
        <div class="toggle-panel toggle-right">
          <h1>Welcome  Back！
          </h1>
          <p>Already have an account?</p>
          <button class="btn login-btn" @click="switchToLogin">
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const isLoading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const switchToLogin = () => {
  isLogin.value = true
}

const switchToRegister = () => {
  isLogin.value = false
}

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.error('请填写完整信息')
    return
  }
  
  if (!loginForm.username.trim() || !loginForm.password.trim()) {
    ElMessage.error('用户名和密码不能为空')
    return
  }
  
  isLoading.value = true
  try {
    authStore.setRole('student')
    // 直接使用组件内的表单数据
    const data = await authStore.enterLoginWithData(loginForm.username.trim(), loginForm.password.trim(), 'student')
    console.log('✅ 学生登录成功:', data)
  } catch (error: any) {
    console.error('❌ 学生登录失败:', error)
    // 错误信息已经在AuthService中通过ElMessage显示了
    // 这里不需要再次显示，避免重复提示
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  // 用户名格式验证：4-16位字母数字下划线
  const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/
  if (!usernameRegex.test(registerForm.username)) {
    ElMessage.error('Username: 4-16 letters, digits or _')
    return
  }
  
  // 密码格式验证：6-18位，包含字母和数字
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/
  if (!passwordRegex.test(registerForm.password)) {
    ElMessage.error('Password: 6-18, include letters and digits')
    return
  }
  
  if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
    ElMessage.error('Please complete all fields')
    return
  }
  
  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage.error('Passwords do not match')
    return
  }
  
  isLoading.value = true
  try {
    authStore.setRole('student')
    // 直接使用组件内的表单数据
    const data = await authStore.enterRegisterWithData(registerForm.username, registerForm.password, 'student')
    console.log('注册成功:', data)
    // 注册成功后切换到登录模式，并清空注册表单
    registerForm.username = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    isLogin.value = true
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败，请检查用户名是否已存在')
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  authStore.open(() => '请联系管理员重置密码')
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
  padding: 20px;
  box-sizing: border-box;
}

.container {
  position: relative;
  width: 850px;
  height: 550px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  box-sizing: border-box;
}

.form-box {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  color: #333;
  text-align: center;
  padding: 40px;
  z-index: 1;
  transition: right 0.6s ease-in-out 1.2s;
}

.form-box.register {
  opacity: 0;
  pointer-events: none;
  transition: right 0.6s ease-in-out 1.2s, opacity 0s 1.8s, pointer-events 0s 1.8s;
}

.container.active .form-box {
  right: 50%;
}

.container.active .form-box.register {
  opacity: 1;
  pointer-events: auto;
  transition: right 0.6s ease-in-out 1.2s, opacity 0s 0.6s, pointer-events 0s 0.6s;
}

form {
  width: 100%;
  box-sizing: border-box;
}

.container h1 {
  font-size: 36px;
  margin: -10px 0;
  color: #333;
}

/* Make registration headline white to keep large white style consistent */
.form-box.register .form-header h1 {
  color: #fff;
}

.form-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.input-box {
  position: relative;
  margin: 30px 0;
}

.input-box input {
  width: 100%;
  padding: 18px 50px 18px 20px;
  background: #eee;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  box-sizing: border-box;
}

.input-box input::placeholder {
  color: #888;
  font-weight: 400;
}

.input-box i {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #888;
}

.forgot-link {
  margin: -15px 0 15px;
}

.forgot-link a {
  font-size: 14.5px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.btn {
  width: 100%;
  height: 48px;
  background: #7494ec;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  background: #5a7bd8;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.container p {
  font-size: 14.5px;
  margin: 15px 0;
}

.social-icons {
  display: flex;
  justify-content: center;
}

.social-icons a,
.social-icons button {
  display: inline-flex;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 24px;
  color: #333;
  text-decoration: none;
  margin: 0 8px;
  transition: all 0.3s ease;
}

.social-icons a:hover,
.social-icons button:hover {
  border-color: #7494ec;
  color: #7494ec;
  transform: translateY(-2px);
}

.social-icons.disabled button,
.social-icons.disabled button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ddd;
  color: #aaa;
  transform: none;
}

/* Match public/login disabled social buttons */
/* (reverted to previous simpler disabled style) */

.toggle-box {
  position: absolute;
  width: 100%;
  height: 100%;
}

.toggle-box::before {
  content: '';
  position: absolute;
  left: -250%;
  width: 300%;
  height: 100%;
  background: #7494ec;
  border-radius: 150px;
  z-index: 2;
  transition: 1.8s ease-in-out;
}

.container.active .toggle-box::before {
  left: 50%;
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  transition: 0.6s ease-in-out;
}

.toggle-panel.toggle-left {
  left: 0;
  transition-delay: 1.2s;
}

.container.active .toggle-panel.toggle-left {
  left: -50%;
  transition-delay: 0.6s;
}

.toggle-panel.toggle-right {
  right: -50%;
  transition-delay: 0.6s;
}

.container.active .toggle-panel.toggle-right {
  right: 0;
  transition-delay: 1.2s;
}

.toggle-panel p {
  margin-bottom: 20px;
}

.toggle-panel h1 {
  color: #fff;
  font-size: 36px;
  margin: -10px 0;
}

.toggle-panel .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 160px;
  height: 45px;
  background: transparent;
  border: 2px solid #fff;
  box-shadow: none;
  font-size: 15px;
}

.toggle-panel .btn i {
  font-size: 20px;
}

.toggle-panel .btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

@media screen and (max-width: 650px) {
  .container {
    height: calc(100vh - 40px);
  }
  
  .form-box {
    bottom: 0;
    width: 100%;
    height: 70%;
  }

  .container.active .form-box {
    right: 0;
    bottom: 30%;
  }
  
  .toggle-box::before {
    left: 0;
    top: -270%;
    width: 100%;
    height: 300%;
    border-radius: 20vw;
  }

  .container.active .toggle-box::before {
    left: 0;
    top: 70%;
  }
  
  .toggle-panel {
    width: 100%;
    height: 30%;
  }
  
  .toggle-panel.toggle-left {
    top: 0;
  }

  .container.active .toggle-panel.toggle-left {
    left: 0;
    top: -30%;
  }
  
  .toggle-panel.toggle-right {
    right: 0;
    bottom: -30%;
  }
  
  .container.active .toggle-panel.toggle-right {
    bottom: 0;
  }
}

@media screen and (max-width: 400px) {
  .form-box {
    padding: 20px;
  }
  
  .toggle-panel h1 {
    font-size: 30px;
  }
}
</style>


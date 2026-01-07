<template>
  <div class="login-container">
    <div class="container">
      <div class="form-box login">
        <form @submit.prevent="handleLogin">
          <h1>Sign In</h1>
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
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
          <p class="admin-notice">Admin only • No registration</p>
        </form>
      </div>

      <div class="toggle-box">
        <div class="toggle-panel toggle-right">
          <h1>Admin Portal</h1>
          <p>Authorized access</p>
          <div class="admin-icon">
            <i class='bx bxs-shield-alt-2'></i>
          </div>
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

const isLoading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

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
    authStore.setRole('admin')
    // 直接使用组件内的表单数据
    const data = await authStore.enterLoginWithData(loginForm.username.trim(), loginForm.password.trim(), 'admin')
    console.log('✅ 管理员登录成功:', data)
  } catch (error: any) {
    console.error('❌ 管理员登录失败:', error)
    // 错误信息已经在AuthService中通过ElMessage显示了
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  authStore.open(() => '请联系系统管理员重置密码')
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

.form-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
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
  margin-top: 10px;
}

.btn:hover:not(:disabled) {
  background: #5a7bd8;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.admin-notice {
  font-size: 14px;
  margin-top: 20px;
  color: #666;
  font-style: italic;
}

/* Match public/login disabled social buttons (for future admin social area if needed) */
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
  left: 0;
}

.toggle-panel h1 {
  font-size: 42px;
  margin-bottom: 20px;
  color: #fff;
}

.toggle-panel p {
  font-size: 16px;
  margin-bottom: 30px;
}

.admin-icon {
  font-size: 120px;
  opacity: 0.9;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@media screen and (max-width: 650px) {
  .container {
    height: calc(100vh - 40px);
    width: 95%;
  }
  
  .form-box {
    width: 100%;
    bottom: 0;
    height: 60%;
  }
  
  .toggle-box::before {
    left: 0;
    top: -270%;
    width: 100%;
    height: 300%;
    border-radius: 20vw;
  }
  
  .toggle-panel {
    width: 100%;
    height: 40%;
    top: 0;
  }
  
  .toggle-panel h1 {
    font-size: 32px;
  }
  
  .admin-icon {
    font-size: 80px;
  }
}

@media screen and (max-width: 400px) {
  .form-box {
    padding: 20px;
  }
  
  .toggle-panel h1 {
    font-size: 28px;
  }
  
  .admin-icon {
    font-size: 60px;
  }
}
</style>


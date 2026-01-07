<script lang="ts" setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { onMounted, ref, reactive } from "vue";
import {
  User,
  Avatar,
  UserFilled,
  Key,
  EditPen,
  SwitchButton as Logout,
} from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/useAuthStore";
import type { FormInstance, FormRules } from "element-plus";
import { change } from "@/services/AuthService";

const authStore = useAuthStore();
const userAvatar = "";
const passwordDialogVisible = ref(false);
const passwordFormRef = ref<FormInstance>();

// 密码表单数据
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 密码表单验证规则
const passwordRules = reactive<FormRules>({
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度必须在6-18位之间", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      // @ts-ignore
      validator: async (_rule, value) => {
        if (value !== passwordForm.newPassword) {
          throw new Error("两次输入的密码不一致");
        }
        return true;  // 验证通过时需要返回 true
      },
      trigger: "blur",
    },
  ],
});

// 提交密码修改
const submitPasswordChange = () => {
  passwordFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const data = await change(
          authStore.user.token,
          authStore.user.nickname,
          passwordForm.oldPassword,
          passwordForm.newPassword,
          authStore.user.username
        );
        authStore.user.token = data.Authorization;
        localStorage.setItem("user", JSON.stringify(authStore.user));
        authStore.isFresh = 0;
        localStorage.setItem("isFresh", JSON.stringify(authStore.isFresh));
        ElMessage.success("密码修改成功");
        passwordDialogVisible.value = false;
        // 重置表单
        passwordForm.oldPassword = "";
        passwordForm.newPassword = "";
        passwordForm.confirmPassword = "";
      } catch {
        ElMessage.error("密码修改失败,请重试");
      }
    }
  });
};

const handleLogout = () => {
  ElMessageBox.confirm("你确定退出登录吗？下次登录需重新输入用户名密码")
    .then(() => {
      authStore.logout();
      console.log("退出登录");
    })
    .catch((e) => {
      console.error(e);
    });
};

const handleModifyNickname = () => {
  authStore.changeUserNickname();
};

onMounted(() => {
  const userInfo = localStorage.getItem("user");
  authStore.user = userInfo
    ? JSON.parse(userInfo)
    : {
      id: 0,
      username: "未登录",
      role: "未登录",
      token: "未登录",
    };
});
</script>

<template>
  <el-dropdown class="user-dropdown">
    <div class="user-info">
      <el-avatar :size="32" :src="userAvatar">
        {{ authStore.user.nickname?.charAt(0) }}
      </el-avatar>
      <span class="username">{{ authStore.user.nickname }}</span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <el-icon>
            <User />
          </el-icon>UID: {{ authStore.user.id }}
        </el-dropdown-item>
        <el-dropdown-item>
          <el-icon>
            <Avatar />
          </el-icon>昵称：{{ authStore.user.nickname }}
        </el-dropdown-item>
        <el-dropdown-item>
          <el-icon>
            <Avatar />
          </el-icon>账号：{{ authStore.user.username }}
        </el-dropdown-item>
        <el-dropdown-item v-if="authStore.user.cno">
          <el-icon>
            <Avatar />
          </el-icon>班级：{{ authStore.user.cno }}
        </el-dropdown-item>
        <el-dropdown-item>
          <el-icon>
            <UserFilled />
          </el-icon>
          身份: &nbsp; {{ authStore.currentRoleCN }}
        </el-dropdown-item>
        <el-dropdown-item @click="handleModifyNickname" v-if="authStore.user.role === 'student'">
          <el-icon>
            <EditPen />
          </el-icon>修改昵称
        </el-dropdown-item>
        <el-dropdown-item @click="passwordDialogVisible = true">
          <el-icon>
            <Key />
          </el-icon>修改密码
        </el-dropdown-item>
        <el-dropdown-item @click="handleLogout" divided>
          <el-icon>
            <Logout />
          </el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <el-dialog v-model="passwordDialogVisible" title="修改密码" width="400px" center destroy-on-close append-to-body
    :modal-append-to-body="true" class="password-dialog">
    <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px" status-icon>
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请确认新密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPasswordChange">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.user-dropdown {
  cursor: pointer;
  border: none !important;
  outline: none !important;
}

.user-dropdown:hover,
.user-dropdown:focus,
:deep(.el-dropdown:focus),
:deep(.el-dropdown:focus-visible) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.user-dropdown:hover {
  border: none;
}

:deep(.el-dropdown) {
  outline: none !important;
}

:deep(.el-dropdown:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.el-focus-trap) {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
  outline: none !important;
}

.user-info:hover {
  background-color: var(--el-fill-color-light);
}

.username {
  font-size: 14px;
  color: var(--text-color);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.password-dialog) {
  z-index: 3000 !important;
}

:deep(.el-overlay) {
  z-index: 2999 !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

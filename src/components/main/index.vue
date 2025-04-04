<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToolsStore } from "@/stores/useToolsStore";
import { useSelectedToolStore } from "@/stores/useSelectedToolStore";
import { change } from "@/services/AuthService";
import { ElMessageBox, ElMessage } from "element-plus";

import Card from "@/components/main/Card.vue";
import BackTop from "@/components/use/backTop.vue";
import type { FormInstance, FormRules } from "element-plus";

const route = useRouter();
const toolsStore = useToolsStore();
const selectToolStore = useSelectedToolStore();
const activeName = ref("对话模型");
const titleH1 = ref("AI / LLM 模型工具集");

// const titleH2 = ref(
//   "100+中文 AI / LLM工具本站链接直达、体验工具后可以留下您对它的评价并写下评分的依据，谢谢！"
// );

const loading = ref(true);
const initialLoading = ref(true);
const authStore = useAuthStore();
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const form = reactive({
  name: "",
  oldPwd: "",
  newPwd: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
};

const gotoDetail = (tool: any) => {
  selectToolStore.selectTool(tool);
  route.push("/detail");
};

const handleSelect = (category: string) => {
  activeName.value = category;
  localStorage.setItem("activeName", JSON.stringify(category));
  scrollToCategory(category);
};

// 修改密码和昵称
const passwordDialogVisible = ref(false);
const passwordFormRef = ref<FormInstance>();

// (密码)表单数据
const passwordForm = reactive({
  nickname: "",
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
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

// 提交修改
const submitPasswordChange = () => {
  passwordFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const data = await change(
          authStore.user.token,
          passwordForm.nickname,
          passwordForm.oldPassword,
          passwordForm.newPassword,
          authStore.user.username
        );
        authStore.user.token = data.Authorization;
        authStore.user.nickname = passwordForm.nickname;
        localStorage.setItem("user", JSON.stringify(authStore.user));
        authStore.isFresh = 0;
        localStorage.setItem("isFresh", JSON.stringify(authStore.isFresh));
        ElMessage.success("修改成功");
        passwordDialogVisible.value = false;
        // 重置表单
        passwordForm.oldPassword = "";
        passwordForm.newPassword = "";
        passwordForm.confirmPassword = "";
        passwordForm.nickname = "";
      } catch {
        ElMessage.error("修改失败,请重试");
      }
    }
  });
};

onMounted(async () => {
  // 1. 检查是否已登录
  authStore.checkAuth();
  if (authStore.isFresh==1) {
    // dialogFormVisible.value = true;
    passwordDialogVisible.value = true;
  }

  // 2. 加载工具列表
  initialLoading.value = true;
  loading.value = true;

  await toolsStore.fetchCategory();
  const storedActive = localStorage.getItem("activeName");
  activeName.value = storedActive ? JSON.parse(storedActive) : "对话模型";
  handleSelect(activeName.value);

  // 首屏加载完成
  initialLoading.value = false;

  // 等待所有类别加载完成
  await new Promise((resolve) => setTimeout(resolve, 100)); // 给UI一个更新的机会
  loading.value = false;
});

const scrollToCategory = (category: string) => {
  const targetLink = document.querySelector(
    `.el-anchor a[href="#${category}"]`
  );
  if (targetLink) {
    (targetLink as HTMLElement).click();
  }
};

// 添加计算属性来获取已加载的类别
const loadedCategories = computed(() => {
  return toolsStore.categories.filter((category) =>
    toolsStore.loadedCategories.has(category)
  );
});

const ChangeInfoHandleSubmit = () => {
  authStore.changeUserPassword(form.name, form.oldPwd, form.newPwd);
  dialogFormVisible.value = false;
};
</script>

<template>
  <el-container v-loading="initialLoading">
    <div class="main-container">
      <div class="header">
        <div class="title">
          <h1 id="titleH1">{{ titleH1 }}</h1>
        </div>
      </div>
      <el-main class="main">
        <template v-if="!initialLoading">
          <div
            v-for="category in loadedCategories"
            :label="category"
            :name="category"
            :key="category"
          >
            <div class="card-title" :id="category">{{ category }}</div>
            <div class="cat-main">
              <Card
                v-for="(tool, index) in toolsStore.toolsByCategory[category]"
                :key="tool.id"
                class="tool-card"
                :style="{ '--index': index % 8 }"
                @click="gotoDetail(tool)"
              >
                <template #header>
                  <div class="tool-logo">
                    <img :src="tool.logo_url" :title="tool.name" />
                    <div class="tool-name">{{ tool.name }}</div>
                  </div>
                </template>
                <template #default>
                  <p class="tool-desc" @click="gotoDetail(tool)">
                    {{ tool.description }}
                  </p>
                </template>
                <template #info>
                  <div class="tool-info">
                    <div class="rating">
                      <span class="rating-score"
                        >{{ tool.score ?? Math.floor(Math.random() * 5) }}
                      </span>
                      <span style="margin-left: 4px">⭐</span>
                      <!-- <div class="rating-stars">
                        <el-rate
                          v-model="tool.score"
                          disabled
                          text-color="#ff9800"
                          score-template="{value}"
                          :show-score="false"
                        />
                      </div> -->
                      <div class="rating-count">
                        已有
                        {{
                          tool.ratingCount ?? Math.floor(Math.random() * 100)
                        }}
                        人评分
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>

          <!-- 显示剩余类别的加载状态 -->
          <div v-if="loading" class="skeleton-container">
            <div v-for="i in 2" :key="i" class="skeleton-category">
              <div class="skeleton-title"></div>
              <div class="skeleton-cards">
                <div v-for="j in 4" :key="j" class="skeleton-card">
                  <div class="skeleton-header"></div>
                  <div class="skeleton-body"></div>
                  <div class="skeleton-info"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="skeleton-container">
            <div v-for="i in 3" :key="i" class="skeleton-category">
              <div class="skeleton-title"></div>
              <div class="skeleton-cards">
                <div v-for="j in 4" :key="j" class="skeleton-card">
                  <div class="skeleton-header"></div>
                  <div class="skeleton-body"></div>
                  <div class="skeleton-info"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-main>
      <el-footer>
        <div class="footer">Footer</div>
      </el-footer>
    </div>
    <aside class="side-nav">
      <el-anchor
        :offset="65"
        :active="activeName"
        direction="vertical"
        type="default"
        @click="handleClick"
        @select="handleSelect"
        class="anchor"
      >
        <div class="anchor-title">分类导航</div>
        <el-anchor-link
          v-for="category in toolsStore.categories"
          :key="category"
          :href="`#${category}`"
          :title="category"
        ></el-anchor-link>
      </el-anchor>
    </aside>
    <div class="backTop">
      <BackTop />
    </div>
  </el-container>

  <!-- 对话框 ONE -->
  <el-dialog
    v-model="dialogFormVisible"
    title="🚀 起一个昵称吧，同时重置密码"
    width="600"
    height="400"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form :model="form">
      <el-form-item label="设置昵称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="输入原密码" :label-width="formLabelWidth">
        <el-input v-model="form.oldPwd" autocomplete="off" type="password" />
      </el-form-item>
      <el-form-item label="输入新密码" :label-width="formLabelWidth">
        <el-input v-model="form.newPwd" autocomplete="off" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消修改 </el-button>
        <el-button type="primary" @click="ChangeInfoHandleSubmit">
          确定修改
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 对话框 TWO -->
  <!-- 修改密码对话框 -->
  <el-dialog
    v-model="passwordDialogVisible"
    :title="`hi! ${authStore.user.username} | 为自己设置一下昵称和密码吧`"
    width="400px"
    center
    destroy-on-close
    append-to-body
    :modal-append-to-body="true"
    class="password-dialog"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form
      :model="passwordForm"
      :rules="passwordRules"
      ref="passwordFormRef"
      label-width="100px"
      status-icon
    >
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="passwordForm.nickname"
          type="password"
          show-password
          placeholder="请输入昵称"
        />
      </el-form-item>
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          v-model="passwordForm.oldPassword"
          type="password"
          show-password
          placeholder="请输入旧密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="passwordForm.confirmPassword"
          type="password"
          show-password
          placeholder="请确认新密码"
        />
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

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.el-container {
  background-color: var(--background-color);
  display: flex;
  padding: 10px 0 10px 10px;
  width: 100%;
  min-height: 100vh;

  .main-container {
    flex: 1;
    max-width: calc(100% - 220px);
    min-width: 0;
    text-align: left;
    margin-right: 20px;
  }

  .header {
    background-color: var(--background-color);
    width: 100%;

    #titleH1 {
      margin: $mains-title-margin;
      font: {
        size: $mains-title-font-size;
        weight: $mains-title-font-weight;
      }
      color: var(--text-color);
    }
  }

  .main {
    padding: 5px 10px 0 20px;

    .card-title {
      font: {
        size: 20px;
        weight: bold;
      }
      color: var(--text-color);
      padding: 10px 0 10px 20px;
      position: relative;
      cursor: pointer;

      &:hover::before {
        content: "#";
        color: #409eff;
        font-size: 22px;
        position: absolute;
        left: 0;
      }
    }
    .card-title:focus:after,
    .card-title:hover:after {
      width: 100%;
      left: 0%;
    }

    .card-title:after {
      content: "";
      pointer-events: none;
      bottom: -2px;
      left: 50%;
      position: absolute;
      width: 0%;
      height: 2px;
      color: var(--text-color);
      background-color: var(--text-color);
      transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
      transition-duration: 400ms;
      transition-property: width, left;
    }

    .cat-main {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .tool-card {
      cursor: pointer;
      max-width: 220px;
      justify-self: center;
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    .tool-logo {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;

      img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        border-radius: 6px;
      }

      .tool-name {
        font-size: 13px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .tool-desc {
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      line-height: 1.3;
      max-height: 3em;
      margin: 0 0 8px 0;
      flex-grow: 1;
    }
    .tool-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .rating {
        display: flex;
        align-items: center;

        .rating-score {
          font-size: 13px;
          font-weight: 600;
          color: #ff9800;
          padding-top: 1px;
        }

        .rating-stars {
          line-height: 1;
          transform: scale(0.8);
          transform-origin: left;
        }

        .rating-count {
          margin-left: 10px;
        }
      }
    }
  }
}
.side-nav {
  position: fixed;
  right: 90px;
  top: 120px;
  .anchor-title {
    font: {
      size: 14px;
      weight: bold;
    }
    color: var(--text-color);
    padding-bottom: 10px;
  }
  .el-anchor__list,
  .el-anchor {
    background-color: var(--background-color);
  }
}
@media screen and (max-width: 768px) {
  .side-nav {
    display: none;
    width: 0;
  }
}

.skeleton-container {
  padding: 20px;
}

.skeleton-category {
  margin-bottom: 40px;
}

.skeleton-title {
  height: 24px;
  width: 120px;
  background: var(--el-skeleton-color);
  border-radius: 4px;
  margin-bottom: 20px;
}

.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  padding: 16px;
}

.skeleton-card {
  height: 160px;
  background: var(--el-skeleton-color);
  border-radius: 3px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .skeleton-header {
    height: 48px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .skeleton-body {
    height: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .skeleton-info {
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.skeleton-card,
.skeleton-title {
  background: linear-gradient(
    90deg,
    var(--el-skeleton-color) 25%,
    var(--el-skeleton-to-color) 37%,
    var(--el-skeleton-color) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
}

/* 添加对话框TWO样式 */
:deep(.password-dialog) {
  z-index: 3000 !important; /* 确保对话框在最上层 */
}

:deep(.el-overlay) {
  z-index: 2999 !important; /* 确保遮罩层在对话框下方但在其他内容上方 */
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

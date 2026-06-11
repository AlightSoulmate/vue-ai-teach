<template>
  <div class="form-page">
    <div v-if="isLoading" class="loader-container">
      <Loading />
    </div>

    <main v-else class="content-container">
      <section class="brand-section">
        <div class="brand-mark">ZISU AI Teach</div>
        <h1 class="brand-title">AI 智能教学平台</h1>
        <p class="brand-subtitle">浙江外国语学院教学服务入口</p>

        <div class="campus-panel" aria-hidden="true">
          <div class="panel-toolbar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="panel-grid">
            <div class="panel-main"></div>
            <div class="panel-side">
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>
          <div class="panel-foot">
            <span></span>
            <span></span>
          </div>
        </div>
      </section>

      <EnterDialog class="form-section" @username-change="updateUsername" />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Loading from "@/components/use/loading.vue";
import EnterDialog from "@/components/use/enter.vue";

const isLoading = ref<boolean>(true);
const currentUsername = ref<string>("");
let debounceTimer: number | null = null;

const updateUsername = (username: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    currentUsername.value = username;
    debounceTimer = null;
  }, 220) as unknown as number;
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 280);
});
</script>

<style lang="scss" scoped>
.form-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background:
    radial-gradient(circle at 16% 18%, rgba(64, 158, 255, 0.12), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #f3f7fb 52%, #f8fafc 100%);
  overflow: hidden;
}

.loader-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fbff;
  z-index: 10;
}

.content-container {
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) 440px;
  gap: 64px;
  align-items: center;
  animation: pageEnter 0.42s ease-out both;
}

.brand-section {
  color: #1f2937;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 13px;
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.68);
  color: #1d4ed8;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 10px 28px rgba(31, 41, 55, 0.06);
}

.brand-title {
  max-width: 520px;
  margin: 26px 0 12px;
  font-size: 48px;
  line-height: 1.12;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0;
}

.brand-subtitle {
  max-width: 560px;
  margin: 0;
  color: #64748b;
  font-size: 18px;
  line-height: 1.7;
}

.campus-panel {
  width: min(520px, 100%);
  margin-top: 46px;
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.58);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
}

.panel-toolbar {
  display: flex;
  gap: 7px;
  margin-bottom: 18px;
}

.panel-toolbar span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #cbd5e1;
}

.panel-grid {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 14px;
}

.panel-main {
  height: 172px;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.16), transparent 58%),
    linear-gradient(160deg, #ffffff, #eaf3ff);
  border: 1px solid rgba(191, 219, 254, 0.72);
}

.panel-side {
  display: grid;
  gap: 12px;
}

.panel-side i,
.panel-foot span {
  display: block;
  border-radius: 8px;
  background: #eef4fb;
  border: 1px solid rgba(203, 213, 225, 0.72);
}

.panel-side i {
  height: 49px;
}

.panel-foot {
  display: grid;
  grid-template-columns: 1fr 0.58fr;
  gap: 12px;
  margin-top: 14px;
}

.panel-foot span {
  height: 42px;
}

.form-section {
  width: 100%;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 920px) {
  .form-page {
    padding: 32px 18px;
    overflow: auto;
  }

  .content-container {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .brand-section {
    text-align: center;
  }

  .brand-title {
    max-width: 100%;
    font-size: 34px;
  }

  .brand-subtitle,
  .campus-panel {
    max-width: 100%;
  }
}

@media (max-width: 560px) {
  .brand-title {
    font-size: 29px;
  }

  .campus-panel {
    display: none;
  }
}
</style>

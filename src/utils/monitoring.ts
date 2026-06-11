import { getBooleanEnv } from "@/utils/env";

interface RuntimeErrorPayload {
  type: "js_error" | "promise_error" | "blank_screen";
  message: string;
  stack?: string;
  path: string;
  createdAt: string;
}

const MONITOR_KEY = "ai_teach_monitor_events";

function persistEvent(payload: RuntimeErrorPayload) {
  const current = JSON.parse(localStorage.getItem(MONITOR_KEY) || "[]") as RuntimeErrorPayload[];
  current.unshift(payload);
  localStorage.setItem(MONITOR_KEY, JSON.stringify(current.slice(0, 20)));
}

function report(payload: RuntimeErrorPayload) {
  persistEvent(payload);
  if (import.meta.env.DEV) {
    console.warn("[monitor]", payload);
  }
}

export function setupRuntimeMonitoring() {
  if (!getBooleanEnv("VITE_APP_MONITOR_ENABLE")) return;

  window.addEventListener("error", (event) => {
    report({
      type: "js_error",
      message: event.message,
      stack: event.error?.stack,
      path: location.href,
      createdAt: new Date().toISOString(),
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    report({
      type: "promise_error",
      message: reason?.message || String(reason),
      stack: reason?.stack,
      path: location.href,
      createdAt: new Date().toISOString(),
    });
  });

  window.setTimeout(() => {
    const app = document.querySelector("#app");
    const visibleText = app?.textContent?.trim();
    if (!visibleText) {
      report({
        type: "blank_screen",
        message: "应用首屏无有效文本内容",
        path: location.href,
        createdAt: new Date().toISOString(),
      });
    }
  }, 4000);
}

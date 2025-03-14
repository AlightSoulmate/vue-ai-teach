export function getEnvValue<T = string>(key: keyof ImportMetaEnv): T {
  const envValue = import.meta.env[key];
  return envValue as unknown as T;
}

export function isDevMode(): boolean {
  return getEnvValue("VITE_APP_ENV") === "development";
}

// 添加调试信息
console.log(
  "当前环境:",
  getEnvValue("VITE_APP_TITLE"),
  getEnvValue("VITE_APP_ENV")
);
console.log("BASE API:", getEnvValue("VITE_APP_BASE_API"));

export function isProdMode(): boolean {
  return getEnvValue("VITE_APP_ENV") === "production";
}

export function isStagingMode(): boolean {
  return getEnvValue("VITE_APP_ENV") === "staging";
}

export function getBaseUrl(): string {
  return getEnvValue("VITE_APP_BASE_API");
}

export function isMockEnabled(): boolean {
  return getEnvValue<boolean>("VITE_APP_MOCK_ENABLE");
}

export function getMockApi(): string | undefined {
  return getEnvValue("VITE_APP_MOCK_API");
}

export function getAppTitle(): string {
  return getEnvValue("VITE_APP_TITLE");
}

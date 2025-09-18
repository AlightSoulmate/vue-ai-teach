export function getEnvValue<T = string>(key: keyof ImportMetaEnv): T {
  const envValue = import.meta.env[key];

  // 更严格地处理布尔值转换
  if (typeof envValue === "string") {
    // 如果期望返回布尔值
    if (typeof (null as unknown as T) === "boolean") {
      return (envValue.toLowerCase() === "true") as unknown as T;
    }
  }

  return envValue as unknown as T;
}

export function isDevMode(): boolean {
  return getEnvValue("VITE_APP_ENV") === "development";
}

console.log("🔍 环境初始化：", {
  env: getEnvValue("VITE_APP_TITLE"),
  mode: getEnvValue("VITE_APP_ENV"),
  mockStatus: getEnvValue("VITE_APP_MOCK_ENABLE"),
  mock_url: getEnvValue("VITE_APP_MOCK_API") ?? "无",
  base_url: getEnvValue("VITE_APP_BASE_API"),
});

export function isProdMode(): boolean {
  return getEnvValue("VITE_APP_ENV") === "production";
}

export function isStagingMode(): boolean {
  return getEnvValue("VITE_APP_ENV") === "staging";
}

export function getBaseUrl(): string {
  return getEnvValue("VITE_APP_BASE_API");
}

export function getBooleanEnv(key: keyof ImportMetaEnv): boolean {
  const value = import.meta.env[key];

  if (value === true) return true;
  if (typeof value === "string") {
    const cleanValue = value.trim().replace(/^['"](.*)['"]$/, "$1");
    return cleanValue.toLowerCase() === "true";
  }
  return false;
}

export function isMockEnabled(): boolean {
  return getBooleanEnv("VITE_APP_MOCK_ENABLE");
}

export function getMockApi(): string | undefined {
  return getEnvValue("VITE_APP_MOCK_API");
}

export function getAppTitle(): string {
  return getEnvValue("VITE_APP_TITLE");
}

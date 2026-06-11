export function getEnvValue<T = string>(key: keyof ImportMetaEnv): T {
  const envValue = import.meta.env[key];
  return envValue as unknown as T;
}

export function isDevMode(): boolean {
  return getEnvValue("VITE_APP_ENV") === "development";
}

export function isProdMode(): boolean {
  return getEnvValue("VITE_APP_ENV") === "production";
}

export function isStagingMode(): boolean {
  return getEnvValue("VITE_APP_ENV") === "staging";
}

export function getBaseUrl(): string {
  return getEnvValue("VITE_APP_BASE_API") || "/api";
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

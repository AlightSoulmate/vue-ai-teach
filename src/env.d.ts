/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_BASE_API: string;
  readonly VITE_APP_MOCK_ENABLE: string | boolean;
  readonly VITE_APP_MOCK_API?: string;
  readonly VITE_APP_DEMO_MODE?: string | boolean;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_MONITOR_ENABLE?: string | boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

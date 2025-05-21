/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_BASE_API: string;
  readonly VITE_APP_MOCK_ENABLE: boolean;
  readonly VITE_APP_MOCK_API?: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 声明Vue组件类型
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 修复@路径别名类型问题
declare module '@/*' {
  const content: any
  export = content
  export * from '*'
}

declare module '@/services' {
  export * from '../services'
}

declare module '@/services/*' {
  const content: any
  export default content
  export * from '../services/*'
}

declare module '@/stores/*' {
  const content: any
  export default content
  export * from '../stores/*'
}

declare module '@/utils/*' {
  const content: any
  export default content
  export * from '../utils/*'
}

declare module '@/router/*' {
  const content: any
  export default content
  export * from '../router/*'
}

declare module '@/interfaces/*' {
  const content: any
  export default content
  export * from '../interfaces/*'
}

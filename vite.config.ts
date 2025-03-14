import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from "vite-plugin-style-import";
import viteCompression from "vite-plugin-compression"; // gzip压缩减少包体积
import { visualizer } from "rollup-plugin-visualizer"; // 打包分析工具

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    createStyleImportPlugin({
      resolves: [ElementPlusResolve()],
    }),
    viteCompression(),
    visualizer({ open: true }),
  ],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      // "/api": {
      //   target: "https://frp-man.com:49044",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      // },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/_variables.scss" as *;
          @use "@/styles/_mixins.scss" as *;
        `,
      },
    },
  },
});

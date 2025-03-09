import { fileURLToPath, resolve, URL } from "node:url";
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
    visualizer({ open: true }), // 打包后自动打开分析页面
  ],
  base: "./",
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes("node_modules")) {
  //           if (id.includes("vue")) return "vendor-vue"; // Vue 相关的库单独打包
  //           if (id.includes("lodash")) return "vendor-lodash"; // lodash 单独打包
  //           return "vendor"; // 其他第三方库
  //         }
  //       },
  //     },
  //   },
  // },
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
      // "/llm": {
      //   target: "http://js1.blockelite.cn:27078",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/llm/, ""),
      // },
    },
  },
});

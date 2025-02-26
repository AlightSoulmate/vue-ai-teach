import path from "path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from "vite-plugin-style-import";
import ViteSvgIconsPlugin from "vite-plugin-svg-icons";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    createStyleImportPlugin({
      resolves: [ElementPlusResolve()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    // allowedHosts: ["99t207r710.zicp.fun"],
    proxy: {
      "/llm": {
        target: "http://js1.blockelite.cn:27078",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/llm/, ""), // 去掉 /llm 前缀
      },
    },
  },
});

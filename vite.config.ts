import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import UnoCss from "unocss/vite";

import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), UnoCss()],

  resolve: {
    alias: {
      "@": resolve(process.cwd(), ".", "src"),
    },
  },
  server: {
    host: true,
    proxy: {
      "/basic-api": {
        target: "http://192.168.188.119:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/basic-api/, ""),
      },
    },
  },
  build: {
    outDir: "RELEASE/dist",
    lib: {
      entry: "./src/lib/index.ts",
      name: "FileManager",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue", "axios", "jszip"],
      output: {
        globals: {
          vue: "Vue",
          axios: "axios",
          jszip: "jszip",
        },
      },
    },
    minify: "esbuild",
  },
});

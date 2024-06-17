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
        target: "http://localhost:5715",

        changeOrigin: true,

        rewrite: (path) => path.replace(/^\/basic-api/, ""),
      },
    },
  },
});

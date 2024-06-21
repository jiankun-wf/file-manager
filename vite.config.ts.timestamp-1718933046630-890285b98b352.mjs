// vite.config.ts
import { defineConfig } from "file:///D:/vite-npm/file-manager/node_modules/.pnpm/vite@5.3.1_@types+node@20.14.2_less@4.2.0/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/vite-npm/file-manager/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.1_vue@3.4.29/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/vite-npm/file-manager/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.0_vite@5.3.1_vue@3.4.29/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import UnoCss from "file:///D:/vite-npm/file-manager/node_modules/.pnpm/unocss@0.61.0_postcss@8.4.38_vite@5.3.1/node_modules/unocss/dist/vite.mjs";
import { resolve } from "path";
var vite_config_default = defineConfig({
  plugins: [vue(), vueJsx(), UnoCss()],
  resolve: {
    alias: {
      "@": resolve(process.cwd(), ".", "src")
    }
  },
  server: {
    host: true,
    proxy: {
      "/basic-api": {
        target: "http://localhost:5715",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/basic-api/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx2aXRlLW5wbVxcXFxmaWxlLW1hbmFnZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHZpdGUtbnBtXFxcXGZpbGUtbWFuYWdlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovdml0ZS1ucG0vZmlsZS1tYW5hZ2VyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiO1xuaW1wb3J0IFVub0NzcyBmcm9tIFwidW5vY3NzL3ZpdGVcIjtcblxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCksIHZ1ZUpzeCgpLCBVbm9Dc3MoKV0sXG5cbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcIi5cIiwgXCJzcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogdHJ1ZSxcbiAgICBwcm94eToge1xuICAgICAgXCIvYmFzaWMtYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTcxNVwiLFxuXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcblxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYmFzaWMtYXBpLywgXCJcIiksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1EsU0FBUyxvQkFBb0I7QUFDN1IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFlBQVk7QUFFbkIsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUFBLEVBRW5DLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxLQUFLLEtBQUs7QUFBQSxJQUN4QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUVSLGNBQWM7QUFBQSxRQUVkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxnQkFBZ0IsRUFBRTtBQUFBLE1BQ3BEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

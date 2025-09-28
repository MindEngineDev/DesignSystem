import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    open: "/pages/dashboard.html"
    // hmr: { overlay: false }, // uncomment if you prefer no error overlay
  }
});

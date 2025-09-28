import { defineConfig } from "vite";
export default defineConfig({
  server: {
    port: 5173,
    open: "/pages/app-shell.html",  // open je hub
    // hmr: { overlay: false },     // zet aan als je de overlay storend vindt
  }
});

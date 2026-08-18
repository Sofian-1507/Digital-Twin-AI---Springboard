import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxies /api/* to the backend so the dev server (localhost:5173) and the
    // API appear same-origin to the browser — required for the httpOnly auth
    // cookie to work without cross-origin SameSite=None/Secure (HTTPS) locally.
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
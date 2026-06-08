import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Code-splitting per playground keeps the initial bundle small; each module
// is lazy-loaded on navigation (see src/modules/registry.ts).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    target: "es2020",
    sourcemap: false,
  },
});

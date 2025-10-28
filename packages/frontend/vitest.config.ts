import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: "forks",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        ".next/",
        "dist/",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/components/ui": path.resolve(__dirname, "./components/ui"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@/lib/utils": path.resolve(__dirname, "./lib/utils"),
      "@/lib/mock-data": path.resolve(__dirname, "./src/lib/mock-data"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/src/lib": path.resolve(__dirname, "./src/lib"),
    },
  },
});

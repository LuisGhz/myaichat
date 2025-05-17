/// <reference types="vitest" />
// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/AppRouter.tsx",
        "src/hooks/useToast.ts",
        "src/vite-env.d.ts",
        "src/types/**",
        "src/assets/**",
        "src/consts/**",
        "src/components/ChatsLoading.tsx",
        "src/hooks/useMarkdown.tsx",
        "src/components/Prompts/PromptSchema.ts",
      ],
    },
  },
  plugins: [
    react(),
    tsConfigPaths(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "My AI Chat",
        short_name: "MyAIChat",
        description: "An AI chat application",
        theme_color: "#000000",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
});

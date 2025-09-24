// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/types/**",
        "src/assets/**",
        "src/store/**",
        "src/icons/**",
        "src/core/const/**",
        "src/shared/models/**",
        "src/App.tsx",
        "src/AppRouter.tsx",
        "src/api/index.ts",
        "src/features/Auth/pages/Login.tsx",
        "src/features/Chat/components/InputSection/AudioSendingLoader.tsx",
        "src/features/Chat/components/AssistantTyping.tsx",
        "src/features/Chat/hooks/useChatParams.ts",
        "src/theme/AntdThemeProvider.tsx",
      ],
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "My AI Chat",
        short_name: "MyAIChat",
        description: "An AI chat application",
        theme_color: "#000000",
        icons: [
          {
            src: "myaichat-pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "myaichat-pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "myaichat-pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});

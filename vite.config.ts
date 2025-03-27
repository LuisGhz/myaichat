import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsConfigPaths(), tailwindcss()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
});

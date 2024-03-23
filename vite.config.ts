import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
  ],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        //options: './options.html'
        content: 'src/scripts/content.ts',
        background: 'src/scripts/background.ts'
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import fs from "fs-extra"

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
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

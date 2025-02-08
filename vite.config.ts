import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/CalculatorJs/",
  build: {
    outDir: 'dist', // Ensure this matches your GitHub Actions config
  },
})

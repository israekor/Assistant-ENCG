import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['frontend', 'localhost'],
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
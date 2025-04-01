import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ react()],
  base:"/ResistAI/",
  server: {
    host: true, // Allow access from network devices over-local ip
    port: 5000  // You can change this to any other port if needed
  }
})

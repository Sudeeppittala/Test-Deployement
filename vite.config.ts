
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the base to your repository name so assets load correctly
  // e.g. https://user.github.io/Test-Deployement/
  base: '/Test-Deployement/', 
})

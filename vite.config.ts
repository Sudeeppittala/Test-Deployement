
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base' is important for GitHub Pages to ensure assets are loaded correctly
  // from the repository subdirectory (e.g. /repo-name/)
  base: './', 
})

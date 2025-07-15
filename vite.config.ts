import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

// Custom plugin to handle asset files properly
const asset404Plugin = () => {
  return {
    name: 'asset-404',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url
        if (!url) return next()
        
        // Check if this is an asset file request
        const assetExtensions = ['.glb', '.gltf', '.bin', '.obj', '.fbx', '.dae', '.meta']
        const isAssetRequest = assetExtensions.some(ext => url.includes(ext))
        
        if (isAssetRequest) {
          // Check if file exists in public directory
          const publicPath = path.join(process.cwd(), 'public', url)
          if (!fs.existsSync(publicPath)) {
            // Return 404 for missing asset files
            res.statusCode = 404
            res.end('Asset file not found')
            return
          }
        }
        
        // Continue with normal processing
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    tailwindcss(),
    asset404Plugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.bin', '**/*.obj', '**/*.fbx', '**/*.dae', '**/*.meta'],
})

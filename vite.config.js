import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true // Exposes the server on the network
  }
})

// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '')
//   return {
//     plugins: [react()],
//     server: {
//       host: true,
//       https: true, // change to true if needed

//     },
//     define: {
//       'process.env': env, // Makes env vars accessible if needed
//     },
//   }
// })

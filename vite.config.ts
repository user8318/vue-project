import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueComponents from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_GATEWAY, VITE_API_TEMPLATE, VITE_WS_TEMPLATE } = env
  return {
    base: '/',
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          {
            dayjs: [['default', 'dayjs']],
          },
        ],
        dts: 'auto-import.d.ts',
        dirs: ['src/utils/auto-import', 'src/components/tsx', 'src/api/services.ts'],
        vueTemplate: true,
      }),
      VueComponents({
        dts: 'vue-components.d.ts',
        resolvers: [NaiveUiResolver()],
        include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5300,
      host: true,
      proxy: {
        [VITE_API_TEMPLATE]: {
          target: VITE_GATEWAY,
          changeOrigin: true,
        },
        [VITE_WS_TEMPLATE]: {
          target: VITE_GATEWAY,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  }
})

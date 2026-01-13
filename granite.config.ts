import { defineConfig } from '@apps-in-toss/web-framework/config'

export default defineConfig({
  appName: 'dubaiprince',
  brand: {
    displayName: '두바이 왕자',
    primaryColor: '#F59E0B',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
})

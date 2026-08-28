import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/index.css'
import '@/utils/auto-import/use-naive-ui'

import App from './App.vue'
import router from './router'
import { useMock } from '@/mocks'

const app = createApp(App)

app.use(createPinia())
app.use(router)

await useMock()

app.mount('#app')

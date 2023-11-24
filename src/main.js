import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ace from 'ace-builds'
import themeChromeUrl from 'ace-builds/src-noconflict/theme-chaos?url'
ace.config.setModuleUrl('ace/theme/chaos', themeChromeUrl)

import '@/assets/scss/theme.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

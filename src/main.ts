import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import App from './App.vue'

import router from './router'
import vuetify from './plugins/vuetify'

createApp(App).use(router).use(vuetify).use(createPinia()).mount('#app')

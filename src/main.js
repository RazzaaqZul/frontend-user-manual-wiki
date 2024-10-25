import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import AnimateOnScroll from 'primevue/animateonscroll'

import Aura from '@primevue/themes/aura'

const app = createApp(App)

app.use(createPinia())

// Registerting the router plugin
app.use(router)

app.mount('#app')
// Framework Prime Vue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  }
})

app.directive('animateonscroll', AnimateOnScroll)

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth' // Importa el store de autenticación

// 🔥 importa quasar y sus estilos
import { Quasar, Notify } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// 🔥 Asegúrate de que el estado de autenticación esté listo antes de montar la app
const authStore = useAuthStore()
authStore.checkAuth().then(() => {
  app.use(Quasar, {
    plugins: {
      Notify
    }
  })
  app.use(router)
  app.mount('#app')
})
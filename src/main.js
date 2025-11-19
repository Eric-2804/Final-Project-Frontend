import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './router'

// 🔥 importa quasar y sus estilos
import { Quasar, Notify } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(App)
const pinia = createPinia() // ya estará definida correctamente

// 🔥 registra los plugins
app.use(Quasar, { plugins: {Notify} })
app.use(pinia) 
app.use(router)

app.mount('#app')

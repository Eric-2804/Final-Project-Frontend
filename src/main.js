import { createApp } from 'vue'
import App from './App.vue'

// 🔥 importa quasar y sus estilos
import { Quasar } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(App)

// 🔥 registra quasar
app.use(Quasar, { plugins: {} })

app.mount('#app')
import { createApp } from 'vue' 
import App from './App.vue' 

import installQuasar from './plugins/quasar'; 
import router from './router';

const app = createApp(App); 

installQuasar(app); 
app.use(router);

app.mount('#app')
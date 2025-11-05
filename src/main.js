import { createApp } from "vue";
import { Quasar } from "quasar";
import quasarIconSet from "quasar/icon-set/material-icons";
import quasarLang from "quasar/lang/es";
import { createPinia } from "pinia";
import router from "./router/index.js";
import App from "./App.vue";

import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

const app = createApp(App);

app.use(Quasar, {
  plugins: {}, 
  lang: quasarLang,
  iconSet: quasarIconSet,
});

app.use(createPinia());
app.use(router);

app.mount("#app");

import { Quasar, Notify } from 'quasar';
import 'quasar/src/css/index.sass';
import '@quasar/extras/material-icons/material-icons.css';

export default function installQuasar(app) {
  app.use(Quasar, {
    plugins: {
      Notify,
    },
  });
}
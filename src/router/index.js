import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login.vue'


const routes = [
  { path: '/', name: 'login', component: login },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// Protección de rutas para que no ingrese a otras paginas sin estar logueados 
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
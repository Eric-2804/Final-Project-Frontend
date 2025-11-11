import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login.vue'
import Home from "../views/home.vue";
import { useAuthStore } from "../store/authStore";


const routes = [
  { path: '/', name: 'login', component: login },
  { 
    path: "/home", component: Home, meta: { requiresAuth: true }
  },
  { path: "/", redirect: "/login" },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protección de rutas para que no ingresen a otra pagina sin loguearse 
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router

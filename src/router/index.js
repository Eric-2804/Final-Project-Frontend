import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/login.vue";
import Home from "../views/home.vue";
import Dashboard from "../views/dashboard.vue";
import { useAuthStore } from "../store/authStore";

const routes = [
  { path: "/login", component: Login },
  { 
    path: "/dashboard", component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: "/home", component: Home,
    meta: { requiresAuth: true }
  },
  { path: "/", redirect: "/login" },
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;

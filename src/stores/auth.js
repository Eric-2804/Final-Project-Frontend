import { defineStore } from 'pinia';
import { getUserById } from '@/services/usuariosColegioService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthReady: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.rol || null
  },

  actions: {
    async login(token, user) {
      this.token = token;
      localStorage.setItem('token', token);

      let finalUser = user;

      if ((!user.roles || user.roles.length === 0) && !user.rol && user.id) {
        try {
          const fullUserData = await getUserById(user.id);
          if (fullUserData) {
            finalUser = fullUserData;
          }
        } catch (error) {
          console.error("Error al buscar los datos completos del usuario:", error);
          this.logout();
          return;
        }
      }

      let roleToUse = null;
      if (finalUser?.roles && Array.isArray(finalUser.roles) && finalUser.roles.length > 0) {
        roleToUse = finalUser.roles[0];
      } else if (finalUser?.rol) {
        roleToUse = finalUser.rol;
      } else if (finalUser?.role) {
        roleToUse = finalUser.role;
      }

      const normalizedRole = roleToUse ? String(roleToUse).trim().toLowerCase() : null;
      
      const userData = { ...finalUser, rol: normalizedRole };

      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    setUser(user) {
      // This action should handle the full user object and normalize it
      let roleToUse = null;
      if (user?.roles && Array.isArray(user.roles) && user.roles.length > 0) {
        roleToUse = user.roles[0];
      } else if (user?.rol) {
        roleToUse = user.rol;
      } else if (user?.role) {
        roleToUse = user.role;
      }

      const normalizedRole = roleToUse ? String(roleToUse).trim().toLowerCase() : null;
      
      const userData = { ...user, rol: normalizedRole };

      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },

    async refreshUserData() {
      if (this.user && this.user.id) {
        try {
          const fullUserData = await getUserById(this.user.id);
          if (fullUserData) {
            // We have the full, fresh user data. Use setUser to update the state.
            this.setUser(fullUserData);
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
          // Optional: handle error, maybe logout user if token is invalid
        }
      }
    },

    async checkAuth() {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');

      if (token && userString) {
        const user = JSON.parse(userString);

        if (user._id && !user.id) {
          user.id = user._id;
        }

        await this.login(token, user);
      } else {
        this.logout();
      }
      
      this.isAuthReady = true;
    },
  }
})
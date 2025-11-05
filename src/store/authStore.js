import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    login(email, password) {
      const fakeUsers = [
        { email: "admini@demo.com", password:"Administrador123.", role:"Administrador"},
        { email: "admin@demo.com", password: "1234", role: "Administrador" },
        { email: "coord@demo.com", password: "1234", role: "Coordinador" },
        { email: "prof@demo.com", password: "1234", role: "Profesor" },
        { email: "rector@demo.com", password: "1234", role: "Rector" },
        { email: "secret@demo.com", password: "1234", role: "Secretaria" },
        { email: "estu@demo.com", password: "1234", role: "Estudiante" },
        { email: "acud@demo.com", password: "1234", role: "Acudiente" },
      ];

      const found = fakeUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!found) throw new Error("Credenciales incorrectas");

      const token = Math.random().toString(36).substring(2); 

      this.user = { email: found.email, role: found.role };
      this.token = token;

      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("token", token);
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

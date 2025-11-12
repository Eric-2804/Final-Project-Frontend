import perfilEstudiante from "../views/students/perfilStudent.vue"


export default {
  options: {
    routes: [
      {
        path: "/perfil-estudiante",
        name: "perfilEstudiante",
        component: perfilEstudiante,
        meta: { requiresAuth: true, role: "Estudiante" }
      },
      
      
    ]
  }
}

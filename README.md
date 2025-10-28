Pasos para Empezar
1️⃣ Clonar el repositorio (este fork)

Cada integrante debe clonar este fork, no el repositorio original.

git clone https://github.com/Eric-2804/Final-Project-Frontend.git
cd Proyecto-final


Si el SSH da error, también puedes usar HTTPS:

git clone https://github.com/Eric-2804/Final-Project-Frontend.git

2️⃣ Cambiar a la rama base del frontend

Antes de crear su propia rama, asegúrense de estar en la rama frontend:

git checkout frontend

3️⃣ Crear su rama de trabajo

Cada pareja trabajará en una rama propia, identificada con los nombres de los integrantes.
De esta forma se sabrá fácilmente quién está a cargo de cada módulo o vista.

Ejemplo:

git checkout -b frontend-Laura-Tatiana


🔹 Usen siempre el formato:
frontend-[Nombre1-Nombre2]
(sin espacios, con guiones medios)

4️⃣ Subir su rama al repositorio remoto

Después de crear la rama, deben subirla al fork para que quede disponible en GitHub:

git push origin frontend-Laura-Tatiana


 Reemplacen Laura-Tatiana por los nombres de su propia pareja.

5️⃣ Mantener su rama actualizada con la rama principal (frontend)

Cada cierto tiempo (o antes de hacer un pull request), actualicen su rama con los últimos cambios del equipo:

git fetch origin
git checkout frontend
git pull origin frontend
git checkout frontend-Laura-Tatiana
git merge frontend
git push origin frontend-Laura-Tatiana


Esto evita conflictos y asegura que todos trabajen con la versión más reciente.

6️⃣ Hacer Pull Request (PR)

Cuando terminen su parte o una versión estable del módulo:

Suban los últimos cambios:

git push origin frontend-Laura-Tatiana


En GitHub, abran un nuevo Pull Request (PR) desde su rama hacia la rama frontend.

Agreguen una descripción clara del trabajo realizado.

🔸 Ejemplo de título de PR:
“Agrega interfaz de login con validación de usuario y alertas visuales”

7️⃣ Comunicación y coordinación

Cada pareja solo debe modificar los archivos de su módulo o vista.

Si necesitan usar componentes comunes (header, footer, botones, etc.), consulten antes para evitar conflictos.

No hacer commits directamente sobre la rama frontend.

🧭 Resumen visual del flujo de trabajo
┌──────────────────────────
│ Fork de Final-Project-Frontend 
│  (rama base: frontend)   
└────────────┬───────────────────
             │
             ▼
    Cada pareja crea su rama:
     ├── frontend-Laura-Tatiana
     ├── frontend-Juan-Pedro
     ├── frontend-Ana-Maria
     ├── frontend-Carlos-Luisa
     ├── frontend-Sofia-Andres
     ├── frontend-Mateo-Daniela
     ├── frontend-Diana-Paula
     └── frontend-Sergio-Valentina
             │
             ▼
     Trabajan, hacen commits,
     actualizan y luego PR → frontend

💡 Buenas prácticas Git (recomendado)

Commits pequeños y descriptivos.
Ejemplo:

git commit -m "Agrega formulario de login con validaciones básicas"


Un PR por funcionalidad o vista.
No mezclar varios módulos en un solo PR.

Actualizar antes de subir.
Siempre hacer:

git fetch origin && git pull origin frontend


antes de un push importante.

Comentarios claros.
Dejar notas breves en el código si algo requiere revisión.
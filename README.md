# 🚀 Pasos para Empezar — Flujo de trabajo Frontend

Este repositorio es un **fork** del proyecto principal.  
Cada integrante trabajará en su propia rama dentro de **este fork**, y **todas las Pull Requests (PR)** se harán hacia la rama `frontend` de este mismo repositorio.

---

## 1️⃣ Clonar el repositorio (este fork)

Cada integrante debe clonar **este fork**, no el repositorio original.

```bash
git clone https://github.com/Eric-2804/Final-Project-Frontend.git
cd Final-Project-Frontend
```

Si el método SSH da error, pueden usar HTTPS (ya está en el ejemplo anterior).

---

## 2️⃣ Cambiar a la rama base del frontend

Antes de crear su rama de trabajo, asegúrense de estar en la rama `frontend`:

```bash
git checkout frontend
```

---

## 3️⃣ Crear su rama de trabajo

Cada pareja trabajará en una rama propia, identificada con los nombres de los integrantes.

**Formato recomendado:**

```text
frontend-[Nombre1-Nombre2]
```

**Ejemplo:**

```bash
git checkout -b frontend-Laura-Tatiana
```

🔹 Usa guiones medios y evita espacios.  
🔹 Haz commits pequeños y descriptivos.

---

## 4️⃣ Subir la rama al fork (GitHub)

Después de crear la rama, súbanla a este fork para que quede visible en GitHub:

```bash
git push origin frontend-Laura-Tatiana
```

> Reemplacen `Laura-Tatiana` por los nombres de su pareja.

---

## 5️⃣ Mantener su rama actualizada con `frontend`

Cada cierto tiempo (o antes de hacer un Pull Request), actualicen su rama con los últimos cambios del equipo:

```bash
git fetch origin
git checkout frontend
git pull origin frontend
git checkout frontend-Laura-Tatiana
git merge frontend
git push origin frontend-Laura-Tatiana
```

Esto evita conflictos y asegura que todos trabajen con la versión más reciente.

---

## 6️⃣ Hacer un Pull Request (PR)

Cuando terminen su módulo o tengan una versión estable:

1. Asegúrense de tener todos los cambios subidos:
   ```bash
   git push origin frontend-Laura-Tatiana
   ```

2. En GitHub, abran un nuevo **Pull Request** desde su rama hacia la rama `frontend` de este fork.

En la descripción incluyan:
- Resumen del cambio realizado.
- Pasos para probar o comandos de build.
- Indiquen **Ready for test** cuando el código esté listo para revisión.

⚠️ **No mergeen su PR por cuenta propia.**

---

## 7️⃣ Política de Testing

- Solo el **tester designado** ejecuta las pruebas con Jest y decide la aprobación o merge.
- Los autores deben dejar instrucciones claras en el PR.

### Cómo el tester revisa un PR localmente

#### Opción 1: con GitHub CLI (recomendado)

```bash
gh pr checkout <PR-number>
npm ci
npm run test
```

#### Opción 2: manualmente desde el fork del autor

```bash
git remote add contrib git@github.com:usuario/Final-Project-Frontend.git
git fetch contrib
git checkout -b review/usuario-branch contrib/branch
npm ci
npm run test
```

Si todo pasa, el tester aprobará y hará el merge a `frontend` de este fork.  
Luego, cuando todo esté listo, el tester creará el PR desde `frontend` hacia el repositorio original (`upstream`).

---

## 8️⃣ Comunicación y buenas prácticas

- Cada pareja trabaja **solo** en su módulo o vista.
- Coordinen antes de editar componentes comunes.
- Un PR por funcionalidad o vista.
- Antes de un push importante:
  ```bash
  git fetch origin && git pull origin frontend
  ```
- Si tienes dudas sobre el estado o proceso del PR, consulta al tester antes de abrirlo.

---

### 💬 Gracias por colaborar
Sigue estas reglas y haremos revisiones más rápidas, ordenadas y seguras. 🚀
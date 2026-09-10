# 🚀 Dilo Digital — Presentación Dinámica de Parrillas de Contenido

Plataforma web interactiva desarrollada para la agencia de marketing **Dilo Digital**, diseñada para presentar a cada cliente su calendario y parrilla de contenidos mensual reemplazando los antiguos formatos estáticos en PDF por una experiencia web fluida, interactiva, protegida por contraseña y sincronizada en tiempo real.

---

## ✨ Características Principales

- **Fidelidad Total al Formato PDF:**
  - Relación de aspecto 16:9 con navegación mediante flechas del teclado (`←` / `→`) y botones de avance rápido.
  - Pestaña lateral negra redondeada (`pdf-side-pill`) que indica dinámicamente la categoría del post.
  - Decoraciones vectoriales Dilo Digital y branding oficial.
  - Mockup realista de Instagram con perfil oficial del cliente, historias destacadas y cuadrícula interactiva de 9 publicaciones.

- **Doble Modo de Visualización:**
  - **Modo Diapositivas:** Formato de presentación ejecutiva lámina por lámina.
  - **Modo Mosaico (Feed Grid):** Cuadrícula tipo Instagram con filtros por categoría para revisar el feed completo de un vistazo.

- **Seguridad y Acceso por Cliente:**
  - URL personalizada por cliente (ej: `/:slug` o `/portal`).
  - Pantalla de acceso privada con contraseña independiente para cada cliente.
  - Persistencia de sesión segura en el navegador.

- **Feedback y Aprobaciones en Tiempo Real:**
  - Sistema de comentarios integrado por cada lámina.
  - Notificación y distintivo **`✓ Subido a la parrilla`** para que el cliente tenga certeza de que su comentario fue registrado.
  - Contador de comentarios pendientes visible en la barra de herramientas y en el **Índice de 30 láminas**.
  - Botón interactivo de **`Aprobar Post`** con animación de confeti y **`Copiar Copy`** con un solo clic.

- **100% Responsivo:**
  - Optimizado para Mobile (<640px), Tablet (768px-1024px) y Desktop (1280px+).

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + Vite 5
- **Estilos:** TailwindCSS + CSS Vanilla de alta fidelidad
- **Iconografía:** Lucide React + Iconos SVG de marca personalizados
- **Efectos:** Canvas Confetti

---

## 💻 Instalación y Uso Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/LucaFront-End/dilo-contenido.git
cd dilo-contenido

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```

---

## 🏢 Contacto & Agencia

- **Agencia:** Dilo Digital
- **Instagram:** [@dilodigitalmx](https://instagram.com/dilodigitalmx)
- **Web Oficial:** [www.dilodigitalmx.com](https://www.dilodigitalmx.com)
- **WhatsApp:** +52 55 9244 1070

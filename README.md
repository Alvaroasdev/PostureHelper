# Posture Helper 🌟

Una aplicación minimalista de recordatorios de postura construida con **Astro**, **JavaScript** y **CSS**. Diseñada para ayudarte a mantener una mejor postura durante tus sesiones de trabajo.

![Posture Helper - Light Theme](/public/pomo-white.webp)
![Posture Helper - Dark Theme](/public/pomo-black.webp)

## ✨ Características

### 🎯 **Funcionalidades Principales**
- **⏱️ Timer Inteligente**: Múltiples modos de sesión (Enfoque 20m, Rápido 5m, Profundo 45m)
- **📊 Seguimiento de Sesiones**: Estadísticas detalladas de tus sesiones completadas
- **🔔 Notificaciones**: Recordatorios visuales y auditivos para corregir tu postura
- **📝 Historial de Enfoque**: Registro de actividades en las que te enfocaste
- **💾 Persistencia**: Los datos se mantienen al refrescar la página

### 🌍 **Internacionalización**
- **🌐 Cambio de Idioma**: Inglés y Español con un clic
- **💾 Preferencias Guardadas**: Tu idioma preferido se recuerda automáticamente

### 🎨 **Temas Visuales**
- **☀️ Tema Claro**: Diseño limpio y minimalista
- **🌙 Tema Oscuro**: Perfecto para usar por la noche
- **🔄 Cambio Dinámico**: Transiciones suaves entre temas

### 📱 **Diseño Responsive**
- **🖥️ Desktop**: Interfaz completa con sidebar
- **📱 Móvil**: Diseño optimizado para dispositivos táctiles
- **📟 Tablet**: Adaptación perfecta para pantallas medianas

## 🚀 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <repository-url>
   cd posture-helper-astro
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en:**
   ```
   http://localhost:3000
   ```

## 🎮 Cómo Usar

### ⏱️ **Configurar el Timer**
1. Selecciona el modo de sesión:
   - **Enfoque (20m)**: Para trabajo concentrado
   - **Rápido (5m)**: Para pausas breves
   - **Profundo (45m)**: Para sesiones largas

2. Haz clic en **"Iniciar"** para comenzar el timer

3. El círculo de progreso te mostrará el tiempo restante

### 📝 **Registrar tu Enfoque**
- Escribe en qué estás trabajando en el campo "Enfoque actual"
- Presiona **Enter** para guardarlo en tu historial
- Revisa tu progreso en la sección de estadísticas

### 🎨 **Personalizar la Experiencia**
- **Cambiar idioma**: Haz clic en el botón EN/ES en la esquina superior
- **Cambiar tema**: Haz clic en el botón ☀️/🌙 para alternar entre claro y oscuro

## 🛠️ Tecnologías

- **⚡ Astro**: Framework web para sitios estáticos
- **🎨 CSS**: Estilos personalizados con diseño responsive
- **⚙️ JavaScript**: Funcionalidad interactiva del timer
- **💾 LocalStorage**: Persistencia de datos del usuario
- **🔊 Web Audio API**: Notificaciones de audio

## 📁 Estructura del Proyecto

```
posture-helper-astro/
├── public/
│   ├── pomo-white.webp     # Captura de pantalla tema claro
│   ├── pomo-black.webp     # Captura de pantalla tema oscuro
│   ├── postura.png         # Icono de la aplicación
│   └── sounds/
│       └── ding.mp3        # Sonido de notificación
├── src/
│   ├── pages/
│   │   └── index.astro     # Página principal
│   ├── scripts/
│   │   └── timer.js        # Lógica del timer y funcionalidades
│   └── styles/
│       └── main.css        # Estilos y temas
├── astro.config.mjs        # Configuración de Astro
└── package.json
```

## 🎯 Características Técnicas

### 💾 **Sistema de Persistencia**
- **localStorage**: Guarda sesiones, historial y preferencias
- **sessionStorage**: Distingue entre refresh y nueva sesión
- **Auto-limpieza**: Los datos se resetean cada 24 horas

### 🌐 **Internacionalización**
- **Sistema de traducciones**: Anidado y escalable
- **Fallback automático**: Al inglés si falta traducción
- **Persistencia de idioma**: Se recuerda tu preferencia

### 🎨 **Sistema de Temas**
- **CSS Variables**: Colores dinámicos
- **Transiciones suaves**: Cambios elegantes entre temas
- **Colores adaptativos**: Ring del timer se adapta al tema

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! 

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

## 👨‍💻 Autor

**Alvaroasdev** - Desarrollador Full Stack

- 🌐 [Portfolio](https://alvaroasdev.com)
- 📧 [Email](mailto:contact@alvaroasdev.com)
- 🐦 [Twitter](https://twitter.com/alvaroasdev)

---

⭐ **¡Si te gusta este proyecto, dale una estrella!**

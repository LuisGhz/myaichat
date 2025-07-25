# MyAIChat

Una aplicación de chat moderna e intuitiva que te permite interactuar con los modelos de inteligencia artificial más avanzados del mercado. Desarrollada con React, Vite y Tailwind CSS como tecnologías principales, MyAIChat combina potencia y simplicidad en una experiencia de usuario excepcional.

## 🚀 ¿Qué es MyAIChat?

MyAIChat es una Progressive Web App (PWA) que pone el poder de la inteligencia artificial al alcance de tus dedos. Ya sea que necesites ayuda con tareas cotidianas, programación, análisis de datos, o simplemente quieras explorar las capacidades de la IA, esta aplicación te ofrece acceso directo a los modelos más sofisticados disponibles.

## 🤖 Modelos de IA Soportados

Accede a una amplia gama de modelos de inteligencia artificial de última generación:

- **[GPT 4O](https://platform.openai.com/docs/models/gpt-4o)**: El modelo más avanzado de OpenAI para conversaciones complejas y tareas especializadas
- **[GPT 4O Mini](https://platform.openai.com/docs/models/gpt-4o-mini)**: Versión optimizada para respuestas rápidas y eficientes
- **[GPT-4.1](https://platform.openai.com/docs/models/gpt-4.1)** - Modelo para tareas más complejas y solución de problemas.
- **[GPT-4.1 mini](https://platform.openai.com/docs/models/gpt-4.1-mini)** - Versión que proporciona un balance entre inteligencía y velocidad.
- **[Gemini 2.0 Flash Lite](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash-lite?hl=es-419)**: Modelo ligero y rápido para interacciones fluidas
- **[Gemini 2.0 Flash](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash?hl=es-419)**: Potente modelo de Google para análisis y generación de contenido
- **[Gemini 2.5 Flash Preview 04 17](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash?hl=es-419)**: Acceso anticipado a las últimas innovaciones
- **[Gemini 2.5 Pro Preview 03 25](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro?hl=es-419)**: La versión más potente para tareas profesionales

## ✨ Características Principales

### 💬 **Sistema de Chat Inteligente**

- **Conversaciones Persistentes**: Guarda y organiza todas tus conversaciones para futuras referencias
- **Gestión de Chats**: Crea, renombra, elimina y marca como favoritos tus conversaciones
- **Historial Completo**: Accede a todo el historial de mensajes con paginación inteligente
- **Navegación Fluida**: Interfaz lateral para navegar fácilmente entre conversaciones

### 📁 **Adjuntos de Archivos Multimedia**

- **Soporte de Imágenes**: Sube y analiza imágenes (JPG, JPEG, PNG, GIF hasta 2MB)
- **Múltiples Métodos de Carga**:
  - Selección directa de archivos
  - Pegado desde el portapapeles (escritorio)
  - Arrastrar y soltar
- **Vista Previa**: Visualiza las imágenes antes de enviarlas

### 🎤 **Entrada de Voz Avanzada**

- **Reconocimiento de Voz**: Convierte tu voz en texto automáticamente
- **Transcripción en Tiempo Real**: Observa como tu voz se convierte en texto mientras hablas
- **Interfaz Intuitiva**: Indicador visual del estado de grabación con contador de tiempo
- **Control Total**: Inicia y detén la grabación con un simple toque

### ⚙️ **Configuración Personalizable**

- **Control de Tokens**: Ajusta la longitud máxima de las respuestas (1,000 - 8,000 tokens)
- **Modo Pensamiento**: Permite al modelo "pensar" antes de responder (próximamente)
- **Búsqueda Web**: Habilita búsquedas en internet para información actualizada (próximamente)
- **Configuración por Chat**: Cada conversación puede tener su propia configuración

### 📝 **Sistema de Prompts**

- **Biblioteca de Prompts**: Crea y gestiona prompts reutilizables para diferentes tareas
- **Editor Avanzado**: Interfaz completa para crear prompts complejos con múltiples mensajes
- **Organización**: Guarda, edita y elimina prompts según tus necesidades
- **Inicio Rápido**: Selecciona prompts predefinidos al iniciar nuevas conversaciones

### 📱 **Progressive Web App (PWA)**

- **Instalación Nativa**: Instala la aplicación como si fuera una app nativa
- **Funcionalidad Offline**: Interfaz disponible incluso sin conexión
- **Actualizaciones Automáticas**: Recibe nuevas funciones automáticamente
- **Responsive Design**: Perfecta experiencia en móvil, tablet y escritorio

### 🎨 **Interfaz de Usuario Moderna**

- **Diseño Dark Mode**: Interfaz elegante optimizada para uso prolongado
- **Navegación Intuitiva**: Menú lateral deslizable con acceso rápido a todas las funciones
- **Responsive**: Se adapta perfectamente a cualquier tamaño de pantalla
- **Accesibilidad**: Diseñada siguiendo las mejores prácticas de accesibilidad web

### 📊 **Monitoreo de Uso**

- **Estadísticas de Tokens**: Visualiza el uso de tokens de entrada y salida
- **Información del Modelo**: Conoce qué modelo estás usando y su configuración actual
- **Historial de Costos**: Información transparente sobre el uso de recursos

### 🔧 **Características Técnicas Avanzadas**

- **Formato Markdown**: Las respuestas soportan formato completo incluyendo código
- **Resaltado de Sintaxis**: Código fuente con colores para mejor legibilidad
- **Scroll Inteligente**: Navegación fluida por conversaciones largas
- **Carga Lazy**: Optimización de rendimiento para conversaciones extensas

## 🔐 Authentication

Esta aplicación utiliza autenticación OAuth2 con GitHub como proveedor de identidad. Todas las rutas de la aplicación están protegidas y requieren autenticación.

### Features

- Integración OAuth2 con GitHub
- Autenticación basada en tokens JWT
- Validación automática de tokens
- Protección segura de rutas
- Gestión de perfiles de usuario
- Sesiones de login persistentes

### Setup

1. Copia `.env.example` a `.env.local`
2. Configura `VITE_API_URL` para apuntar a tu backend
3. Asegúrate de que el backend OAuth2 esté configurado correctamente con las credenciales de GitHub

Para una implementación detallada de la autenticación, consulta [auth-steps.md](./auth-steps.md).

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

- **Frontend**: React 19 con TypeScript para máxima robustez y rendimiento
- **Build Tool**: Vite para desarrollo rápido y builds optimizados
- **Styling**: Tailwind CSS 4.0 para diseño moderno y responsive
- **State Management**: Zustand para gestión de estado eficiente
- **Routing**: React Router 7 para navegación SPA
- **Forms**: React Hook Form + Zod para validación robusta
- **Testing**: Vitest + React Testing Library para calidad de código
- **PWA**: Vite PWA Plugin para funcionalidad de app nativa

### Arquitectura Modular

- **Separación de Responsabilidades**: Arquitectura por features para escalabilidad
- **Hooks Personalizados**: Lógica reutilizable encapsulada en hooks especializados
- **Componentes Atómicos**: Sistema de componentes modulares y reutilizables
- **Servicios Centralizados**: API calls organizados en servicios especializados
- **Types Safety**: TypeScript en todo el proyecto para prevenir errores

### Patrones de Diseño Implementados

- **Custom Hooks**: Para lógica de negocio reutilizable
- **Compound Components**: Para componentes complejos como modales y formularios
- **Provider Pattern**: Para gestión de estado global
- **Observer Pattern**: Para reactividad en la UI
- **Repository Pattern**: Para abstracción de la capa de datos

## 🔧 Configuración y Desarrollo

### Variables de Entorno Requeridas

```bash
VITE_API_URL=https://tu-backend-api.com
```

### Requisitos del Sistema

- **Node.js**: versión 18.0 o superior
- **PNPM**: gestor de paquetes recomendado (o npm/yarn)
- **Navegador Moderno**: Chrome, Firefox, Safari, Edge con soporte ES2022

### Instalación y Setup

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/LuisGhz/myaichat.git
   cd myaichat
   ```

2. **Instala las dependencias**

   ```bash
   pnpm install
   ```

3. **Configura las variables de entorno**

   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus configuraciones
   ```

4. **Inicia el servidor de desarrollo**

   ```bash
   pnpm dev
   ```

5. **Construye para producción**
   ```bash
   pnpm build
   ```

### Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm preview` - Vista previa de la build de producción
- `pnpm test` - Ejecuta los tests unitarios
- `pnpm test:coverage` - Tests con reporte de cobertura
- `pnpm lint` - Ejecuta ESLint para análisis estático
- `pnpm type-check` - Verificación de tipos TypeScript

### Estructura del Proyecto

```
src/
├── api/                 # Configuración y llamadas API
├── assets/             # Recursos estáticos (imágenes, iconos)
├── components/         # Componentes UI reutilizables
│   ├── Dialogs/       # Modales y diálogos
│   ├── modals/        # Componentes modales específicos
│   └── SideNav/       # Navegación lateral
├── features/          # Funcionalidades organizadas por dominio
│   ├── Auth/          # Sistema de autenticación
│   ├── Chat/          # Gestión de conversaciones
│   ├── Prompts/       # Sistema de prompts
│   └── Welcome/       # Pantalla de bienvenida
├── hooks/             # Custom hooks reutilizables
├── services/          # Servicios para lógica de negocio
├── store/             # Gestión de estado global
├── types/             # Definiciones de tipos TypeScript
└── utils/             # Utilidades y helpers
```

## 🧪 Testing

El proyecto incluye una suite completa de tests para garantizar la calidad del código:

### Estrategia de Testing

- **Unit Tests**: Componentes individuales y funciones utilitarias
- **Integration Tests**: Interacción entre componentes
- **Custom Hooks Tests**: Validación de lógica de hooks personalizados
- **Service Tests**: API calls y lógica de servicios

### Tecnologías de Testing

- **Vitest**: Framework de testing rápido y moderno
- **React Testing Library**: Testing de componentes React
- **MSW (Mock Service Worker)**: Mocking de APIs
- **User Event**: Simulación realista de interacciones de usuario

### Ejecutar Tests

```bash
# Tests en modo watch
pnpm test

# Tests con cobertura
pnpm test:coverage

# Tests en modo CI
pnpm test:run
```

## 🚀 Despliegue

### Build de Producción

```bash
# Generar build optimizada
pnpm build

# Vista previa local de la build
pnpm preview
```

### PWA Configuration

La aplicación incluye configuración completa de PWA:

- **Service Worker**: Para funcionalidad offline
- **Manifest**: Para instalación como app nativa
- **Icons**: Conjunto completo de iconos para diferentes dispositivos
- **Cache Strategy**: Estrategia de caché optimizada

### Deployment Options

- **Vercel**: Recomendado para deploy automático
- **Netlify**: Alternativa con CI/CD integrado
- **Docker**: Containerización incluida para deploy personalizado

## 📱 PWA Features

### Instalación

1. Visita la aplicación en tu navegador
2. Busca el botón "Instalar" en la barra de direcciones
3. Sigue las instrucciones para instalar como app nativa

### Funcionalidades Offline

- Interfaz completamente funcional sin conexión
- Cache inteligente de recursos estáticos
- Sincronización automática al recuperar conexión

## 🤝 Contribución

### Guidelines de Desarrollo

1. **Fork** el repositorio
2. Crea una **rama feature** (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un **Pull Request**

### Estándares de Código

- **TypeScript**: Tipado estricto requerido
- **ESLint**: Seguir las reglas configuradas
- **Prettier**: Formateo automático de código
- **Tests**: Incluir tests para nuevas funcionalidades
- **Commits**: Usar conventional commits

### Code Review Process

- Todos los PRs requieren revisión
- Tests deben pasar antes del merge
- Cobertura de código debe mantenerse >80%

## 📊 Monitoreo y Analytics

### Performance Monitoring

- **Core Web Vitals**: Métricas de rendimiento web
- **Bundle Analysis**: Análisis del tamaño de bundles
- **Runtime Performance**: Monitoreo de performance en tiempo real

### Error Tracking

- **Error Boundaries**: Captura de errores React
- **Logging**: Sistema de logs estructurado
- **User Feedback**: Reporte de issues por usuarios

## 🔒 Seguridad

### Características de Seguridad

- **OAuth2**: Autenticación segura con GitHub
- **JWT Tokens**: Manejo seguro de sesiones
- **Content Security Policy**: Protección contra XSS
- **Secure Headers**: Headers de seguridad configurados
- **Input Validation**: Validación robusta de inputs
- **File Upload Security**: Validación estricta de archivos

## 📚 Documentación Adicional

### Enlaces Útiles

- [Documentación de React 19](https://react.dev/)
- [Guía de Vite](https://vitejs.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Zustand Store](https://github.com/pmndrs/zustand)

### API Reference

Para documentación detallada de la API, consulta:

- [API Documentation](./docs/api.md)
- [Authentication Guide](./auth-steps.md)
- [Component Library](./docs/components.md)

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de autenticación**: Verifica las variables de entorno
2. **Problemas de build**: Limpia `node_modules` y reinstala
3. **Tests fallando**: Verifica la configuración de Vitest
4. **PWA no funciona**: Revisa la configuración del service worker

### Soporte

- **Issues**: Reporta bugs en GitHub Issues
- **Discussions**: Únete a las discusiones de la comunidad
- **Wiki**: Consulta la wiki para documentación extendida

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **OpenAI**: Por los modelos GPT
- **Google**: Por los modelos Gemini
- **React Team**: Por el increíble framework
- **Vite Team**: Por la herramienta de build ultrarrápida
- **Tailwind CSS**: Por el sistema de diseño
- **Comunidad Open Source**: Por todas las increíbles librerías utilizadas

---

**¿Listo para experimentar el futuro de la conversación con IA?**

Instala MyAIChat hoy y descubre una nueva forma de interactuar con la inteligencia artificial. Ya sea para trabajo, estudio o exploración personal, MyAIChat es tu compañero perfecto en el mundo de la IA.

[🚀 **Comenzar Ahora**](https://myaichat.vercel.app) | [📖 **Documentación**](./docs) | [🐛 **Reportar Bug**](https://github.com/LuisGhz/myaichat/issues)

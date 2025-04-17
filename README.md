# Sagrapp - Aplicación de Estudio Bíblico Gamificada

## Credenciales de Administrador
- **Email**: admin@sagrapp.com
- **Password**: Sagrapp2023!

## Despliegue de la Aplicación

### Requisitos Previos
- Node.js 16 o superior
- Cuenta en Vercel
- Cuenta en Supabase

### Pasos para Desplegar

#### 1. Configurar Supabase
1. Crea un nuevo proyecto en Supabase
2. Ejecuta el script SQL proporcionado en el editor SQL de Supabase
3. Obtén las credenciales de API (URL y anon key)

#### 2. Configurar Variables de Entorno
Crea un archivo `.env.local` con las siguientes variables:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-clave-de-servicio-de-supabase
\`\`\`

#### 3. Desplegar en Vercel
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Despliega la aplicación

#### 4. Crear Usuario Administrador
Ejecuta el siguiente comando para crear un usuario administrador:
\`\`\`
npx ts-node scripts/create-admin-user.ts
\`\`\`

### Desarrollo Local

1. Instala las dependencias: `npm install`
2. Ejecuta el servidor de desarrollo: `npm run dev`
3. Accede a http://localhost:3000

## Estructura del Proyecto

- `/app` - Rutas y páginas de Next.js
  - `/app/app` - Aplicación para usuarios finales
  - `/app/dashboard` - Panel de administración
- `/components` - Componentes reutilizables
  - `/components/app` - Componentes para la aplicación de usuarios
  - `/components/dashboard` - Componentes para el panel de administración
- `/lib` - Utilidades y configuración

## Características

### Aplicación de Usuario
- Autenticación con verificación de email
- Visualización de cursos y lecciones
- Sistema de gamificación (XP, niveles, logros)
- Preguntas interactivas
- Perfil de usuario

### Panel de Administración
- Gestión de cursos
- Gestión de lecciones
- Editor de texto enriquecido
- Gestión de preguntas
- Seguimiento de usuarios
- Seguimiento de decisiones

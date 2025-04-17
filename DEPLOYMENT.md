# Instrucciones Detalladas para el Despliegue de Sagrapp

## Credenciales de Administrador
- **Email**: admin@sagrapp.com
- **Password**: Sagrapp2023!

## 1. Configuración de Supabase

### 1.1 Crear un Proyecto en Supabase
1. Ve a [Supabase](https://supabase.com/) y regístrate o inicia sesión
2. Haz clic en "New Project"
3. Ingresa un nombre para tu proyecto (por ejemplo, "Sagrapp")
4. Establece una contraseña para la base de datos
5. Selecciona una región cercana a tus usuarios
6. Haz clic en "Create new project"

### 1.2 Ejecutar el Script SQL
1. Una vez creado el proyecto, ve a la sección "SQL Editor"
2. Crea un nuevo script
3. Copia y pega el contenido del archivo SQL proporcionado
4. Ejecuta el script haciendo clic en "Run"

### 1.3 Obtener las Credenciales de API
1. Ve a la sección "Settings" (configuración) en el menú lateral
2. Selecciona "API"
3. Copia la "URL" y la "anon key" (clave anónima)
4. Guarda estas credenciales para usarlas más adelante

## 2. Despliegue del Panel de Administración en Vercel

### 2.1 Preparar el Repositorio
1. Asegúrate de que tu código esté en un repositorio Git (GitHub, GitLab o Bitbucket)
2. Verifica que el repositorio contenga todos los archivos necesarios

### 2.2 Conectar con Vercel
1. Ve a [Vercel](https://vercel.com/) y regístrate o inicia sesión
2. Haz clic en "Add New" > "Project"
3. Importa tu repositorio de Git
4. Selecciona el repositorio de Sagrapp

### 2.3 Configurar el Proyecto
1. Mantén la configuración predeterminada para un proyecto Next.js
2. En la sección "Environment Variables", añade las siguientes variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = [URL de Supabase]
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = [Clave anónima de Supabase]
   - `SUPABASE_SERVICE_ROLE_KEY` = [Clave de servicio de Supabase]
3. Haz clic en "Deploy"

### 2.4 Crear Usuario Administrador
1. Una vez desplegada la aplicación, ve a la sección "Deployments" en Vercel
2. Haz clic en los tres puntos (...) junto a tu despliegue y selecciona "Open Terminal"
3. Ejecuta el siguiente comando:
   \`\`\`
   npm run create-admin
   \`\`\`
4. Verifica que se muestre el mensaje de éxito

## 3. Despliegue de la Aplicación Móvil

### 3.1 Configuración del Entorno
1. Asegúrate de tener instalado Node.js, React Native CLI y las herramientas de desarrollo para Android/iOS
2. Clona el repositorio en tu máquina local
3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=[URL de Supabase]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[Clave anónima de Supabase]
   \`\`\`

### 3.2 Preparar la Aplicación para Android
1. Ejecuta `cd android && ./gradlew clean` para limpiar el proyecto
2. Genera el bundle de JavaScript:
   \`\`\`
   npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
   \`\`\`
3. Construye el APK:
   \`\`\`
   cd android && ./gradlew assembleRelease
   \`\`\`
4. El APK generado estará en `android/app/build/outputs/apk/release/app-release.apk`

### 3.3 Preparar la Aplicación para iOS
1. Ejecuta `cd ios && pod install`
2. Abre el proyecto en Xcode:
   \`\`\`
   open ios/Sagrapp.xcworkspace
   \`\`\`
3. Selecciona "Generic iOS Device" como destino
4. Ve a Product > Archive
5. Una vez completado el archivo, haz clic en "Distribute App"

## 4. Verificación del Despliegue

### 4.1 Verificar el Panel de Administración
1. Accede a la URL proporcionada por Vercel
2. Inicia sesión con las credenciales de administrador:
   - Email: admin@sagrapp.com
   - Password: Sagrapp2023!
3. Verifica que puedas acceder a todas las secciones del panel

### 4.2 Verificar la Aplicación Móvil
1. Instala el APK/IPA en un dispositivo
2. Abre la aplicación
3. Crea una cuenta de usuario o inicia sesión
4. Verifica que puedas ver los cursos y lecciones

## 5. Solución de Problemas Comunes

### 5.1 Problemas con Supabase
- Verifica que las políticas RLS (Row Level Security) estén configuradas correctamente
- Asegúrate de que las tablas se hayan creado con los nombres correctos
- Comprueba que las claves de API sean correctas

### 5.2 Problemas con Vercel
- Revisa los logs de construcción para identificar errores
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el proyecto sea compatible con Next.js

### 5.3 Problemas con la Aplicación Móvil
- Limpia la caché de React Native: `npx react-native start --reset-cache`
- Verifica que las dependencias estén instaladas: `npm install`
- Comprueba que las variables de entorno estén configuradas correctamente
\`\`\`

Finalmente, vamos a crear un archivo .env.example para mostrar las variables de entorno necesarias:

# X7 EXTERNAL / MOONX7 — Website Guide

## Español

### Requisitos
- Hosting con PHP 8 o superior.
- MySQL/MariaDB y la extensión PHP `pdo_mysql` para el panel administrativo persistente.
- HTTPS recomendado para todas las rutas públicas.

### Instalación
1. Sube el contenido de `WEBSITE/` a tu hosting PHP.
2. Crea una base de datos y un usuario con permisos mínimos necesarios.
3. Importa `install.sql` en la base de datos.
4. Copia `database.config.example.php` a `database.config.php` y configura las credenciales fuera del control de versiones.
5. Configura la variable de entorno `APEX_ADMIN_PASSWORD` con una contraseña fuerte.
6. Abre `index.php` para la web pública y `/admin/` para la administración.
7. Verifica que `config.json`, los archivos de configuración y los registros no sean accesibles públicamente.

### Fondo animado de la app
La app consume el fondo desde la configuración remota. La configuración de este branch apunta a:
`BRANDING/BackgroundMedia/background.mp4`
El archivo se sirve desde GitHub Raw. Para producción, es preferible alojar el vídeo en tu propio hosting/CDN y actualizar `backgroundVideoURL` desde el panel. La reproducción depende de que la app pueda acceder a la configuración remota y de que el enlace HTTPS esté disponible.

### Despliegue
Este proyecto usa PHP y MySQL; no se puede publicar como sitio PHP dinámico en GitHub Pages. Despliega la carpeta `WEBSITE/` en un hosting PHP compatible. Netlify puede servir recursos estáticos, pero no ejecuta directamente este backend PHP/MySQL sin una adaptación de arquitectura.

### Seguridad y publicación
- No subas `database.config.php`, contraseñas, tokens, certificados ni claves privadas.
- Mantén el servicio de administración protegido.
- Comprueba los enlaces de descarga, las URL de API y las credenciales antes de anunciar una versión.
- No declares un build como listo hasta que el proveedor de CI genere y permita descargar el artefacto IPA.

## English

### Requirements
- PHP 8+ hosting.
- MySQL/MariaDB and the PHP `pdo_mysql` extension for persistent admin settings.
- HTTPS for public endpoints.

### Installation
1. Upload the contents of `WEBSITE/` to your PHP hosting.
2. Create a database and a database user with only the required privileges.
3. Import `install.sql`.
4. Copy `database.config.example.php` to `database.config.php` and configure credentials outside version control.
5. Set a strong `APEX_ADMIN_PASSWORD` environment variable.
6. Open `index.php` for the public site and `/admin/` for administration.
7. Verify that configuration files, secrets, and logs cannot be downloaded publicly.

### App background video
The app reads its background from remote configuration. This branch currently points to:
`BRANDING/BackgroundMedia/background.mp4`
The file is served through GitHub Raw. For production, host the video on your own hosting/CDN and update `backgroundVideoURL` in the admin panel. Playback requires a reachable HTTPS URL and a working remote configuration endpoint.

### Deployment
This project uses PHP and MySQL. GitHub Pages cannot run the dynamic PHP backend. Deploy `WEBSITE/` to PHP-compatible hosting. Netlify can serve static assets, but it does not directly run this PHP/MySQL backend without an architecture change.

### Security and release
- Never commit `database.config.php`, passwords, tokens, certificates, or private keys.
- Keep the admin panel protected.
- Verify download links, API endpoints, and credentials before release.
- Do not mark a build as release-ready until CI has produced a downloadable IPA artifact.

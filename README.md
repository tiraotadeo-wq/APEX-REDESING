# X7 EXTERNAL / MOONX7

## Español

Este repositorio contiene la app iOS SwiftUI y la web de administración de X7 EXTERNAL. El rebranding se desarrolla en la rama `rebrand/x7-external-moonx7`; la rama principal no se modifica.

### Estructura
- `ThreeOneOSFive/`: proyecto iOS.
- `WEBSITE/`: web PHP y panel de administración.
- `BRANDING/Appicon/`: icono de la app.
- `BRANDING/MOONX7logo/`: logotipos PNG.
- `BRANDING/Banners/`: banners animados.
- `BRANDING/BackgroundMedia/`: fondo de vídeo o imagen para la app.

### Compilación y publicación
La compilación iOS necesita macOS y Xcode. Ejecuta el workflow configurado en Codemagic y verifica los logs y el artefacto IPA antes de distribuirlo. La web usa PHP y MySQL/MariaDB; requiere hosting compatible. Netlify no ejecuta directamente este backend PHP/MySQL. No publiques secretos, contraseñas, certificados ni archivos de configuración privados en Git.

El fondo animado se configura en `WEBSITE/config.json` mediante `backgroundVideoURL`; la app lo recibe mediante su configuración remota. Para producción, es preferible servir el vídeo desde un hosting/CDN propio y confirmar que la URL HTTPS permite reproducirlo.

## English

This repository contains the X7 EXTERNAL SwiftUI iOS app and its administration website. Rebranding work is isolated on `rebrand/x7-external-moonx7`; the main branch remains unchanged.

### Structure
- `ThreeOneOSFive/`: iOS project.
- `WEBSITE/`: PHP website and admin panel.
- `BRANDING/Appicon/`: app icon.
- `BRANDING/MOONX7logo/`: PNG logos.
- `BRANDING/Banners/`: animated banners.
- `BRANDING/BackgroundMedia/`: app video or image background.

### Build and deployment
The iOS build requires macOS and Xcode. Run the configured Codemagic workflow and verify its logs and IPA artifact before distribution. The website uses PHP and MySQL/MariaDB and requires compatible hosting. Netlify does not directly run this PHP/MySQL backend. Never commit secrets, passwords, certificates, or private configuration files.

The animated background is configured in `WEBSITE/config.json` via `backgroundVideoURL`; the app receives it through remote configuration. For production, host the video on your own hosting/CDN and verify that its HTTPS URL can be played.

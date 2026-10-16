# X7 EXTERNAL / MOONX7 — Branding Assets

## Español

Coloca aquí los recursos originales de la marca.

- `Appicon/MOONX7Logo.png`: icono de la app (el asset de Xcode usa `ThreeOneOSFive/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`).
- `MOONX7logo/MOONX7Logo.png`: logotipo PNG.
- `Banners/realm-banner.gif`: banner animado.
- `BackgroundMedia/background.mp4`: vídeo de fondo de la app.

La app usa el fondo mediante la configuración remota `backgroundVideoURL`. El sitio utiliza `brandBannerURL` para mostrar el GIF. Comprueba las URL HTTPS y el tamaño de los archivos antes de publicar.

## English

Place the original brand assets here.

- `Appicon/MOONX7Logo.png`: app icon source (the Xcode asset is `ThreeOneOSFive/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`).
- `MOONX7logo/MOONX7Logo.png`: PNG logo.
- `Banners/realm-banner.gif`: animated banner.
- `BackgroundMedia/background.mp4`: app background video.

The app uses the background through the remote `backgroundVideoURL` configuration. The website displays the GIF through `brandBannerURL`. Verify the HTTPS URLs and file sizes before release.

### Release checks / Comprobaciones de publicación
- Verify the iOS app icon and all asset references.
- Verify that the background video loops without blocking navigation.
- Verify website links, admin access, database settings, and download URL.
- Build on macOS/Xcode and confirm the generated IPA artifact.
- Never commit signing certificates, provisioning profiles, passwords, or service-role keys.

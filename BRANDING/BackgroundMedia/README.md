# X7 EXTERNAL / MOONX7 — Background Media

## Español

El fondo animado de esta rama es `background.mp4`.

Formatos compatibles con el controlador multimedia de la app:
- `.mp4`, `.mov`, `.m4v`
- `.gif`
- `.png`, `.jpg`, `.jpeg`

La configuración remota utiliza `backgroundType: "video"`, `backgroundVideoURL` y `backgroundContentMode: "cover"`. El vídeo se reproduce en bucle y sin audio como fondo de la app. La reproducción depende de que el endpoint de configuración remota esté publicado y que la URL HTTPS sea accesible.

La web utiliza el mismo vídeo como fondo si su configuración `backgroundVideoURL` está activa. Antes de producción, comprueba la reproducción en un iPhone real, el consumo de batería y el rendimiento de la red. Para despliegue estable, se recomienda servir el vídeo desde tu propio hosting/CDN.

## English

The animated background for this branch is `background.mp4`.

Supported formats in the app media controller:
- `.mp4`, `.mov`, `.m4v`
- `.gif`
- `.png`, `.jpg`, `.jpeg`

Remote configuration uses `backgroundType: "video"`, `backgroundVideoURL`, and `backgroundContentMode: "cover"`. The video loops silently behind the app UI. Playback requires the remote configuration endpoint to be deployed and the HTTPS media URL to be reachable.

The website uses the same video as its background when `backgroundVideoURL` is configured. Before release, test playback on a real iPhone, battery usage, and network performance. For reliable production delivery, host the video on your own hosting/CDN.

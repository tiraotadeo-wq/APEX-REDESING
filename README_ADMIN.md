# X7 External — administración, Supabase, Netlify y VPS

## Estado y arquitectura

- Sitio Netlify: `x7-external` (el sitio debe tener configurado el directorio de publicación y variables de entorno antes de considerarlo producción).
- Supabase independiente: `X7-EXTERNAL`, región `us-east-1`, proyecto ref `mnqginyzeegdmvynnexf`.
- La web estática se sirve desde `WEBSITE/public`; el panel está en `/admin`.
- El panel usa Supabase Auth y las políticas RLS como autorización real. La clave publicable/anon puede estar en el navegador; **nunca** publiques `service_role` ni una secret key.
- El backend PHP original se conserva como fallback para VPS; Netlify no ejecuta PHP nativo.

## 1. Preparar el proyecto Supabase

1. Abre el proyecto `X7-EXTERNAL` en Supabase Dashboard.
2. En Authentication, crea/invita la cuenta de administrador. Deshabilita el registro público si no necesitas nuevos usuarios.
3. Ejecuta la migración SQL del directorio `supabase/migrations` en el SQL Editor o mediante Supabase CLI.
4. Copia el UUID de la cuenta desde Authentication → Users y, como propietario del proyecto, insértalo en la tabla privada de administradores:

   ```sql
   insert into public.x7_admins(user_id)
   values ('UUID-DE-LA-CUENTA-AUTORIZADA');
   ```

   No se permite auto-autorizarse desde el navegador. La cuenta solo tendrá permisos administrativos tras la inserción por un propietario.
5. Configura el frontend con el Project URL y la publishable key (o legacy anon key). La URL ya figura en `WEBSITE/public/config.js`; reemplaza el marcador de `anonKey` por la clave pública del proyecto. No uses nunca la service role.

## 2. Desplegar en Netlify

1. En Netlify abre el sitio `x7-external` → Site configuration → Build & deploy → Continuous deployment.
2. Conecta GitHub y selecciona `tiraotadeo-wq/APEX-REDESING`; elige la rama `rebrand/x7-external-moonx7` durante pruebas. La configuración `netlify.toml` publica `WEBSITE/public`.
3. En Site configuration → Environment variables, define `SUPABASE_URL=https://mnqginyzeegdmvynnexf.supabase.co` y `SUPABASE_ANON_KEY` con la clave pública del proyecto, para builds/producción. Las variables no se interpolan automáticamente en un archivo estático; `WEBSITE/public/config.js` es el punto de configuración del cliente hasta que se añada un paso de build que genere ese archivo.
4. Pulsa Deploy site y verifica la URL publicada, `/admin`, la carga de JS/CSS y la autenticación. Cada push a la rama conectada debe disparar un deploy automático.
5. No declares el sitio listo para producción hasta que la URL pública y el deploy estén en estado Published/Ready. Para promover a producción, cambia la rama de producción a la rama revisada.

## 3. Administrar configuración remota

1. Abre `https://TU-SITIO.netlify.app/admin` e inicia sesión con una cuenta de Supabase previamente autorizada en `x7_admins`.
2. En Configuración, actualiza las URLs absolutas HTTPS de descarga IPA, fondo de vídeo, recursos y branding. Usa solo recursos propios/autorizados.
3. Guarda y verifica el mensaje de éxito. Los datos se guardan como JSON en la fila singleton `x7_app_config.id = 1`.
4. La app iOS debe implementar una lectura de esa fila/endpoint con caché y fallback local. Guardar en Supabase no cambia una app que no consulta esa configuración; no se presupone que esta integración iOS ya exista.
5. No pegues secretos, tokens privados, credenciales ni datos personales en los campos de configuración.

## 4. Estadísticas

La pestaña Estadísticas consulta los registros existentes de `x7_request_stats` por fecha. La tabla no inventa métricas: para poblarla, la web y/o la app deben enviar eventos a un endpoint validado y limitado. No habilites inserciones públicas directas en la tabla agregada; pueden falsificarse. Añade un Edge Function/Netlify Function con validación, rate limiting y agregación atómica antes de instrumentar producción.

## 5. VPS con Docker (plan B)

1. Provisiona un VPS actualizado y configura firewall (solo SSH restringido y HTTP/HTTPS público). Instala Docker Engine y Docker Compose.
2. Copia el repo y entra a `docker/`. Copia `.env.example` a un `.env` privado, genera contraseñas largas y diferentes, y nunca las subas a Git.
3. Revisa que las rutas y el esquema MySQL del PHP original sean compatibles; importa únicamente un dump revisado y respaldado. La base de Supabase y MySQL no se sincronizan automáticamente.
4. Ejecuta `docker compose --env-file .env up -d --build` desde `docker/`. El ejemplo expone HTTP en el puerto 80; antes de producción, coloca TLS (por ejemplo, un proxy inverso con certificados), backups restaurables, logs y alertas.
5. Prueba login, formularios, uploads, endpoints y permisos. El contenedor MySQL está en red Docker privada y no publica el puerto 3306.
6. Para migrar de vuelta, congela escrituras, exporta y valida datos, cambia DNS y verifica con una ventana de rollback. No borres el entorno anterior hasta confirmar el servicio y los backups.

## 6. Rollback y troubleshooting

- Para volver atrás en Netlify, publica el deploy previo desde Deploys → Deploy details → Publish deploy.
- Para revertir código, crea un commit de reversión en la rama de trabajo; no reescribas `main`.
- Error de acceso al panel: comprueba la sesión Supabase, que el UUID esté en `x7_admins`, que la migración se aplicó y que las políticas RLS estén activas.
- Configuración no aparece en iOS: comprueba que la app consulta el proyecto correcto y vuelve a solicitar la fila; la escritura no fuerza una actualización de un cliente que no lee la configuración.
- Antes de release, ejecuta pruebas de login autorizado/no autorizado, lectura y escritura de configuración, permisos RLS, errores de red, y despliegue desde la rama conectada.

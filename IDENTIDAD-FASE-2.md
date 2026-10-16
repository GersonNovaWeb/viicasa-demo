# Acceso de clientes - Google, Apple y correo

Implementación exclusiva de `viicasa-fase2-demo`. No modifica Firebase ni el
inicio de sesión de la plataforma oficial. El administrador sigue usando
`/admin` o `/vendedor` con contraseña y TOTP; `/equipo` conserva el acceso general.
Un proveedor social jamás otorga rol de equipo.

## Estado actual

Correo/contraseña, recuperación por código y verificación funcionan localmente.
Google/Apple ahora tienen adaptadores de autorización e intercambio de código,
verificación JWT criptográfica y vinculación de cuentas, pero están desactivados.
Las pruebas usan claves RSA/EC y servidores simulados, no cuentas externas.

`/api/client/auth/providers` publica solo activación, motivo y callback. Tokens,
secretos, clave privada y sujetos de proveedor no se exponen al frontend. No se
almacenan access/refresh tokens; se solicitan únicamente datos de identidad.

## Configuración privada de la demo

Google: crear un cliente OAuth de aplicación web en el proyecto de pruebas y
registrar el callback exacto `${PHASE2_SITE_URL}/auth/google/callback`. Configurar
pantalla de consentimiento y usuarios de prueba según el proyecto:

```
PHASE2_GOOGLE_ENABLED=true
PHASE2_GOOGLE_CLIENT_ID=VALOR_PRIVADO_DE_CONFIGURACION
PHASE2_GOOGLE_CLIENT_SECRET=SECRETO_PRIVADO
```

No es el apiKey del SDK web Firebase ni la clave JSON de una cuenta de servicio.
El localhost de esta copia es `http://127.0.0.1:3030`; la URL autorizada debe
coincidir exactamente con la que se usa para comenzar el acceso.

Apple: necesita la cuenta del cliente, Service ID, asociación con su App ID,
dominio y Return URL autorizados, Team ID, Key ID y clave de Sign in with Apple.
El callback exacto será `${PHASE2_SITE_URL}/auth/apple/callback` en un dominio
HTTPS; Apple no admite localhost ni IP como Return URL.

```
PHASE2_APPLE_ENABLED=true
PHASE2_APPLE_SERVICE_ID=SERVICE_ID
PHASE2_APPLE_TEAM_ID=TEAM_ID
PHASE2_APPLE_KEY_ID=KEY_ID
PHASE2_APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCONTENIDO_PRIVADO\n-----END PRIVATE KEY-----"
```

No activar placeholders. Guardar en `.env.phase2.local` o secretos del hosting,
nunca Git, capturas ni chats. Reiniciar tras configurar. En HTTPS conservar el
dominio exacto de `PHASE2_SITE_URL`; no alterar callbacks ni confiar en un Host
de petición enviado por el navegador. Validar la política de correo Private Relay
de Apple y registrar los remitentes del dominio si se utilizarán direcciones relay.

## Vinculación y recuperación

1. Iniciar sesión con el método que ya posee el cliente.
2. En `/cliente`, **Acceso y seguridad**, seleccionar **Vincular cuenta**.
3. Autorizar el proveedor. El mismo ID de cliente, pedidos y email principal se
   mantienen. Apple puede vincular su dirección privada, sin reemplazar el contacto.
4. Si el proveedor coincide por correo con una cuenta preexistente, el acceso
   sin vinculación se bloquea; no se fusionan cuentas por email automáticamente.
5. Desvincular exige autenticación reciente y otro método restante. Cierra todas
   las sesiones; no se permite quitar el último proveedor sin contraseña alternativa.

Un cliente creado con Google/Apple no tiene contraseña habilitada inicialmente.
Puede configurarla mediante **Olvidé mi contraseña**, verificando el código enviado
al correo principal. Recuperar contraseña también revoca todas las sesiones.

## Seguridad implementada y puntos de extensión

- `identity-provider.mjs`: endpoints fijos de proveedor, PKCE S256 para Google,
  client secret ES256 de corta duración para Apple y JWKS RS256 verificados con
  `jose`. Comprueba emisor, audiencia, sujeto, nonce, expiración, iat y email verificado.
- `customer-social.mjs`: state y cookie HttpOnly ligados al navegador, duración
  de 10 minutos, consumo único previo al intercambio y callback sin redirects libres.
  Apple recibe `form_post` con cookie Secure/SameSite=None, sin debilitar la cookie
  normal de sesión Lax. El email del campo `user` de Apple no se confía: solo el JWT.
- `customer_identities`: identificador estable provider+subject, no email como
  identidad del proveedor. Link explícito y sesión objetivo vigente/revocable.
- Sesiones separadas de equipo/cliente. Cookies de sesión privadas, 8 horas,
  revocación por auth_version; cambios de acceso exigen un inicio reciente.
- Bienvenida idempotente y avisos de seguridad en la bandeja transaccional.
  Su entrega sigue el modo outbox/SMTP de esta copia.

Pendientes para publicar: pruebas de consentimiento/callbacks reales, autorización
de Apple y dominio HTTPS, Private Relay, conservación/borrado de identidad y
notificaciones de revocación de proveedor. Si se agregan APIs de proveedor para
revocar consentimiento o eliminar cuentas, su implementación y política requieren
revisión adicional; desvincular aquí solo retira el método dentro de VIICASA.

Fuentes técnicas:
- https://developers.google.com/identity/openid-connect/openid-connect
- https://developer.apple.com/documentation/signinwithapplerestapi/request-an-authorization-to-the-sign-in-with-apple-server.
- https://developer.apple.com/documentation/signinwithapplerestapi/generate-and-validate-tokens
- https://github.com/panva/jose

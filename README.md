# VIICASA — Fase 2 demo

Copia independiente de desarrollo, basada en la fase 1. El arranque de esta copia
es `npm run dev`: abre `http://127.0.0.1:3030` y el portal comercial en `/equipo`.
Usa dos bases PostgreSQL locales persistentes y no carga el Firestore oficial.

La guía vigente de configuración, cuentas de ejemplo, alcance implementado y
pendientes se encuentra en [FASE-2.md](FASE-2.md). La configuración de esta copia
se documenta en `.env.phase2.example`; no utilizar variables de producción.

Pruebas del nuevo módulo: `npm run test:phase2`.

Catálogo de los 27 servicios: `/admin` → **Catálogo de servicios**. Precios en
CAD, portada y galería, publicación y textos ES/EN editables. Las fichas iniciales
son borradores sin tarifas inventadas. Guía: [phase2/SERVICE-CATALOGUE.md](phase2/SERVICE-CATALOGUE.md).
Los servicios nuevos usan solicitudes/cotizaciones; no sustituyen el checkout de limpieza.

Entrega del 14 de octubre: perfil staging limpio, administrador inicial privado,
inspección de lanzamiento, cola de reservas preparada para el puente autorizado
y herramientas heredadas aisladas. Guía vigente:
[PREPRODUCCION-Y-CIERRE-INTERNO-FASE-2.md](PREPRODUCCION-Y-CIERRE-INTERNO-FASE-2.md).
No activa producción ni conexiones. `demo` mantiene la revisión existente.

Última entrega de código: Stripe avanzado en sandbox, adaptador Shopify, analítica
consentida, worker independiente y respaldo/restauración cifrados de PostgreSQL.
Guía vigente: [INTEGRACIONES-Y-OPERACION-FASE-2.md](INTEGRACIONES-Y-OPERACION-FASE-2.md).
Permanecen desactivados por defecto; las claves no equivalen a pruebas aprobadas.
Airbnb/Lodgify sigue pendiente del contrato de API y canal autorizado.

Último avance interno: cierre económico supervisado en `/admin` → **Cierre
económico**, y cotizaciones de paquetes semanales con varios días de visita.
Guías: [CIERRES-FASE-2.md](CIERRES-FASE-2.md) y
[PRECIOS-FASE-2.md](PRECIOS-FASE-2.md). Los datos que se solicitarán al cliente al
final se recopilan en [DATOS-PENDIENTES-CLIENTE-FASE-2.md](DATOS-PENDIENTES-CLIENTE-FASE-2.md).

Los tres módulos internos restantes (desglose de ViiShop, revisión de estancias y
correcciones de comisiones) están documentados en
[MODULOS-INTERNOS-FASE-2.md](MODULOS-INTERNOS-FASE-2.md). Pruebas específicas:
`npm run test:phase2-pending-modules`. Las conexiones se reservan para el final.

## Referencia heredada de fase 1

La información siguiente documenta la base anterior. Sus credenciales, proyecto
Firebase y pasos de producción no son la configuración activa de esta demo.

Aplicación Node.js con frontend ES/EN, backend Fastify y Firestore. Incluye
propiedades, galería, disponibilidad, tienda, dashboard y acceso con Google.
Este repositorio **no sustituye ni incluye la landing Coming Soon**.

## Estado de esta entrega

- Preparada para importar en Hostinger y validar Google/Firestore en un dominio temporal.
- Proyecto Firebase confirmado: `viicasa`, compartido con la landing.
- Clientes: cualquier cuenta Google que Firebase autorice, no una lista de correos del frontend.
- Administrador: `viicasa.database@gmail.com`, validado en servidor.
- Zona del cliente: Canadá / resto del mundo / no detectado, estimada al registrarse.
- Precios USD/CAD introducidos por el administrador, sin conversión automática ni selector público.
- Stripe desactivado durante esta etapa; no hacen falta claves de pago.
- No se ha probado Google real desde este repositorio ni se han aplicado reglas,
  cambiado DNS, conectado el hosting o modificado datos del Firebase real.

## Instalación y comandos (desde la raíz)

Node.js 24 recomendado. La raíz contiene todas las dependencias y un `package-lock.json`.
No hay que instalar las carpetas hijas por separado para desplegar.

```sh
npm ci --omit=dev
npm run build
npm start
```

`build` valida sintaxis y prepara una base local de países; no conecta Firestore ni
Stripe. La preparación de países necesita acceso de descarga a su proveedor público.
`start` utiliza las variables del hosting o un `.env` privado. Copiar los nombres
de `.env.example` al gestor de variables del hosting y completar los valores.

Para desarrollo local, con Firestore Emulator activo en 127.0.0.1:8095:

```sh
npm run dev
```

Abre http://127.0.0.1:3015. Usa un proyecto `demo-` aislado y no carga claves de `.env`.
Para instalar también herramientas locales de Firebase: `npm ci` sin `--omit=dev`.
El comando `npx firebase emulators:start --only firestore --project demo-viicasa-platform
--config viicasa-frontend-prototype/firebase.json` requiere Java compatible instalado.

## Google y Firestore sin Stripe

Seguir [HOSTINGER.md](HOSTINGER.md). Comprobaciones de configuración (sin conexiones externas):

```sh
npm run preflight:auth
```

Google habilitado y dominio de pruebas autorizado en Firebase son necesarios.
Completar la prueba con el administrador y otra cuenta: esa otra cuenta debe poder
registrarse y entrar a Mi cuenta, pero recibir rechazo en el dashboard y sus APIs.
Una cuenta ya creada en Firebase por la landing puede iniciar sesión aquí; el perfil
de la plataforma se crea en su primer acceso, sin migrar ni modificar `cs_accounts`.

## Compartir la base sin dañar la landing

La landing usa `cs_*`. La plataforma usa `properties`, `products`, `variants`,
`guests`, `platform_accounts`, `checkouts`, `users` y otras colecciones propias.
No lee ni escribe las colecciones `cs_*` en sus flujos normales.

`firebase.json` de la raíz configura **solo índices**. `firestore.indexes.json`
conserva las excepciones de índices/TTL de la landing local además de los índices
de la plataforma. Antes de aplicarlo, comparar con la configuración real actual.
No ejecutar un deploy global de Firebase ni aceptar eliminar índices desconocidos.
Las reglas locales de ambas aplicaciones bloquean acceso directo del navegador;
los servidores usan Admin SDK con IAM. No se han sustituido las reglas remotas.

## Seguridad y comprobaciones

Nunca subir `.env`, JSON de servicio, claves de Stripe ni datos/archivos del emulador.
El escáner `node scripts/check-publication.mjs` revisa los archivos preparados para
Git sin imprimir valores sensibles. No sustituye una revisión de seguridad completa.

```sh
npm run check
npm run test:platform
```

`test:platform` requiere la demo activa en 3015; crea registros ficticios y archiva
su catálogo al terminar. Las suites Firestore usan un proyecto demo separado;
ver los documentos de validación de las carpetas hijas. Google real, índices reales,
sesiones entre dispositivos y persistencia de archivos se validan después de importar.

La auditoría inicial de npm reportó dependencias transitivas moderadas (incluyendo
`gaxios`/`uuid`) y otras de herramientas de desarrollo. No se aplicaron correcciones
forzadas con cambios incompatibles. Revisarlas antes de producción; `npm ci --omit=dev`
no instala las herramientas de desarrollo. Los resultados locales no certifican
que la aplicación esté lista para cobros o lanzamiento público.

Cuando corresponda validar Stripe: `npm run preflight:payments`, únicamente con
credenciales de prueba. Por ahora `PAYMENT_PROVIDER=disabled`.

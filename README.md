# VIICASA Demo

Copia independiente e interactiva de la plataforma VIICASA para demostraciones locales. No es la plataforma de producción ni la landing Coming Soon.

## Qué permite probar

- Catálogo ficticio de propiedades y ViiShop, galerías y formularios ES/EN.
- ViiLife: limpieza rutinaria y profunda. Rutinaria = tarifa × horas por visita × días seleccionados por un ciclo; sin renovación automática.
- Panel de administrador de demostración y operaciones con pago simulado.
- Aviso visible de demostración en todo el sitio.

## Seguridad y limitaciones

- Solo escucha en `127.0.0.1:3016`. No se configura un dominio público.
- Firestore Emulator en `127.0.0.1:8089`, proyecto ficticio `demo-viicasa-preview`, distinto de la plataforma local.
- No carga archivos `.env`. No necesita cuentas Firebase, claves Stripe ni SMTP.
- El backend rechaza bases reales, Stripe y SMTP aunque se añadan variables de entorno. Google, Apple y Facebook reales están deshabilitados.
- Los correos se guardan únicamente en la cola ficticia; no se envían. Solo usar nombres, direcciones y correos de prueba.
- Los datos del emulador desaparecen al cerrarlo; al iniciar se recrea el catálogo de ejemplo.
- El acceso admin de prueba no sustituye una autenticación segura para Internet. **No publicar este servidor directamente ni quitar la restricción local.**

## Ejecutar

Requisitos: Node.js 22.13 o posterior, npm y Java 21. Desde esta carpeta:

```powershell
npm ci
npm run emulator
```

La primera ejecución del emulador puede descargar sus componentes. Dejar esa terminal abierta y abrir otra en la misma carpeta:

```powershell
npm run dev
```

Abrir [la demo](http://127.0.0.1:3016/) o [ViiLife](http://127.0.0.1:3016/viilife/limpieza). En `/admin`, elegir el acceso de demostración. La limpieza se habilita inicialmente con precios ficticios para recorrer el flujo completo. Los pagos solo se simulan desde el administrador.

## Validar

Con emulador y servidor activos:

```powershell
npm run check
npm run test:safety
$env:TEST_FIRESTORE_HOST='127.0.0.1:8089'
npm run test:cleaning
npm run test:platform
```

Antes de publicar código: `git add .` y `npm run check:publication`. El repositorio excluye credenciales, dependencias, datos locales y cargas de archivos.

## GitHub y hosting

Destino: `https://github.com/GersonNovaWeb/viicasa-demo.git`.

Subir a GitHub publica el código, no una web navegable. Esta entrega funciona localmente. Para una demo pública en Hostinger hace falta preparar almacenamiento aislado adecuado, protección del acceso administrativo y limpieza de datos de prueba. No usar las credenciales ni la base real de VIICASA.

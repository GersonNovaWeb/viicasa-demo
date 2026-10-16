# Integraciones y operación · entrega de desarrollo del 13 de octubre

Esta entrega modifica únicamente `viicasa-fase2-demo`. Conserva `PHASE2_MODE=demo`,
rechaza `sk_live`, mantiene las conexiones nuevas desactivadas y no promociona
la plataforma oficial. **Código preparado no equivale a proveedor conectado,
validado o autorizado para producción.**

## Stripe avanzado en sandbox

- Checkout independiente de configuración de tarjeta, con consentimiento específico
  para un acuerdo aceptado. El SDK verifica sesión, SetupIntent, cliente y método.
  No se reciben números de tarjeta ni se guardan PAN/CVC en VIICASA.
- Tarjeta confirmada no significa autorización activa: la activación administrativa
  es separada; el cliente puede revocar futuras operaciones en `/cliente`.
- Cobro off-session CAD para facturas emitidas por visitas completadas, con fechas
  de Vancouver, evidencia del acuerdo, límite de calendario y reservas en curso.
- Cada factura admite una operación automática; llamadas repetidas no crean otro
  PaymentIntent. `PHASE2_STRIPE_AUTO_COLLECT` es una autorización técnica adicional
  que permanece `false`; requiere aprobación de calendario y pagos recurrentes,
  consentimiento activo y método confirmado. No autoriza renovación ni penalidades.
- Si se requiere autenticación, la factura queda pendiente. El cliente resuelve el
  intento cancelable antes de usar Checkout individual; un pago en procesamiento
  no se libera como si hubiera fallado. Las operaciones inciertas sin ID requieren
  conciliación del administrador: **no se reintentan automáticamente**.
- Reembolsos aprobados y acotados al pago original, con idempotencia. Un reembolso
  pendiente no modifica el libro interno. La confirmación verificable agrega el
  asiento, aviso al comprador/admin y revisión de comisiones una sola vez.
- Webhooks firmados y conciliación consultan Stripe en el servidor. La página de
  retorno y los importes del navegador no confirman un cobro.

Administrador: **Cobros programados → Stripe sandbox**. Variables y activaciones
en `.env.phase2.example`; no colocar secretos en el panel ni en Git.

Referencias: [SetupIntent](https://docs.stripe.com/api/setup_intents/retrieve),
[PaymentIntent](https://docs.stripe.com/api/payment_intents/create),
[reembolsos](https://docs.stripe.com/api/refunds/create).

## Shopify

- API GraphQL versionada; dominio exacto `.myshopify.com`, tienda CAD y una
  ubicación de inventario explícita. No suma existencias de otras ubicaciones.
- Webhook `/v1/webhooks/shopify`: HMAC del cuerpo crudo, tienda/topic permitidos,
  clave persistente de entrega y refetch de la fuente antes de aplicar datos.
- Catálogo y pedidos paginados; cola durable con lease, límites, reintento
  administrativo y cuarentena para datos incompatibles. Webhooks no autorizados
  o snapshots conflictivos no se consideran importaciones correctas.
- Sincronización opcional cada 15 minutos del catálogo y pedidos actualizados en
  las últimas 48 horas. No cubre interrupciones mayores de esa ventana ni reemplaza
  la conciliación histórica de la tienda. El historial ampliado requiere acordar
  permisos/ventana; productos de más de 100 variantes y pedidos de más de 100 líneas
  se rechazan para revisión, no se importan truncados.
- Ordenamiento por actualización externa y revisión interna monotónica. Una
  diferencia con igual timestamp entra en cuarentena en vez de sobrescribirse.
- Desglose CAD de líneas, descuento, envío e impuestos incluidos o adicionales.
  Cambios económicos posteriores, tasas no reconciliadas, duties y ajustes no
  compatibles requieren revisión. Los reembolsos del canal son estados espejo,
  no instrucciones para devolver dinero en Stripe ni contabilidad de devoluciones.
- Checkout Storefront externo, con destino HTTPS aprobado y resultado cifrado.
  Las retenciones demo permanecen independientes y los pedidos importados no
  descuentan inventario por segunda vez. Productos importados son de solo lectura
  en herramientas de simulación. Ocultarlos localmente persiste al sincronizar.
- Correos de pedidos externos requieren `PHASE2_SHOPIFY_MAIL_APPROVED=true` además
  de SMTP. Eventos demo siempre generan previews que no salen por SMTP.

**Importante:** el pago de Shopify depende de la configuración de esa tienda;
`sk_test` de VIICASA no controla Shopify. Activar checkout exige una tienda de
pruebas autorizada. La copia limita por defecto la importación a pedidos test.
No se probó aquí ninguna cuenta Shopify real ni se activaron sus webhooks.

Referencias: [firmas](https://shopify.dev/docs/apps/build/webhooks/verify-deliveries),
[pedidos](https://shopify.dev/docs/api/admin-graphql/latest/queries/orders),
[cartCreate](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate).

## GA4, Meta y GTM

- Payloads de servidor sin contactos, IP, textos libres ni URLs de formularios.
  ID pseudónimo de consentimiento, eventos permitidos, CAD y claves estables.
- Aprobación **separada** para compartir datos, además del aviso de privacidad y
  registro local. Cambiar esa aprobación invalida elecciones anteriores; exige
  consentimiento nuevo. Meta necesita además marketing; GPC bloquea recolección.
- GA4 valida el contrato por debug y después envía; respuesta HTTP aceptada no
  demuestra aparición en reportes. Meta utiliza Test Events en esta copia.
- Una entrega incierta no se reenvía automáticamente. Retirar consentimiento
  elimina eventos locales asociados y evita nuevos envíos; no recupera datos ya
  enviados ni un envío que ya estaba en curso. Configurar retención en proveedores
  es una tarea externa adicional.
- GTM navegador y envío directo GA4/Meta son topologías alternativas. GTM exige
  auditar previamente el contenedor: este código no inspecciona ni certifica sus
  etiquetas. No se carga en pantallas privadas ni sin ambas preferencias.
  El modo GTM no incluye conversiones de servidor para pedidos cerrados fuera del
  navegador; la fuente de compra autoritativa es el envío directo preparado.
- Activaciones/configuración requieren versionar y aprobar el aviso real. El texto
  genérico de demo no sustituye una revisión de privacidad.

Referencias: [GA4 validación](https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events),
[comprobación GA4](https://developers.google.com/analytics/devguides/collection/protocol/ga4/verify-implementation),
[SDK Meta](https://github.com/facebook/facebook-nodejs-business-sdk/tree/main/src/objects/serverside).

## Worker, base remota y respaldo

- `PHASE2_RUN_ROLE=embedded`: servidor y timer local en un único proceso, apropiado
  para PGlite. Nunca ejecutar dos procesos contra sus archivos.
- Con dos bases PostgreSQL independientes: usar `PHASE2_RUN_ROLE=web` para HTTP y
  `npm run worker:phase2` para el worker. Un lock de sesión PostgreSQL evita ciclos
  simultáneos entre workers. Colas y cobros tienen sus propias defensas idempotentes;
  una desconexión debe investigarse, no se presume una entrega o cargo exitoso.
- Estado privado: **Seguimiento automático → Estado del worker**; conserva 100
  ejecuciones con pasos sanitizados. Una ejecución vieja `running` puede ser un
  proceso interrumpido. Usar supervisión/reinicio y alertas del hosting.
- `/health/live` y `/health/ready` no exponen credenciales. Ready solo comprueba las
  bases: no certifica proveedores ni demuestra que el worker se esté ejecutando.
- `npm run migrate:phase2`: esquema idempotente, sin seed, pagos ni correo. Usar
  exclusivamente dos bases demo y conservar la clave de cifrado estable.
- `npm run backup:phase2-postgres -- --confirm-stopped`: dos archivos pg_dump custom,
  cifrados AES-256-GCM con clave independiente, manifiesto y hashes. Detener web,
  worker y entradas webhook durante el respaldo para un par coordinado.
- Restauración a **dos bases nuevas/vacías**:

  ```sh
  npm run backup:phase2-postgres -- restore "RUTA_PRIVADA_DEL_RESPALDO" --confirm-empty-targets --trusted-backup
  ```

  Configurar las dos variables `PHASE2_RESTORE_*_URL`. Se verifican ambos archivos
  antes de tocar destinos; se rechaza origen/destino idéntico y base no vacía. No
  usa `--clean` ni borra una base existente. Cada base se restaura en una transacción;
  **no hay transacción distribuida**: si falla la segunda, revisar la primera antes
  de repetir en nuevos destinos. Solo admitir respaldos propios/confiables.
- Necesita pg_dump/pg_restore compatibles, certificados TLS y almacenamiento
  privado. Asegurar ACL en Windows; chmod no sustituye sus permisos. Mantener
  clave de respaldo y `PHASE2_VAULT_KEY` fuera del archivo/Git. El respaldo SQL no
  incluye medios del filesystem; respaldarlos por separado. No activar proveedores
  en la instancia restaurada hasta validar su aislamiento.
- Estas utilidades no implementan PITR, snapshots gestionados ni retención externa.
  Contratar/configurar esas capacidades según el proveedor acordado.

Referencias: [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html),
[pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html).

## Único conector aún sin contrato implementable confirmado

Airbnb/Lodgify: motor interno de estancias, revisiones, disponibilidad local, jobs,
mapeos y notificaciones preview ya existente. **No hay conexión de disponibilidad
externa ni importación autenticada desde ese proveedor.** Confirmar acceso directo
autorizado o gestión vía Lodgify. La documentación detallada de reservas/calendario
de Lodgify no estuvo accesible para confirmar formatos y autenticación de eventos.

Se necesita una copia de su contrato/OpenAPI o ejemplos de reserva, modificación,
cancelación y disponibilidad sin datos personales, además de mapeos y permisos de
la cuenta. Con eso se cierra el adaptador y las notificaciones externas verificadas.
No sustituir ese pendiente por una ruta pública genérica o campos adivinados.

## Verificación

Suite: `npm run test:phase2`; nuevas pruebas: `npm run test:phase2-adapters`.
Resultado final en `RESULTADOS-PRUEBAS-LOCALES-FASE-2.md`. Pruebas con dobles de API,
cuentas ficticias, bases en memoria y archivos temporales; no hay validación de
cuentas, HTTP externo autenticado, SMTP, PostgreSQL remoto o restauración real.
Persisten QA visual de nuevas pantallas y los 31 casos de aceptación manual.

Dependencias de producción: Nodemailer 10.1.0 y override acotado de UUID 11.1.1
para Gaxios, con composición MIME y compatibilidad CommonJS comprobadas localmente.
La auditoría incluyendo Firebase CLI de desarrollo mantiene alertas heredadas;
la distribución de ejecución usa `npm ci --omit=dev`. Revisar esas herramientas
por separado antes de utilizarlas; no se declara una auditoría de seguridad final.

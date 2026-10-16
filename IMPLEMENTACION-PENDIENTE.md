# Fase 2: puntos preparados y trabajo aún pendiente

## Estado vigente después de la entrega de integraciones

Entrega posterior del 14 de octubre:
`PREPRODUCCION-Y-CIERRE-INTERNO-FASE-2.md`. Añade staging, alta segura inicial,
inspección y procesamiento de reservas verificadas. El puente concreto y el
calendario del proveedor siguen pendientes; no afirmar conexiones con solo claves.

La entrega más reciente implementa Stripe avanzado sandbox, Shopify, GA4/Meta/GTM,
worker independiente y respaldos PostgreSQL cifrados. Configuración, límites y
pendiente Airbnb/Lodgify: `INTEGRACIONES-Y-OPERACION-FASE-2.md`. Las referencias
históricas de este documento a esos adaptadores como ausentes describen el estado
anterior; no son el inventario vigente. Ninguna conexión o caso de aceptación se
ha dado por validado automáticamente.

Esta copia es exclusivamente demo. Una aprobación registrada en el panel no la
convierte en producción, no activa pagos reales y no conecta un proveedor.

## Orden de trabajo acordado

Primero completar las funciones internas; Shopify y Airbnb se conectarán al final,
junto con las pruebas de integración y aceptación del cliente. Las pruebas
automatizadas quedan preparadas para el cierre. Por la instrucción vigente,
desde la decimocuarta entrega solo se revisa sintaxis, sin ejecutar pruebas, usar
cuentas externas, cobrar o enviar correos reales.

Actualización del 13 de octubre: el usuario autorizó pruebas locales y la
corrección del desfase UTC/Vancouver. Se ejecutó la suite completa con resultado
final 103/103 aprobadas; no incluye proveedores reales ni QA visual. Informe:
`RESULTADOS-PRUEBAS-LOCALES-FASE-2.md`. Las validaciones externas siguen pendientes.

La decimoquinta entrega incorpora `/admin` → **Plan de validación**: 27 casos con
responsable, fecha, estado, dependencias, evidencia, historial y exportación privada.
Los casos no se han marcado como comprobados. No ejecuta pruebas, no verifica de
manera independiente ni habilita producción; los adaptadores no implementados
siguen pendientes. Cambios de código/configuración registrada dejan resultados
anteriores por revalidar. Ver `VALIDACION-FASE-2.md`.

Nueva entrega interna del 13 de octubre: cierre económico supervisado y paquetes
semanales con varios días. Esa entrega llevó el plan a 28 casos (cierre económico);
no se marcaron automáticamente como aceptados. Ver `CIERRES-FASE-2.md` y
`PRECIOS-FASE-2.md`. El borrador de datos para el informe final se acumula en
`DATOS-PENDIENTES-CLIENTE-FASE-2.md`.

La suite posterior a esta entrega dio 113/113 aprobadas y la revisión de sintaxis
173 archivos sin errores. Los seis renders de PDF semanal se revisaron; no incluye
prueba manual de la interfaz nueva ni conexiones externas. Ver el informe local.

### Últimos tres módulos internos: implementados en la siguiente entrega

1. Desglose de envío, impuestos y descuentos del canal ViiShop de fase 2, con
   configuración aprobada/versionada, preview sin retenciones y snapshot de pedido.
2. Revisión de cambios de propiedad y estancias iniciadas, con disponibilidad,
   evidencia antes/después e invalidación de avisos anteriores.
3. Correcciones anexadas de comisiones resueltas, sin sobrescribir pagos, con
   recuperaciones y complementos ficticios separados.

Ver `MODULOS-INTERNOS-FASE-2.md`. No presentar la fase como certificada para
producción ni como pendiente únicamente de credenciales: los adaptadores reales
ausentes y las validaciones externas también requieren trabajo.

Esta última entrega incorpora tres casos más de aceptación (desglose de ViiShop,
revisión de estancias y correcciones de comisión): **31 casos** en total, pendientes
de validación manual según sus dependencias. La suite local completa dio 121/121;
se repiten las pruebas de planificación/accesos tras ampliar ese catálogo.

La octava entrega añade reportes comerciales por periodo e integrante y gestión
de sesiones propias. Administra resultados en `/admin` y resultados personales
en `/vendedor` → **Reportes y metas**. No requiere proveedores conectados.
Los reportes usan la fecha de registro y el estado actual, no constituyen un
libro contable ni un histórico de transiciones. Las metas son las personales
configuradas; las metas mensuales o periodificadas necesitan reglas aprobadas.

La novena entrega añade automatizaciones internas del equipo: tareas próximas y
vencidas, visitas de mañana, facturas vencidas, pagos fallidos/en revisión, cambios
sin revisar por 48 horas y problemas de correo. Se activan en **Seguimiento
automático → Alertas internas del equipo** y se consultan en **Centro de alertas**.
Están desactivadas por defecto; no cobran ni generan correos. Las automatizaciones
de correo ViiLife existentes conservan sus preferencias separadas y el modo outbox.

El procesamiento necesita que el servidor esté ejecutándose. Su intervalo local
es de 30 segundos; una instalación con varias instancias necesitará el servicio
worker/scheduler acordado y supervisión del hosting. Se serializa cada ejecución
en SQL, sin depender de un navegador abierto. El registro operativo conserva las
últimas 100 ejecuciones; la auditoría administrativa permanece independiente.

## Integraciones y datos externos

La undécima entrega añade autorización independiente y calendario de cobros
ViiLife **simulados**, en `/admin` → **Cobros programados** y `/cliente`.
El circuito interno de consentimiento, límites, fallo, recuperación y recibo de
prueba está implementado. Falta conectar SetupIntent/método guardado, cobros
off-session, eventos firmados, autenticación adicional y conciliación Stripe.
No hay retención bancaria, tarjeta guardada, cobro recurrente real ni renovación.
Las reglas de fecha de cobro, reintentos, impuestos y términos requieren aprobación.
Ver `COBROS-PROGRAMADOS-FASE-2.md`. Shopify y Airbnb siguen reservados para el final.

`phase2/readiness.mjs` declara los requisitos privados de cada conexión; el panel
guarda referencias y mapeos versionados en `phase2_settings`. No guarda tokens.
`/api/commercial/setup` expone únicamente presencia de variables al administrador.

Los actuales `/integrations/:provider/simulate` generan eventos internos de ejemplo.
No son webhooks ni modifican reservas externas. Falta implementar:

- Adaptadores de Lodgify/Airbnb autorizados por las cuentas y sus planes: obtención
  de disponibilidad/reservas, estado externo, identificadores estables y tratamiento
  de cambios/cancelaciones. Confirmar si Airbnb se gestiona a través de Lodgify.
- Shopify: el motor interno de catálogo/variantes/inventario/pedidos normalizados
  ya existe. Falta adaptador a la API/cuenta, autenticación de webhooks, checkout
  externo, paginación, ubicaciones y conciliación periódica de stock.
- Meta/GA4/GTM: diario local de eventos y preferencias ya implementado (décima
  entrega). Faltan adaptadores y payloads por proveedor, separación de producción,
  deduplicación entre fuentes, conciliación y validación con cuentas reales.
  Ningún proveedor recibe datos. Ver `ANALITICA-FASE-2.md`.
- Automatizaciones de reserva/estancia: el motor interno ya tiene inbox normalizado,
  deduplicación, control de ocupación, jobs persistentes, invalidación de avisos,
  zona horaria y plantillas. Falta conectar eventos verificados de proveedores,
  conciliar disponibilidad externa y autorizar/validar envío de avisos reales.

Cada adaptador deberá verificar la autenticidad del cuerpo crudo antes de aceptar
eventos públicos; mapear IDs externos contra contenido local y dejar auditoría.
Las URLs/tokens nunca deben incorporarse a logs, al frontend ni a Git. No crear
una ruta pública genérica sin autenticación suponiendo que es un webhook válido.

### Interfaz implementada del motor de estancias

`phase2/stays.mjs` exporta `ingestStayEvent(db, event, context)` y
`processStayJobs(db, {now})`. Un adaptador real debe autenticar el cuerpo crudo,
normalizar el evento completo y resolver `unit_id` desde los mapeos aprobados.
Los campos son provider, event_id, external_reference, source_revision, event
(confirmed/modified/cancelled), unit_id, guest_name, guest_email, guests,
checkin_date y checkout_date. Fechas locales y zona/horas se toman de la propiedad.
No existe webhook público genérico. El único endpoint de eventos actual exige
sesión administrativa y origen válido: `/api/commercial/stays/events/demo`.

Los eventos rechazados/ignorados se registran; repetir ese ID conserva su resultado.
Una corrección usa ID y revisión nuevos. Rechazos deben presentarse al operador,
no confirmarse externamente como reservas aceptadas. Cambiar de propiedad o editar
una estancia iniciada ahora genera una revisión administrativa separada, con
evidencia congelada y revalidación antes de aplicar. No modifica el canal externo.

`stay_units` no es el catálogo público de fase 1. Debe mapearse expresamente al
catálogo y al canal antes de activar sincronización; no hay conciliación automática.
Los correos `delivery_scope=preview` nunca salen por SMTP. Cambiar esta política
requiere implementar y validar un camino separado para estancias externas verificadas,
sin permitir que eventos de simulación se conviertan en mensajes reales.

### Interfaz implementada de ViiShop / Shopify

`phase2/shop-channel.mjs` exporta `ingestChannelEvent(db,event,context)` y
`expireChannelCheckouts(db)`. `event` lleva event_id, kind (product/inventory/order)
y payload normalizado. Las estructuras están declaradas en el módulo: versiones
enteras monotónicas, IDs externos estables, precios CAD en centavos, cantidades
absolutas y snapshots de líneas. No acepta importes decimales ni hace conversión FX.

El adaptador real debe verificar la firma del cuerpo crudo, tienda autorizada y
topic antes de normalizar. Fechas/IDs reales de Shopify no deben inventarse como
versiones: el adaptador necesita una estrategia de ordenamiento y conciliación.
No existe aún tal adaptador, endpoint público ni creación de checkout Shopify.
Elegir fuentes demo o configurar tokens no habilita conexión alguna.

Datos en `channel_products`, `channel_variants`, `channel_events`, `channel_orders`.
El carrito ficticio del canal usa `channel_checkouts`/`channel_holds`, exclusivamente
clientes verificados. No se copia el stock al catálogo de fase 1. Las reservas
locales se descuentan de disponibilidad para simulación; un pedido importado no
modifica stock, que se recibe por evento absoluto de inventario.

Al activar Shopify real, deshabilitar este checkout ficticio y usar el checkout
externo con su propia validación de inventario. No combinar sus retenciones con
las de Stripe local ni sumar inventario de ubicaciones/canales sin definir mapeo.
Impuestos, envío y descuentos ya tienen desglose opcional normalizado y configuración
local aprobada. El contrato legado sin desglose conserva total igual a las líneas;
un adaptador real deberá normalizar correctamente cada importe externo. Reembolsos y
cancelaciones reflejados son estados de ejemplo, nunca solicitudes monetarias.

## Identidad

Correo/contraseña del cliente funciona en `/api/client`; TOTP del equipo es
independiente en `/api/commercial`. Los adaptadores Google/Apple están implementados
en `phase2/identity-provider.mjs` y `phase2/customer-social.mjs`. Ambos quedan
desactivados por defecto. Validan firma, proveedor, audiencia, correo, estado y
nonce. La vinculación exige una sesión reciente del cliente y su autorización;
no fusiona cuentas por correo ni otorga roles del equipo. Quitar un proveedor
revoca todas las sesiones y requiere conservar otro método de acceso.

Pendientes: configurar clientes OAuth independientes, dominio HTTPS para Apple,
pruebas reales con ambos proveedores y relay de Apple, aprobación de privacidad,
políticas de retención/baja y revocación del consentimiento en el proveedor. No se
guardan access/refresh tokens para revocar ese consentimiento desde esta demo.
Instrucciones completas: `IDENTIDAD-FASE-2.md`.

## Cobros y condiciones

- PDF: `phase2/service-pdf.mjs`; las descripciones de adjuntos contienen una copia
  del documento al momento del aviso. El worker `phase2/mail.mjs` los genera sin
  consultar un archivo remoto. Solo equipo autorizado/cliente dueño descarga.
- Facturas y cobros CAD: `phase2/agreements.mjs` y `phase2/invoice-gateway.mjs`.
  Solo `sk_test`; importes calculados por backend. No usar el retorno del navegador
  como prueba de pago. El webhook firmado verifica importe y moneda.
- Solicitudes de cambios, terminación y recordatorios: `phase2/service-operations.mjs`.
  Cambios al calendario no reescriben la aceptación ni las facturas existentes.
  El cierre económico supervisado ya permite borrador, aprobación y factura CAD
  separada, o cierre sin cargos: `phase2/service-closing.mjs`. No aplica multas
  por defecto, ni cobra automáticamente, ni modifica recibos previos. Las reglas
  e impuestos requieren aprobación explícita. Ver `CIERRES-FASE-2.md`.
  Penalizaciones y reembolsos automáticos siguen sin habilitarse. El flujo de
  solicitud, aprobación, ledger y ejecución simulada de créditos/reembolsos
  supervisados ya existe en la decimotercera entrega: `AJUSTES-FASE-2.md`.
  Falta ejecutar y conciliar reembolsos externos y aprobar sus consecuencias
  fiscales/comerciales. La revisión interna de comisiones tras reembolsos,
  conservación de pagos previos y recuperaciones ficticias están implementadas
  en la decimocuarta entrega: `COMISIONES-FASE-2.md`, con pruebas locales ejecutadas.
  Correcciones anexadas de decisiones resueltas y complementos ficticios ya están
  implementados, sin editar decisiones/pagos originales. Ver la nueva guía interna.
- Autorización/cobro recurrente: consentimiento separado, calendario de facturas,
  revocación y recuperación simulados ya implementados en `phase2/recurring.mjs`.
  Falta método de pago guardado y adaptador Stripe off-session, aprobar reintentos
  y definir vencimiento/renovación (la demo nunca extiende el calendario aceptado).
  No reutilizar un cobro único como autorización para una suscripción.
- Cotización comercial de cuota semanal negociada, mínimos, impuestos y extras:
  motor/configuración ya implementados en la duodécima entrega. Sin tasas ni
  cargos predeterminados; requieren valores y reglas finales aprobados.
  Los paquetes semanales ya permiten varios días, precio único por bloque y
  mínimos/extras por cada ejecución, manteniendo acuerdos previos inmutables.
  Impuestos compuestos/territoriales y base de comisiones requieren reglas finales
  y una ampliación si el cliente los necesita.
  Ver `PRECIOS-FASE-2.md`.

## Infraestructura y pruebas posteriores

`PHASE2_DATABASE_DRIVER=postgres` usa `phase2/postgres.mjs` y las migraciones de
`phase2/database.mjs`. Necesita dos bases vacías de demo y TLS válido. El hosting
de Node no tiene que alojar también PostgreSQL; el proveedor remoto sigue pendiente.
La clave `PHASE2_VAULT_KEY` debe mantenerse privada, persistente y respaldada.

`backup:phase2` genera copia offline del PGlite local, nunca una copia caliente.
Para bases remotas faltan snapshots/pg_dump programados, restauración y migración
de datos. Separar datos de prueba de producción, preservar claves de cifrado y
no llevar cuentas ficticias o contraseñas de demo a la plataforma oficial.

Pruebas posteriores: SMTP con recepción real y PDF adjunto, Stripe sandbox y
webhooks alojados, base remota/restore, Google/Apple, integraciones por proveedor,
responsive en dispositivos, idiomas, accesibilidad y recorrido completo con cliente.

El paso a oficial será otra copia/version aprobada. No se ha hecho push ni despliegue
ni se ha modificado el proyecto `viicasa-plataforma`.

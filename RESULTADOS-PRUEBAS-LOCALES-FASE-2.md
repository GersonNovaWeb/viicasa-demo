# Pruebas locales · fase 2 · 13 de octubre de 2026

## Entrega del 14 de octubre: perfiles y cierre interno

`npm run test:phase2`: **141 aprobadas, 0 fallidas, 0 omitidas**, 357 segundos.
Tras los últimos refuerzos se repitieron **5 pruebas de perfiles/puente interno**,
todas aprobadas, también después de una instalación `npm ci --ignore-scripts`.
La reinstalación desde lockfile completó correctamente. Revisión de sintaxis:
**210 archivos JavaScript sin errores**.

- Staging limpio sin cuentas de ejemplo, inicialización de un administrador de
  un solo uso con MFA, aislamiento/ID de pareja, rechazo de bases existentes,
  HTTPS/TLS y bloqueo de simulaciones/producción/sk_live.
- Entrada de reservas desactivada sin puente, firma ficticia del harness local,
  refetch autoritativo, mapeo, deduplicación, versiones y cuarentena. Avisos
  aprobados al huésped/admin correcto; lo no aprobado queda en preview.
- Se repitieron los módulos previos: acuerdos, visitas/facturas, cobros/reembolsos,
  comisiones, Shopify, privacidad, perfiles/roles, reportes y colas.

`npm audit` del manifiesto principal: **0 vulnerabilidades reportadas**, incluyendo
dependencias de ejecución y desarrollo de ese manifiesto. Se aisló el CLI opcional
de Firebase en `tools/firebase/package.json`; no se instaló ni se declara corregida
su cadena. Los avisos de deprecación no equivalen a una certificación de seguridad.

No se inició un servidor persistente ni se ejecutó el alta sobre las bases del
usuario. No hubo conexiones autenticadas, SMTP, cobros, base remota o QA visual.
`.env.phase2.local` no fue editado; las claves y datos persistentes están ignorados.
La plataforma oficial permanece sin cambios. No hubo commit, push ni despliegue.
Detalles y límite de la promoción oficial:
`PREPRODUCCION-Y-CIERRE-INTERNO-FASE-2.md`.

## Entrega actual: adaptadores y operación

Primera suite completa de esta entrega: **136 aprobadas, 0 fallidas, 0 omitidas**,
262 segundos. Además se repitieron las **4 pruebas Shopify**, todas aprobadas,
tras ampliar la conciliación de productos conocidos. Sintaxis: **201 archivos
JavaScript sin errores**. Las pruebas no marcan automáticamente aceptación manual.

Cobertura nueva: Stripe SetupIntent/off-session/reembolso con servidor autoritativo,
consentimiento, propiedad, activaciones, firma, idempotencia y avisos al comprador;
Shopify HMAC/tienda, refetch, CAD/desglose, stock independiente, solo lectura,
ocultación persistente, checkout y conciliación periódica; aprobación independiente
de analítica, consentimiento nuevo, GPC, revocación y entregas inciertas sin resend;
worker concurrente y resultados sanitizados; cifrado/autenticación de ambos archivos
de respaldo, destinos separados/vacíos y rechazo de corrupción sin restaurar.

**No se conectó ningún proveedor real.** PostgreSQL remoto, SMTP y restauración
real no fueron probados. Backup tests usan archivos ficticios temporales y procesos
pg_dump/pg_restore sustituidos; comprueban el pipeline de cifrado y las guardas,
no la compatibilidad con una base remota. No hubo QA visual nuevo.

Revisión de dependencias: Nodemailer actualizado a 10.1.0; UUID de Gaxios se limita
a 11.1.1 con override compatible CommonJS/v4 comprobado. Se compuso un mensaje MIME
con adjunto usando stream transport, sin SMTP. Firebase CLI actualizado dentro de
su rango existente. `npm audit --omit=dev`: **0 vulnerabilidades reportadas**.
La auditoría incluyendo desarrollo mantiene **10 alertas (8 altas y 2 moderadas)**
en la cadena de Firebase CLI heredada; no se aplicó `audit fix --force` ni se declara
resuelta esa cadena. La fase 2 no usa ese CLI; desplegar con `npm ci --omit=dev`.
Auditoría es una comprobación puntual, no una certificación de seguridad.

Repetición completa después de actualizar dependencias: **136 aprobadas, 0 fallidas,
0 omitidas**, 261 segundos. La revisión final de sintaxis conservó **201 archivos
sin errores**. `.env.phase2.local` y `data/phase2/vault.key` están ignorados por Git;
la comprobación del repositorio oficial mostró que permanecía limpio. No hubo
commit, push, despliegue ni ejecución del servidor con proveedores activos.
Informe técnico y pendientes:
`INTEGRACIONES-Y-OPERACION-FASE-2.md`. La plataforma oficial no se modificó.

Resultado de la entrega anterior: **103 pruebas aprobadas, 0 fallidas, 0 omitidas** en
`npm run test:phase2`. Duración del último recorrido: aproximadamente 152 segundos.
Este resultado corresponde al código de la copia `viicasa-fase2-demo`, no a
conexiones externas ni a certificación de producción.

Revisión de sintaxis de esa entrega: **168 archivos JavaScript sin errores**.

## Nueva entrega interna: cierres y calendario semanal

Última ejecución completa: **113 pruebas aprobadas, 0 fallidas, 0 omitidas**,
aproximadamente 167 segundos en `npm run test:phase2`. Revisión de sintaxis:
**173 archivos JavaScript sin errores**. Se agregaron seis pruebas de cierre y
cuatro de paquetes semanales; no se omitieron módulos anteriores.

- Cierres: política pendiente, roles/origen/propietario, impuestos explícitos,
  límites de recuperación/cargos, evidencia congelada, cambios financieros,
  factura separada inmutable, concurrencia/idempotencia, pago manual simulado,
  destinatario comprador correcto y exclusión de comisiones/cobros programados.
- Semanales: días distintos, fecha inicial, bloques de siete días, múltiples
  propiedades, conservación de centavos, extras por ejecución, límite de filas,
  ventana introductoria y comportamiento del calendario legado. Recorrido API
  cotización → aprobación → aceptación → visitas → facturas mensuales.
- Una aserción inicial de la nueva prueba esperaba rechazar trece bloques que sí
  cabían en la ventana introductoria. Se reemplazó por un escenario donde la
  visita adicional del último bloque queda fuera; no se relajó la validación.
- PDF: revisión de cuatro páginas del acuerdo y dos del recibo, generados con
  `preview:phase2-documents -- --weekly`. Encabezados/pies repetidos, márgenes,
  calendario y desglose legibles; dos bloques y doce ejecuciones diferenciados.
  La revisión se corroboró con texto extraído y una hoja de contacto nueva por
  una previsualización que mostró imágenes antiguas. No son documentos fiscales.

Las pruebas siguen siendo locales con bases en memoria y mensajes outbox. No se
alteró la base persistente, ni se enviaron mensajes SMTP, ni se realizaron cobros
o conexiones externas. La interfaz nueva sigue pendiente de recorrido manual en
escritorio/móvil; los 28 casos del plan de aceptación no se marcan automáticamente.
El estado Git de `viicasa-plataforma` continúa limpio. No hubo commit/push/despliegue.

## Historial de la validación anterior

## Últimos tres módulos internos: resultado posterior

Recorrido completo: **121 aprobadas, 0 fallidas, 0 omitidas**, aproximadamente
183 segundos en `npm run test:phase2`. Se agregaron ocho pruebas en tres módulos:

- ViiShop: aritmética exacta, impuestos explícitos, importes normalizados,
  permisos, versión de reglas, preview sin retenciones, total confirmado,
  preservación de pedidos y rechazo de cambios de desglose aun con el mismo total.
- Estancias: revisión administrativa, rechazo entre roles y de origen externo,
  idempotencia, historial antes/después, invalidación de avisos, ocupación concurrente,
  versiones obsoletas, rechazo supervisado, conservación de check-in, cancelación
  revisada y bloqueo de estancias finalizadas.
- Comisiones: original inmutable, secuencia/huellas, importes combinados,
  revisión pendiente, base congelada al pagar, pagos previos conservados,
  recuperación y complemento separados, concurrencia, idempotencia y manipulación
  de evidencia rechazada. Lectura propia del vendedor y avisos internos.

Tras ese recorrido se amplió el catálogo de aceptación a 31 casos y se corrigió
el paso del manejador de avisos a la nueva interfaz de comisiones. Se repiten las
pruebas de planificación/accesos y sintaxis sobre esos últimos ajustes:
**10 pruebas aprobadas sin fallos** y **183 archivos JavaScript sin errores**.
Estas diez comprobaciones son revalidaciones, no diez casos nuevos de la suite.
No se marcan automáticamente los casos de aceptación como aprobados.

No hubo prueba manual de navegador de los nuevos formularios, contactos con
Shopify/Airbnb, SMTP, transferencias o pagos reales. Bases en memoria; no se
modificó la demo persistente ni la plataforma oficial. Ver
`MODULOS-INTERNOS-FASE-2.md` para capacidades y límites.

## Pruebas nuevas que estaban pendientes

- `npm run test:phase2-commissions`: 5 aprobadas. Permisos/origen, historia,
  reducción supervisada, pago original, recuperaciones demo, concurrencia,
  límites, vínculo de datos anteriores e integridad de evidencia.
- `npm run test:phase2-launch`: 5 aprobadas. Panel administrativo privado,
  dependencias, bloqueo de adaptadores ausentes, versiones/huellas, historial,
  exportación segura y ausencia de activación de producción.
- Calendario de servicio: 3 nuevas pruebas de cruce UTC/Vancouver, medianoche
  en invierno/verano, Net 15 con DST, año/mes y fechas inválidas.
- El recorrido completo de fase 2 volvió a incluir los módulos anteriores:
  identidad simulada, MFA, CRM/cotizaciones/acuerdos, visitas/facturas, pagos y
  eventos firmados ficticios, correos outbox y PDF, cambios, créditos/reembolsos,
  comisiones, cobros programados, analítica local, reservas y catálogo internos.

## Defecto detectado y corregido con autorización

La primera ejecución tuvo 93 aprobadas y 7 fallidas (sobre 100). El cobrador
usaba el día de Vancouver, pero el vencimiento de nuevas facturas residenciales
se calculaba con el día UTC. Después de medianoche UTC y antes de medianoche
Vancouver, la factura quedaba con vencimiento un día posterior; no se generaba
el job esperado y varias pruebas posteriores fallaban por esa ausencia.

Se agregó `phase2/service-time.mjs` como calendario compartido:

- Residencial: vencimiento en el día de emisión del calendario Vancouver.
- Comercial: Net 15 en días calendario contados desde ese mismo día.
- Operaciones y cobrador mantienen la misma definición de día local.
- El instante absoluto de emisión sigue guardado como timestamp. Se conserva
  evidencia del calendario calculado en la auditoría de nuevas facturas.
- No se recalcularon facturas previas ni se modificaron recibos ya guardados.

Después de corregir, 13 comprobaciones de calendario/cobros programados pasaron.
La suite general encontró entonces una aserción antigua de Net 15 que aún
comparaba contra UTC: se actualizó para comparar contra Vancouver. La repetición
final quedó en 103/103, sin saltar pruebas ni desactivar validaciones de negocio.

## Alcance y límites

Bases PGlite en memoria, cuentas ficticias y correos en outbox. Stripe utiliza
dobles de prueba y validación criptográfica local de eventos; no se realizaron
llamadas a Stripe, cobros, devoluciones o envíos SMTP reales. Tampoco se conectó
Google/Apple, PostgreSQL remoto, Shopify, Airbnb/Lodgify o analítica externa.

Se intentó abrir un servidor de interfaz temporal con bases descartables y sin
worker de correo. El navegador no pudo conectarse (timeout); **no se contabiliza
como prueba visual aprobada**. El servidor tenía cierre automático y la revisión
posterior no mostró procesos Node ni listeners en el puerto temporal 3041.
No se accedió a cuentas existentes ni se alteraron sesiones/MFA de la demo guardada.
Quedan pendientes recorridos visuales de escritorio/móvil, idioma/accesibilidad
y aceptación real con proveedores y hosting.

No se marcaron automáticamente los 27 casos del Plan de validación como pasados:
esas comprobaciones de aceptación tienen alcance distinto de las pruebas de API.
No hubo commit, push, despliegue ni cambios en la plataforma oficial.

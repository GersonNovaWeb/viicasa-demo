# VIICASA — copia independiente de desarrollo de Fase 2

Carpeta: `outputs/viicasa-fase2-demo`. Creada desde el estado de
`outputs/viicasa-plataforma` del 12 de octubre de 2026. La plataforma original
se copió desde el commit `a6c577b16d5f662626d01bcfca1ad0d6d3dbd33b`, sin cambios locales;
conserva sus archivos y configuración. Esta copia excluye `.git`, credenciales,
variables privadas y datos de la fase 1; no tiene remoto ni despliegue oficial.

## Primera entrega de desarrollo

- Sitio y feed vertical de fase 1 conservados, con productos y propiedades de ejemplo.
- Accesos separados `/admin` y `/vendedor`, adaptables a móvil, ES/EN.
  `/equipo` conserva el acceso general y dirige al panel según el rol asignado.
- Correo/contraseña con scrypt; segundo factor TOTP obligatorio y ocho códigos
  de respaldo de un solo uso. Secretos TOTP cifrados, cookies HttpOnly, expiración,
  intentos limitados, revocación por usuario y comprobación de origen.
- CRM con etapas, prioridad, origen, notas, asignación/reasignación y actividades.
- Tareas con próxima fecha y estado; cada vendedor accede solo a sus registros.
- Ventas, metas y comisiones en CAD; cálculo en centavos, estados pendiente,
  aprobada y pagada. La regla se captura al crear la venta. El 5% inicial es
  exclusivamente una regla de ejemplo, pendiente de aprobación.
- Administración de usuarios, desactivación/reactivación, restablecimiento de
  contraseña/2FA y eliminación del acceso preservando referencias y auditoría.
- Cotizador interno basado en los contratos y tarjetas residenciales/comerciales
  del ZIP. Equipos de dos personas, múltiples direcciones/superficies, proyectos,
  visitas y trabajos subcontratados. Referencias internas accesibles solo al equipo.
- Condición comercial anual: 30% en los primeros tres meses únicamente con
  servicio semanal o diario; el cotizador calcula el periodo inicial, no toda la
  anualidad. La recuperación de descuentos usa descuentos realmente recibidos.
- Dos bases locales persistentes e independientes: plataforma y módulo comercial.
- Bandeja privada de correos; SMTP opcional con configuración propia de la demo.
- Panel de integraciones con eventos locales de ejemplo, identificado como demo.

## Segunda entrega: acuerdos, clientes y facturación de demo

- Portal de clientes `/cliente`, con correo/contraseña, verificación por código,
  bienvenida, recuperación de acceso y sesiones independientes de los vendedores.
- El correo verificado se usa para los pedidos del cliente autenticado. El
  checkout lo completa automáticamente y el backend asegura ese destinatario.
- Solicitudes residenciales/comerciales desde ViiLife; crean prospectos en CRM
  y avisos para el cliente y el administrador, sin publicar tablas internas.
- Cotizaciones editables con versión, revisión del administrador y bloqueo tras
  aprobación. Se incluyen dos borradores ficticios para explorar el módulo.
- Acuerdos basados en los contratos recibidos: propiedades, alcance, periodo,
  precio y condiciones se conservan como una copia inmutable. El cliente acepta
  desde una cuenta con correo verificado, elige acceso y la opción de fotografías.
  Se registra nombre escrito, fecha, versión y huella del documento; no se
  presenta como una firma electrónica certificada.
- Las visitas del periodo se crean una sola vez al aceptar. El administrador
  registra realización, falta de acceso o cancelación; los vendedores consultan
  únicamente los clientes asignados.
- Residencial: documento de cobro por visita facturable. Comercial: documento
  mensual consolidado tras resolver las visitas del mes; vencimiento Net 15.
  Los importes y descuentos cuadran en centavos y las visitas no se facturan dos veces.
- Pago simulado de facturas o Stripe con tarjeta en sandbox al conectar las
  claves. Webhook firmado, importe/moneda comprobados, actualización del estado,
  avisos al comprador y administrador y creación única de venta/comisión.
- Contratos y facturas pueden abrirse como documentos e imprimirse/guardarse en
  PDF desde el navegador. La tercera entrega añade generación PDF en servidor y
  adjuntos automáticos para acuerdos, facturas y recibos comerciales.
- Correos comerciales se guardan transaccionalmente en su propia bandeja. Con
  SMTP activo, el servidor procesa y reintenta los pendientes automáticamente.
- La bandeja del administrador permite previsualizar el correo, útil para obtener
  el código de verificación en esta demo cuando aún se utiliza `outbox`.

### Recorrido de prueba

1. Entrar como administrador a `/equipo`; completar el alta TOTP si es la primera vez.
2. Abrir `/cliente` en otro navegador o ventana; crear una cuenta con un correo de prueba.
3. En **Correos** del administrador, abrir el mensaje «Verify your email» y escribir
   su código en el portal del cliente. Con SMTP activo el cliente lo recibe por correo.
4. Solicitar una propuesta desde el cliente. En CRM, el administrador asigna el
   prospecto a un vendedor. El vendedor prepara la cotización con datos del cliente.
5. El administrador aprueba la cotización; desde ella crear el acuerdo y enviarlo.
6. En el cliente, revisar el acuerdo, condiciones, acceso y fotografías; aceptarlo.
7. En **Visitas**, marcar las realizadas. En **Facturación**, emitir el documento
   residencial por visita o el consolidado comercial del mes.
8. El cliente pulsa **Pagar**. Sin claves Stripe, el administrador puede completar
   la simulación desde **Facturación**. Con `sk_test`, pagar en Stripe y recibir el
   webhook configurado. Revisar factura pagada, venta, comisión y correos.

Las cuentas y acuerdos de clientes se guardan en la base comercial; la plataforma
utiliza la identidad verificada para conservar sus compras de ViiShop/ViiLife.
Google y Apple siguen pendientes de un proyecto de pruebas con sus accesos.

## Tercera entrega: operación y preparación para conexiones

- PDFs en inglés con logo local, encabezado, pie y páginas numeradas. Rutas
  privadas de descarga para cliente/equipo. Al enviar un acuerdo, aceptar,
  facturar o registrar el pago se conserva el documento correspondiente en la
  bandeja y se adjunta cuando se active SMTP; no cambia si el registro evoluciona.
- El cliente solicita cambio de fecha, cancelación de visita o terminación. La
  solicitud no altera el calendario hasta que el administrador la apruebe.
  Puede retirar solicitudes pendientes y consultar la respuesta posterior.
- Panel **Cambios de servicio**: revisión con control de versiones, próxima
  fecha, plazo de aviso residencial y referencia del descuento realmente recibido
  en facturas pagadas. Una excepción al plazo exige aprobación explícita.
- Las terminaciones aprobadas cancelan visitas programadas desde su fecha
  efectiva. Facturas, pagos, visitas realizadas y evidencia de aceptación se
  preservan. No se cobran penalizaciones, recobros ni reembolsos automáticos.
- Panel **Seguimiento automático**: recordatorio de visita al día siguiente y de
  facturas vencidas (máximo semanal), ambos desactivados inicialmente. Deduplicación
  transaccional, zona America/Vancouver y procesamiento cada 30 segundos.
- Panel **Preparación de lanzamiento**: registro de aprobaciones y mapeos externos
  por propiedad/producto/variante/evento. Solo indica si las variables privadas
  están presentes; no expone claves ni declara conexiones verificadas.
- Adaptador PostgreSQL remoto con dos bases independientes, TLS verificado,
  transacciones, migraciones bloqueadas y clave de cifrado persistente por entorno.
  La copia sigue usando PGlite local por defecto. No se migraron datos ni se
  conectaron bases externas; esa configuración requiere validación posterior.
- Utilidad de respaldo local offline: detener el servidor y ejecutar
  `npm run backup:phase2 -- --confirm-stopped`. Guarda ambas bases y la clave
  en `data/backups`, excluido de Git. Contiene datos personales y secretos:
  almacenarlo de forma privada. Restauración y backups remotos aún deben validarse.

Los adaptadores externos de Lodgify/Airbnb/Shopify/Meta **siguen pendientes de
implementación y validación**. Los mapeos y nombres de variables son una interfaz
preparada, no sincronización real. El acceso Google/Apple ya está implementado en
la sexta entrega; falta configurar y validar los proveedores reales.
La lista técnica de trabajos y puntos de conexión está en `IMPLEMENTACION-PENDIENTE.md`.

## Cuarta entrega: motor de reservas y estancias

- Panel administrador **Reservas y estancias**: propiedades operativas independientes,
  calendario nocturno de ocupación, alta de reserva ficticia, cambios, cancelación,
  check-in/check-out manual y actividad. La fecha de salida no bloquea la entrada
  de otro huésped ese día. Se incluye una propiedad ficticia; no se cargan reservas
  automáticamente ni se modifica el catálogo de la fase 1.
- Propiedades con capacidad, zona IANA, horas de entrada/salida y textos editables
  en inglés. Cada reserva conserva una copia de su propiedad y sus plantillas:
  editar la propiedad no cambia estancias ya guardadas.
- Inbox persistente de eventos normalizados, con ID externo y revisión de origen.
  Repetir un evento no duplica datos; reutilizar su ID con contenido diferente se
  rechaza. Eventos anteriores se guardan como ignorados y conflictos como rechazados.
- Bloqueo transaccional de disponibilidad. No admite dos reservas confirmadas
  solapadas ni exceso de capacidad. Una reserva cancelada libera las noches.
- Jobs persistentes de confirmación, cambio, llegada, salida y cancelación. Avisos
  de llegada/salida 24 horas antes del horario de la propiedad; los vencidos se
  omiten. Reprogramar o cancelar invalida jobs y correos pendientes anteriores.
- Zona horaria y horario estacional manejados con `Intl`; horas inexistentes o
  ambiguas se rechazan para revisión en vez de desplazar silenciosamente una estancia.
- Los avisos son exclusivamente **vistas previas**. `delivery_scope=preview` bloquea
  su envío incluso con SMTP. No contienen códigos de acceso ni confirman pagos.
- Portal cliente: estancias visibles solo tras verificar la cuenta y coincidir su
  correo, nunca mediante consulta anónima por email.
- `ingestStayEvent` es el punto interno para un adaptador futuro. No se expone un
  webhook público sin autenticación; elegir Lodgify/Airbnb en un evento de demo no
  conecta sus cuentas ni envía reservas a esos servicios.

Para explorar: entrar como administrador → **Reservas y estancias** → crear una
reserva de demo → **Preparar avisos pendientes** → abrir la vista previa. Los
avisos futuros se preparan al llegar su hora; no se adelanta el reloj real desde UI.
Cambiar las fechas y cancelar permite revisar la anulación de avisos anteriores.
Después de iniciar una estancia no se permiten modificaciones externas automáticas;
esa excepción queda para un flujo supervisado posterior.

## Quinta entrega: ViiShop y canal de catálogo Shopify de demo

- Panel administrador **ViiShop · Canal Shopify**: catálogo con variantes y SKU,
  eventos de inventario absoluto, publicación/archivo, operaciones del cliente,
  pedidos reflejados y preparación simulada. Se cargan dos productos ficticios
  mediante un botón; cuatro variantes con precios CAD y ocho unidades iniciales.
  Recargar los ejemplos no repone stock ni restaura productos archivados.
- Los productos del canal aparecen **después del scroll de ViiShop**, además del
  catálogo existente. Sus detalles usan `/shop-channel/:slug` para distinguirlos
  del checkout Stripe de fase 1; no se mezclan carritos ni inventarios.
- Cliente autenticado con correo verificado prepara una operación ficticia con
  precio de servidor y retención de 30 minutos. Puede verla/cancelarla en su portal.
  La confirmación simulada es una acción del administrador, sin tarjeta ni dinero.
- Stocks bloqueados transaccionalmente, retenciones liberadas al cancelar/vencer,
  importes inmutables y confirmación idempotente. Un cambio de inventario de origen
  que deja retenciones sin respaldo bloquea la confirmación para revisión.
- Inbox normalizado de producto/inventario/pedido: controles de duplicados,
  versiones antiguas, SKU/slugs y datos inmutables. Importar un pedido externo
  **no descuenta stock**: su evento de inventario es la fuente de verdad, evitando
  descontar una venta dos veces.
- Correos de pedido a comprador/administrador preparados exclusivamente como
  `delivery_scope=preview`, bloqueados para SMTP. Una simulación no procesa pagos,
  entrega, devolución física ni reembolso real.
- El catálogo nuevo es un espejo independiente. `ingestChannelEvent` prepara el
  punto de entrada interno, no interpreta un webhook Shopify crudo ni crea checkout
  externo. El adaptador, autenticación, paginación y conciliación siguen pendientes.

Para explorar: **ViiShop · Canal Shopify** → **Cargar 2 productos de ejemplo** →
abrir `/shop` y bajar después del feed → elegir variante → iniciar sesión en
`/cliente` → preparar pedido ficticio → simular pago desde el equipo. Pedidos
locales con Stripe siguen usando sus rutas y catálogo originales.

## Cómo abrirlo

Desde esta carpeta ejecutar `npm run dev` y abrir `http://127.0.0.1:3030`.
Administrador: `http://127.0.0.1:3030/admin`.
Vendedor: `http://127.0.0.1:3030/vendedor`.
El acceso general `/equipo` se conserva y, después de verificar la identidad,
dirige al panel correspondiente. Cada acceso valida el rol almacenado en servidor;
seleccionar otro rol o cambiar la URL no modifica los permisos de la cuenta.
Ambos requieren contraseña y TOTP. La administración del catálogo heredado está
en `/admin/plataforma`, solo para sesiones administrativas verificadas.

Credenciales de datos ficticios, solo para esta copia local:

| Perfil | Correo | Contraseña |
|---|---|---|
| Administrador | admin@viicasa.demo.invalid | ViiCasa-Demo-2026! |
| Vendedor | seller@viicasa.demo.invalid | ViiCasa-Seller-2026! |

Al primer acceso registra la clave mostrada en Google Authenticator, Microsoft
Authenticator u otra app TOTP. Guarda los códigos de recuperación que aparecen
después de validar. Para revisión local también puedes generar el código con
`npm run demo:totp -- CLAVE_MOSTRADA`. No se muestran códigos TOTP en una ruta pública.

No requiere Firestore local ni emulador. Los datos persisten en
`data/phase2/platform` y `data/phase2/commercial` usando PGlite (PostgreSQL local).
La clave de cifrado está en `data/phase2/vault.key`; no compartirla ni borrarla.
Para respaldar la demo, detener el servidor y copiar todo `data/phase2` a un lugar
privado. La base de producción requiere proveedor remoto y esquema de respaldos;
no se debe utilizar este almacenamiento embebido como despliegue oficial escalado.
Para alojar esta demo con PostgreSQL remoto, configurar `PHASE2_DATABASE_DRIVER=postgres`,
las dos URLs privadas de bases distintas y `PHASE2_VAULT_KEY` (32 bytes aleatorios
en base64, estable). TLS está activo por defecto y no acepta parámetros que lo
degraden dentro de las URLs. No reutilizar las bases de producción. Una instalación
ya existente debe conservar su clave original al migrar, o se pierde acceso a los
secretos TOTP; todavía no se realizó esa migración.

`.env.phase2.example` documenta la configuración independiente. Los pagos son
simulados por defecto. Para ingresar tarjetas de Stripe usar credenciales sandbox
propias de esta copia y webhook a `/v1/webhooks/stripe`. Las claves `sk_live` se
rechazan. Con `outbox`, los correos quedan guardados; con SMTP configurado sí se
envían a los destinatarios de las pruebas.

## Alcance pendiente de Fase 2

1. Conectar y validar cuentas reales de Lodgify, Airbnb, Shopify y Meta; mapeos,
   disponibilidad, inventario, checkout externo y webhooks según APIs/planes.
   Los eventos locales no equivalen a sincronización externa completada.
2. Configurar GA4, Tag Manager, Pixel y consentimiento/eventos; medición todavía
   no activada. Automatizaciones de estancia/check-in/check-out pendientes.
3. Aprobar reglas comerciales: comisiones, CRM final, metas, perfiles y recuperación.
4. Resolver con el cliente el cambio de condiciones de los contratos nuevos:
   cobro al terminar en residencial y factura mensual Net 15 en comercial, frente
   al checkout anticipado de fase 1. El cotizador no cambia el checkout anterior.
5. Confirmar moneda de las tarjetas ($ sin código): CAD es la opción de la demo.
   Revisar impuestos, recargos, mínimos, suministro, traslados y precios finales.
6. Validar y aprobar los contratos/aceptación y cambios ya implementados; conectar
   a Stripe la autorización y los cobros recurrentes preparados en la undécima
   entrega, y definir el recobro de
   descuentos/penalizaciones conforme a reglas aprobadas. En esta demo no se
   activan cargos recurrentes ni recobros automáticos. Confirmar impuestos y
   recargos; los documentos de cobro actuales son de prueba y no fiscales.
7. Configurar clientes Google/Apple en un proyecto de pruebas; correo/contraseña
   y verificación local ya funcionan. La copia no hereda Firebase de producción.
8. Validar todo el bloque A y B en entorno alojado antes de aprobación final.

Aunque la propuesta menciona WordPress, se continúa con Node.js y código propio,
conforme a la instrucción vigente del proyecto. Las integraciones usarán las
capacidades reales permitidas; Airbnb no se presenta como API pública universal.

## Pasar a oficial cuando la fase esté aprobada

Congelar una versión probada de esta demo y clonarla a una carpeta/repositorio
oficial separado. Configurar servicios y bases remotas, permisos, secretos,
dominio, respaldos y webhooks; reemplazar datos/usuarios ficticios. Migrar solo el
esquema y las configuraciones aprobadas. No copiar ventas, sesiones, secretos ni
contraseñas de demostración a producción. Validar pagos y correos del entorno
oficial, y desplegar tras autorización. La fase no está completada por esta
primera entrega: requiere las conexiones y criterios descritos arriba.

Validación técnica de la entrega anterior: 25 pruebas automatizadas aprobadas. Se añade
gestión de cambios, permisos PDF, adjuntos inmutables, recordatorios sin duplicados,
preparación de integraciones y transacciones del adaptador remoto con cliente simulado.
Las pruebas funcionales con el cliente y conexiones externas quedan para después.
La cuarta entrega añade 4 pruebas del motor de estancias: reloj estacional,
idempotencia, concurrencia/disponibilidad, reprogramación/cancelación, aislamiento
por cuenta y bloqueo de envío SMTP. No usan servicios externos ni cobros.
En la cuarta entrega se aprobaron 29 pruebas y se revisaron 126 archivos
JavaScript. El servidor local se mantiene en el puerto 3030.
La quinta entrega añade pruebas de catálogo/inventario, retenciones, permisos,
idempotencia, cancelación/expiración, pedidos y exclusión SMTP del canal de demo.
La suite completa de la quinta entrega pasa 32 pruebas y la revisión de sintaxis
cubre 130 archivos JavaScript, sin servicios externos ni cobros.

## Sexta entrega: identidad de clientes Google y Apple

- Acceso por correo/contraseña conservado. Google y Apple aparecen en el acceso
  del cliente y quedan desactivados hasta configurar sus variables privadas.
- Intercambio de código en servidor y validación criptográfica de tokens:
  proveedor, audiencia, caducidad, correo verificado y nonce. Google incluye PKCE.
  El estado de autorización está ligado al navegador y solo puede usarse una vez.
- Vinculación explícita desde Mi cuenta, sin fusionar cuentas por coincidencia de
  correo. Los proveedores sociales nunca otorgan permisos del equipo comercial.
- El cliente puede quitar un proveedor si conserva otro método de acceso. Esta
  acción revoca todas sus sesiones. La recuperación por correo permite habilitar
  contraseña en cuentas creadas con un proveedor social.
- El panel de preparación distingue adaptador implementado de proveedor
  configurado y probado. Apple web necesita dominio HTTPS; no se activa en localhost.
- Guía: `IDENTIDAD-FASE-2.md`. No se conectaron cuentas externas. Quedan pendientes
  las credenciales, pruebas reales, entrega al relay de Apple y procesos de baja
  y revocación del consentimiento en el proveedor.

Validación de esta entrega: **36 pruebas aprobadas y 133 archivos JavaScript**
revisados. Las cuatro pruebas nuevas usan tokens firmados de prueba y transportes
simulados; no acceden a Google, Apple, Firebase ni cobran o envían correos reales.

En la entrega anterior se aprobaron 22 pruebas automatizadas y 115 archivos
JavaScript revisados. Se probaron permisos, aceptación, facturación, destinatarios,
revocación de sesiones y webhooks firmados con transportes simulados; no se
realizaron cargos ni envíos externos durante estas pruebas.

## Séptima entrega: accesos separados por rol

- `/admin` y `/vendedor` tienen identificación visual y enlaces propios; ES/EN
  también están disponibles antes de iniciar sesión.
- La petición de acceso comprueba el rol antes de generar o mostrar un reto TOTP.
  El reto conserva el rol solicitado en la base y vuelve a comprobarlo al verificar.
- Las sesiones ya abiertas se dirigen a su panel, sin elevar permisos. El vendedor
  no ve el enlace ni accede a `/admin/plataforma`, usuarios, configuración o catálogo
  administrativo. Los permisos de CRM, facturas y cotizaciones permanecen vigentes.
- `/equipo` continúa funcionando. Los códigos de respaldo del primer acceso se
  presentan antes de cualquier cambio de página; no se restablecieron claves TOTP.
- Pruebas específicas: `npm run test:phase2-portals`. Usan bases en memoria, sin
  cuentas externas ni cambios en usuarios persistentes de esta demo.
- La suite completa aprobó 41 pruebas; la revisión de sintaxis cubre 134 archivos
  JavaScript. La salida del panel heredado ahora revoca la sesión del equipo,
  no solo la sesión del cliente.

## Octava entrega: reportes comerciales y sesiones propias

- Módulo **Reportes y metas** en ambos paneles. El administrador puede consultar
  todo el equipo o un integrante; el vendedor solo puede consultar/exportar sus
  datos, incluso si modifica la petición manualmente.
- Fechas inclusivas en America/Vancouver (incluido el cambio de horario), importes
  CAD en centavos, prospectos/ganados, conversión, operaciones, ventas pendientes
  y pagadas y comisiones pendientes/aprobadas/pagadas sobre ventas pagadas.
- Agrupación mensual y comparación contra la meta personal actual. No se inventa
  una meta mensual ni se presenta este reporte como registro fiscal/contable.
- Exportación CSV privada y auditada, con protección contra fórmulas introducidas
  desde nombres de usuario. Los totales no multiplican ventas al unir prospectos.
- En **Mi perfil**, consultar sesiones activas y cerrar la propia o cualquier otra
  sesión propia. No se exponen tokens ni se recopilan IP/huellas de dispositivos.
  Cada sesión tiene un ID independiente. No se reinician los accesos existentes.
- Shopify y Airbnb se conectarán al final, conforme a la instrucción del cliente.
  Esta entrega no activa proveedores ni cambia la plataforma oficial.
- Pruebas específicas: `npm run test:phase2-reports`. Las pruebas aisladas cubren
  permisos, fechas/DST, cifras, CSV, auditoría y revocación de sesiones.
- Validación de esta entrega: 47 pruebas internas aprobadas y 137 archivos
  JavaScript revisados. Las conexiones y pruebas de aceptación siguen pendientes.

## Novena entrega: automatizaciones internas del equipo

- Centro de alertas por rol, también integrado con Notificaciones. No envía
  correos, crea cobros, cambia fechas ni modifica asignaciones.
- Recordatorios de tareas próximas (24 horas), vencidas, visitas de mañana,
  facturas vencidas, pagos fallidos/en revisión y cambios pendientes por 48 horas.
- Avisos de correo fallido o tres intentos sin éxito, solo para administradores.
  Los mensajes de simulación marcados preview se excluyen de estos avisos.
- Activación explícita y preferencias versionadas en Seguimiento automático.
  El vendedor no puede modificar opciones ni ejecutar el proceso manual.
- SQL persistente, bloqueo concurrente y claves de deduplicación. Marcar leído
  no resuelve el pendiente ni vuelve a generar el aviso. Los cambios de responsable
  y la resolución del origen se comprueban también al leer, sin esperar al worker.
- Las alertas se resuelven al completar, pagar, cancelar o retirar el pendiente;
  si se reabre, se reactiva su aviso sin crear una copia. Los administradores
  conservan el seguimiento de pendientes cuyo vendedor haya sido desactivado.
- Últimas 100 ejecuciones visibles al administrador. Intervalo local de 30 segundos
  mientras el servidor está activo; scheduler y monitoreo alojados por validar.
- La entrega conserva outbox y proveedores externos desactivados. El proyecto
  oficial no se modifica. Pruebas aisladas: `npm run test:phase2-followup`.
- Validación: suite completa con 55 pruebas aprobadas y 140 archivos JavaScript
  revisados. Las pruebas reales de proveedores y aceptación se harán al final.

## Décima entrega: consentimiento y diario analítico local

- Aviso ES/EN en páginas públicas y botón para cambiar preferencias. No se carga
  en los paneles del equipo. Necesarias/estadísticas/marketing están separadas.
- Registro opcional desactivado por defecto, bloqueado hasta aprobar el aviso y
  recibir consentimiento. Cambio de aviso exige una nueva elección; revocar o
  actualizar preferencias elimina eventos y atribuciones del recibo anterior.
- Respeto de GPC, cookies privadas y recibos pseudónimos versionados. No se afirma
  anonimato irreversible ni que la aprobación operativa sustituya revisión legal.
- Eventos de páginas, consultas, inicio de checkout y pagos confirmados por el
  backend. Incluye factura ViiLife, canal ficticio ViiShop y pedidos/reservas del
  catálogo existente. Solo importes CAD, sin contactos, textos, URL completas o IP.
- Compras deduplicadas y vinculadas al consentimiento del comprador; no se cuentan
  desde el retorno del navegador. Las APIs públicas no admiten eventos purchase.
- Panel de analítica solo para admin y retención local configurable, sin eliminar
  datos comerciales. No hay etiquetas, scripts ni envíos a Google o Meta.
- Guía y límites de la instrumentación: `ANALITICA-FASE-2.md`. Payloads externos,
  conectores y pruebas reales de proveedores siguen pendientes para el final.
- Validación: 64 pruebas internas aprobadas y 144 archivos JavaScript revisados.
  Pruebas específicas: `npm run test:phase2-measurement`.

## Undécima entrega: autorización y calendario de cobros simulados

- Consentimiento independiente del acuerdo en `/cliente`, límite finito CAD,
  evidencia inmutable y revocación. Ninguna tarjeta real se recoge ni se cobra.
- Módulo **Cobros programados** del equipo: calendario de facturas, estado de
  autorización, pausa/activación administrativa, historial de resultados.
  El vendedor solo consulta sus clientes actualmente asignados.
- Preparación desactivada por defecto. Solo facturas vencidas por visitas
  realizadas; residencial al completar y comercial Net 15. No emite facturas,
  añade visitas, renueva acuerdos ni aplica recargos/penalizaciones.
- Simulación de éxito, rechazo o acción requerida, con límites y reintentos
  manuales. Éxito reutiliza la liquidación/recibo PDF de prueba; fallo conserva
  factura pendiente y prepara avisos al comprador y administrador en outbox.
- Bloqueos SQL, versiones, idempotencia por factura/intento, comprobación del
  presupuesto acumulado y pagos individuales abiertos. Las revocaciones y
  terminaciones bloquean simulaciones; el historial financiero se preserva.
- La conexión recurrente a Stripe sigue pendiente y bloqueada, incluso si ya hay
  Stripe para pagos individuales. Guía: `COBROS-PROGRAMADOS-FASE-2.md`.
- Prueba específica: `npm run test:phase2-recurring`. No usa servicios externos.
- Validación: **74 pruebas internas aprobadas y 148 archivos JavaScript**
  revisados. El arranque local y las rutas de ambos módulos responden correctamente;
  las pruebas de aceptación visual y las conexiones reales siguen pendientes.

## Duodécima entrega: cotizador y configuración de precios ViiLife

- **Precios y extras** en admin: reglas CAD separadas residencial/comercial,
  mínimos por visita, impuestos explícitos y extras por visita o calendario.
  Borrador/aprobación, versiones, historial y auditoría; sin importes inventados.
- Cotización comercial de paquete semanal negociado para propiedades incluidas:
  una tarifa por bloque semanal, no una tarifa duplicada por cada propiedad.
- Cálculo/preview en servidor sin escritura, cantidades validadas, reparto exacto
  de centavos y desglose para equipo/cliente. Recalcular borradores si cambian reglas.
- Cotizaciones aprobadas y contratos/visitas/facturas/recibos conservan precios
  y conceptos congelados. Los cambios de configuración no reescriben documentos.
- PDF inglés con desglose y encabezado por página; documentos solo de demo.
  Guía y límites: `PRECIOS-FASE-2.md`. Reglas fiscales/valores/comisiones finales
  y conexiones externas aún requieren aprobación y validación.
- Pruebas específicas: `npm run test:phase2-pricing`.
- Validación de la entrega: **82 pruebas internas aprobadas y 153 archivos
  JavaScript revisados**. Se comprobaron arranque/rutas locales y renders de
  contrato/recibo con configuración ficticia; conexiones y aceptación externa
  siguen pendientes. Los ejemplos de QA no se guardaron como precios activos.

## Decimotercera entrega: ajustes y reembolsos supervisados

- Solicitudes del cliente y admin, revisión parcial/total, rechazo, retiro y
  cancelación de aprobaciones. Aprobación y ejecución están separadas.
- Ledger inmutable, evidencia/hash, versiones, reservas de importe, límites
  según saldo o pago realmente registrado e idempotencia de ejecuciones.
- Crédito aplicado reduce el importe del pago individual sin reescribir la
  factura original; crédito total cierra esa factura sin crear un pago.
- Reembolso de demo conserva pagos y recibos anteriores. Historial financiero
  en equipo/cliente y confirmaciones en inglés con PDF de la posición registrada.
- Permisos por rol/asignación; vendedor solo consulta. Ajustes sobre una factura
  retiran su cobro programado y usan pago individual supervisado del saldo neto.
- Stripe Refund y ejecución monetaria real siguen bloqueados. Comisiones,
  impuestos, política de devolución y conciliación externa requieren revisión.
- Guía: `AJUSTES-FASE-2.md`. Revisión técnica aislada:
  `npm run test:phase2-financial`. Las pruebas integrales/conexiones se realizarán
  al terminar la fase, conforme a la instrucción vigente del cliente.
- Revisión de desarrollo: 8 comprobaciones aisladas de este módulo y sintaxis
  de 157 archivos JavaScript. No se ejecutó la suite integral de toda la fase
  en esta entrega ni se enviaron correos/reembolsos externos.

## Decimocuarta entrega: revisión de comisiones después de reembolsos

- Panel independiente en admin y consulta personal del vendedor. Un reembolso
  completado abre revisión; solicitudes/fallos no provocan descuentos automáticos.
- Decisión de conservar o reducir con motivo, versión y evidencia inmutable.
  Comisiones pendientes/aprobadas usan saldo ajustado; comisiones ya pagadas
  conservan su pago anterior y generan recuperación separada si así se decide.
- Recuperaciones ficticias parciales/total, idempotentes y acotadas al saldo.
  Sin transferencias, compensaciones de otras ventas o cobros a vendedores.
- Bloqueo backend de comisión/venta mientras falte revisión. Vínculo factura
  explícito para nuevas ventas; verificación administrativa para registros anteriores.
- Reportes/CSV mantienen ventas históricas y pagos de comisión; muestran saldo
  revisado por pagar. Nuevo panel conserva decisiones y recuperaciones por separado.
- Guía: `COMISIONES-FASE-2.md`. Pruebas preparadas para cierre:
  `npm run test:phase2-commissions`. No se ejecutaron pruebas en esta entrega,
  conforme a la instrucción vigente. No hubo correos/pagos externos ni despliegue.
- Revisión de sintaxis: 161 archivos JavaScript sin errores. Las migraciones SQL,
  funcionamiento del módulo e integración completa siguen pendientes de pruebas.

## Decimoquinta entrega: plan de validación y entrega

- Nuevo panel administrativo con 27 recorridos definidos y criterios ES/EN:
  responsables, fechas, preparación, bloqueos, notas y referencia de evidencia.
- Dependencias y requisitos en servidor. Claves presentes no habilitan resultados
  de adaptadores ausentes. Historial versionado y permisos exclusivos del admin.
- Resultados reportados separados de verificación independiente; cambios de
  código al reiniciar/configuración registrada o dependencias retiradas exigen
  revalidación sin eliminar el historial. No cambia el modo demo.
- Filtros y exportación privada JSON/CSV, sin fórmulas ejecutables ni secretos.
  No realiza solicitudes externas, pagos, envíos ni despliegues.
- Guía `VALIDACION-FASE-2.md`. Se preparó `npm run test:phase2-launch` para el
  cierre; no se ejecutaron pruebas en esta entrega conforme a la instrucción actual.
- Sintaxis de 166 archivos JavaScript revisada sin errores. Funcionamiento,
  migraciones SQL y aceptación visual quedan pendientes de la validación final.

## Pruebas locales autorizadas · 13 de octubre

- Se ejecutaron las verificaciones pendientes de comisiones y plan de validación,
  y después la suite completa: resultado final **103 aprobadas, cero fallos**.
- Se corrigió, con autorización, un desfase UTC/Vancouver que difería la factura
  residencial y el cobro programado; Net 15 usa el mismo calendario de servicio.
  Se agregó cobertura de medianoche, DST y fechas límite sin alterar facturas previas.
- Bases en memoria, outbox, proveedores simulados; sin cobros/envíos externos.
  La apertura de navegador temporal falló por conexión: no hay aprobación visual.
- Informe y limitaciones: `RESULTADOS-PRUEBAS-LOCALES-FASE-2.md`.

Pruebas: `npm run test:phase2`. Revisión de sintaxis: `npm run check`.
`npm run build` revisa el código sin descargar una base GeoIP: esta copia de la
fase 2 no utiliza detección de moneda por IP.

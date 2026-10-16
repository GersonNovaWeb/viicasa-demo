# ViiLife: ajustes y reembolsos supervisados

Implementado solo para las facturas de servicios residenciales/comerciales de
la copia de fase 2. No devuelve dinero a Stripe, Shopify ni cuentas bancarias.
No implica cancelación de servicios, recuperación automática de descuentos,
reembolso automático al terminar un contrato ni ajuste de comisiones pagadas.

## Accesos

- Cliente `/cliente`: **Revisión de facturas y reembolsos**. Solicita revisión
  sobre sus propias facturas y retira solicitudes pendientes que él creó.
- Admin `/admin`: **Ajustes y reembolsos**. Crea una solicitud para una factura,
  revisa, aprueba un importe igual o menor, rechaza o cancela una aprobación.
  Solo el administrador simula la ejecución.
- Vendedor `/vendedor`: consulta únicamente clientes actualmente asignados;
  no aprueba, ejecuta o modifica movimientos financieros.

## Estados separados

Solicitud pendiente → aprobación o rechazo. La aprobación reserva un importe,
**no registra dinero devuelto ni un crédito aplicado**. Una aprobación puede
cancelarse antes de ejecutar, liberando la reserva sin movimiento financiero.

El administrador puede simular éxito o fallo cuando el gateway de facturas es
`demo`. Un éxito crea un movimiento inmutable y completa la solicitud. Un fallo
solo registra el intento, conserva la aprobación/reserva y permite revisión o
reintento manual. Máximo tres intentos de demo; no hay reintentos automáticos.
Repetir el mismo ID de intento no duplica movimientos ni correos.

Con Stripe configurado, la ejecución está **bloqueada**, aunque exista una
aprobación. Se requiere el adaptador y la confirmación externa futura; no se
puede sustituir un reembolso real por un botón de simulación.

## Créditos sobre facturas no pagadas

Solo facturas emitidas sin pago registrado. El crédito no puede exceder el
saldo neto restante, descontando otros créditos aprobados o aplicados.
Un checkout abierto bloquea la aprobación, evitando cambiar una operación
en curso. Mientras el crédito aprobado espera ejecución, el cliente no puede
iniciar otro pago ni recibe recordatorios de pago de esa factura.

Al aplicar el crédito de demo:

- Se conserva total/snapshot original de factura, contrato, visitas y precios.
- Un ledger separado reduce el saldo que se presenta y prepara para pagar.
- Crédito parcial: el cliente paga únicamente el saldo restante.
- Crédito total: se cierra esa factura como cancelada, sin crear un pago ficticio.
- El cobro programado de esa factura se cancela; el saldo ajustado requiere pago
  individual supervisado. No se revoca la autorización del resto del acuerdo.
- Los recordatorios posteriores utilizan el saldo ajustado, no el importe original.

## Reembolsos de pagos registrados

Solo facturas pagadas, no pagos pendientes ni en revisión. El máximo disponible
se basa en el importe **realmente registrado como pagado**, no en el valor bruto
original de factura; resta devoluciones registradas y reservas aprobadas.
Solicitudes simultáneas no permiten aprobar más que ese disponible.

Una ejecución ficticia agrega un movimiento de reembolso de demo. La factura
y el recibo original conservan su historia; no se elimina o reescribe el pago.
El panel distingue original, créditos, pagos, reembolsos y posición neta.
Los reportes comerciales existentes siguen mostrando ventas históricas; no son
un libro contable ni ventas netas tras devoluciones. Usar el panel financiero
para consultar la posición neta y revisar comisiones por separado.

## Evidencia, documentos y avisos

Cada solicitud tiene motivo, autor, clave idempotente, referencia de factura,
huella del snapshot original y monto solicitado. La revisión conserva respuesta,
importe aprobado, versión, actor y fecha. Historial, intentos y movimientos son
independientes; los cambios de asignación se comprueban al leer y actuar.

Avisos en inglés para cliente/administrador, con marca VIICASA. Las aprobaciones
explican que aún no hay operación completada. Las confirmaciones de demo dicen
explícitamente que no se devolvió dinero real y adjuntan el historial de factura
en PDF de demostración. Ese adjunto conserva la posición al momento del aviso;
los recibos anteriores no cambian. No son notas de crédito ni documentos fiscales.

Con `PHASE2_MAIL_MODE=outbox` los correos solo quedan en la bandeja privada.
SMTP, sus destinatarios y recepción se validarán al final; este desarrollo no
envía mensajes externos ni prueba reembolsos de Stripe.

## Verificación y pendientes

`npm run test:phase2-financial` es una revisión técnica en memoria de permisos,
origen, versiones, idempotencia, reservas, límites, pagos después de un crédito,
retiro/rechazo, fallos, documentos inmutables y bloqueo de ejecución externa.
No utiliza datos persistentes ni dinero/correos reales. Se integra en la suite
para ejecutar todas las pruebas cuando termine la fase, conforme a lo acordado.

Pendiente: adaptador Stripe Refund con clave idempotente, referencia del pago
real, firma de eventos/estados pendientes-fallidos y conciliación; política
aprobada de reembolsos, autorización operativa, notas fiscales, impuestos y
reglas definitivas de comisiones. La revisión supervisada interna y recuperación
ficticia de comisiones está preparada en `COMISIONES-FASE-2.md`; su validación
se realizará al final. ViiShop y reservas de canales externos usarán sus propios
flujos al conectar Shopify/Airbnb, sin simular transferencias monetarias.

Tablas: `financial_requests`, `financial_events`, `financial_attempts`,
`financial_entries`. Migraciones solo en las bases independientes de esta copia.

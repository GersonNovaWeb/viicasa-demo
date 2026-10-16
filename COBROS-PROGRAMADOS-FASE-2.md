# ViiLife: autorización y calendario de cobros de demostración

La entrega implementa el recorrido local, no una suscripción Stripe ni una
retención bancaria de fondos. No recoge tarjetas, números de cuenta o CVC.
No llama a Stripe. El proyecto oficial no se modifica.

## Recorrido

1. Preparar, aprobar y enviar una cotización recurrente; el cliente acepta el
   acuerdo en `/cliente`. Esa aceptación **no autoriza cobros automáticos**.
2. En el portal del cliente aparece **Autorización de pagos programados**.
   Revisar el límite CAD, escribir el nombre y aceptar dos casillas separadas:
   autorización de simulación y reconocimiento de que no hay tarjeta real.
3. Se guarda evidencia inmutable vinculada al hash del acuerdo, nombre,
   identidad verificada, fecha, moneda, límite del calendario y texto aceptado.
   La autorización nace **pausada**. Se prepara un correo en inglés al cliente.
4. En `/admin` → **Cobros programados**, activar la preparación local de demo
   y activar la autorización con un motivo. El vendedor solo consulta sus clientes
   actualmente asignados; no activa, revoca ni simula cobros.
5. Completar visitas y emitir facturas desde **Visitas / Facturación**. La nueva
   preparación no emite facturas ni crea visitas automáticamente.
6. **Actualizar calendario** prepara registros para facturas vencidas elegibles.
   También se revisan cada 30 segundos con el servidor activo. No procesa dinero:
   cada resultado necesita **Simular resultado** por el administrador.
7. Un éxito ficticio marca la factura pagada usando la liquidación existente:
   venta/comisión una sola vez y recibo PDF de prueba para cliente y aviso al admin.
   Los correos respetan el modo de esta copia; con `outbox` solo quedan guardados.
8. Un rechazo conserva la factura pendiente y prepara avisos en inglés al cliente
   y administrador. El enlace lleva al portal privado del cliente. No crea recibo
   de pago ni aplica recargos. Los reintentos son manuales (límite demo 1–3).
   «Acción del cliente» bloquea posteriores simulaciones de ese cobro: el cliente
   puede usar el pago individual existente. El calendario concilia ese pago.

## Límites y seguridad

- Solo acuerdos recurrentes aceptados y sin cambios de hash: semanal, quincenal,
  mensual o diario. El calendario es finito; no extiende ni renueva el servicio.
- Residencial: facturas por visitas realizadas y emitidas, vencidas al completar.
  Comercial: facturas consolidadas, respetando el vencimiento Net 15 existente.
- Solo visitas **realizadas**. Las futuras, canceladas y sin acceso quedan fuera
  de este colector aunque exista otra factura que requiera revisión/pago manual.
- Importes en centavos, CAD, líneas contrastadas con visitas y precios del acuerdo.
  Se comprueban importes anteriores pagados/en revisión para respetar el límite
  acumulado. No añade impuestos, cargos de cancelación, recobros ni penalizaciones.
- Autorizaciones versionadas; el cliente puede revocar y el administrador pausar.
  El administrador no puede reactivar una revocación. Una nueva autorización
  requiere un nuevo calendario/acuerdo, no reemplaza la evidencia existente.
- Revocar pagos no cancela el contrato ni elimina facturas. La cancelación del
  servicio sigue su flujo separado. Las terminaciones/cancelaciones bloquean
  simulaciones y conservan historial, facturas y recibos existentes.
- Bloqueo SQL, clave única por factura y por intento. Estado de factura,
  autorización, contrato, presupuesto y pagos abiertos se vuelven a comprobar
  dentro de la transacción. Repetir un intento no duplica el pago ni sus correos.
- Los pagos individuales abiertos bloquean la simulación para evitar dobles cobros.
- Si la copia tiene un gateway Stripe, la autorización/activación/simulación
  recurrente está bloqueada; solo continúa el flujo individual ya implementado.

## Conexión pendiente

La integración futura requiere recopilar el consentimiento aprobado y configurar
un método de pago mediante SetupIntent/Checkout setup, Customer/PaymentMethod,
confirmación autenticada y eventos firmados; después, un adaptador off-session
con idempotencia, recuperación de autenticación y conciliación. No reutilizar la
simulación como resultado financiero real ni guardar una tarjeta en SQL.

Guía oficial de referencia:
[Stripe SetupIntents](https://docs.stripe.com/api/setup_intents).
Guardar un método no garantiza que cualquier cobro posterior tenga éxito.
Antes de conectar se deben aprobar términos/avisos, impuestos, fecha de cobro,
reintentos, recuperación de pagos, cancelación y migración entre entornos.

## Verificación

`npm run test:phase2-recurring`: pruebas aisladas en memoria de consentimiento,
permisos/CSRF, Net 15, idempotencia/concurrencia, revocación, límites, cambios,
fallos/reintentos, acción requerida, pago manual y bloqueo con gateway Stripe.
No utiliza cuentas, datos persistentes, SMTP ni Stripe externos.

Archivos: `phase2/recurring.mjs`, tablas `recurring_authorizations`,
`recurring_jobs`, `recurring_attempts` y módulos de panel/cliente. El esquema
se aplica al arrancar esta copia; no hay cambios en Firestore de fase 1.

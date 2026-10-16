# Datos y decisiones por solicitar al cliente · borrador acumulativo

Documento de trabajo, no informe final ni aceptación de producción. Se completa
al terminar el desarrollo interno; no se ha enviado al cliente. No incluir claves,
contraseñas, tokens ni datos personales de clientes en este archivo.

## ViiLife: tarifas, calendarios y condiciones

- Tarifas finales CAD, mínimos, suministros, traslados y extras: importes y unidad
  de cobro (por visita o por calendario), y cuáles son gravables.
- Confirmación del paquete semanal: precio único para las propiedades incluidas;
  bloque de siete días desde la primera visita; mismo patrón de días y ventana de
  llegada para todas ellas. Identificar si necesita horarios distintos por propiedad.
- Frecuencias, cantidad de bloques contratados, cobertura y reglas operativas.
  El sistema actual no renueva ni extiende automáticamente el calendario aceptado.
- Tratamiento de cancelación tardía, no acceso y terminación anticipada: condiciones,
  límites, exenciones, fecha de vencimiento y aprobación de los textos de acuerdos.
- Recuperación del descuento anual: confirmar qué descuentos efectivamente recibidos
  se recobran. Los recibos con créditos/reembolsos se excluyen por ahora; definir
  cómo tratarlos si se necesita una recuperación parcial.
- Impuestos y redondeo de servicios/cierres, con aprobación contable: tasas, bases
  y reglas territoriales; la demo no presume tasas legales ni exenciones.
- Comisiones: base con o sin impuestos/extras, descuentos y ajustes posteriores.
- Autorización de cobros programados: fechas, límites, reintentos, revocación,
  tratamiento de fallos y comunicación al cliente.

## ViiShop y estancias

- Catálogo, variantes, imágenes, stock/ubicaciones, despacho, envío, descuentos,
  impuestos, devoluciones y correos finales de ViiShop.
- Canal autorizado para Airbnb/Lodgify, propiedades/unidades y mapeos, zonas
  horarias, horarios, capacidad y criterios para revisar cambios de propiedad o
  estancias iniciadas. No asumir acceso directo a la API de Airbnb.
- Regla comercial de corrección de comisiones ya resueltas, especialmente cuando
  hubo pago al vendedor o recuperación registrada.

## Accesos, proveedores y lanzamiento · se conectan al final

- Cuentas y permisos independientes de prueba de Shopify y canal de reservas.
- Configuración y dominios OAuth Google/Apple; cuenta Apple y relay aprobados.
- Stripe sandbox: pagos individuales, webhooks, devoluciones y método guardado.
  Adaptadores off-session y reembolsos sandbox implementados; falta configurar,
  aprobar reglas y validar operaciones contra la cuenta real de pruebas.
- Correo corporativo/remitentes/destinatarios, SMTP y aprobación de plantillas.
- Proveedor de las dos bases remotas, backups, política de restauración/retención,
  worker/scheduler, hosting y dominio de la copia de pruebas.
- Privacidad, textos legales, analítica autorizada y consentimiento, contenido real,
  responsables de pruebas y aceptación de lanzamiento.

## Módulos internos completados en la siguiente entrega

1. Desglose de envío, impuestos y descuentos del canal ViiShop de fase 2.
2. Revisión administrativa de cambios de propiedad y estancias iniciadas.
3. Correcciones anexadas de comisiones resueltas, con recuperaciones y complementos
   separados, sin modificar pagos originales.

Implementación y límites: `MODULOS-INTERNOS-FASE-2.md`. Esto no certifica toda la
fase para producción: faltan conexiones, reglas aprobadas, pruebas de
interfaz/hosting/proveedores y aceptación. Guía actualizada de Stripe, Shopify,
analítica, worker y respaldo: `INTEGRACIONES-Y-OPERACION-FASE-2.md`.

Airbnb/Lodgify sigue requiriendo programación: confirmar el canal y aportar contrato
API/OpenAPI o ejemplos despersonalizados de reservas, cambios, cancelación,
calendario y autenticación de eventos. Sus credenciales por sí solas no resuelven
este contrato. Las utilidades de respaldo no reemplazan snapshots/PITR del hosting.

Actualización del 14 de octubre: el procesamiento interno de entregas de reservas
verificadas, mapeos, revisiones y avisos está preparado. Falta implementar el puente
concreto y calendario del proveedor al conectar. Guía:
`PREPRODUCCION-Y-CIERRE-INTERNO-FASE-2.md`. También está preparado staging limpio y
el alta inicial privada; no se migraron datos ni se activó producción.

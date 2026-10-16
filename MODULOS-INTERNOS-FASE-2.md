# Últimos módulos internos · fase 2 · 13 de octubre de 2026

Implementados exclusivamente en `viicasa-fase2-demo`, sin cambios en la versión
oficial ni conexiones con proveedores. Se conserva correo de canal/estancias como
vista previa; no se realizan cobros, transferencias, devoluciones ni entregas reales.

## ViiShop: envío, descuentos e impuestos

`/admin` → **ViiShop · Canal Shopify** → **Envío, descuentos e impuestos CAD**.
La configuración es independiente del catálogo y checkout de fase 1. Partimos de
listas vacías y tratamiento fiscal pendiente, sin tarifas ni tasas inventadas.

El administrador puede guardar reglas en borrador o aprobarlas con referencia:

- Envío: `id`, `label`, `amount_minor` (centavos CAD). Selección explícita cuando
  hay opciones configuradas. No hay cálculo geográfico ni integración logística.
- Descuento: `code` en mayúsculas, `label`, `basis` (`fixed`/`percent`), `value` y
  `min_subtotal_minor`. `fixed` usa centavos; `percent` usa puntos base (500 = 5%).
  Un código por carrito, solo sobre productos, limitado a su subtotal.
- Impuestos: `id`, `label`, `basis_points`, `shipping_taxable`. Se calculan sobre
  productos tras descuento y, si se configura, sobre envío. Tasas independientes,
  sin impuestos compuestos. `null` indica pendiente; `[]` expresa sin tasas agregadas.
  Aprobar exige definir expresamente ese tratamiento. No certifica exención fiscal.

El cliente revisa un total del servidor antes de preparar el pedido. El preview
no retiene inventario ni crea un pedido. Preparar valida precios actuales, versión
de reglas y total revisado, luego guarda desglose inmutable junto a la retención.
Cambiar la política no recalcula operaciones ya creadas; repetir una clave conserva
el resultado original. Sin reglas aprobadas se conserva el checkout base de demo,
claramente pendiente de envío/impuestos, no listo para venta real.

Los pedidos importados aceptan opcionalmente `breakdown` con `subtotal_minor`,
`discount_minor`, `shipping_minor`, `tax_minor`, `total_minor` y `taxes` (`id`,
`label`, `amount_minor`). Subtotal = suma de líneas; total = subtotal − descuento
+ envío + impuestos; las tasas deben sumar el campo fiscal. Omitir desglose conserva
el contrato anterior de total igual a las líneas, no permite omitir un impuesto
incluido en un total mayor. Cambiar un desglose de un pedido existente se rechaza,
aunque se conserve el total. Los eventos importados no descuentan stock otra vez.
La normalización de impuestos incluidos en precio u otras reglas externas deberá
hacerse en el futuro adaptador, no se supone que esta fórmula cubre cada tienda.

Desglose visible en producto, panel del cliente y administrador. Esto no implementa
checkout Shopify, dirección/validación de entrega, tarifas de transportistas ni
descuentos/tributación territoriales reales; esos datos y conexiones quedan al final.

## ViiConcierge: revisión de cambios sensibles

`/admin` → **Reservas y estancias** → **Cambios que requieren revisión**.

Cambiar de propiedad o modificar/cancelar una estancia que empezó genera una
propuesta sin tocar la reserva. Se congela el estado anterior y la versión de la
propiedad destino. El administrador aprueba o rechaza con motivo y confirmación.

Al aprobar, el motor revalida versión, ocupación, capacidad, propiedad activa,
fechas y zona horaria. Dos aprobaciones simultáneas no pueden ocupar las mismas
noches. Una propuesta obsoleta no se fuerza: se rechaza y se presenta un evento
nuevo con el estado vigente. Una estancia finalizada no se reabre. Una estancia
con check-in registrado conserva ese estado y no admite entrada futura al revisarla.

Se conserva el evento original rechazado/pendiente y su resultado de ingestión;
la decisión posterior queda en registro separado con autor, razón y antes/después.
Repetir un evento o una decisión no duplica modificaciones. Las vistas previas y
jobs anteriores se invalidan; se prepara el calendario nuevo sin avisos de llegada
para quien ya tiene check-in. Una cancelación no confirma reembolso ni penalización.

No se actualiza Airbnb/Lodgify ni se garantiza disponibilidad externa. Las unidades
siguen separadas del catálogo oficial. El cliente solo ve su estancia actual por
correo verificado; no recibe acceso al historial interno de propuestas.

## Comisiones: correcciones sin reescribir decisiones

`/admin` → **Revisión de comisiones** → **Correcciones anexadas y pagos
complementarios**. El vendedor consulta sus propios registros y el historial.

El administrador indica una nueva **reducción total** para esa revisión, no una
diferencia. Cero restaura su reducción. La decisión original, evidencia, recuperaciones
y pago original se conservan. Cada corrección tiene secuencia, autor, motivo, clave
de idempotencia y huella enlazada a la anterior. Una versión obsoleta o evidencia
alterada se rechaza. Primero se deben resolver los nuevos reembolsos pendientes.
Las reducciones de todas las revisiones no pueden superar la comisión original.

Antes del pago, la corrección cambia el importe pendiente. Al registrar el pago se
congela la reducción vigente de cada revisión como base de ese pago. Si después
se corrige, el pago original no cambia: se calcula recuperación o complemento por
separado. Para datos anteriores sin base guardada se conserva la reducción original
previa al pago como referencia; registros no conciliados deben investigarse.

Cada revisión calcula diferencia = reducción vigente − reducción al momento del
pago. Por recuperar = máximo(0, diferencia − recuperaciones + complementos).
Complemento pendiente = máximo(0, recuperaciones − diferencia − complementos).
Esto evita borrar una recuperación si después se restaura la comisión: aparece un
complemento separado. No se compensan otras ventas ni se modifican transferencias.
Un pago complementario es un registro explícitamente ficticio, con límites e
idempotencia. Los reportes habituales conservan el pago original; este panel muestra
los ajustes por separado, no representa un libro contable certificado.

Ventas impagadas y comisiones canceladas no se reabren con este formulario; requieren
investigación específica. No hay transferencias bancarias reales ni deducciones automáticas.

## Verificación y pendientes

`npm run test:phase2-pending-modules` contiene ocho pruebas nuevas con bases
descartables y cuentas ficticias. Se integra también en `npm run test:phase2`.
No escribe la base local persistente ni contacta proveedores.

Las reglas finales y los datos del cliente se recopilan en
`DATOS-PENDIENTES-CLIENTE-FASE-2.md`. Siguen pendientes pruebas manuales de interfaz,
hosting, base remota/restauración, cuentas reales, integraciones y aceptación. Los
adaptadores externos no implementados requieren código además de credenciales.

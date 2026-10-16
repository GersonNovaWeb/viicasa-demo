# Cierre económico de ViiLife · copia de fase 2

En `/admin` → **Cierre económico**, una cancelación de visita o terminación ya
aprobada puede recibir una revisión económica independiente. El vendedor consulta
solo cierres de prospectos actualmente asignados; el administrador prepara,
revisa y emite. El cliente ve únicamente los cierres emitidos o sin cargos.

## Flujo

1. Aprobar primero el cambio operativo en Solicitudes de cambios.
2. Preparar un borrador con recuperación de descuento, cargo manual, vencimiento
   acordado y una explicación que verá el cliente. Los valores parten de cero.
3. Consultar evidencia: acuerdo aceptado, descuento elegible, facturas y ajustes
   pendientes. No se toma un estimado del cotizador como descuento ya recibido.
4. Revisar la aprobación. Se congela la evidencia financiera y la configuración.
5. Emitir crea una factura CAD separada y dos mensajes en outbox (cliente y
   administrador), con PDF para el cliente. Cero cargos finaliza sin factura.
6. El cliente puede pagar mediante el flujo individual existente de prueba.
   No se guarda ni debita una tarjeta automáticamente.

Después de emitir no se edita el cierre, el acuerdo ni las facturas originales.
Los ajustes posteriores usan la revisión financiera supervisada existente. Antes
de emitir se puede cancelar la revisión o reabrirla; el historial no se borra.
La emisión tiene una clave de idempotencia y no duplica factura ni mensajes.

## Condiciones y límites

- Reglas desactivadas y sin tasas ni penalizaciones predeterminadas. Un borrador
  no habilita el cobro ni sustituye la aprobación comercial/legal del cliente.
- Los cargos positivos necesitan política de cierre aprobada, tratamiento fiscal
  explícito y aprobaciones de cancelaciones/impuestos en Preparación de lanzamiento.
- Recuperación: solo terminación anticipada de un acuerdo comercial anual con
  frecuencia semanal o diaria. Se consideran descuentos de facturas pagadas por
  completo, sin créditos/reembolsos ni reservas financieras previas. Las facturas
  ajustadas se excluyen conservadoramente, sin inferir una recuperación proporcional.
- Se descuentan recuperaciones ya emitidas para el mismo acuerdo. Su devolución
  posterior no vuelve a habilitar automáticamente ese importe.
- No se factura una terminación antes de su fecha efectiva ni mientras haya
  facturas/solicitudes financieras pendientes o visitas facturables sin emitir.
- El cargo manual requiere un límite explícito. En cancelación de una visita no
  puede superar su importe; no se infiere una tarifa por la hora del aviso.
- Impuestos independientes por concepto (recuperación/cargo/ambos), redondeados
  al centavo. No hay cálculo territorial ni impuestos compuestos.
- Cambiar el contexto después de aprobar obliga a reabrir y revisar de nuevo.
- La factura de cierre queda fuera del cobrador recurrente, de ventas nuevas y
  de nuevas comisiones. No representa una nueva visita.

`npm run test:phase2-closing` usa bases descartables, correo outbox y pagos
simulados. No se instalaron políticas en la base persistente ni se enviaron
correos/cobros reales. Las reglas finales se recopilan en
`DATOS-PENDIENTES-CLIENTE-FASE-2.md`.

# ViiLife: cotizador y configuración de precios de la demo

En `/admin` → **Precios y extras**, hay reglas independientes para residencial
y comercial, en CAD. No se copiaron importes de producción ni se configuraron
tasas fiscales por defecto. Los mínimos/impuestos parten de `null`, los extras
de una lista vacía y la aprobación está desactivada.

## Configuración

- **Mínimo por visita/propiedad**: vacío significa pendiente; cero significa un
  mínimo cero explícito. Se aplica al servicio neto después del descuento y antes
  de agregar extras e impuestos. No es un mínimo por todo el periodo.
- **Impuestos**: IDs/nombres y porcentajes aprobados por el cliente. Sin marcar
  «Impuestos definidos», no se aplican y se indica que no están incluidos.
  Marcarlo con lista vacía expresa explícitamente que no se agregan impuestos.
  No hay detección territorial, lookup fiscal ni declaración de exención legal.
- Cada tasa se calcula independientemente sobre servicio neto + ajuste por mínimo
  + extras gravables. No se calculan impuestos sobre otros impuestos. Redondeo
  aritmético al centavo por visita; los totales suman esas líneas, no otro redondeo
  independiente del periodo. Este modelo requiere aprobación fiscal/contable.
- **Extras**: ID estable, nombre, importe CAD, `visit` o `schedule` y
  `taxable`/`exempt`. `visit` cobra la cantidad por cada visita de cada propiedad;
  `schedule` cobra una sola vez para todo el calendario. Los extras por calendario
  se distribuyen en centavos entre visitas para su facturación posterior.
- Suministros, traslados u otros conceptos se agregan manualmente a esa lista;
  no hay importes precargados. Solo se cobran los conceptos seleccionados en la
  cotización. Los descuentos iniciales se aplican al servicio base, no a extras.
- **Aprobación**: las reglas pendientes se guardan como borrador y no afectan al
  importe base de nuevas cotizaciones. No se pueden seleccionar sus extras.
  Aprobar reglas de demo no activa pagos reales ni sustituye aprobación legal.
- Cada guardado tiene versión, nota, autor/fecha e historial SQL. Solo un admin
  autenticado con MFA modifica reglas; los vendedores consultan la configuración
  para cotizar. No hay configuración de precios pública.

## Cuota comercial semanal negociada

En **Cotizaciones** → **Nueva cotización**, seleccionar **Negotiated weekly
package**. La tarifa es el precio total negociado de un bloque semanal para todas
las propiedades listadas. No se sugiere un importe. La cantidad es una unidad y
la frecuencia debe ser semanal; se indica cuántos bloques tiene este calendario.

Dos propiedades y dos bloques semanales no multiplican el precio por cuatro:
el base es tarifa × dos bloques. Sin seleccionar días, se reparte entre cuatro
visitas de ejecución, conservando el comportamiento anterior.

Se pueden seleccionar varios días de la semana. El bloque abarca siete días
calendario desde la primera visita, que debe caer en uno de los días seleccionados.
El patrón se repite en cada bloque y para todas las propiedades, usando la misma
ventana de llegada del acuerdo. Por ejemplo: dos propiedades, dos bloques y
lunes/miércoles/viernes generan doce visitas, pero solo dos cuotas semanales.
El importe de cada cuota y descuento se reparte en centavos sin duplicar el precio.

Un mínimo por visita o extras por visita sí cuentan todas las ejecuciones; los
extras por calendario siguen cobrándose una sola vez. Se limita el calendario a
300 visitas totales y se verifica cada fecha frente al límite introductorio de
tres meses, no solo la primera fecha del bloque. El desglose debe revisarse antes
de aprobar. No se crean renovaciones ni semanas adicionales automáticamente.

El descuento comercial anual inicial existente sigue aplicándose cuando corresponde
y conserva su límite a los primeros tres meses. Impuestos, mínimos y extras no
modifican esos términos ni activan recobros/reembolsos automáticos.

## Cotización → acuerdo → visitas → factura → recibo

1. **Calcular desglose** pide un cálculo al backend sin crear cotización, factura,
   visita, venta ni pago. El servidor valida importes, extras, cantidades y permisos.
2. Guardar crea un borrador con versión de configuración, parámetros y desglose
   congelados. El administrador dispone de **Ver desglose** antes de revisar.
3. Si cambian las reglas mientras el borrador espera aprobación, se requiere editar
   y recalcular. Una cotización ya aprobada conserva los precios acordados.
4. El acuerdo mantiene esa copia; el cliente ve el desglose antes de aceptar.
   Cada visita conserva su parte en centavos, descuento, mínimo, extras e impuestos.
5. Facturar usa las visitas de ese acuerdo, nunca las reglas actuales. Comercial
   conserva consolidación mensual Net 15; residencial sigue por visita realizada.
   Los documentos y adjuntos conservan el desglose de las líneas facturadas.
6. El importe final CAD se usa en el pago existente y en la autorización simulada
   de cobros programados. No se trata el retorno del navegador como pago confirmado.
7. HTML/PDF incluyen los conceptos y cantidades. Los PDF siguen identificados
   como demostración, no documentos fiscales. El encabezado se repite por página.

La comisión conserva su fórmula vigente sobre el importe facturado; decidir si
se excluyen impuestos/extras de la comisión requiere aprobación y otro ajuste.
No presentar esta configuración como un sistema fiscal o contable validado.

## Validación técnica

`npm run test:phase2-pricing` prueba asignación de centavos, descuentos, mínimos,
extras elegidos/duplicados, impuestos explícitos, cuotas semanales, revisión,
permisos, preview sin escritura, aceptación, preservación de documentos y recibo.
Usa reglas ficticias únicamente en memoria; no las instala en la demo persistente.

`npm run preview:phase2-documents -- --pricing` genera dos PDF ficticios de revisión
en `tmp/pdfs`. No envía correos ni modifica precios/pedidos. Esos archivos y sus
renders están excluidos de Git. Las conexiones y pruebas externas quedan para el final.

`npm run test:phase2-weekly` verifica días, bloques, importes, aceptación y
facturación mensual sin recalcular acuerdos previos. `npm run
preview:phase2-documents -- --weekly` genera los dos PDF de revisión con un
calendario de doce ejecuciones y dos bloques facturados; no envía correos.

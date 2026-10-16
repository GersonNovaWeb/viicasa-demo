# Comisiones tras reembolsos · fase 2

Entrega interna de demo. No transfiere dinero, no recupera pagos de vendedores,
no ejecuta Stripe Refund ni compensa comisiones de otras ventas.

## Accesos y decisiones

`/admin` → **Revisión de comisiones**: reembolsos completados, evidencia original,
decisiones y recuperaciones ficticias. `/vendedor` ofrece consulta únicamente
de las ventas atribuidas a ese vendedor, aunque cambie el responsable del prospecto.
No da acceso a facturas o información privada de otros clientes.

Cada movimiento de reembolso completado de ViiLife abre una revisión independiente
cuando su factura tiene venta vinculada. Una solicitud pendiente/aprobada o un
intento fallido de reembolso no abre esa revisión. La misma entrada financiera
no puede crear dos revisiones. Se notificará internamente al vendedor; el aviso
financiero al administrador sigue utilizando el circuito de correos existente.

El administrador decide expresamente:

- **Conservar**: motivo obligatorio, reducción cero.
- **Reducir**: importe CAD positivo, como máximo el saldo restante de la comisión
  original. No se presume una reducción proporcional al importe reembolsado.
- Comisión pendiente/aprobada: la decisión disminuye el saldo por pagar.
- Comisión ya pagada: la decisión abre un saldo de recuperación separado. El
  importe y estado del pago anterior no se reescriben.

Una revisión pendiente bloquea cambios de estado de comisión/venta en el backend,
no únicamente los botones. Después de la revisión puede continuarse el flujo
existente de aprobación/pago; una comisión con saldo cero se cancela, no se marca
pagada. Cada decisión conserva evidencia/hash, autor, fecha, motivo y versión.
Una decisión resuelta es inmutable. No existe edición retroactiva ni reapertura;
correcciones de decisiones necesitarán otro flujo aprobado.

## Recuperación ficticia

Solo admin registra recuperaciones parciales/total de reducciones sobre comisiones
ya pagadas. Cada registro lleva motivo, actor y clave idempotente. No puede exceder
el saldo de esa revisión ni consumir el de otra. Se conserva historial, se informa
internamente al vendedor y se distingue claramente que no confirma una operación
bancaria real. No existen compensaciones automáticas, perdón de saldos o sanciones.

## Historia y reportes

`commercial_sales.commission_minor` y el importe original de venta no cambian.
`commercial_commission_balances` proyecta reducción, saldo actual, pendientes de
revisión y recuperación. Al marcar una comisión pagada se congela su saldo pagado
en `commission_paid_minor`; los registros antiguos sin ese campo conservan como
referencia el importe original. Una devolución posterior no modifica ese pago.

Ventas muestra original, vigente, pago registrado y recuperación por separado.
Resumen/reportes/CSV usan saldo revisado para pendientes y aprobadas, pero preservan
el pago registrado para pagadas. Las ventas mantienen su valor histórico sin
restar devoluciones: no se convierten en un libro contable. El periodo sigue siendo
fecha de creación de venta y los estados actuales; no fecha de revisión/reembolso.
Las métricas del nuevo panel cubren las últimas 200 revisiones visibles y lo indican.

## Facturas anteriores

Los nuevos pagos de ViiLife vinculan expresamente la venta por ID de factura.
Los registros anteriores no se enlazan automáticamente por referencia parecida.
Reembolsos sin vínculo aparecen en un panel administrativo separado. Si hay un
candidato compatible, admin verifica y vincula con motivo. El servidor exige
misma referencia, prospecto, vendedor, moneda CAD, venta/factura pagadas, suma del
pago registrada e historial `invoice.paid`. Un dato discrepante no se fuerza.

Una venta anterior sin vínculo que coincide con referencia/prospecto/vendedor
de una factura reembolsada queda retenida para revisión antes de cambiar su estado.
El arranque solo recupera revisiones faltantes para vínculos explícitos; GET no
modifica registros. Las revisiones y recuperaciones se serializan con el mismo
lock financiero de créditos/reembolsos para evitar duplicación o exceder saldos.

## Verificación aplazada y pendientes

Se preparó `npm run test:phase2-commissions` y se añadió a la suite general.
**No se ejecutó** en esta entrega: las pruebas quedan para el final según la
instrucción actual. Solo se revisa sintaxis; SQL/migraciones, concurrencia,
permisos, interfaz móvil, idiomas y recorridos requieren validación posterior.

Faltan las reglas comerciales finales (base y tasa de comisión, relación con
impuestos, devolución/recuperación, comprobantes y autorización), conciliación
de reembolsos Stripe y manejo de correcciones. Shopify/Airbnb permanecen para
la etapa final. Las conexiones no se activan al aprobar una revisión interna.

Tablas: `commission_reviews`, `commission_recoveries`; venta→factura con
`service_invoice_id`. Cambios exclusivos de `viicasa-fase2-demo`.

## Actualización: pruebas locales autorizadas

El 13 de octubre se ejecutaron las 5 pruebas de este módulo y pasaron. La suite
general terminó con 103/103 aprobadas. Los reembolsos/recuperaciones comprobados
son internos y ficticios; no se validaron transferencias ni proveedores externos.
Detalle: `RESULTADOS-PRUEBAS-LOCALES-FASE-2.md`.

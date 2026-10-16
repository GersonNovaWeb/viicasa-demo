# Analítica y consentimiento - diario local de fase 2

Esta entrega solo prepara medición interna de la demo. No carga Google Analytics,
Tag Manager, Pixel ni APIs de Meta, y no envía eventos a terceros. Tener claves de
un proveedor en el hosting no activa ninguna conexión.

## Activación y elección del visitante

1. En `/admin` → Preparación de lanzamiento, registrar la aprobación del aviso de
   privacidad. Es una aprobación operativa, no una certificación legal: debe
   reemplazarse el borrador público y validarse la política antes de publicar.
2. En Analítica y privacidad, activar **registro interno con consentimiento** y
   elegir la conservación de eventos, de 1 a 90 días (30 por defecto).
3. En una página pública, el visitante puede elegir **Solo necesarias** o guardar
   su selección de estadísticas/marketing. La medición opcional está bloqueada
   mientras no haya aprobación o consentimiento válido. Marketing solo conserva
   una preferencia para el conector futuro; no activa publicidad.
4. El botón Privacidad permite cambiar la selección. Se revoca el recibo anterior
   y se eliminan sus eventos y atribuciones locales. Cambiar la versión aprobada
   del aviso exige una elección nueva. La señal `Sec-GPC: 1` bloquea los eventos
   de navegador y la interfaz guarda la preferencia de rechazo cuando procede.

La cookie `vc2_privacy` conserva únicamente una clave aleatoria HttpOnly/SameSite
Lax, Secure en HTTPS, con caducidad de 180 días. El servidor guarda su hash y el
recibo de preferencias. No se crea esta cookie antes de guardar una elección o de
respetar la señal de rechazo del navegador. No es una cookie de cuenta de usuario.

## Eventos implementados

- `page_view`: sección pública (`home`, `account`, `viilife`, `viishop`,
  `viiconcierge`), después del consentimiento. No guarda la URL, query ni referer.
- `generate_lead`: respuesta exitosa de una solicitud de servicios de fase 2 o
  consulta de ViiConcierge. No guarda texto, dirección, teléfono o correo.
- `begin_checkout`: preparación exitosa de factura ViiLife, carrito del canal
  ficticio, pedido ViiShop existente o reserva ViiConcierge existente.
- `purchase`: factura pagada por el backend, simulación administrativa confirmada
  del canal o checkout existente confirmado con pago CAD validado. La página de
  retorno no es prueba de pago. Se usa el importe pagado en centavos y moneda CAD.

Las conversiones usan el consentimiento del comprador atribuido al iniciar el
checkout, no el del administrador ni el del servidor de webhooks. Revalidan su
vigencia antes de registrar. Un evento confirmado se deduplica por referencia
interna hasheada. No se almacenan contactos, IP, huella de dispositivo, contenidos
libres ni IDs de cuenta en la tabla de eventos. Los recibos y referencias siguen
siendo pseudónimos y pueden relacionarse con operaciones internas: no se afirma
anonimato irreversible ni cumplimiento normativo automático.

La medición es opcional y best-effort: no bloquea una operación comercial si falla
el diario. Los conectores finales deberán añadir conciliación y diagnóstico de
eventos faltantes. La recepción real de webhooks se validará en un entorno alojado.

## Extensión pendiente para proveedores

Los nombres de los eventos siguen referencias de Google, pero los parámetros
internos no son aún un payload GA4/GTM/Meta completo. Faltan adaptadores, IDs de
medición, productos/ítems públicos, IDs estables de transacción, contrato de envío,
deduplicación entre navegador/servidor y pruebas reales por proveedor. No se debe
exportar el recibo, hash de cookie o los datos de contacto como identificadores
de publicidad. La autorización de marketing no autoriza datos personales por sí sola.

La interfaz de equipo no carga el aviso ni registra vistas; el dashboard analítico
solo es accesible para administradores. Los vendedores no pueden modificar estas
opciones ni consultar datos globales.

## Retención y validación

El worker elimina eventos más antiguos que la conservación configurada y recibos
caducados; no borra pedidos, facturas, pagos ni CRM. Cambiar la conservación puede
eliminar eventos anteriores al nuevo límite. Las preferencias deben validarse con
el cliente antes del despliegue. Las pruebas aisladas usan bases en memoria y no
configuran cuentas ni mandan eventos externos: `npm run test:phase2-measurement`.

Fuentes técnicas:
- https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
- https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

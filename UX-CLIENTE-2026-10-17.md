# VIICASA - correcciones y UX del cliente

Estado: implementacion local, sin commit, push ni despliegue en Hostinger.
La copia Fase 2 sigue separada de la plataforma oficial. No se han usado claves reales, SMTP, Firestore remoto ni cargos de Stripe para estas pruebas.

## Correcciones de la solicitud

| Punto | Trabajo realizado | Estado / condicion |
| --- | --- | --- |
| 1. Servicios como invitado | Se habilita expresamente en el servidor web oficial, no solo en el formulario. El pedido conserva contacto, consentimiento, sesion y permisos privados sin crear una identidad verificada. | Codigo corregido en ambas copias. Falta desplegar. |
| 1. Cuenta opcional despues de comprar | Confirmacion independiente del registro; invitacion con beneficios. En Fase 2 se recuperan nombre y correo desde el pedido privado para rellenar el registro. Se mantiene la verificacion del correo antes de vincular pedidos. | Implementado; no se crea una cuenta automaticamente ni se pone informacion personal en una URL. |
| 2. Regreso de Stripe | Consulta servidor-a-servidor sobre la sesion persistida, verifica referencia, metadatos, importe y moneda; usa el mismo cierre transaccional/idempotente que el webhook. Un retorno no acredita un pago. La sesion pagada deja de devolver un enlace a Stripe. | Probado localmente con adaptador de Stripe; falta repetir con el dominio, webhook y sandbox reales. |
| 2. Confirmacion | Pantalla de confirmacion y acceso opcional a cuenta, regreso al inicio y sugerencias del catalogo. Espera de webhook con lecturas limitadas; no inicia un segundo cobro. | Implementado en el checkout comun. La pagina privada mantiene su acceso sin cuenta. |
| 3. Envio | Se comprobo el soporte existente de direccion, tarifa configurable, total del servidor y persistencia. | No se activo una tarifa inventada en produccion. El administrador debe habilitar shipping en los ajustes CAD y usar cobertura/tarifas aprobadas. El calculo con transportista sigue pendiente de conexion. |
| 4. Canasta | Cantidad +/- limitada por existencias; View basket visible despues de agregar, Comprar ahora, cajon y contador visible en el encabezado tambien en movil. | Implementado y recorrido en navegador local. La validacion final de existencias sigue en servidor. |
| 5. Scroll | Reinicio despues de contenido asincrono, sin desplazamiento suave accidental; respeta anclas. El formulario largo no fuerza snap hacia un reel. El nuevo feed reserva imagenes, usa snap y pausa videos fuera de pantalla. | Ambas copias corregidas; QA movil emulada y escritorio, no prueba fisica de Safari/LTE. |
| 6. Reserva de prueba | Se identifico el rechazo de propiedades de ejemplo en el entorno de produccion. Ahora pueden reservarse con sk_test y modo test, nunca con una clave live. La marca is_demo se conserva y se vuelve a validar al pagar. | Reserva y anticipo CAD probados. Los errores concretos del servidor ya no quedan sustituidos por un mensaje generico. |
| 7. Logo y titulo | Espacio reservado segun altura real del encabezado, tarjetas sin titulo bajo el logo y navegacion movil separada. | Verificado a 390 x 844 sin overflow horizontal. |
| 8. Moneda | El storefront solicita las tarifas CAD configuradas por el administrador. No hay conversion FX ni fallback silencioso a USD. | Una tarifa CAD ausente se debe configurar antes de vender ese articulo. No se reescriben precios en la base existente. |
| 9. Textos de demo | Se mantienen las advertencias de las propiedades/productos ficticios en esta copia. | Retirarlas solo al sustituir contenido de prueba y aprobar el lanzamiento; no ocultar la naturaleza de un pedido de ejemplo. |

## Nuevo UX implementado en Fase 2

- Inicio mezclado de las tres marcas, con el logo enlazado al inicio. /fase2 conserva la antigua presentacion interna.
- Tiles inmersivos; dos columnas de escritorio y una de movil, video de limpieza, imagen de respaldo, etiquetas por marca y acciones independientes.
- Secciones /shop, /viilife y /viiconcierge con barra delgada y panel de intencion: busqueda, categorias, precio y busquedas recientes locales.
- Favoritos guardados por cuenta; los invitados son dirigidos a iniciar sesion, no se simula que se guardaron. Vista de favoritos en /?likes=1.
- Retorno desde detalle al feed de la marca, con restauracion del contexto guardado y sin mandar nuevas visitas al pie.
- Plantilla de servicio en /servicios/:id: media, galeria deslizable/ampliable, inclusiones, modos, complemento y paquete sugeridos cuando hay contenido publicado, boton fijo que se oculta al verse el boton en linea.
- Panel lateral de cotizacion con contacto de invitado, frecuencia preferida cuando corresponde y complementos nunca preseleccionados salvo que el usuario elija expresamente el paquete.
- La limpieza con tarifa publicada lleva al checkout operativo de ViiLife. Los otros servicios conservan el flujo honesto de propuesta/cotizacion; seleccionar recurrente no crea una suscripcion automatica.
- Base de reseñas /7 con comprobacion de compra y fecha. Sin reseñas reales, se muestra el estado vacio, no una calificacion ficticia.
- Registro posterior a pedido reutiliza contacto desde su acceso privado y exige verificar el mismo correo para vincularlo.

## Alcance del PDF que aun requiere programacion adicional

Estos puntos no se presentan como terminados ni como simples conexiones:

1. Canasta multimarcas de productos + servicios + estancia con un unico total transaccional, impuestos y pago; hoy los flujos operativos siguen separados.
2. Armador de viaje e itinerario unificado, preferencias posteriores al pago y cambios coordinados de disponibilidad.
3. Mapa interactivo de resultados, calendario con disponibilidad bloqueada y alternativas de fechas cercanas.
4. Motor de combinaciones con ranking editable, paquetes con tarifa/descuento aprobados, suscribirse y ahorrar y progreso real hacia envio gratis.
5. Comentarios publicos moderados, fotos/recompensas con divulgacion y politicas aprobadas. La base de reseñas no incluye aun todo ese subsistema.
6. Personalizacion Para ti por historial, ciudad e intereses; el feed mezclado actual no se anuncia como recomendacion inteligente.
7. Acceso con numero celular, onboarding de intereses/ciudad y consentimiento de ofertas con persistencia. Los accesos existentes por correo/Google/Apple se conservan segun su configuracion.
8. Checkout de compra inmediata para todos los servicios con precio fijo, opciones de alcance, precios de paquete y recurrentes. La limpieza operativa y las cotizaciones existentes no equivalen a esta ampliacion.
9. Guia de llegada, check-in digital y mensajes de concierge integrados con una estancia real.
10. Continuidad del mismo reel sin recarga entre tile y detalle, la variante A/B del CTA fijo y las nuevas plantillas completas de anuncio/producto del documento.

## Datos y decisiones del cliente

- Tarifas CAD publicadas, impuestos, cobertura y reglas/tarifas de envio.
- Fotografias del resultado, detalle y equipo por servicio; videos e imagenes reales de productos/propiedades.
- Alcances estandar, precios y composicion de paquetes; frecuencia y reglas para compra recurrente.
- Beneficios de reserva directa, fecha de entrega y umbral de envio gratis, si se ofreceran.
- Politica de resenas, moderacion y recompensa sin condicionar la opinion.
- Aprobacion de textos, privacidad/condiciones, y de cuando sustituir el contenido de prueba.

## Validacion y despliegue

Pruebas de checkout, invitado, anticipo, CAD, envios configurados, idempotencia, permisos y rechazo de cobros live sobre ejemplos. Pruebas de navegacion/scroll y recorridos de navegador movil emulado. Compilacion sin llamadas de pagos ni Firebase.

Comandos de Fase 2:

    npm run test:checkout-resolution
    npm run test:ux
    npm run build

Plataforma oficial:

    npm run test:checkout-resolution
    npm run build

La validacion local no verifica por si sola la recepcion en correos reales ni el webhook de Hostinger. Despues de publicar, repetir compra normal y grande, invitado y cliente, confirmar estado, recibo al comprador y aviso administrativo.

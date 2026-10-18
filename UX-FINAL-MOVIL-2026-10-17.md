# Revision visual UX Final - 17 de octubre de 2026

Alcance: copia independiente `viicasa-fase2-demo`, rama `fase-2`. Cambios locales, sin commit, push ni despliegue. Plataforma oficial intacta.

Referencia revisada: las 11 laminas de `VIICasa_Vii_UX_Final_ES.pdf`. Se conserva el PNG negro solicitado posteriormente y la transicion lateral ya aprobada.

Actualizacion posterior solicitada: hero editorial exclusivo del inicio Vii, con imagen existente, texto ES/EN, accesos a las tres marcas y boton para descubrir el feed. Favoritos y catalogos no repiten el hero. Se mantienen los avisos de demo.

Pulido de desplazamiento: scroll nativo sin paradas obligatorias, ajuste suave solo para el boton del hero, menor animacion si el sistema lo solicita, encabezado con transicion corta y control de direccion para rueda, tacto y barra. Se corrigio el caso de un scroll rapido que terminaba antes de pintar el encabezado. En escritorio no hay snap entre columnas; en movil el inicio conserva ajuste por proximidad sin bloquear avances. El buscador utiliza el espacio ya reservado por el encabezado, sin duplicarlo.

Correccion posterior de navegacion: la navbar ahora permanece fija y visible. Vii, ViiShop, ViiLife y ViiConcierge preparan sus datos e imagenes antes de reemplazar solamente el contenido, sin recargar el documento. La transicion lateral no usa fundidos ni mezcla aditiva; cabecera y barra inferior se mantienen separadas. Se verificaron cambios repetidos, entrada desde una posicion avanzada, Atrás/Adelante, movimiento reducido y error de preparacion. Las rutas privadas y los enlaces con filtros conservan su navegacion normal.

## Pantallas ajustadas

| Referencia | Implementacion visual y comportamiento disponible |
| --- | --- |
| 1-2. Sistema e Inicio | Encabezado movil compacto con logo, tres marcas, canasta con cantidad y menu. Inicio mezclado con tarjetas inmersivas, etiqueta arriba, acciones sociales y CTA dorado. La canasta vacia sigue sin icono. |
| 3. Secciones | Tarjetas blancas compactas, imagen separada del texto, precio CAD real y corazon. Busqueda delgada, panel con chips de categorias y orden, rango de precios, busquedas recientes y contador de resultados. Resultados en dos columnas. Borrado visible dentro de la barra. |
| 3. Continuidad | Navbar fija y visible segun correccion posterior; solo el buscador se oculta al bajar y se recupera al subir. Se conserva la posicion al cerrar el panel sin aplicar cambios. Al volver de un detalle se conservan filtros validados y contexto de la marca. |
| 4. Producto y canasta | Cabecera de regreso a ViiShop, precio CAD, stock real, variantes con chips, cantidad, botones fijos Agregar/Comprar ya, cajon inferior con miniatura y acceso a checkout. No se inventa progreso hacia envio gratuito. |
| 4. Checkout | Cabecera compacta, resumen antes del formulario en movil, campos y accion dorada. Se mantiene la compra como invitado y la captura de tarjeta en Stripe, sin botones de pago ficticios. |
| 5-6. ViiConcierge | Acento verde azulado, resultados blancos, detalle con galeria y comodidades. Barra movil fija: tarifa por noche hasta cotizar, total del servidor despues de cotizar. Reservar abre una hoja inferior con el formulario operativo existente. |
| ViiLife | Detalle compacto, galeria/video, cabecera de regreso con favoritos/menu, inclusiones, complementos publicados y CTA fijo. Compra de limpieza y cotizacion conservan sus destinos operativos. |
| 8-9. Venta cruzada | Se conserva la seccion de sugerencias existente y se agrega la tarjeta de cuidado ViiLife en producto. Las sugerencias son enlaces a catalogos reales, no descuentos o suscripciones ficticias. |
| 10. Acceso | Logo, formulario compacto, recuperar contrasena, Apple/Google con su estado real de configuracion. No se cambia la autenticacion ni se crea una cuenta automaticamente al comprar. |
| 11. Me gusta | Filtros Todo/Articulos/Destinos/Servicios, tarjetas compactas, corazones con estado de la cuenta y acceso inferior. La agenda enlaza a visitas existentes, no a un itinerario inexistente. |

## Diferencias que no deben presentarse como terminadas

- Armador de viaje y canasta multimarcas con un unico pago transaccional.
- Mapa interactivo, disponibilidad bloqueada en calendario y alternativas de fechas.
- Itinerarios unificados y personalizacion del feed por ciudad/historial.
- Alta con celular, onboarding de intereses/ciudad y consentimiento comercial persistente.
- Suscripciones, descuentos, envio gratis y entrega estimada sujetos a reglas aprobadas.
- Programa de recompensas por fotos y categorias detalladas de resenas.
- Nuevas experiencias/paquetes, metadatos de origen y "usado en nuestras estancias" requieren contenido real y configuracion.

No se dibujan botones de Apple Pay/Google Pay como si estuvieran conectados: los medios de pago disponibles los determina la integracion de checkout. No se muestran puntuaciones, descuentos, fechas o disponibilidad inventados.

Las fotos ilustrativas y advertencias de demostracion permanecen. El documento es un esquema de UX; no un archivo de diseno con medidas/exportaciones finales. Las fotografias y el logo real sustituyen los bloques grises y el logo esquematico.

## Comprobaciones locales

- Navegador a 390 x 844 y 320 x 740; comprobacion de escritorio a 1440 x 1000.
- Categorias, cantidad de resultados, dos columnas, borrado de filtros y menu lateral.
- Producto de ejemplo agregado a la canasta local; cajon, contador y cierre. Sin cobros.
- Hoja de reserva: 3 noches a CAD 380 + CAD 70 de limpieza = CAD 1,210, calculado por el servidor. Sin reservar ni pagar.
- Fechas y huespedes pasan desde la busqueda al formulario de la propiedad; capacidad filtra las estancias. La disponibilidad sigue requiriendo cotizacion del servidor. Las preferencias se conservan al volver a la marca.
- El total fijo de reserva se limpia al cambiar las fechas; vuelve a la tarifa por noche hasta recibir una nueva cotizacion.
- Acceso de clientes y detalle ViiLife, sin iniciar sesion con proveedores reales.
- Pruebas unitarias/integracion, checkout existente y compilacion. No se ha validado aun un dispositivo fisico ni el despliegue de Hostinger.

Comandos relevantes:

    node --test test/ux-final-mobile.test.mjs test/section-motion.test.mjs test/feed-controls.test.mjs
    npm run test:ux
    npm run test:checkout-resolution
    npm run build

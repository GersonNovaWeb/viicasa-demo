# Plan de validación y entrega · fase 2

Nuevo panel `/admin` → **Plan de validación**. La fase sigue siendo demo.
Las pruebas se ejecutarán al finalizar el desarrollo: este panel no ejecuta
comandos, no llama proveedores y no convierte un resultado reportado en certificación.

## Qué se puede planificar

31 casos agrupados: seguridad y permisos, identidad, CRM/servicios, cobros y
comisiones, canales externos, operación/respaldos, privacidad, móvil/idiomas y
revisión del cliente. Cada caso describe qué recorrido hay que comprobar.

- Responsable: administrador activo (no asigna tareas que el vendedor no puede ver).
- Fecha objetivo, nota de preparación y referencia de evidencia.
- Estados pendiente, en preparación, bloqueado, listo para pruebas, resultado
  satisfactorio reportado o fallo reportado.
- Historial inmutable por versión, actor/fecha y auditoría.
- Filtros por sección, estado y responsable. Exportación privada CSV/JSON.

Todos los casos comienzan pendientes. No se han marcado pruebas como realizadas
ni se han importado resultados antiguos para aparentar que la fase está validada.
El vendedor y los clientes no pueden consultar ni modificar este panel.

## Qué significa un resultado satisfactorio

Un administrador informa que un recorrido fue comprobado. Debe registrar
responsable, nota y referencia de evidencia (fecha, escenario y resultado).
La evidencia es texto referencial: no sube un archivo, no visita una URL,
no comprueba automáticamente que el documento exista o sea auténtico.

El backend exige requisitos y dependencias: ejemplo, no se acepta la validación
del aislamiento de pedidos antes de registrar acceso de equipo y cliente.
Los casos reales de Stripe necesitan gateway sandbox y secreto webhook presentes;
recepción de correo requiere SMTP completo; Apple requiere estar habilitado con
configuración compatible. Estas comprobaciones son de configuración, no pruebas
de funcionamiento. Tener una clave nunca prueba un proveedor.

Off-session, Stripe Refund, Shopify, canal externo de estancias y analítica externa
siguen con adaptadores pendientes y no pueden registrarse como validados ahora.
Al desarrollar esos adaptadores se actualizarán los requisitos del servidor;
ninguna variable de entorno elude este bloqueo.

## Cambios después de reportar un resultado

Los resultados guardan una huella de catálogo, revisión de código, configuración
registrada, permisos y presencia de credenciales. Cambiar esa información vuelve
obsoletos los resultados anteriores; se muestran como **Revalidación necesaria**
sin borrar su historial. Retirar un resultado previo invalida sus dependientes.
Una aprobación comercial no es un resultado de prueba y se registra por separado
en **Preparación de lanzamiento**.

La revisión del código se calcula al arrancar el proceso, leyendo solo archivos
de código/interfaz y dependencias declaradas. No lee .env, claves, bases, uploads
ni datos de usuarios. Después de editar código hay que reiniciar antes de reportar
un resultado. Los archivos de pruebas/documentación no forman parte de esa huella.

Se conserva una huella hash de parámetros no secretos de correo
(host, usuario, remitente, destinatario administrador, puerto/TLS), sin exportar
esos valores en el plan. Las contraseñas y tokens no se usan para calcularla.
Rotar claves conservando su presencia, cambiar un endpoint de base fuera de la
configuración registrada o cambiar permisos del proveedor no se detecta: restablecer
manualmente los resultados afectados y comprobarlos otra vez.

Guardar una modificación usa versión optimista y huella vigente. Dos editores no
sobrescriben resultados silenciosamente. Los GET no crean casos ni cambian estados.
El CSV neutraliza fórmulas y conserva estados reportados/actuales por separado.
El informe no contiene contraseñas, tokens o respuestas de proveedores.

## Límites de seguridad

No pegar secretos ni datos privados de clientes en notas/evidencia. Se rechazan
patrones comunes de claves privadas/API, pero esto no detecta todas las contraseñas
o formatos. Usar referencias internas sin credenciales o enlaces firmados.
El acceso administrativo mantiene MFA, comprobación de origen y permisos existentes.

`production_enabled=false` e `independently_verified=false` permanecen así incluso
si se reportan resultados satisfactorios. Copiar/promover a la plataforma oficial
requiere autorización separada, entorno y datos adecuados y el cierre real de las
validaciones. Este panel no publica, no activa pagos reales ni envía correos.

## Verificación pendiente

Pruebas preparadas: `npm run test:phase2-launch`, incorporadas en `test:phase2`.
**No ejecutadas** durante la entrega inicial según la instrucción entonces vigente. Solo se revisó
sintaxis: 166 archivos JavaScript sin errores. Migraciones SQL, autenticación, concurrencia, exportación, interfaz,
idiomas y recorrido completo se comprobarán al final con el resto de la fase.

Tablas: `launch_checks`, `launch_check_history`. Módulos `launch-readiness.mjs`,
`launch-catalogue.mjs`, `source-revision.mjs`, `public/launch-workspace.js`.
Cambios únicamente en `viicasa-fase2-demo`; sin modificaciones a la versión oficial.

## Actualización: pruebas locales autorizadas

El 13 de octubre se ejecutó este módulo: 5 pruebas aprobadas. La suite de fase 2
terminó con 103 aprobadas y cero fallos tras corregir el calendario de vencimiento
UTC/Vancouver. Ver `RESULTADOS-PRUEBAS-LOCALES-FASE-2.md` para alcance y límites.
Esto no acredita recepción SMTP real, proveedores conectados ni revisión visual.

# Cierre interno y preproducción · 14 de octubre de 2026

Esta entrega sigue trabajando **solo en `viicasa-fase2-demo`**. No modifica la
plataforma oficial, `.env.phase2.local`, cuentas existentes ni datos persistentes.
No activa proveedores, envía SMTP real, ejecuta cobros o despliega el proyecto.

## Perfiles separados

- `PHASE2_MODE=demo`: conserva el comportamiento de revisión y los ejemplos, con
  datos locales en `data/phase2`. Las cuentas ficticias se mantienen exclusivamente
  en ese perfil para no romper la revisión que ya se estaba haciendo.
- `PHASE2_MODE=staging`: preproducción **sin usuarios, CRM, propiedades, productos
  ni unidades de ejemplo**. Localmente usa `data/phase2-staging`; con PostgreSQL
  necesita un par independiente y vacío. Los dos componentes guardan un ID de
  instalación; no se permite mezclar pares ni relabelar una base demo como staging.
  Los uploads también usan una carpeta independiente (`data/phase2-staging-media`).
- Nunca borra datos para conseguir una base vacía. Rechaza registros de ejemplo,
  datos empresariales sin perfil y perfiles incompatibles. Ante una instalación
  interrumpida, revisar la pareja y los respaldos antes de intervenir manualmente.
- Staging prohíbe los endpoints de simulación/siembra y los asientos ficticios de
  venta, recuperación y complemento. Sin claves de sandbox, los pagos quedan
  desactivados. Con claves, solo admite Stripe test. Esta separación no se puede
  desactivar desde un checkbox del navegador.
- La instancia pública de staging exige HTTPS y la base remota TLS verificable.
  Loopback permite HTTP para desarrollo. Ambos perfiles permanecen `noindex`.
- `production` y `sk_live` **siguen rechazados expresamente**: la promoción oficial
  es la etapa final autorizada, no una conexión ni una aprobación implícita.

## Alta inicial privada del administrador

Solo para una instalación staging limpia y sin miembros del equipo:

```sh
npm run init:phase2-admin
```

Detener el servidor primero si utiliza PGlite. El comando lee nombre y correo;
la contraseña se introduce oculta en una terminal interactiva. Exige 16–128
caracteres y una confirmación explícita. También admite JSON por **stdin privado**
para operadores autorizados; no poner contraseñas en argumentos, historial,
README, Git ni un archivo público.

No existe endpoint público de creación de administrador. Se guarda un hash, no la
contraseña. La operación está serializada, es de un solo uso y no reemplaza usuarios
existentes. El primer acceso por `/admin` requiere configurar/verificar TOTP y
conservar sus códigos de recuperación. Las altas posteriores usan gestión
autenticada del equipo, no este comando.

**No se ejecutó el comando sobre las bases del usuario.** Las pruebas crearon
administradores ficticios únicamente en memoria.

## Inspección de lanzamiento

`/admin` → **Plan de validación** incorpora **Inspección del candidato oficial**.
Comprueba el perfil, datos demo, administrador con MFA, aprobaciones y vigencia de
los 31 casos de aceptación. Expone bloqueos y una huella de configuración, sin
secretos. No aprueba casos por sí sola, ejecuta pruebas, borra datos o activa
producción. Las pruebas locales y las pruebas externas tienen alcances diferentes.

## Reservas: código interno preparado para conectar al final

Nuevo módulo: `phase2/stay-provider-operations.mjs`. Implementa:

- Entrada desactivada por defecto y separada de las herramientas demo.
- Verificación delegada al puente autorizado **antes** de encolar la entrega.
- Refetch de la reserva completa desde el servidor; no confía en nombre, correo,
  fechas o estado incluidos en el cuerpo del aviso.
- Mapeo externo/local de unidades, cola durable, límite de tamaño/tiempo, leases,
  idempotencia, versiones, cuarentena, reintento supervisado y consulta privada.
- Revisión existente de cambio de propiedad/estancia iniciada. No convierte una
  ausencia de respuesta en cancelación ni envía cambios al canal externo.
- Aislamiento de reservas verificadas: las herramientas de simulación no pueden
  alterarlas. La confirmación de una reserva **no confirma un pago**.
- Avisos al huésped y administrador, sujetos a aprobación separada. Demo y
  entradas no aprobadas siguen en preview. Cambios/cancelaciones invalidan avisos
  pendientes anteriores; un mensaje ya enviado o en vuelo no puede recuperarse.
- El remitente/destinatarios proceden del pedido/configuración, no de una dirección
  de prueba forzada. La entrega de canales se vuelve a bloquear si se retira la
  aprobación técnica de correo en la configuración del proceso.

Administrador: **Estancias → Entrada de canales de reservas**. Las variables
`PHASE2_STAY_CONNECTOR_APPROVED` y `PHASE2_STAY_MAIL_APPROVED` permanecen `false`.
Agregar una API key **no crea ni activa** un conector.

### Límite del puente real

El contrato descrito abajo es **de VIICASA, no un supuesto formato de la API de
Lodgify/Airbnb**. Un módulo privado autorizado debe implementar:

```text
enabled: boolean
contractVersion: identificador de contrato revisado
verifyDelivery(rawBuffer, headers): entrega validada { id, reference }
reservation(reference): snapshot autoritativo completo
```

Snapshot normalizado: `external_reference`, `external_unit_id`, `modified_at`,
`status` (`confirmed` o `cancelled`), `guest_name`, `guest_email`, `guests`,
`checkin_date`, `checkout_date`. No expone tokens al frontend. Se inyecta mediante
`providerGateways.stays`, no mediante un formulario público.

**Pendiente para la etapa de conexiones:** confirmar canal autorizado, endpoints,
permisos, autenticación/firma y payloads del proveedor, e implementar/validar ese
puente concreto. La disponibilidad local deducida de reservas no sustituye el
calendario externo: el módulo devuelve `calendar_verified=false`. Falta integrar
y conciliar el calendario del proveedor con los mapeos del catálogo público.
Esta entrega no afirma tener una API Airbnb/Lodgify funcional con solo sus claves.

## Dependencias

El CLI heredado de Firebase se aisló en `tools/firebase/package.json`. Fase 2 no
lo utiliza, no lo instala con el manifiesto principal y no lo necesita para SQL.
La opción de emulador de fase 1 se conserva como herramienta separada. Sus
advisories no están corregidos por esta separación; revisar antes de instalarlo.

La auditoría del manifiesto principal volvió a comprobarse tras la instalación.
Resultado y suite final: `RESULTADOS-PRUEBAS-LOCALES-FASE-2.md`. Conservar el
lockfile; no ejecutar `audit fix --force` para saltar cambios incompatibles.

## Lo que permanece para el cierre externo

Conexiones y pruebas con proveedores, calendario Airbnb/Lodgify, reglas/textos
aprobados, contenido real, validación visual, hosting/bases/respaldos y aceptación.
Producción continúa bloqueada. La adaptación final de cobros/documentos reales y
la promoción de datos existentes se realizan en la copia oficial autorizada;
**esta copia no certifica ni permite activar producción**.

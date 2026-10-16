# Herramienta heredada opcional de fase 1

La fase 2 usa PGlite/PostgreSQL y no necesita Firebase CLI. Este paquete separado
conserva la opción de instalar herramientas de emulador para el código heredado:
`npm install --prefix tools/firebase`, solo si se necesitan, tras revisar sus
advisories. No se instala con `npm ci` de la plataforma ni se incluye en despliegue.
Sus alertas transitivas no se consideran resueltas por haberlo aislado.

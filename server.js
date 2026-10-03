// Demo-only entry. It never loads .env, Stripe credentials or a live database.
import('./viicasa-frontend-prototype/dev-local.mjs').catch((error) => {
  console.error('No se pudo iniciar VIICASA:', error);
  process.exit(1);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {configFromEnv} from '../viicasa-backend/src/config.js';
const base={DATABASE_DRIVER:'firestore',FIREBASE_MODE:'emulator',FIREBASE_PROJECT_ID:'demo-viicasa-preview',FIRESTORE_EMULATOR_HOST:'127.0.0.1:8089',PAYMENT_PROVIDER:'demo',MAIL_MODE:'outbox'};
test('demo uses a fake local project and outbox only',()=>{const c=configFromEnv(base);assert.equal(c.firebaseProjectId,'demo-viicasa-preview');assert.equal(c.paymentProvider,'demo');assert.equal(c.mailMode,'outbox');});
test('live databases, Stripe and SMTP fail closed',()=>{
  for(const env of [{FIREBASE_MODE:'live',FIREBASE_PROJECT_ID:'real-project'},{DATABASE_DRIVER:'postgres'},{PAYMENT_PROVIDER:'stripe',STRIPE_SECRET_KEY:'not-a-secret',STRIPE_WEBHOOK_SECRET:'not-a-secret'},{MAIL_MODE:'smtp',SMTP_HOST:'example.invalid'},{FIREBASE_PROJECT_ID:'real-project'},{FIRESTORE_EMULATOR_HOST:'remote.example:8089'}])assert.throws(()=>configFromEnv({...base,...env}));
});
test('package starts only demo launcher and does not expose live setup commands',async()=>{
  const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));assert.equal(pkg.name,'viicasa-demo');assert.equal(pkg.scripts.start,'node server.js');assert.equal(pkg.scripts.dev,'node server.js');assert.equal(pkg.scripts['dev:stripe'],undefined);
  const entry=await readFile(new URL('../server.js',import.meta.url),'utf8');assert.match(entry,/import\('\.\/viicasa-frontend-prototype\/dev-local.mjs'\)/);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('web glass is progressive, constrained to controls and accessible',async()=>{
  const css=await readFile(new URL('viicasa-frontend-prototype/liquid-glass.css',root),'utf8');
  assert.match(css,/@supports.*backdrop-filter/);
  assert.match(css,/-webkit-backdrop-filter/);
  for(const preference of ['prefers-reduced-transparency','prefers-reduced-motion','forced-colors'])assert.ok(css.includes(preference));
  assert.match(css,/--glass-surface: #f7f5f0/);
  assert.match(css,/--glass-panel:rgba\(250,248,244,\.96\)/);
  assert.match(css,/outline:3px solid/);
  assert.doesNotMatch(css,/filter\s*:[^;{}]*url\(|(?:^|[;{\s])(?:scroll-snap-type|scroll-behavior|touch-action|will-change)\s*:/);
  assert.doesNotMatch(css,/transition:[^;{}]*(?:all|filter)|animation:[^;{}]*(?:glass|blur)/);
});
test('only public Phase 2 pages opt into the web theme',async()=>{
  const server=await readFile(new URL('phase2/app.mjs',root),'utf8');
  assert.match(server,/pathname!=='\/admin\/plataforma'/);
  assert.match(server,/relative==='phase2\/public\/service-catalogue.html'/);
  assert.match(server,/<html data-vii-glass /);
  assert.match(server,/href="\/liquid-glass.css"/);
  assert.doesNotMatch(server,/relative==='phase2\/public\/(?:guest-order|portal).html'[^\n]*liquid-glass/);
});

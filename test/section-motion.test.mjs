import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {installSectionMotion,sectionDirection} from '../viicasa-frontend-prototype/section-motion.js';
function fixture({path='/shop',reduced=false,storageWorks=true,animate=true}={}){
  const handlers={},events={},storage=new Map(),animations=[],navigation=[],dataset={};
  const feed=animate?{animate(frames,options){const entry={frames,options,cancelled:false};animations.push(entry);return{finished:Promise.resolve(),cancel(){entry.cancelled=true;}};}}:{};
  const win={location:{pathname:path,origin:'https://viicasa.example',href:'https://viicasa.example'+path,assign:url=>navigation.push(url)},innerWidth:390,matchMedia:()=>({matches:reduced}),setTimeout,clearTimeout,
    sessionStorage:{setItem(k,v){if(!storageWorks)throw Error('unavailable');storage.set(k,v);},getItem:k=>storage.get(k),removeItem:k=>storage.delete(k)},addEventListener:(n,fn)=>events[n]=fn};
  const doc={documentElement:{dataset},querySelector:()=>feed,addEventListener:(n,fn)=>handlers[n]=fn};
  const motion=installSectionMotion(win,doc);
  function click(to,extra={}){const link={href:'https://viicasa.example'+to,target:'',hasAttribute:()=>false},event={button:0,target:{closest:()=>link},preventDefault(){this.defaultPrevented=true;},...extra};handlers.click(event);return event;}
  return{motion,win,click,storage,animations,navigation,dataset,events};
}
test('tab order determines opposite lateral directions; private and nested routes are excluded',()=>{
  assert.equal(sectionDirection('/','/shop'),1);assert.equal(sectionDirection('/viiconcierge','/viilife'),-1);
  for(const target of ['/shop','/admin','/checkout','/pedido','/shop/example'])assert.equal(sectionDirection('/shop',target),0);
});
test('normal tab click slides content only, then follows the real URL',async()=>{
  const f=fixture();assert.equal(f.click('/viilife').defaultPrevented,true);
  await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(f.navigation,['https://viicasa.example/viilife']);assert.equal(f.animations.length,1);
  assert.match(f.animations[0].frames[1].transform,/translateX\(-/);assert.equal(f.animations[0].options.duration,150);
  assert.equal(f.animations[0].options.fill,'forwards');assert.equal(f.animations[0].cancelled,false);
  assert.ok(f.animations[0].frames.every(frame=>!('opacity' in frame)));
  assert.equal(f.dataset.sectionMotion,undefined);
  const destination=fixture({path:'/viilife'});for(const [k,v]of f.storage)destination.storage.set(k,v);
  await destination.motion.enter();assert.equal(destination.animations.length,1);assert.equal(destination.animations[0].options.duration,360);assert.equal(destination.storage.size,0);
  assert.ok(destination.animations[0].frames.every(frame=>!('opacity' in frame)));assert.equal(destination.animations[0].cancelled,true);
  f.events.pageshow({persisted:true});assert.equal(f.animations[0].cancelled,true);
  await destination.motion.enter();assert.equal(destination.animations.length,1);
});
test('the first HTML paint uses a light shell before JavaScript and async catalogue loading',async()=>{
  const html=await readFile(new URL('../viicasa-frontend-prototype/index.html',import.meta.url),'utf8');
  assert.match(html,/<html class="platform-shell"/);assert.match(html,/<body class="platform">/);
  assert.match(html,/<style>html.platform-shell\{background:#f7f4ee;color-scheme:light\}/);
  assert.match(html,/name="theme-color" content="#f7f4ee"/);
  assert.ok(html.indexOf('<style>')<html.indexOf('href="/styles.css"'));
});
test('native behavior is preserved for modifiers, current tab, private paths, missing storage, reduced motion and unsupported animation',()=>{
  for(const extra of [{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:true},{button:1},{defaultPrevented:true}]){
    const f=fixture();f.click('/viilife',extra);assert.equal(f.animations.length,0);assert.equal(f.storage.size,0);
  }
  for(const options of [{reduced:true},{storageWorks:false},{animate:false}])assert.notEqual(fixture(options).click('/viilife').defaultPrevented,true);
  for(const path of ['/shop','/admin','/checkout','/viilife/limpieza','/viilife?return=1','/viilife#form'])assert.notEqual(fixture().click(path).defaultPrevented,true);
});
test('stale or mismatched transitions are discarded, and returning from browser history resets pending state',async()=>{
  for(const pending of [{from:'/shop',to:'/viilife',direction:1,at:'invalid'},{from:'/shop',to:'/viilife',direction:1,at:0},{from:'/shop',to:'/viiconcierge',direction:1,at:Date.now()},{from:'/shop',to:'/viilife',direction:-1,at:Date.now()}]){
    const f=fixture({path:'/viilife'});f.storage.set('vii-section-motion',JSON.stringify(pending));await f.motion.enter();assert.equal(f.animations.length,0);assert.equal(f.storage.size,0);
  }
  const f=fixture();f.storage.set('vii-section-motion','bad');await f.motion.enter();assert.equal(f.storage.size,0);
  f.storage.set('vii-section-motion','{}');f.events.pageshow({persisted:true});assert.equal(f.storage.size,0);
});
test('cancelled browser animation never traps the customer on the source page',async()=>{
  const f=fixture();let cancelled=false;
  // Use a deliberately rejected animation to exercise the normal navigation fallback.
  const handlers={},win={...f.win},doc={documentElement:{dataset:{}},querySelector:()=>({animate:()=>({finished:Promise.reject(Error('cancelled')),cancel(){cancelled=true;}})}),addEventListener:(name,handler)=>handlers[name]=handler};
  installSectionMotion(win,doc);
  handlers.click({button:0,target:{closest:()=>({href:'https://viicasa.example/viilife',target:'',hasAttribute:()=>false})},preventDefault(){}});
  await new Promise(resolve=>setImmediate(resolve));assert.equal(cancelled,true);assert.deepEqual(f.navigation,['https://viicasa.example/viilife']);
});

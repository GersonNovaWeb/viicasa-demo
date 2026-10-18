import {test} from 'node:test';
import assert from 'node:assert/strict';
import {installFeedControls} from '../viicasa-frontend-prototype/feed-controls.js';
function fixture(){
  const handlers=new Map(),frames=[],classes=new Set(),feed={scrollTop:0,addEventListener(name,fn,options){handlers.set(name,{fn,options});}},body={classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}};
  installFeedControls(feed,body,{requestFrame:fn=>frames.push(fn)});
  return{feed,handlers,hidden:()=>classes.has('vii-scrolling-down'),event:(name,event={})=>handlers.get(name).fn(event),scroll(top){feed.scrollTop=top;handlers.get('scroll').fn();while(frames.length)frames.shift()();}};
}
test('an upward wheel gesture reveals immediately and snap settling cannot hide controls again',()=>{
  const f=fixture();f.event('wheel',{deltaY:500});f.scroll(700);assert.equal(f.hidden(),true);
  f.event('wheel',{deltaY:-100});assert.equal(f.hidden(),false);f.scroll(500);f.scroll(540);assert.equal(f.hidden(),false);
  f.event('wheel',{deltaY:100});f.scroll(800);assert.equal(f.hidden(),true);
  f.scroll(0);assert.equal(f.hidden(),false);
});
test('touch and keyboard intent preserve native scrolling and keyboard focus reveals controls',()=>{
  const f=fixture();f.scroll(500);assert.equal(f.hidden(),true);
  f.event('touchstart',{touches:[{clientY:200}]});f.event('touchmove',{touches:[{clientY:260}]});assert.equal(f.hidden(),false);
  f.scroll(550);assert.equal(f.hidden(),false);f.event('touchmove',{touches:[{clientY:100}]});f.scroll(800);assert.equal(f.hidden(),true);
  f.event('focusin');assert.equal(f.hidden(),false);f.event('keydown',{target:f.feed,key:'PageDown'});f.scroll(1100);assert.equal(f.hidden(),true);
  f.event('keydown',{target:f.feed,key:'PageUp'});assert.equal(f.hidden(),false);
  for(const name of ['wheel','touchstart','touchmove','touchend','scroll'])assert.equal(f.handlers.get(name).options.passive,true);
});

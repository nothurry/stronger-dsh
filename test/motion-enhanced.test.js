import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';import React from 'react';
const source=await readFile(new URL('../lib/client.js',import.meta.url),'utf8');
function mount(reduced=false){let effect,mutate,frame,change,observers=0;const listeners=new Map(),calls=[],react={...React,useEffect:fn=>effect=fn,useSyncExternalStore:(_s,get)=>get()};const media={matches:reduced,addEventListener:(_n,fn)=>change=fn,removeEventListener(){}};const doc={hidden:false,body:{},documentElement:{toggleAttribute(){},removeAttribute(){}},querySelectorAll:()=>[],addEventListener(){},removeEventListener(){}};const win={innerHeight:800,matchMedia:()=>media,getComputedStyle:()=>({opacity:'0.97',transform:'matrix(1, 0, 0, 1, 0, 1)'}),addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name),__ModuleLoader__:{load:x=>x.factory(id=>id==='react'?react:{})}};
 vm.runInNewContext(source.replace("return {name:'dsh-ui-stronger',inject:","window.Motion=MotionBridge;return {name:'dsh-ui-stronger',inject:"),{window:win,document:doc,MutationObserver:class{constructor(fn){observers++;mutate=fn;}observe(){}disconnect(){}},requestAnimationFrame:fn=>{frame=fn;return 1;},cancelAnimationFrame(){},setTimeout,clearTimeout});win.Motion({store:{snapshot:()=>({preferences:{enabled:true,motion:true}}),subscribe:()=>()=>{}},navigation:{}});const off=effect();const node=()=>({nodeType:1,isConnected:true,matches:()=>true,getBoundingClientRect:()=>({top:1,bottom:21,width:20,height:20}),animate:(frames,options)=>{const a={frames,options,cancelled:false,finished:new Promise(()=>{}),cancel(){this.cancelled=true;}};calls.push(a);return a;}});
 return {calls,media,doc,listeners,get observers(){return observers;},mutate:n=>mutate([{addedNodes:n}]),flush:()=>frame(),change:()=>change(),node,off};
}
test('incoming motion uses bounded stagger, does not replay the same streaming node and cancels on reduced motion',()=>{
 const h=mount();try{const nodes=Array.from({length:6},h.node);h.mutate(nodes);h.flush();assert.equal(h.calls.length,6);assert.deepEqual(h.calls.map(c=>c.options.delay),[0,16,32,48,48,48]);assert(h.calls.every(c=>c.options.duration<=250));h.mutate([nodes[0]]);assert.equal(h.calls.length,6);h.media.matches=true;h.change();assert(h.calls.every(c=>c.cancelled));}finally{h.off();}
});
test('initial reduced-motion preference creates no animation observer',()=>{const h=mount(true);assert.equal(h.observers,0);assert.equal(h.off,undefined);assert.equal(h.calls.length,0);});

test('rapid mode changes retarget from the current visual state and unload cancels only owned animations',()=>{
 const h=mount();try{
  const node=h.node();h.doc.querySelector=()=>node;
  h.listeners.get('ui-stronger-mode-change')();h.flush();assert.equal(h.calls.length,1);
  h.listeners.get('ui-stronger-mode-change')();h.flush();assert.equal(h.calls.length,2);assert.equal(h.calls[0].cancelled,true);
  assert.equal(h.calls[1].frames[0].opacity,'0.97');assert.equal(h.calls[1].frames[0].transform,'matrix(1, 0, 0, 1, 0, 1)');
  h.doc.hidden=true;h.change();assert.equal(h.calls[1].cancelled,true);
  h.listeners.get('ui-stronger-mode-change')();assert.equal(h.calls.length,2);
 }finally{h.off();}
 assert.equal(h.listeners.has('ui-stronger-mode-change'),false);
});

test('unrelated tabs and offscreen nodes remain outside entrance animation work',()=>{
 const h=mount();try{
  const node=h.node();node.getBoundingClientRect=()=>({top:900,bottom:920,width:20,height:20});h.mutate([node]);h.flush();assert.equal(h.calls.length,0);
  assert.doesNotMatch(source,/\.LOmM4q_userRow\{animation:zw-arrive/);
  assert.match(source,/tab\?\.closest\?\.\('\.an3WzG_body,\.zs-tools,\.zs-team-workspace'\)/);
 }finally{h.off();}
});

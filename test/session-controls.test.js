import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import React from 'react';
import {Workbench,wireWorkbench,validateSessionPresets} from '../lib/workbench.js';
import {Intelligence,reviewConfig} from '../lib/intelligence.js';

async function temporary(run){
 const dir=await mkdtemp(path.join(tmpdir(),'session-controls-'));
 try{await run(dir);}finally{await rm(dir,{recursive:true,force:true});}
}
function modes(){
 let current='standard',durable='standard';const events=[],calls=[];
 const session={id:'one',header:{},append(type,data){events.push({type,data});durable=data.agentPreset;}};
 const agent={session,ctx:{}},registry={
  resolve:async id=>{if(id==='missing')throw Error('missing preset');return {id,broken:id==='broken'};},
  composedPreset:()=>current,presetForSession:()=>durable,
  recompose:async(scope,id)=>{assert.equal(scope,agent.ctx);calls.push(id);current=id;}
 };
 const ctx={get:key=>({sessions:{get:id=>id==='one'?session:null},agents:{get:id=>id==='one'?agent:null},agentPresets:registry}[key])};
 return {ctx,registry,agent,session,events,calls};
}
test('current-session mode intent survives restart and applies before request construction without replacing its log',()=>temporary(async dir=>{
 const f=modes();let w=new Workbench(dir,f.ctx);await w.load();
 const status=await w.selectPreset('one','ptc');assert(status.pending);assert.equal(status.current,'standard');assert.equal(f.events.length,0);assert.equal(f.calls.length,0);
 await w.dispose();w=new Workbench(dir,f.ctx);await w.load();assert.equal(w.presetStatus('one').requested,'ptc');
 let request;wireWorkbench({...f.ctx,on:(name,fn)=>{if(name==='agent/request')request=fn;},inject(){},effect(){}},w);
 let built=false;await request({agent:f.agent},()=>{built=true;assert.equal(f.registry.composedPreset(f.agent.ctx),'ptc');assert.equal(f.events[0].data.agentPreset,'ptc');return 'same request';});
 assert(built);assert.equal(f.session.id,'one');assert(!w.presetStatus('one').pending);assert.deepEqual(f.calls,['ptc']);
 await w.applyPreset(f.agent);assert.equal(f.events.length,1);await w.dispose();
}));
test('mode validation and failed composition preserve intent and prevent model request construction',()=>temporary(async dir=>{
 const f=modes(),w=new Workbench(dir,f.ctx);await w.load();
 for(const id of ['missing','broken','bad\n'])await assert.rejects(w.selectPreset('one',id));
 assert.deepEqual(w.config.sessionPresets,{});await w.selectPreset('one','ptc');
 f.registry.recompose=async()=>{throw Error('composition failed');};let built=false,request;
 wireWorkbench({...f.ctx,on:(name,fn)=>{if(name==='agent/request')request=fn;},inject(){},effect(){}},w);
 await assert.rejects(request({agent:f.agent},()=>{built=true;}),/composition failed/);assert(!built);assert.equal(f.events.length,0);assert(w.presetStatus('one').pending);
 f.agent.session.header.origin='subagent';await assert.rejects(w.selectPreset('one','standard'),/主会话/);await w.applyPreset(f.agent);await w.dispose();
}));
test('a mode change during composition converges on the latest persisted choice and cancellation blocks execution',()=>temporary(async dir=>{
 const f=modes(),w=new Workbench(dir,f.ctx);await w.load();await w.selectPreset('one','ptc');
 const original=f.registry.recompose;let started,release;
 const ready=new Promise(resolve=>started=resolve),pause=new Promise(resolve=>release=resolve);
 f.registry.recompose=async(scope,id)=>{if(id==='ptc'){started();await pause;}await original(scope,id);};
 const applying=w.applyPreset(f.agent);await ready;await w.selectPreset('one','minimal');release();await applying;
 assert.deepEqual(f.calls,['ptc','minimal']);assert.equal(w.presetStatus('one').current,'minimal');assert(!w.presetStatus('one').pending);
 await assert.rejects(w.applyPreset(f.agent,AbortSignal.abort()));
 assert.throws(()=>validateSessionPresets({'one':'bad\u0000'}));await w.dispose();
}));
test('context browser uses the same native projection and capacity as the conversation dock',()=>{
 let pressure={projectedTokens:173000,pressureTokens:170000,contextWindow:1000000};
 const session={id:'one',snapshotEvents:()=>[],requestHeader:()=>({config:{provider:'p',model:'m'}}),requestContext:()=>({contextWindow:128000})};
 const services={sessions:{get:()=>session},tokenMeter:{measure:()=>({totalTokens:221545,baseline:{kind:'estimate'}})},sessionProjections:{snapshot:(s,keys)=>{assert.equal(s,session);assert.deepEqual(keys,['contextPressure','contextBreakdown']);return {values:{contextPressure:pressure,contextBreakdown:{systemTokens:16400,toolsTokens:628,messageTokens:204000}}};}}};
 const w=new Workbench('/unused',{get:key=>services[key]});let result=w.context('one');
 assert.equal(result.tokens,173000);assert.equal(result.capacity,1000000);assert.equal(result.basis,'projected');assert.equal(result.measurementTokens,221545);assert.equal(result.breakdown.toolsTokens,628);
 pressure={projectedTokens:0,contextWindow:1000000};assert.equal(w.context('one').tokens,0);
 pressure={pressureTokens:177000,contextWindow:1000000};assert.equal(w.context('one').tokens,177000);assert.equal(w.context('one').basis,'usage');
 delete services.sessionProjections;result=w.context('one');assert.equal(result.tokens,221545);assert.equal(result.capacity,128000);assert.equal(result.basis,'estimate');
});
test('review settings migrate legacy routing, persist independently and validate the next selected model effort',()=>temporary(async dir=>{
 const f=modes(),resolved=[];f.session.requestHeader=()=>({config:{provider:'old',model:'old'}});
 const services={...f.ctx,get:key=>key==='llm'?{resolveModelInfo:async(p,m)=>{resolved.push([p,m]);return {reasoning:{efforts:[{id:'high'}]}};}}:key==='sessionProjections'?{snapshot:()=>({values:{modelSelection:{next:{provider:'new',model:'selected'}}}})}:f.ctx.get(key)};
 let i=new Intelligence(dir,services);await i.load();
 await i.configureReview({model:null,effort:'high'},'one');assert.deepEqual(resolved,[['new','selected']]);assert.deepEqual(i.reviewRoute('one'),{provider:'old',model:'old',reasoningEffort:'high'});
 await i.configureReview({model:{provider:'review',model:'guard'},effort:'high'},'one');
 const saved=await readFile(path.join(dir,'intelligence.json'),'utf8');
 await assert.rejects(i.configureReview({model:null,effort:'unsupported'},'one'));assert.equal(await readFile(path.join(dir,'intelligence.json'),'utf8'),saved);
 i=new Intelligence(dir,services);await i.load();assert.deepEqual(i.reviewRoute('one'),{provider:'review',model:'guard',reasoningEffort:'high'});assert.equal(i.config.routingEnabled,false);
 const legacy=JSON.parse(saved);delete legacy.review;legacy.routingEnabled=true;legacy.routes.review={provider:'legacy',model:'review'};await writeFile(path.join(dir,'intelligence.json'),JSON.stringify(legacy));
 i=new Intelligence(dir,services);await i.load();assert.deepEqual(i.config.review,{model:legacy.routes.review,effort:null});
 assert.throws(()=>reviewConfig({model:null,effort:'x\n'}));assert.throws(()=>reviewConfig({model:null,effort:null,apiKey:'secret'}));
}));
async function client(react=React,extra={}){
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={cacheHitReading,CacheReading};return {name:'dsh-ui-stronger',inject:");
 const window={__ModuleLoader__:{load:b=>b.factory(id=>id==='react'?react:{})}};
 vm.runInNewContext(source,{window,setTimeout,clearTimeout,...extra});return window.qa;
}
test('cache hit percentage has one decimal, includes cache writes and preserves unknown values',async()=>{
 const {cacheHitReading}=await client();
 assert.equal(cacheHitReading({uncachedInputTokens:3,cacheReadTokens:96,cacheWriteTokens:1}),'96.0');
 assert.equal(cacheHitReading({uncachedInputTokens:0,cacheReadTokens:1,cacheWriteTokens:0}),'100.0');
 assert.equal(cacheHitReading({uncachedInputTokens:1,cacheReadTokens:0,cacheWriteTokens:0}),'0.0');
 for(const v of [null,{}, {uncachedInputTokens:0,cacheReadTokens:0,cacheWriteTokens:0},{uncachedInputTokens:-1,cacheReadTokens:2,cacheWriteTokens:0}])assert.equal(cacheHitReading(v),null);
});
test('cache adapter cleanup restores only its own nodes and leaves foreign adapter attributes intact',async()=>{
 let cleanup;const node=(tag,text)=>({tagName:tag,textContent:text,attrs:{},getAttribute(k){return this.attrs[k]??null;},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];}});
 const ratio=node('DT','ratio'),value=node('DD','97%'),hit=node('DT','命中缓存'),hitValue=node('DD','96');
 const foreign=node('DD','foreign');foreign.attrs['data-zs-cache-row']='other';
 const table={children:[ratio,value,hit,hitValue]},document={body:{},querySelector:()=>table};
 const qa=await client({...React,useEffect:fn=>{cleanup=fn();}},{document,MutationObserver:class{observe(){}disconnect(){}}});
 qa.CacheReading({root:{current:{querySelector:()=>true}},usage:{uncachedInputTokens:3,cacheReadTokens:96,cacheWriteTokens:1},t:key=>key==='message.turnUsage.cacheHit'?'ratio':key});
 assert.equal(value.textContent,'96.0%');assert.equal(hit.getAttribute('data-zs-cache-row'),'hit');cleanup();assert.equal(value.textContent,'97%');assert.equal(hit.getAttribute('data-zs-cache-row'),null);assert.equal(foreign.getAttribute('data-zs-cache-row'),'other');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import React from 'react';
import {Workbench,wireWorkbench,validateSessionPresets,inspectSession} from '../lib/workbench.js';
import {Intelligence,reviewConfig} from '../lib/intelligence.js';
import {Bots} from '../lib/bots.js';

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

test('persisted conversations can configure modes and collaboration before their agents are materialized',()=>temporary(async dir=>{
 const agents=new Map(),sessions=new Map(),headers=new Map([['one',{id:'one',cwd:'/project',agentPreset:'standard'}],['child',{id:'child',origin:'subagent',parentSession:'one'}]]);
 let releases=0,compositions=0,durable='ptc',actual='ptc';
 const registry={resolve:async id=>({id}),composedPreset:()=>actual,presetForSession:()=>durable,recompose:async(_scope,id)=>{compositions++;actual=id;}};
 const query={observeSession:async(id,{signal})=>{signal?.throwIfAborted();if(!headers.has(id))throw Object.assign(Error('not found'),{code:'SESSION_QUERY_SESSION_NOT_FOUND'});return {header:headers.get(id),projections:{values:{agentPreset:'ptc'}},get events(){throw Error('settings must not read the full event log');},[Symbol.dispose](){releases++;}};}};
 const ctx={get:key=>({agents,sessions,agentPresets:registry,sessionQuery:query,subagents:{startActivation(){throw Error('settings must not dispatch');}}}[key])};
 const w=new Workbench(dir,ctx),bots=new Bots(dir,ctx);await w.load();await bots.load();
 assert.equal((await w.readPresetStatus('one')).current,'ptc');assert.equal((await w.selectPreset('one','minimal')).pending,true);assert.equal(compositions,0);assert.equal(agents.size,0);assert.equal(sessions.size,0);
 const policy=bots.policyStatus('one',await inspectSession(ctx,'one'));assert(policy.editable);assert(policy.available);
 await bots.configurePolicy({sessionId:'one',revision:policy.revision,...policy.policy,enabled:true,maxParallel:3});assert.equal(bots.policy('one').maxParallel,3);
 await assert.rejects(w.selectPreset('child','standard'),/主会话/);await assert.rejects(bots.configurePolicy({sessionId:'child',revision:bots.state.revision,...policy.policy}),/主会话/);
 await assert.rejects(w.readPresetStatus('missing'),/实际会话/);assert(!bots.policyStatus('missing',await inspectSession(ctx,'missing')).editable);
 const events=[],session={id:'one',header:headers.get('one'),append(type,data){events.push({type,data});durable=data.agentPreset;}},agent={session,ctx:{}};sessions.set('one',session);agents.set('one',agent);
 await w.applyPreset(agent);assert.equal(actual,'minimal');assert.equal(compositions,1);assert.equal(events[0].data.agentPreset,'minimal');assert(releases>=6);
 await w.dispose();await bots.close();
}));

test('cold observation identity and corrupt reads fail closed and always release the native lease',()=>temporary(async dir=>{
 let releases=0,corrupt=false;
 const ctx={get:key=>key==='agentPresets'?{resolve:async id=>({id}),recompose(){}}:key==='sessionQuery'?{observeSession:async()=>{if(corrupt)throw Error('corrupt persisted session');return {header:{id:'another'},[Symbol.dispose](){releases++;}};}}:null};
 const w=new Workbench(dir,ctx),bots=new Bots(dir,ctx);await w.load();await bots.load();
 await assert.rejects(w.selectPreset('one','ptc'),/来源不一致/);assert.equal(releases,1);assert.deepEqual(w.config.sessionPresets,{});
 await assert.rejects(bots.configurePolicy({sessionId:'one',revision:0,enabled:true,maxParallel:2,maxTasks:8}),/来源不一致/);assert.equal(releases,2);assert.equal(bots.state.revision,0);
 corrupt=true;await assert.rejects(w.readPresetStatus('one'),/corrupt/);await assert.rejects(w.selectPreset('one','ptc'),/corrupt/);assert.deepEqual(w.config.sessionPresets,{});
 await w.dispose();await bots.close();
}));

test('cancellation after a cold observation releases its lease and prevents preference writes',()=>temporary(async dir=>{
 const controller=new AbortController();let releases=0;
 const ctx={get:key=>key==='agentPresets'?{resolve:async id=>({id}),recompose(){}}:key==='sessionQuery'?{observeSession:async()=>{controller.abort(Error('read cancelled'));return {header:{id:'one'},[Symbol.dispose](){releases++;}};}}:null};
 const w=new Workbench(dir,ctx);await w.load();await assert.rejects(w.selectPreset('one','ptc',controller.signal),/read cancelled/);assert.equal(releases,1);assert.deepEqual(w.config.sessionPresets,{});await w.dispose();
}));

test('a changed live header during preset validation cannot write a stale choice',()=>temporary(async dir=>{
 const f=modes(),w=new Workbench(dir,f.ctx);await w.load();f.registry.resolve=async id=>{f.session.header.origin='subagent';return {id};};
 await assert.rejects(w.selectPreset('one','ptc'),/会话已切换/);assert.deepEqual(w.config.sessionPresets,{});await w.dispose();
}));

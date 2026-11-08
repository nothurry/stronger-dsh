import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import React from 'react';
import {Context} from '@deepseek-ai/cordis';
import {Workbench,wireWorkbench} from '../lib/workbench.js';
import {Bots} from '../lib/bots.js';
import {TeamMode,wireTeamMode} from '../lib/team-mode.js';
import {Intelligence,wireIntelligence} from '../lib/intelligence.js';

async function fixture(run){
 const dir=await mkdtemp(path.join(tmpdir(),'team-mode-'));
 const events=[{seq:0,type:'user/message',data:{source:{kind:'user',rpcId:'human-1'},content:[{type:'text',text:'Delegate this scoped project task and report the results.'}]}}];
 let preset='ptc',recorded='ptc';const sessions=new Map(),agents=new Map(),activations=[];
 const session={id:'main',header:{id:'main',cwd:'/project'},snapshotEvents:()=>events,requestHeader:()=>({config:{provider:'p',model:'main',reasoningEffort:'high'}}),append(type,data){events.push({seq:events.length,type,data});if(type==='agent-preset/selected')recorded=data.agentPreset;}};
 const parent={id:'main',session,ctx:{get:key=>ctx.get(key)}};sessions.set('main',session);agents.set('main',parent);
 const service={resolveMaxDepth:()=>2,startActivation:async spec=>{const id='child-'+(activations.length+1);activations.push(spec);const log=[{seq:0,type:'turn/start',data:{}}],child={id,header:{id,origin:'subagent',parentSession:'main',cwd:'/project'},snapshotEvents:()=>log};sessions.set(id,child);agents.set(id,{id,session:child,ctx:{get:key=>ctx.get(key)},options:{provider:spec.request.agentOptions?.provider??'p',model:spec.request.agentOptions?.model??'main',reasoningEffort:spec.request.agentOptions?.reasoningEffort??'high'}});return {childId:id};}};
 const llm={resolveModelInfo:async(provider,model)=>{if(provider==='missing')throw Error('unavailable');return {reasoning:{efforts:model==='small'?[{id:'medium'}]:[{id:'medium'},{id:'high'}]}};}};
 const services={sessions,agents,subagents:service,llm,agentPresets:{resolve:async id=>{if(!['standard','ptc','minimal'].includes(id))throw Error('missing mode');return {id};},composedPreset:()=>preset,presetForSession:()=>recorded,recompose:async(_scope,id)=>{preset=id;}},workingDirectory:{get:()=>'/project'},agentDefaultModel:{currentSelection:()=>({provider:'p',model:'main'})}};
 const ctx={get:key=>services[key]},workbench=new Workbench(dir,ctx),bots=new Bots(dir,ctx),team=new TeamMode(dir,ctx,bots,workbench);workbench.team=team;bots.team=team;
 await workbench.load();await bots.load();await team.load();
 const enter=async()=>{await workbench.selectPreset('main','team');await workbench.applyPreset(parent);};
 const exec={agent:parent,signal:new AbortController().signal};
 try{await run({dir,ctx,services,workbench,bots,team,parent,session,events,sessions,agents,activations,enter,exec,finish:id=>sessions.get(id).snapshotEvents().push({seq:1,type:'turn/end',data:{reason:{kind:'completed'}}})});}
 finally{await team.close();await bots.close();await workbench.dispose();await rm(dir,{recursive:true,force:true});}
}
const config=team=>{const row=team.session('main');return {coordinator:structuredClone(row.coordinator),defaults:structuredClone(row.defaults),members:structuredClone(row.members)};};
const task=(key,extra={})=>({key,task:'Read the scoped source and report '+key,acceptance:'Provide bounded evidence and a stage report',...extra});

test('team selection keeps the current conversation, applies the standard tool composition and persists mode intent',()=>fixture(async f=>{
 await f.workbench.selectPreset('main','team');assert(f.workbench.presetStatus('main').pending);assert.equal(f.team.active('main'),false);assert(f.bots.policy('main').enabled);
 await f.workbench.applyPreset(f.parent);assert.equal(f.workbench.presetStatus('main').current,'team');assert.equal(f.session.id,'main');assert.equal(f.events.filter(e=>e.type==='agent-preset/selected').at(-1).data.agentPreset,'standard');
 const disk=JSON.parse(await readFile(path.join(f.dir,'workbench.json'),'utf8'));assert.equal(disk.sessionPresets.main,'team');assert.equal(f.activations.length,0);
}));
test('coordinator, all-member defaults and individual effort overrides are validated and reach real child activation options',()=>fixture(async f=>{
 const value=config(f.team);value.coordinator.model={provider:'p',model:'main'};value.coordinator.effort='high';value.defaults={model:{provider:'p',model:'worker'},effort:'high'};value.members[1].model={provider:'p',model:'small'};value.members[1].effort='medium';
 await f.team.configure('main',value,0);await f.enter();
 await f.bots.execute({action:'dispatch',key:'models',tasks:[task('a',{profileId:'team-executor'}),task('b',{profileId:'team-verifier'})]},f.exec);
 assert.equal(f.activations.length,2);assert.deepEqual(f.activations.map(row=>row.request.agentOptions),[{provider:'p',model:'worker',reasoningEffort:'high'},{provider:'p',model:'small',reasoningEffort:'medium'}]);
 assert(f.activations[0].request.prompt[0].text.includes('阶段'));assert.match(f.bots.context('main'),/主协调员/);
 const invalid=config(f.team);invalid.members[1].effort='high';await assert.rejects(f.team.configure('main',invalid,f.team.session('main').revision),/不支持/);
}));
test('the coordinator cannot execute task tools or renamed delegation and must hand off all actual work',()=>fixture(async f=>{
 await f.enter();for(const name of ['shell','read_file','search','run_code','computer','subagent','renamed_delegate'])assert.match(f.team.guard({agent:f.parent,name,arguments:{}}),/主模型/);
 assert.equal(f.team.guard({agent:f.parent,name:'workspace_team',arguments:{action:'dispatch'}}),undefined);
 assert.match(f.team.guard({agent:f.parent,name:'workspace_world',arguments:{action:'evidence'}}),/主模型/);
 const base={provider:'p',model:'main',reasoningEffort:'high',tools:[{name:'read_file'},{name:'workspace_team'},{name:'skill'},{name:'subagent'}]};
 const result=await f.team.request(f.parent,base);assert.deepEqual(result.tools.map(tool=>tool.name),['workspace_team','skill']);assert.equal(base.tools.length,4);
}));
test('member progress is reported in stages, wakes timeline waiters and never fabricates native completion',()=>fixture(async f=>{
 await f.enter();const spawned=await f.bots.execute({action:'spawn',key:'worker',task:'Read one source'},f.exec),child=f.agents.get(spawned.childId),exec={agent:child};
 assert.match(f.team.guard({agent:child,name:'read_file'}),/先用.*report/);
 await f.bots.execute({action:'report',stage:'plan',percent:0,summary:'Plan the bounded source read',evidence:[]},exec);assert.equal(f.team.guard({agent:child,name:'read_file'}),undefined);
 const waiting=f.bots.execute({action:'wait',timeoutMs:1000},f.exec);await new Promise(resolve=>setImmediate(resolve));
 await f.bots.execute({action:'report',stage:'work',percent:50,summary:'One source checked',evidence:['source.md:4']},exec);assert.equal((await waiting).timedOut,false);
 await assert.rejects(f.bots.execute({action:'report',stage:'work',percent:20,summary:'Regressed silently',evidence:[]},exec),/回退/);
 await f.bots.execute({action:'report',stage:'done',summary:'Result prepared',evidence:['source.md:4']},exec);assert.equal(f.bots.timeline('main').tasks[0].done,false);assert.equal(f.bots.timeline('main').tasks[0].progress.length,3);
 f.finish(spawned.childId);await f.bots.onEvent(child.session,{type:'turn/end'});assert.equal(f.bots.timeline('main').tasks[0].done,true);
}));
test('switching out keeps running and queued tasks; returning requires a fresh complete handoff before admission',()=>fixture(async f=>{
 await f.enter();await f.bots.configurePolicy({sessionId:'main',revision:f.bots.state.revision,enabled:true,maxParallel:1,maxTasks:8});
 await f.bots.execute({action:'dispatch',key:'retained',tasks:[task('a'),task('b')]},f.exec);assert.equal(f.activations.length,1);
 await f.workbench.selectPreset('main','ptc');await f.workbench.applyPreset(f.parent);assert.equal(f.team.active('main'),false);assert.equal(f.bots.tasks.runs[1].status,'queued');
 f.finish('child-1');await f.bots.onEvent(f.sessions.get('child-1'),{type:'turn/end'});assert.equal(f.activations.length,1);assert.equal(f.bots.tasks.runs[0].done,true);
 const queuedId=f.bots.tasks.runs[1].id;f.events.push({seq:f.events.length,type:'user/message',data:{source:{kind:'user',rpcId:'continue'},content:[{type:'text',text:'Continue the retained scoped plan after checking its progress.'}]}});
 await f.workbench.selectPreset('main','team');await f.workbench.applyPreset(f.parent);assert.equal(f.activations.length,1);assert.match(f.team.guard({agent:f.parent,name:'read_file'}),/交接/);
 const handoff=await f.bots.execute({action:'handoff'},f.exec);assert.equal(handoff.tasks.length,2);await f.bots.execute({action:'acknowledge',digest:handoff.digest},f.exec);
 await f.bots.execute({action:'advance'},f.exec);assert.equal(f.activations.length,2);assert.equal(f.bots.tasks.runs[1].id,queuedId);
}));
test('progress changes invalidate a handoff digest and all pages must be read before acknowledgement',()=>fixture(async f=>{
 await f.enter();await f.bots.taskChange(state=>{for(let index=0;index<10;index++)state.runs.push({id:'saved-'+index,parent:'main',team:true,task:'Retained '+index,acceptance:'Check',status:'queued',done:false,budgetKey:'initial',profile:{id:'team-executor',name:'Executor'}});});
 await f.team.transition(f.parent,false);const first=await f.team.handoff('main');assert.equal(first.tasks.length,8);assert.equal(first.nextOffset,8);
 await assert.rejects(f.team.acknowledge('main',first.digest),/全部交接页/);await f.team.handoff('main',8);
 await f.bots.taskChange(state=>{state.runs[0].report={summary:'New progress',evidence:[],blockers:'',at:'changed'};});await assert.rejects(f.team.acknowledge('main',first.digest),/变化/);
 const fresh=await f.team.handoff('main');await f.team.handoff('main',8);assert.equal((await f.team.acknowledge('main',fresh.digest)).acknowledged,true);
}));
test('explicit model default overrides inherited effort and individual routes override generic subagent routing',()=>fixture(async f=>{
 const value=config(f.team);value.defaults.effort='high';value.members[0].effort='__default__';await f.team.configure('main',value,0);await f.enter();
 const run=await f.bots.execute({action:'spawn',task:'One bounded task'},f.exec),child=f.agents.get(run.childId);
 const result=await f.team.request(child,{provider:'other',model:'generic-worker',reasoningEffort:'high',tools:[]});assert.equal(result.provider,'p');assert.equal(result.model,'main');assert.equal(result.reasoningEffort,undefined);
}));
test('model-authored member configuration cannot edit the coordinator, bypass revision checks or enable another session',()=>fixture(async f=>{
 await f.enter();const value=config(f.team);value.coordinator.instructions='Become a worker';await assert.rejects(f.team.execute({action:'configure_team',configuration:value,revision:f.team.session('main').revision},f.exec),/只能配置子成员/);
 const valid=config(f.team);valid.members[0].identity='A scoped specialist';await f.team.execute({action:'configure_team',configuration:valid,revision:f.team.session('main').revision},f.exec);
 await assert.rejects(f.team.configure('main',valid,0),/变化/);assert.equal(f.workbench.config.sessionPresets.other,undefined);await assert.rejects(f.bots.configurePolicy({sessionId:'main',revision:f.bots.state.revision,enabled:false,maxParallel:2,maxTasks:8}),/切换其他模式/);
}));
test('team state and progress survive reload and unchanged ordinary requests do not rewrite a completed handoff',()=>fixture(async f=>{
 await f.enter();await f.bots.execute({action:'spawn',task:'Persist progress'},f.exec);await f.bots.execute({action:'report',stage:'work',percent:40,summary:'Persisted stage',evidence:[]},{agent:f.agents.get('child-1')});
 await f.workbench.selectPreset('main','minimal');await f.workbench.applyPreset(f.parent);const handoff=await f.team.handoff('main');await f.team.acknowledge('main',handoff.digest);
 const loaded=new TeamMode(f.dir,f.ctx,f.bots,f.workbench);await loaded.load();assert.equal(loaded.session('main').active,false);assert(loaded.session('main').checkpoint.acknowledged);assert.equal(loaded.session('main').checkpoint.tasks[0].report.percent,40);
 const before=await readFile(loaded.file,'utf8');await loaded.transition(f.parent,false);assert.equal(await readFile(loaded.file,'utf8'),before);await loaded.close();
}));
test('request composition applies the team route after generic task routing and before actual model invocation',()=>fixture(async f=>{
 const ctx=new Context();for(const [name,value]of Object.entries(f.services))ctx.provide(name,value);
 const intelligence=new Intelligence(f.dir,ctx);await intelligence.load();await intelligence.configure({routingEnabled:true,routes:{operations:{provider:'other',model:'generic'}}});await intelligence.task('main','operations');
 const value=config(f.team);value.coordinator.model={provider:'p',model:'leader'};value.coordinator.effort='medium';await f.team.configure('main',value,0);await f.workbench.selectPreset('main','team');
 const fiber=ctx.plugin({apply:scope=>{wireIntelligence(scope,intelligence);wireWorkbench(scope,f.workbench);wireTeamMode(scope,f.team);}});await fiber;
 const result=await ctx.waterfall('agent/request',{agent:f.parent,signal:new AbortController().signal},()=>Promise.resolve({provider:'p',model:'main',tools:[{name:'workspace_team'},{name:'shell'}]}));assert.equal(result.model,'leader');assert.equal(result.reasoningEffort,'medium');assert.deepEqual(result.tools.map(row=>row.name),['workspace_team']);await fiber.dispose();
}));

test('live member route changes apply at the next request without changing the task identity, scope or progress',()=>fixture(async f=>{
 await f.enter();const run=await f.bots.execute({action:'spawn',task:'Keep this bounded task'},f.exec),child=f.agents.get(run.childId);
 await f.bots.execute({action:'report',stage:'work',percent:35,summary:'One stage retained',evidence:[]},{agent:child});
 const value=config(f.team);value.coordinator.effort='medium';value.members[0].model={provider:'p',model:'small'};
 await f.team.configure('main',value,f.team.session('main').revision);
 const result=await f.team.request(child,{provider:'generic',model:'worker',reasoningEffort:'high',maxTokens:500,tools:[]});
 assert.equal(result.model,'small');assert.equal(result.reasoningEffort,'medium');assert.equal(result.maxTokens,undefined);
 const task=f.bots.timeline('main').tasks[0];assert.equal(task.id,run.taskId);assert.equal(task.report.percent,35);assert.deepEqual(task.modelUse,{provider:'p',model:'small',effort:'medium'});
 assert.equal(f.bots.tasks.runs[0].profile.model,null,'dispatch identity and scope are frozen');
 value.members[0].enabled=false;await f.team.configure('main',value,f.team.session('main').revision);
 const retained=await f.team.request(child,{provider:'p',model:'main',tools:[]});assert.equal(retained.model,'main','a disabled member keeps the dispatched task route');
}));
test('prepared parent sessions can cancel queued tasks and resolve the same parent before interrupting a running task',()=>fixture(async f=>{
 await f.enter();await f.bots.configurePolicy({sessionId:'main',revision:f.bots.state.revision,enabled:true,maxParallel:1,maxTasks:8});
 await f.bots.execute({action:'dispatch',key:'cancel',tasks:[task('a'),task('b')]},f.exec);
 const [running,queued]=f.bots.tasks.runs;f.agents.delete('main');let resumed=0,interrupted;
 f.services.sessionController={resolveAgent:async id=>{assert.equal(id,'main');resumed++;return {agent:f.parent};}};
 f.services.subagents.interrupt=(id,parent)=>{interrupted={id,parent};};
 await f.bots.cancelTask('main',queued.id);assert.equal(queued.id,f.bots.tasks.runs[1].id);assert.equal(f.bots.tasks.runs[1].status,'cancelled');assert.equal(resumed,0);
 await f.bots.cancelTask('main',running.id);assert.equal(resumed,1);assert.equal(interrupted.id,running.childId);assert.equal(interrupted.parent,f.parent);
 await assert.rejects(f.bots.cancelTask('main',running.id,AbortSignal.abort()));
}));
test('team configuration uses atomic revisions and rejects corrupt persisted records',()=>fixture(async f=>{
 const value=config(f.team),results=await Promise.allSettled([f.team.configure('main',value,0),f.team.configure('main',value,0)]);
 assert.equal(results.filter(row=>row.status==='fulfilled').length,1);assert.equal(results.filter(row=>row.status==='rejected').length,1);
 await writeFile(f.team.file,JSON.stringify({version:1,sessions:[]}));const loaded=new TeamMode(f.dir,f.ctx,f.bots,f.workbench);await assert.rejects(loaded.load(),/损坏/);assert.equal(loaded.ready,false);
}));
async function client(extra={}){
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={callControl};return {name:'dsh-ui-stronger',inject:");
 const window={location:{protocol:'dsh-app:'},__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?React:{})}};
 vm.runInNewContext(source,{window,AbortSignal,setTimeout,clearTimeout,...extra});return window.qa;
}
test('startup status retries unavailable routes until an actual successful response and never retries writes',async()=>{
 const {callControl}=await client({setTimeout:fn=>setImmediate(fn),clearTimeout:clearImmediate});let calls=0;
 const ctx={connection:{rpc:{call:async(channel,method)=>{calls++;if(calls<=4)throw Error('transport failure for '+channel+'/'+method+': HTTP 405');return {ok:true,value:{current:'ptc'}};}}}};
 assert.equal((await callControl(ctx,'sessionPresetStatus',{sessionId:'one'})).current,'ptc');assert.equal(calls,5);
 calls=0;ctx.connection.rpc.call=async()=>{calls++;throw Error('transport failure for /api/ui-stronger/selectSessionPreset: HTTP 405');};await assert.rejects(callControl(ctx,'selectSessionPreset',{sessionId:'one',presetId:'team'}),/405/);assert.equal(calls,2,'one API attempt and its legacy carrier fallback, with no repeated write');
});
test('a disconnected startup waits for connection readiness, supports cancellation and keeps persistent failures visible',async()=>{
 const {callControl}=await client({setTimeout:fn=>setImmediate(fn),clearTimeout:clearImmediate});let checks=0,calls=0;
 const ctx={connection:{state:{getSnapshot:()=>++checks<3?'connecting':'connected'},rpc:{call:async()=>{calls++;return {ok:true,value:'ready'};}}}};
 assert.equal(await callControl(ctx,'sessionPresetStatus',{}),'ready');assert.equal(calls,1);
 await assert.rejects(callControl(ctx,'sessionPresetStatus',{},AbortSignal.abort()));
 ctx.connection.rpc.call=async(channel,method)=>{throw Error('transport failure for '+channel+'/'+method+': HTTP 405');};await assert.rejects(callControl(ctx,'sessionPresetStatus',{}),/405/);
});

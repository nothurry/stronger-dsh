import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,writeFile,mkdir} from 'node:fs/promises';
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
 service.sendMessage=async(parent,id,prompt)=>{const log=sessions.get(id).snapshotEvents();log.push({seq:log.length,type:'turn/start',data:{}});activations.push({reused:true,request:{parent,prompt}});return 'message-'+activations.length;};
 const llm={resolveModelInfo:async(provider,model)=>{if(provider==='missing')throw Error('unavailable');return {reasoning:{efforts:model==='small'?[{id:'medium'}]:[{id:'medium'},{id:'high'}]}};}};
 const services={sessions,agents,subagents:service,llm,agentPresets:{resolve:async id=>{if(!['standard','ptc','minimal'].includes(id))throw Error('missing mode');return {id};},composedPreset:()=>preset,presetForSession:()=>recorded,recompose:async(_scope,id)=>{preset=id;}},workingDirectory:{get:()=>'/project'},agentDefaultModel:{currentSelection:()=>({provider:'p',model:'main'})}};
 const ctx={get:key=>services[key]},workbench=new Workbench(dir,ctx),bots=new Bots(dir,ctx),team=new TeamMode(dir,ctx,bots,workbench);workbench.team=team;bots.team=team;
 await workbench.load();await bots.load();await team.load();
 team.state.sessions.main={...team.session('main'),members:[{id:'team-executor',name:'执行子智能体',identity:'负责范围内执行',duties:'报告计划、证据与阶段进度',model:null,effort:null,enabled:true},{id:'team-verifier',name:'核验子智能体',identity:'独立核验结果',duties:'核对证据并报告结果',model:null,effort:null,enabled:true}]};
 const enter=async()=>{await workbench.selectPreset('main','team');await workbench.applyPreset(parent);};
 const exec={agent:parent,signal:new AbortController().signal};
 try{await run({dir,ctx,services,workbench,bots,team,parent,session,events,sessions,agents,activations,enter,exec,finish:id=>sessions.get(id).snapshotEvents().push({seq:sessions.get(id).snapshotEvents().length,type:'turn/end',data:{reason:{kind:'completed'}}})});}
 finally{await team.close();await bots.close();await workbench.dispose();await rm(dir,{recursive:true,force:true});}
}
const config=team=>{const row=team.session('main');return {coordinator:structuredClone(row.coordinator),defaults:structuredClone(row.defaults),members:structuredClone(row.members)};};
const task=(key,extra={})=>({key,profileId:'team-executor',task:'Read the scoped source and report '+key,acceptance:'Provide bounded evidence and a stage report',...extra});

test('failed durable task replacement retains committed state and the write queue recovers',()=>fixture(async f=>{
 const file=f.bots.taskFile,blocked=path.join(f.dir,'blocked-target');
 await mkdir(blocked);await writeFile(path.join(blocked,'keep'),'original');
 const before=JSON.stringify(f.bots.tasks);f.bots.taskFile=blocked;
 await assert.rejects(f.bots.taskChange(state=>{state.messages.push({id:'failed-change'});}));
 assert.equal(JSON.stringify(f.bots.tasks),before);assert.equal(await readFile(path.join(blocked,'keep'),'utf8'),'original');
 f.bots.taskFile=file;
 await f.bots.taskChange(state=>{state.messages.push({id:'committed-change',from:'main',to:'child',text:'Commit after recovery'});});
 assert.equal(f.bots.tasks.messages[0].id,'committed-change');
 assert.equal(JSON.parse(await readFile(file,'utf8')).messages[0].id,'committed-change');
}));

test('new teams have no implicit subagents and the user roster determines capacity',()=>fixture(async f=>{
 assert.equal(f.team.session('fresh').members.length,0);
 const value=config(f.team);value.members=Array.from({length:8},(_,index)=>({...value.members[0],id:'user-'+index,name:'User child '+index}));
 await f.team.configure('main',value,0);await f.enter();
 assert.equal(f.team.profiles('main').length,8);assert.equal(f.bots.policy('main').maxParallel,8);
 await f.bots.configurePolicy({sessionId:'main',revision:f.bots.state.revision,enabled:true,maxParallel:1,maxTasks:8});
 assert.equal(f.bots.policy('main').maxParallel,8);assert.equal(f.bots.view().policies.main.maxParallel,8);
 const before=JSON.stringify(f.team.state);const changed=config(f.team);changed.members[0].name='Updated specialist';
 await f.bots.execute({action:'configure_team',configuration:changed,revision:f.team.session('main').revision},f.exec);
 assert.notEqual(JSON.stringify(f.team.state),before);
}));

test('team tasks require an explicit member and acceptance before any native activation',()=>fixture(async f=>{
 await f.enter();
 await assert.rejects(f.bots.execute({action:'spawn',task:'Do something'},f.exec),/profileId/);
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Do something',acceptance:''},f.exec),/验收/);
 assert.equal(f.activations.length,0);
}));

test('five assignments reuse two independent members and preserve completed task boundaries',()=>fixture(async f=>{
 await f.enter();
 await f.bots.execute({action:'dispatch',key:'five',tasks:Array.from({length:5},(_,i)=>task('step-'+i,{profileId:i%2?'team-verifier':'team-executor'}))},f.exec);
 assert.equal(f.activations.length,2);assert.equal(f.bots.timeline('main').summary.running,2);
 for(let i=0;i<5;i++){
  const current=f.bots.tasks.runs.find(row=>!row.done&&row.childId&&row.status!=='queued');
  assert(current);const log=f.sessions.get(current.childId).snapshotEvents();log.push({seq:log.length,type:'assistant/message',data:{content:[{type:'text',text:'Result for '+current.key}]}});
  f.finish(current.childId);await f.bots.onEvent(f.sessions.get(current.childId),{type:'turn/end'});
  assert(f.bots.timeline('main').summary.running<=2);
 }
 assert.equal(f.activations.filter(call=>!call.reused).length,2);
 assert.equal(new Set(f.bots.tasks.runs.map(row=>row.childId)).size,2);
 assert.equal(f.bots.tasks.runs[0].result,'Result for step-0');assert.equal(f.bots.tasks.runs[4].result,'Result for step-4');
 assert.equal(f.bots.timeline('main').summary.running,0);
}));

test('member memories persist separately and a child cannot read or edit another member',()=>fixture(async f=>{
 await f.enter();await f.team.editMemory('main','team-executor',{operation:'remember',key:'fact',content:'Executor fact'});
 await f.team.editMemory('main','team-verifier',{operation:'remember',key:'fact',content:'Verifier fact'});
 const run=await f.bots.execute({action:'spawn',profileId:'team-executor',acceptance:'Check',task:'Read own facts'},f.exec);
 assert.match(f.activations[0].request.prompt[0].text,/Executor fact/);assert.doesNotMatch(f.activations[0].request.prompt[0].text,/Verifier fact/);
 const execution={agent:f.agents.get(run.childId)};
 const frozen=f.team.snapshotFor(run.childId);
 assert.equal((await f.bots.execute({action:'member_memory',operation:'list'},execution)).memories[0].content,'Executor fact');
 await assert.rejects(f.bots.execute({action:'member_memory',operation:'list',profileId:'team-verifier'},execution),/自己的/);
 await f.bots.execute({action:'member_memory',operation:'remember',key:'learned',content:'A verified lesson'},execution);
 assert.deepEqual(f.team.snapshotFor(run.childId),frozen,'new member facts must not invalidate the frozen system prefix');
 const loaded=new TeamMode(f.dir,f.ctx,f.bots,f.workbench);await loaded.load();assert.equal(loaded.memory('main','team-executor').length,2);assert.equal(loaded.memory('main','team-verifier').length,1);await loaded.close();
 await f.team.editMemory('main','team-executor',{operation:'forget',key:'fact'});assert.equal(f.team.memory('main','team-verifier').length,1);
}));

test('an unknown initial activation occupies its slot until its native result can be reconciled',()=>fixture(async f=>{
 await f.enter();await f.bots.configurePolicy({sessionId:'main',revision:f.bots.state.revision,enabled:true,maxParallel:1,maxTasks:8});
 f.services.subagents.startActivation=async()=>{throw Error('Transport closed after admission');};
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'First',acceptance:'Check'},f.exec),/Transport/);
 assert.equal(f.bots.tasks.runs[0].status,'delivery-unknown');assert.equal(f.bots.tasks.runs[0].done,false);
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Second',acceptance:'Check'},f.exec),/未完成|上限/);
 const reserved=f.bots.tasks.runs[0].childId;assert.match(reserved,/^[0-9a-f-]{36}$/);
 let interrupted;f.services.subagents.interrupt=id=>{interrupted=id;};
 await f.bots.cancelTask('main',f.bots.tasks.runs[0].id);assert.equal(interrupted,reserved);
}));

test('removing a busy member interrupts its active work and cancels its queue',()=>fixture(async f=>{
 const value=config(f.team);value.members.push({...value.members[0],id:'third',name:'Third'});await f.team.configure('main',value,0);await f.enter();
 assert.equal(f.bots.policy('main').maxParallel,3);assert.equal(f.team.profiles('main').length,3);
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'unknown',task:'Work',acceptance:'Check'},f.exec),/不存在/);
 await f.bots.execute({action:'spawn',profileId:'team-executor',task:'Work',acceptance:'Check'},f.exec);
 const changed=config(f.team);changed.members=changed.members.filter(row=>row.id!=='team-executor');
 let interrupted;f.services.subagents.interrupt=id=>{interrupted=id;f.finish(id);};
 await f.team.configure('main',changed,f.team.session('main').revision);assert.equal(interrupted,'child-1');assert.equal(f.bots.tasks.runs[0].status,'cancelled');
 assert(!f.team.session('main').members.some(row=>row.id==='team-executor'));
}));

test('an old unknown delivery reconnects to exactly one native child without coordinator acknowledgement',()=>fixture(async f=>{
 await f.enter();f.services.subagents.startActivation=async()=>{throw Error('Lost transport');};
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Recover one task',acceptance:'Check'},f.exec));
 const row=f.bots.tasks.runs[0];await f.bots.taskChange(state=>{delete state.runs[0].childId;});
 f.sessions.set('native-existing',{id:'native-existing',header:{parentSession:'main',cwd:'/project'},snapshotEvents:()=>[{seq:0,type:'turn/start'},{seq:1,type:'turn/end',data:{reason:{kind:'completed'}}}]});
 f.services.subagents.listChildren=async id=>{assert.equal(id,'main');return [{id:'native-existing',mode:'continuable',label:row.profile.name,createdAt:Date.parse(row.createdAt)}];};
 const timeline=await f.bots.refreshTimeline('main');assert.equal(timeline.tasks[0].childId,'native-existing');assert.equal(timeline.tasks[0].done,true);
}));

test('a restored never-created child releases its stale slot and starts the already queued member message',()=>fixture(async f=>{
 await f.enter();const activate=f.services.subagents.startActivation;
 f.services.subagents.startActivation=async()=>{throw Error('Legacy activation failed');};
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Old request',acceptance:'Check'},f.exec));
 await f.bots.taskChange(state=>{delete state.runs[0].childId;});
 await f.team.sendMember('main','team-executor','Independent user message','direct-message');
 assert.equal(f.bots.tasks.runs.at(-1).status,'queued');
 await f.bots.loadTasks();f.services.subagents.listChildren=async()=>[];f.services.subagents.startActivation=activate;
 const value=await f.bots.refreshTimeline('main');
 assert.equal(value.tasks[0].status,'dispatch-failed');assert.equal(value.tasks[0].dispatchError,'Error');assert.match(f.bots.tasks.runs[0].dispatchFailure,/Legacy activation failed/);
 assert.equal(value.tasks[0].done,true);assert.equal(f.activations.length,1);assert.equal(value.tasks.at(-1).childId,'child-1');
}));

test('an empty catalog cannot release a delivery failure from the current runtime',()=>fixture(async f=>{
 await f.enter();f.services.subagents.startActivation=async()=>{throw Error('Current transport failure');};
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Current request',acceptance:'Check'},f.exec));
 await f.bots.taskChange(state=>{delete state.runs[0].childId;});f.services.subagents.listChildren=async()=>[];
 const value=await f.bots.refreshTimeline('main');assert.equal(value.tasks[0].status,'delivery-unknown');assert.equal(value.tasks[0].done,false);
}));

test('failed catalog reads retain restored uncertain tasks',()=>fixture(async f=>{
 await f.enter();f.services.subagents.startActivation=async()=>{throw Error('Old transport failure');};
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Old request',acceptance:'Check'},f.exec));
 await f.bots.taskChange(state=>{delete state.runs[0].childId;});await f.bots.loadTasks();
 f.services.subagents.listChildren=async()=>{throw Error('Native catalog unavailable');};
 const value=await f.bots.refreshTimeline('main');assert.equal(value.tasks[0].status,'delivery-unknown');assert.equal(value.tasks[0].done,false);
}));

test('ambiguous native children are never guessed or replaced',()=>fixture(async f=>{
 await f.enter();f.services.subagents.startActivation=async()=>{throw Error('Old transport failure');};
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Old request',acceptance:'Check'},f.exec));
 await f.bots.taskChange(state=>{delete state.runs[0].childId;});await f.bots.loadTasks();const row=f.bots.tasks.runs[0];
 f.services.subagents.listChildren=async()=>['one','two'].map(id=>({id,label:row.profile.name,createdAt:Date.parse(row.createdAt),mode:'continuable'}));
 const value=await f.bots.refreshTimeline('main');assert.equal(value.tasks[0].childId,null);assert.equal(value.tasks[0].done,false);assert.equal(f.activations.length,0);
}));

test('ambiguous continuation reserves the member and never creates a replacement',()=>fixture(async f=>{
 await f.enter();const one=await f.bots.execute({action:'spawn',profileId:'team-executor',task:'First',acceptance:'Check'},f.exec);
 f.finish(one.childId);await f.bots.onEvent(f.sessions.get(one.childId),{type:'turn/end'});
 f.services.subagents.sendMessage=async()=>{throw Error('Unknown delivery');};
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Second',acceptance:'Check'},f.exec),/Unknown/);
 assert.equal(f.bots.tasks.runs.at(-1).status,'delivery-unknown');assert.equal(f.bots.tasks.runs.at(-1).done,false);
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Retry blindly',acceptance:'Check'},f.exec),/未完成/);
 assert.equal(f.activations.length,1);
}));

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
test('the coordinator retains task tools while coordination remains its instruction',()=>fixture(async f=>{
 await f.enter();for(const name of ['shell','read_file','search','run_code','computer','subagent','renamed_delegate'])assert.equal(f.team.guard({agent:f.parent,name,arguments:{}}),undefined);
 assert.equal(f.team.guard({agent:f.parent,name:'workspace_team',arguments:{action:'dispatch'}}),undefined);
 assert.equal(f.team.guard({agent:f.parent,name:'workspace_world',arguments:{action:'evidence'}}),undefined);
 const base={provider:'p',model:'main',reasoningEffort:'high',tools:[{name:'read_file'},{name:'workspace_team'},{name:'skill'},{name:'subagent'}]};
 const result=await f.team.request(f.parent,base);assert.deepEqual(result.tools,base.tools);assert.equal(base.tools.length,4);
}));
test('member progress is reported in stages, wakes timeline waiters and never fabricates native completion',()=>fixture(async f=>{
 await f.enter();const spawned=await f.bots.execute({action:'spawn',profileId:'team-executor',acceptance:'Verify actual evidence',key:'worker',task:'Read one source'},f.exec),child=f.agents.get(spawned.childId),exec={agent:child};
 assert.match(f.team.guard({agent:child,name:'read_file'}),/先用.*report/);
 await f.bots.execute({action:'report',stage:'plan',percent:0,summary:'Plan the bounded source read',evidence:[]},exec);assert.equal(f.team.guard({agent:child,name:'read_file'}),undefined);
 const waiting=f.bots.execute({action:'wait',timeoutMs:1000},f.exec);await new Promise(resolve=>setImmediate(resolve));
 await f.bots.execute({action:'report',stage:'work',percent:50,summary:'One source checked',evidence:['source.md:4']},exec);assert.equal((await waiting).timedOut,false);
 await assert.rejects(f.bots.execute({action:'report',stage:'work',percent:20,summary:'Regressed silently',evidence:[]},exec),/回退/);
 await f.bots.execute({action:'report',stage:'done',summary:'Result prepared',evidence:['source.md:4']},exec);assert.equal(f.bots.timeline('main').tasks[0].done,false);assert.equal(f.bots.timeline('main').tasks[0].progress.length,3);
 f.finish(spawned.childId);await f.bots.onEvent(child.session,{type:'turn/end'});assert.equal(f.bots.timeline('main').tasks[0].done,true);
}));
test('switching out preserves progress and returning admits existing tasks without a handoff confirmation',()=>fixture(async f=>{
 await f.enter();await f.bots.configurePolicy({sessionId:'main',revision:f.bots.state.revision,enabled:true,maxParallel:1,maxTasks:8});
 await f.bots.execute({action:'dispatch',key:'retained',tasks:[task('a'),task('b')]},f.exec);assert.equal(f.activations.length,1);
 await f.workbench.selectPreset('main','ptc');await f.workbench.applyPreset(f.parent);assert.equal(f.team.active('main'),true);
 f.events.push({seq:f.events.length,type:'user/message',data:{source:{kind:'user',rpcId:'switch-ordinary'},content:[{type:'text',text:'Continue in the selected ordinary mode.'}]}});
 await f.workbench.applyPreset(f.parent);assert.equal(f.team.active('main'),false);assert.equal(f.bots.tasks.runs[1].status,'queued');
 f.finish('child-1');await f.bots.onEvent(f.sessions.get('child-1'),{type:'turn/end'});assert.equal(f.activations.length,1);assert.equal(f.bots.tasks.runs[0].done,true);
 const queuedId=f.bots.tasks.runs[1].id;f.events.push({seq:f.events.length,type:'user/message',data:{source:{kind:'user',rpcId:'continue'},content:[{type:'text',text:'Continue the retained scoped plan after checking its progress.'}]}});
 await f.workbench.selectPreset('main','team');
 f.events.push({seq:f.events.length,type:'user/message',data:{source:{kind:'user',rpcId:'switch-team'},content:[{type:'text',text:'Continue using the selected team mode.'}]}});
 await f.workbench.applyPreset(f.parent);assert.equal(f.activations.length,1);assert.equal(f.team.admission('main'),true);
 assert.equal(f.team.guard({agent:f.parent,name:'workspace_team',arguments:{action:'advance'}}),undefined);
 const handoff=await f.bots.execute({action:'handoff'},f.exec);assert.equal(handoff.tasks.length,2);assert.equal(handoff.required,false);
 await f.bots.execute({action:'advance'},f.exec);assert.equal(f.activations.length,2);assert.equal(f.bots.tasks.runs[1].id,queuedId);
}));

test('a saved unacknowledged checkpoint cannot block direct member messages or ordinary tools',()=>fixture(async f=>{
 await f.enter();
 await f.team.change('main',record=>{record.checkpoint={...f.team.capture('main'),acknowledged:false};});
 assert.equal(f.team.admission('main'),true);
 const result=await f.team.sendMember('main','team-executor','Read one scoped source','manual-no-handoff');
 assert(result);assert.equal(f.activations.length,1);
 await f.team.transition(f.parent,false);
 await f.team.change('main',record=>{record.checkpoint.acknowledged=false;});
 assert.equal(f.team.guard({agent:f.parent,name:'read_file'}),undefined);
 assert.equal((await f.bots.execute({action:'catalog'},f.exec)).handoffRequired,false);
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
 const run=await f.bots.execute({action:'spawn',profileId:'team-executor',acceptance:'Verify actual evidence',task:'One bounded task'},f.exec),child=f.agents.get(run.childId);
 const result=await f.team.request(child,{provider:'other',model:'generic-worker',reasoningEffort:'high',tools:[]});assert.equal(result.provider,'p');assert.equal(result.model,'main');assert.equal(result.reasoningEffort,undefined);
}));
test('model-authored member configuration cannot edit the coordinator, bypass revision checks or enable another session',()=>fixture(async f=>{
 await f.enter();const value=config(f.team);value.coordinator.instructions='Become a worker';await assert.rejects(f.team.execute({action:'configure_team',configuration:value,revision:f.team.session('main').revision},f.exec),/主模型只能配置子智能体/);
 const valid=config(f.team);valid.members[0].identity='A scoped specialist';await f.team.execute({action:'configure_team',configuration:valid,revision:f.team.session('main').revision},f.exec);
 await assert.rejects(f.team.configure('main',valid,0),/变化/);assert.equal(f.workbench.config.sessionPresets.other,undefined);await assert.rejects(f.bots.configurePolicy({sessionId:'main',revision:f.bots.state.revision,enabled:false,maxParallel:2,maxTasks:8}),/切换其他模式/);
}));
test('team state and progress survive reload and unchanged ordinary requests do not rewrite a completed handoff',()=>fixture(async f=>{
 await f.enter();await f.bots.execute({action:'spawn',profileId:'team-executor',acceptance:'Verify actual evidence',task:'Persist progress'},f.exec);await f.bots.execute({action:'report',stage:'work',percent:40,summary:'Persisted stage',evidence:[]},{agent:f.agents.get('child-1')});
 await f.workbench.selectPreset('main','minimal');
 f.events.push({seq:f.events.length,type:'user/message',data:{source:{kind:'user',rpcId:'switch-minimal'},content:[{type:'text',text:'Continue in minimal mode after checking progress.'}]}});
 await f.workbench.applyPreset(f.parent);const handoff=await f.team.handoff('main');await f.team.acknowledge('main',handoff.digest);
 const loaded=new TeamMode(f.dir,f.ctx,f.bots,f.workbench);await loaded.load();assert.equal(loaded.session('main').active,false);assert(loaded.session('main').checkpoint.acknowledged);assert.equal(loaded.session('main').checkpoint.tasks[0].report.percent,40);
 const before=await readFile(loaded.file,'utf8');await loaded.transition(f.parent,false);assert.equal(await readFile(loaded.file,'utf8'),before);await loaded.close();
}));
test('request composition applies the team route after generic task routing and before actual model invocation',()=>fixture(async f=>{
 const ctx=new Context();for(const [name,value]of Object.entries(f.services))ctx.provide(name,value);
 const intelligence=new Intelligence(f.dir,ctx);await intelligence.load();await intelligence.configure({routingEnabled:true,routes:{operations:{provider:'other',model:'generic'}}});await intelligence.task('main','operations');
 const value=config(f.team);value.coordinator.model={provider:'p',model:'leader'};value.coordinator.effort='medium';await f.team.configure('main',value,0);await f.workbench.selectPreset('main','team');
 const fiber=ctx.plugin({apply:scope=>{wireIntelligence(scope,intelligence);wireWorkbench(scope,f.workbench);wireTeamMode(scope,f.team);}});await fiber;
 const result=await ctx.waterfall('agent/request',{agent:f.parent,signal:new AbortController().signal},()=>Promise.resolve({provider:'p',model:'main',tools:[{name:'workspace_team'},{name:'shell'}]}));assert.equal(result.model,'leader');assert.equal(result.reasoningEffort,'medium');assert.deepEqual(result.tools.map(row=>row.name),['workspace_team','shell']);await fiber.dispose();
}));

test('live member route changes apply at the next request without changing the task identity, scope or progress',()=>fixture(async f=>{
 await f.enter();const run=await f.bots.execute({action:'spawn',profileId:'team-executor',acceptance:'Verify actual evidence',task:'Keep this bounded task'},f.exec),child=f.agents.get(run.childId);
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
 f.services.subagents.interrupt=(id,parent)=>{interrupted={id,parent:parent.agent};};
 await f.bots.cancelTask('main',queued.id);assert.equal(queued.id,f.bots.tasks.runs[1].id);assert.equal(f.bots.tasks.runs[1].status,'cancelled');assert.equal(resumed,0);
 await f.bots.cancelTask('main',running.id);assert.equal(resumed,1);assert.equal(interrupted.id,running.childId);assert.equal(interrupted.parent,f.parent);
 await assert.rejects(f.bots.cancelTask('main',running.id,AbortSignal.abort()));
}));
test('team configuration uses atomic revisions and rejects corrupt persisted records',()=>fixture(async f=>{
 const value=config(f.team),results=await Promise.allSettled([f.team.configure('main',value,0),f.team.configure('main',value,0)]);
 assert.equal(results.filter(row=>row.status==='fulfilled').length,1);assert.equal(results.filter(row=>row.status==='rejected').length,1);
 await writeFile(f.team.file,JSON.stringify({version:1,sessions:[]}));const loaded=new TeamMode(f.dir,f.ctx,f.bots,f.workbench);await assert.rejects(loaded.load(),/损坏/);assert.equal(loaded.ready,false);
}));
test('the coordinator can edit child configuration and children cannot edit the roster',()=>fixture(async f=>{
 await f.enter();const catalog=await f.bots.execute({action:'catalog'},f.exec);
 assert.equal(catalog.revision,f.team.session('main').revision);catalog.configuration.members[0].identity='A focused source reader';catalog.configuration.defaults={model:{provider:'p',model:'small'},effort:'medium'};
 await f.bots.execute({action:'configure_team',configuration:catalog.configuration,revision:catalog.revision},f.exec);
 const run=await f.bots.execute({action:'spawn',profileId:'team-executor',acceptance:'Verify actual evidence',task:'One bounded source task'},f.exec),child=f.agents.get(run.childId);
 assert.match(f.activations[0].request.prompt[0].text,/focused source reader/);assert.equal(f.activations[0].request.agentOptions.model,'small');
 const childCatalog=await f.bots.execute({action:'catalog'},{agent:child});assert.equal(childCatalog.configuration,undefined);assert.equal(childCatalog.revision,undefined);
}));

test('coordinator and member names persist while identities and independent memory keep their keys',()=>fixture(async f=>{
 await f.enter();await f.team.editMemory('main','team-executor',{operation:'remember',key:'fact',content:'A scoped fact'});
 const value=config(f.team);value.coordinator.name='任务指挥';value.members[0].name='资料研究员';
 await f.team.configure('main',value,f.team.session('main').revision);
 assert.equal(f.team.session('main').coordinator.name,'任务指挥');assert.equal(f.team.memory('main','team-executor')[0].content,'A scoped fact');
 const loaded=new TeamMode(f.dir,f.ctx,f.bots,f.workbench);await loaded.load();assert.equal(loaded.session('main').members[0].name,'资料研究员');await loaded.close();
 value.coordinator.name='';await assert.rejects(f.team.configure('main',value,f.team.session('main').revision),/名称/);
}));

test('all idle members can be deleted without silently restoring default workers',()=>fixture(async f=>{
 await f.enter();const value=config(f.team);value.members=[];
 await f.team.configure('main',value,f.team.session('main').revision);assert.equal(f.team.profiles('main').length,0);
 await assert.rejects(f.bots.execute({action:'spawn',profileId:'team-executor',task:'Should not run',acceptance:'Check'},f.exec),/不存在|离线/);assert.equal(f.activations.length,0);
 const loaded=new TeamMode(f.dir,f.ctx,f.bots,f.workbench);await loaded.load();assert.equal(loaded.session('main').members.length,0);await loaded.close();
 value.members=[{id:'new-worker',name:'新子智能体',identity:'Reader',duties:'Read and report',model:null,effort:null,enabled:true}];
 await f.team.configure('main',value,f.team.session('main').revision);assert.equal(f.team.profiles('main')[0].id,'new-worker');
}));

test('legacy coordinator settings acquire a display name without changing saved model routing',()=>fixture(async f=>{
 const value=config(f.team);value.coordinator.model={provider:'p',model:'main'};await f.team.configure('main',value,0);
 const saved=JSON.parse(await readFile(f.team.file,'utf8'));delete saved.sessions.main.coordinator.name;await writeFile(f.team.file,JSON.stringify(saved));
 const loaded=new TeamMode(f.dir,f.ctx,f.bots,f.workbench);await loaded.load();assert.equal(loaded.session('main').coordinator.name,'主智能体');assert.equal(loaded.session('main').coordinator.model.model,'main');await loaded.close();
}));

test('replayed completed native turns never create a new task or rewrite history',()=>fixture(async f=>{
 await f.enter();const run=await f.bots.execute({action:'spawn',profileId:'team-executor',task:'Initial task',acceptance:'Check'},f.exec);
 f.finish(run.childId);await f.bots.onEvent(f.sessions.get(run.childId),{type:'turn/end'});
 const before=JSON.stringify(f.bots.tasks);await f.team.trackNativeTurn(f.sessions.get(run.childId));assert.equal(JSON.stringify(f.bots.tasks),before);
}));

test('native member follow-up reserves one existing child and preserves completed task history',()=>fixture(async f=>{
 await f.enter();const run=await f.bots.execute({action:'spawn',profileId:'team-executor',task:'Initial task',acceptance:'Check'},f.exec);
 f.finish(run.childId);await f.bots.onEvent(f.sessions.get(run.childId),{type:'turn/end'});
 const before=structuredClone(f.bots.tasks.runs[0]),session=f.sessions.get(run.childId),log=session.snapshotEvents();
 log.push({seq:log.length,type:'turn/start'});await f.bots.onEvent(session,log.at(-1));
 assert.equal(f.bots.tasks.runs.length,2);assert.deepEqual(f.bots.tasks.runs[0],before);assert.equal(f.bots.tasks.runs[1].childId,run.childId);
 await f.team.request(f.agents.get(run.childId),{provider:'p',model:'main',tools:[]});
 const routed=JSON.stringify(f.bots.tasks);await f.team.request(f.agents.get(run.childId),{provider:'p',model:'main',tools:[]});assert.equal(JSON.stringify(f.bots.tasks),routed);
 assert.equal(f.activations.length,1);assert.equal(f.bots.timeline('main').summary.running,1);
 f.finish(run.childId);await f.bots.onEvent(session,{type:'turn/end'});assert.equal(f.bots.tasks.runs[1].done,true);assert.deepEqual(f.bots.tasks.runs[0],before);
}));

test('native member follow-up respects online limits and refuses removed identities',()=>fixture(async f=>{
 await f.enter();const run=await f.bots.execute({action:'spawn',profileId:'team-verifier',task:'Initial check',acceptance:'Check'},f.exec);
 f.finish(run.childId);await f.bots.onEvent(f.sessions.get(run.childId),{type:'turn/end'});
 const log=f.sessions.get(run.childId).snapshotEvents();log.push({seq:log.length,type:'turn/start'});
 const disabled=config(f.team);disabled.members.find(row=>row.id==='team-verifier').enabled=false;await f.team.configure('main',disabled,f.team.session('main').revision);
 await assert.rejects(f.team.trackNativeTurn(f.sessions.get(run.childId)),/离线|移除/);assert.equal(f.bots.tasks.runs.length,1);
 const value=config(f.team);value.members=value.members.filter(row=>row.id!=='team-verifier');await f.team.configure('main',value,f.team.session('main').revision);
 await assert.rejects(f.team.request(f.agents.get(run.childId),{provider:'p',model:'main',tools:[]}),/离线|移除/);
}));
async function client(extra={}){
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={callControl,TEAM_CSS};return {name:'dsh-ui-stronger',inject:");
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

test('team workspace styles preserve the embedded native conversation buttons and typography',async()=>{
 const {TEAM_CSS}=await client();
 assert(!TEAM_CSS.includes('.zs-team-workspace button{'));
 assert(TEAM_CSS.includes('.zs-team-workspace button:not(.zs-team-main-conversation *)'));
 assert(!TEAM_CSS.includes('.zs-team-coordinator strong{'));
 assert(!TEAM_CSS.includes('.zs-team-coordinator small,'));
});


test('current host activation receives flat arguments and a stable native member name',()=>fixture(async f=>{
 await f.enter();const original=f.services.subagents.startActivation;
 f.services.subagents.rootOf=()=>f.parent;
 f.services.subagents.startActivation=async spec=>{assert.equal(spec.parent,f.parent);assert.equal(spec.request,undefined);assert.match(spec.name,/^member-[a-f0-9]{20}$/);assert(Array.isArray(spec.prompt));return original({...spec,request:spec});};
 await f.bots.execute({action:'spawn',...task('flat')},f.exec);assert.equal(f.activations.length,1);
}));

test('native projection fallback recovers absent cancellation and releases its observation',()=>fixture(async f=>{
 await f.enter();f.services.subagents.startActivation=async()=>{throw Error('Startup failure');};
 await assert.rejects(f.bots.execute({action:'spawn',...task('absent')},f.exec));let disposed=0;
 f.services.sessionQuery={observeSession:async()=>({projections:{values:{subagentCatalog:[]}},[Symbol.dispose](){disposed++;}})};
 f.services.subagents.interrupt=()=>{};await f.bots.cancelTask('main',f.bots.tasks.runs[0].id);
 assert.equal(f.bots.tasks.runs[0].status,'cancelled');assert.equal(f.bots.tasks.runs[0].done,true);assert(disposed>0);
}));

test('four-member model configuration accepts embedded matching revision and a members-only patch',()=>fixture(async f=>{
 await f.enter();const members=[...config(f.team).members,...[3,4].map(n=>({...config(f.team).members[0],id:'member-'+n,name:'Member '+n}))];
 const revision=f.team.session('main').revision;await f.team.execute({action:'configure_team',revision,configuration:{members,revision}},f.exec);
 assert.equal(f.team.session('main').members.length,4);
 await assert.rejects(f.team.execute({action:'configure_team',revision:0,configuration:{members,revision:1}},f.exec),/版本不一致/);
}));

test('failed interruption preserves the member and reports the actual interruption error',()=>fixture(async f=>{
 await f.enter();await f.bots.execute({action:'spawn',...task('busy')},f.exec);f.services.subagents.interrupt=()=>{throw Error('Interrupt transport failed');};
 const next=config(f.team);next.members=next.members.filter(row=>row.id!=='team-executor');
 await assert.rejects(f.team.configure('main',next,f.team.session('main').revision),/Interrupt transport failed/);
 assert(f.team.profiles('main').some(row=>row.id==='team-executor'));
}));


test('removing a member cancels queued messages without activating another child',()=>fixture(async f=>{
 await f.enter();await f.bots.execute({action:'dispatch',key:'queue-delete',tasks:[task('first'),task('second')]},f.exec);
 f.services.subagents.interrupt=id=>f.finish(id);
 const next=config(f.team);next.members=next.members.filter(row=>row.id!=='team-executor');
 await f.team.configure('main',next,f.team.session('main').revision);
 assert.equal(f.activations.length,1);assert(f.bots.tasks.runs.every(row=>row.done&&row.status==='cancelled'));
}));

test('deletion aborts an in-flight activation before removing its member',()=>fixture(async f=>{
 await f.enter();let admitted;const ready=new Promise(resolve=>{admitted=resolve;});
 f.services.subagents.startActivation=spec=>new Promise((resolve,reject)=>{admitted();spec.signal.addEventListener('abort',()=>reject(spec.signal.reason),{once:true});});
 f.services.subagents.interrupt=()=>{};f.services.subagents.listChildren=async()=>[];
 const starting=f.bots.execute({action:'spawn',...task('starting-delete')},f.exec);const rejected=assert.rejects(starting);await ready;
 const next=config(f.team);next.members=next.members.filter(row=>row.id!=='team-executor');
 await f.team.configure('main',next,f.team.session('main').revision);await rejected;
 assert.equal(f.bots.tasks.runs[0].done,true);assert.equal(f.bots.tasks.runs[0].status,'cancelled');assert.equal(f.team.profiles('main').length,1);
}));


test('UUID member identifiers are mapped to valid native names',()=>fixture(async f=>{
 const cfg=config(f.team);cfg.members[0].id='9e126f31-6df0-477a-b25d-504ac089f212';await f.team.configure('main',cfg,0);await f.enter();
 f.services.subagents.rootOf=()=>f.parent;const start=f.services.subagents.startActivation;
 f.services.subagents.startActivation=spec=>{assert.match(spec.name,/^[a-z][a-z0-9-]{0,31}$/);return start({...spec,request:spec});};
 await f.bots.execute({action:'spawn',...task('uuid',{profileId:cfg.members[0].id})},f.exec);
 assert.equal(f.activations.length,1);
}));

test('failed reserved session ids are never reused for the next assignment',()=>fixture(async f=>{
 await f.enter();const start=f.services.subagents.startActivation;f.services.subagents.startActivation=async()=>{throw Object.assign(Error('invalid agent name'),{code:'INVALID_AGENT_NAME'});};
 await assert.rejects(f.bots.execute({action:'spawn',...task('bad-name')},f.exec));
 f.services.subagents.listChildren=async()=>[];await f.bots.refreshTimeline('main');
 assert.equal(f.bots.tasks.runs[0].dispatchError,'INVALID_AGENT_NAME');assert.match(f.bots.tasks.runs[0].dispatchFailure,/invalid agent name/);
 f.services.subagents.startActivation=start;await f.bots.execute({action:'spawn',...task('retry-after-fix')},f.exec);
 assert.equal(f.activations.length,1);assert.equal(f.bots.tasks.runs.at(-1).childId,'child-1');
}));


test('dispatch derives a stable plan key when task keys are present but the outer key is omitted',()=>fixture(async f=>{
 await f.enter();await f.bots.execute({action:'dispatch',tasks:[task('implicit-plan')]},f.exec);await f.bots.execute({action:'dispatch',tasks:[task('implicit-plan')]},f.exec);assert.equal(f.activations.length,1);
}));

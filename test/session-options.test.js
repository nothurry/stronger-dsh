import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {Workspace,wireWorkspace} from '../lib/workspace.js';
import {SessionTasks} from '../lib/session-tasks.js';
import {EvidenceBridge} from '../lib/evidence.js';
import {wireGuard} from '../lib/guard.js';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

async function fixture(run){const dir=await mkdtemp(path.join(tmpdir(),'session-options-'));try{await run(dir);}finally{await rm(dir,{recursive:true,force:true});}}
const makeSession=id=>({id,header:{id,cwd:'/work'},snapshotEvents:()=>[],requestHeader:()=>({config:{provider:'p',model:'text'}})});

test('ordinary memory changes retain frozen prompt and do not invalidate the native skills provider',()=>fixture(async dir=>{
 const workspace=new Workspace(dir);await workspace.load();let invalidations=0;const cleanup=[];
 const scope={skills:{register:()=>()=>{},registerProvider(factory){factory({invalidate(){invalidations++;}});return()=>{};}},on(){},effect(callback){cleanup.push(callback());},inject(names,callback){if(names.includes('skills'))callback(scope);}};
 wireWorkspace(scope,workspace);const before=workspace.snapshotFor('one','/work');
 await workspace.propose('memory',{title:'Later fact',content:'This new fact stays available through recall'},{human:true});
 assert.deepEqual(workspace.snapshotFor('one','/work'),before);assert.equal(invalidations,0);
 await workspace.builtinSkill('careful-change',false);assert.equal(invalidations,1);
 for(const dispose of cleanup.reverse())await dispose?.();
}));

test('explicit session and whole-workspace pools isolate origins, share selected scopes and revoke existing snapshots',()=>fixture(async dir=>{
 const w=new Workspace(dir);await w.load();const cwds={one:'/a',two:'/b',three:'/c',future:'/b'};w.sessionCwd=id=>cwds[id];
 const fact=await w.propose('memory',{title:'Fact',content:'Selected project memory',scope:'workspace'},{human:true,cwd:'/a',sessionId:'one'});
 await w.setMemoryPools([{id:'pool',name:'Project',sessionIds:['one'],cwds:['/b']}],w.state.revision);
 assert.equal(w.snapshotFor('two','/b').memories[0].id,fact.id);
 assert.equal(w.snapshotFor('future','/b').memories[0].id,fact.id);
 assert.equal(w.recallContext({query:'project'},'/c','desktop','three').memories.length,0);
 await w.setMemoryPools([{id:'pool',name:'Project',sessionIds:['one'],cwds:[]}],w.state.revision);
 assert.equal(w.snapshotFor('two','/b').memories.length,0);
 await assert.rejects(w.setMemoryPools([{id:'a',name:'A',sessionIds:['one'],cwds:[]},{id:'b',name:'B',sessionIds:['one'],cwds:[]}],w.state.revision),/只能/);
 await assert.rejects(w.setMemoryPools([],0),/更新/);await w.dispose();
}));

test('persona freedom is opt-in and never changes stored facts or execution permissions',()=>fixture(async dir=>{
 const w=new Workspace(dir);await w.load();const p=await w.propose('persona',{title:'Custom',content:'A thoughtful fictional character'},{human:true});await w.persona(p.id);
 assert.deepEqual(w.personaPolicy(),{openness:'fixed',evolve:false,initiative:false});assert.equal(w.personaGuidance(),'');
 await w.setPersonaPolicy(p.id,{openness:'preferences',evolve:true,initiative:true});
 assert.match(w.personaGuidance(),/虚构偏好/);assert.match(w.personaGuidance(),/不授予工具权限/);assert.match(w.personaGuidance(),/不能自动改写/);
 assert.equal(w.state.records.find(row=>row.id===p.id).content,p.content);assert.equal(w.state.guard,true);
 await assert.rejects(w.setPersonaPolicy(p.id,{openness:'unrestricted',evolve:true,initiative:true}));await w.dispose();
}));

test('session schedules preserve same-session targets, never duplicate dispatch and require confirmation after restart',()=>fixture(async dir=>{
 const session=makeSession('one'),calls=[];const ctx={get:name=>({sessions:new Map([['one',session]]),schedule:{async create(args,actor){calls.push({args,actor});return{id:'native-'+calls.length};}}}[name])};
 let tasks=new SessionTasks(dir,ctx);await tasks.load();
 const row=await tasks.create('one',{title:'Check',prompt:'Check current project',at:new Date(Date.now()+60000).toISOString()});
 tasks.state.tasks[0].at=new Date(Date.now()-1).toISOString();await Promise.all([tasks.tick(),tasks.tick()]);
 assert.equal(calls.length,1);await assert.rejects(tasks.action('one',row.id,'cancel'),/已提交/);assert.deepEqual(calls[0].args.target,{kind:'session',sessionId:'one'});assert.equal(calls[0].actor,'one');assert.equal(tasks.view('one').tasks[0].nativeId,'native-1');
 await tasks.create('one',{title:'Later',prompt:'Review later',at:new Date(Date.now()+60000).toISOString()});await tasks.close();
 const file=path.join(dir,'session-tasks.json'),saved=JSON.parse(await readFile(file,'utf8'));saved.tasks[1].at=new Date(Date.now()-10000).toISOString();await writeFile(file,JSON.stringify(saved));
 tasks=new SessionTasks(dir,ctx);await tasks.load();await tasks.tick();assert.equal(calls.length,1);assert.equal(tasks.view('one').tasks[1].status,'missed');
 await tasks.action('one',saved.tasks[1].id,'run');assert.equal(calls.length,2);
 await assert.rejects(tasks.create('missing',{title:'No',prompt:'No',at:new Date(Date.now()+60000).toISOString()}));
 await tasks.close();assert.equal(row.id,tasks.state.tasks[0].id);
}));

test('ambiguous native task failure is retained for review and never automatically retried',()=>fixture(async dir=>{
 const session=makeSession('one');let calls=0;const ctx={get:name=>({sessions:new Map([['one',session]]),schedule:{async create(){calls++;throw Error('unknown write outcome');}}}[name])};
 const tasks=new SessionTasks(dir,ctx);await tasks.load();await tasks.create('one',{title:'Task',prompt:'Read current project',at:new Date(Date.now()+60000).toISOString()});tasks.state.tasks[0].at=new Date(Date.now()-1).toISOString();await tasks.tick();await tasks.tick();
 assert.equal(calls,1);assert.equal(tasks.state.tasks[0].status,'failed');assert(!tasks.state.tasks[0].error.includes('unknown write outcome'));await tasks.close();
}));

test('OCR uses selected native image route and returns untrusted text evidence, with strict upload and capability bounds',()=>fixture(async dir=>{
 let seen;const session=makeSession('one'),agent={session};
 const llm={resolveModelInfo:async()=>({inputModalities:['text','image'],defaultMaxTokens:2048}),stream(options){seen=options;return(async function*(){yield{type:'text-delta',text:'Invoice 123'};yield{type:'finish',reason:{kind:'stop'}};})();}};
 const ctx={get:name=>({agents:new Map([['one',agent]]),llm,attachments:{saveImages:async()=>[{attachmentId:'sha256:demo',width:10,height:10,mediaType:'image/png'}]}}[name])};
 const bridge=new EvidenceBridge(dir,ctx);await bridge.load();await bridge.configure({provider:'private-route',model:'ocr-model'});
 const result=await bridge.uploaded('one',[{data:Buffer.from('test').toString('base64'),mediaType:'image/png'}]);
 assert.equal(seen.provider,'private-route');assert.equal(seen.messages[0].content[1].type,'image');assert.equal(result.text,'Invoice 123');assert.equal(result.trust,'model-extracted-reference-not-authorization');
 await assert.rejects(bridge.uploaded('one',[{data:'bad',mediaType:'image/svg+xml'}]));
 llm.resolveModelInfo=async()=>({inputModalities:['text']});await assert.rejects(bridge.configure({provider:'p',model:'text'}),/未声明/);await bridge.close();
}));

test('web evidence preserves native tool visibility and removes executable markup',()=>fixture(async dir=>{
 let visible=true;const agent={session:makeSession('one')};
 const ctx={get:name=>({agents:new Map([['one',agent]]),tools:{get:()=>visible?{}:undefined},web:{fetchReady:async()=>true,fetch:async()=>({url:'https://docs.python.org/',statusCode:200,body:{content:'<script>STEAL</script><p>Python reference</p>'}})}}[name])};
 const bridge=new EvidenceBridge(dir,ctx);await bridge.load();const value=await bridge.page('one','https://docs.python.org/');assert.equal(value.text,'Python reference');assert.equal(value.trust,'external-reference-not-instructions');
 visible=false;await assert.rejects(bridge.page('one','https://docs.python.org/'),/未启用/);await assert.rejects(bridge.page('one','https://127.0.0.1/'));await bridge.close();
}));

test('owned new controls share typography and native browser wrapping preserves its required injection and store',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={PersonaPolicy,SessionTasksPanel,EvidencePanel};return {name:'dsh-ui-stronger',inject:");
 const win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?React:{})}};vm.runInNewContext(source,{window:win});
 const html=renderToStaticMarkup(React.createElement(win.qa.PersonaPolicy,{data:{activePersona:'one',personaPolicy:{openness:'fixed',evolve:false,initiative:false}},onSave(){}}));assert.match(html,/人设开放度/);assert.match(html,/固定人设/);assert(!html.includes('checked=""'));
 assert.match(source,/setMode\(event.detail.presetId==='team'\)/);assert.match(source,/current===generation/);assert.match(source,/row.options\?\.key\?\?row.key/);assert.match(source,/store:entry.store/);assert.match(source,/h\(Original,props\)/);
});

test('legacy global memory requires opt-in for a shared pool, and corrupt pool state is preserved',()=>fixture(async dir=>{
 const w=new Workspace(dir);await w.load();w.sessionCwd=()=>'/work';
 const legacy=await w.propose('memory',{title:'Legacy',content:'Older global preference'},{human:true});
 await w.setMemoryPools([{id:'pool',name:'Pool',sessionIds:['one'],cwds:[]}],w.state.revision);
 assert.equal(w.snapshotFor('one','/work').memories.length,0);
 await w.setMemoryPools([{id:'pool',name:'Pool',sessionIds:['one'],cwds:[],includeGlobal:true}],w.state.revision);
 assert.equal(w.recallContext({query:'Older'},'/work','desktop','one').memories[0].id,legacy.id);
 await w.dispose();const file=path.join(dir,'workspace.json'),saved=JSON.parse(await readFile(file,'utf8'));saved.memoryPools[0].cwds='invalid';const raw=JSON.stringify(saved);await writeFile(file,raw);
 const broken=new Workspace(dir);await assert.rejects(broken.load(),/设置无效/);assert.equal(await readFile(file,'utf8'),raw);assert.equal(broken.ready,false);
}));

import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Bots,wireBots} from '../lib/bots.js';
import {Workspace} from '../lib/workspace.js';

async function fixture(run){
 const directory=await mkdtemp(path.join(tmpdir(),'agent-skills-'));
 const events=[{seq:1,type:'user/message',data:{source:{kind:'user',rpcId:'fixture'}}}];
 const parent={session:{id:'parent',header:{cwd:'/work'},snapshotEvents:()=>events}};
 const sessions=new Map([['parent',parent.session]]),agents=new Map([['parent',parent]]),activations=[];
 const definitions=new Map(),context={
  get:name=>({sessions,agents,subagents,tools:tools}[name]),
  inject(names,callback){if(names.includes('tools'))callback({tools});},on(){},effect(){}
 };
 const tools={guard(){},register(definition){definitions.set(definition.name,definition);}};
 const subagents={resolveMaxDepth:()=>1,async startActivation(specification){
  activations.push(specification);
  const id='child-'+activations.length,log=[{seq:1,type:'turn/start'}];
  const session={id,header:{origin:'subagent',parentSession:'parent',cwd:'/work'},snapshotEvents:()=>log};
  sessions.set(id,session);agents.set(id,{session});return {childId:id};
 }};
 subagents.sendMessage=async(parent,id,prompt)=>{activations.push({reused:true,request:{parent,prompt}});const log=sessions.get(id).snapshotEvents();log.push({seq:Math.max(...log.map(event=>event.seq))+1,type:'turn/start'});return 'resumed';};
 const bots=new Bots(directory,context),workspace=new Workspace(directory);
 await bots.load();await workspace.load();wireBots(context,bots);
 bots.skillSuggestions=(task,id,cwd)=>workspace.skillCatalog({task,limit:3},cwd,workspace.channelFor(id)).skills;
 const execution={agent:parent,signal:new AbortController().signal};
 const execute=args=>definitions.get('workspace_team').execute(args,execution);
 const finish=(id,answer)=>{const log=sessions.get(id).snapshotEvents();log.push({seq:log.length+1,type:'assistant/message',data:{content:[{type:'reasoning',text:'hidden deliberation'},{type:'text',text:answer}]}},{seq:log.length+2,type:'turn/end',data:{reason:{kind:'completed'}}});};
 try{await run({bots,workspace,agents,sessions,activations,execution,execute,finish,definitions});}
 finally{await bots.close();await workspace.dispose();await rm(directory,{recursive:true,force:true});}
}
const task=(key,extra={})=>({key,task:'Inspect source '+key,acceptance:'Cite the source and check actual output',...extra});

test('task-oriented skill discovery returns only permitted enabled summaries and keeps memory snapshots stable',()=>fixture(async f=>{
 const active=await f.workspace.propose('skill',{name:'local-sampling',title:'Sampling',description:'sampling dataset checks',content:'LOCAL PROCEDURE BODY',scope:'workspace'},{human:true,cwd:'/work'});
 await f.workspace.propose('skill',{name:'local-other',title:'Other',description:'sampling dataset checks',content:'OTHER WORKSPACE BODY',scope:'workspace'},{human:true,cwd:'/other'});
 await f.workspace.propose('skill',{name:'local-pending',title:'Pending',description:'sampling dataset checks',content:'UNAPPROVED BODY'},{cwd:'/work'});
 const snapshot=f.workspace.snapshotFor('parent','/work');
 const result=f.workspace.skillCatalog({task:'sampling dataset',limit:3},'/work','desktop');
 assert(result.skills.some(row=>row.name==='local-sampling'));assert(result.skills.every(row=>row.status==='active'&&row.bodyLoaded===false));
 assert(!JSON.stringify(result).includes('BODY'));assert(!result.skills.some(row=>['local-other','local-pending'].includes(row.name)));
 assert(!f.workspace.skillCatalog({task:'sampling dataset'},'/work','wechat').skills.some(row=>row.name==='local-sampling'));
 await f.workspace.decide(active.id,'archived');
 assert(!f.workspace.skillCatalog({task:'sampling dataset'},'/work').skills.some(row=>row.name==='local-sampling'));
 assert.deepEqual(f.workspace.snapshotFor('parent','/work'),snapshot);
 assert.throws(()=>f.workspace.skillCatalog({task:123}));assert.throws(()=>f.workspace.skillCatalog({activeOnly:'true'}));
}));

test('normal tool dispatch passes skills and minimal context, captures native results and releases review-gated dependencies',()=>fixture(async f=>{
 f.bots.state.policies.parent={enabled:true,maxParallel:2,maxTasks:8};
 await f.workspace.propose('skill',{name:'local-sampling',title:'Sampling',description:'sampling dataset checks',content:'PROCEDURE MUST STAY LAZY'},{human:true});
 const schema=f.definitions.get('workspace_team').parameters.properties;
 for(const key of ['skills','context','requireReview']){assert(schema[key]);assert(schema.tasks.items.properties[key]);}
 let result=await f.execute({action:'dispatch',key:'verified-flow',tasks:[
  task('read',{task:'sampling dataset checks',skills:['local-sampling'],context:'Use dataset.csv rows 2–10',requireReview:true}),
  task('verify',{dependsOn:['read'],phase:'review'})
 ]});
 assert.equal(f.activations.length,1);const prompt=f.activations[0].request.prompt[0].text;
 assert.match(prompt,/local-sampling/);assert.match(prompt,/dataset.csv rows 2–10/);assert(!prompt.includes('PROCEDURE MUST STAY LAZY'));
 f.finish('child-1','Actual finding at dataset.csv:4');
 await f.bots.onEvent(f.sessions.get('child-1'),{type:'turn/end'});
 assert.equal(f.activations.length,1,'gated dependency waits for main review');
 result=f.bots.timeline('parent');assert.equal(result.tasks[0].result,'Actual finding at dataset.csv:4');assert.equal(result.tasks[1].waitingFor,'waiting');
 await f.execute({action:'review',taskId:result.tasks[0].id,decision:'accepted',evidence:['Checked dataset.csv:4 independently']});
 assert.equal(f.activations.length,2);assert.match(f.activations[1].request.prompt[0].text,/Actual finding at dataset.csv:4/);
 assert(!f.activations[1].request.prompt[0].text.includes('hidden deliberation'));
 const worker={agent:f.agents.get(f.bots.timeline('parent').tasks[1].childId)};
 assert.equal((await f.bots.execute({action:'status',taskId:result.tasks[0].id},worker)).done,true);
 await assert.rejects(f.bots.execute({action:'cancel',taskId:result.tasks[0].id},worker));
 await f.execute({action:'spawn',task:'Unrelated work',key:'unrelated'});
 const unrelated=f.bots.timeline('parent').tasks.find(row=>row.key==='unrelated');
 await assert.rejects(f.bots.execute({action:'status',taskId:unrelated.id},worker));
 worker.agent.session.header.cwd='/changed';
 await assert.rejects(f.bots.execute({action:'status',taskId:result.tasks[0].id},worker));
}));

test('missing profile assignment selects an enabled configured role and exposes bounded role descriptions',()=>fixture(async f=>{
 await f.bots.save({revision:0,profiles:[
  {id:'writer',name:'Writer',role:'child',instructions:'Implement code changes',skills:['careful-change'],model:null,enabled:true},
  {id:'reviewer',name:'Reviewer',role:'child',instructions:'Review and verify source evidence. '+'.'.repeat(900),skills:[],model:null,enabled:true}
 ]});
 f.bots.state.policies.parent={enabled:true,maxParallel:2,maxTasks:8};
 const catalog=await f.execute({action:'catalog'});assert.equal(catalog.profiles[1].instructions.length,600);assert(catalog.profiles[1].instructionsTruncated);
 const result=await f.execute({action:'spawn',task:'Verify source evidence',phase:'review'});
 assert.equal(result.profileId,'reviewer');assert.equal(f.activations[0].label,'Reviewer');
 await assert.rejects(f.execute({action:'spawn',profileId:'missing',task:'Inspect'}));
}));

test('task briefing changes participate in idempotence and malformed batches never partially launch',()=>fixture(async f=>{
 f.bots.state.policies.parent={enabled:true,maxParallel:2,maxTasks:8};
 for(const extra of [{skills:['../bad']},{skills:'skill'},{context:42},{requireReview:'true'}]){
  await assert.rejects(f.execute({action:'dispatch',key:'bad',tasks:[task('valid'),task('invalid',extra)]}));
 }
 assert.equal(f.activations.length,0);
 const args={action:'spawn',key:'same',task:'Read once',context:'Original pointer',skills:['careful-change'],requireReview:true};
 await f.execute(args);assert((await f.execute(args)).duplicate);
 for(const change of [{context:'Changed pointer'},{skills:[]},{requireReview:false}])await assert.rejects(f.execute({...args,...change}),/不同内容/);
 assert.equal(f.activations.length,1);
}));

test('a reviewer rejection blocks dependents and a changed native result invalidates previous acceptance',()=>fixture(async f=>{
 f.bots.state.policies.parent={enabled:true,maxParallel:2,maxTasks:8};
 await f.execute({action:'dispatch',key:'reject',tasks:[task('a',{requireReview:true}),task('b',{dependsOn:['a']})]});
 f.finish('child-1','First result');await f.bots.onEvent(f.sessions.get('child-1'),{type:'turn/end'});
 const row=f.bots.tasks.runs[0];
 await f.execute({action:'review',taskId:row.id,decision:'changes-requested',evidence:['Missing source verification']});
 assert.equal(f.bots.timeline('parent').tasks[1].status,'blocked');assert.equal(f.activations.length,1);
 await f.execute({action:'review',taskId:row.id,decision:'accepted',evidence:['Source verified separately']});
 const log=f.sessions.get('child-1').snapshotEvents();log.push({seq:10,type:'turn/start'});await f.bots.onEvent(f.sessions.get('child-1'),{type:'turn/start'});
 assert.equal(f.bots.tasks.runs[0].review,null);
 const running=await f.execute({action:'status',taskId:row.id});assert.equal(running.done,false);assert.deepEqual(running.messages,[]);assert.equal(running.review,null);
 await assert.rejects(f.execute({action:'review',taskId:row.id,decision:'accepted',evidence:['Old evidence']}));
 f.finish('child-1','Revised result');const revised=await f.execute({action:'status',taskId:row.id});assert.deepEqual(revised.messages,['Revised result']);assert.equal(revised.review,null);
}));

test('completed workers cannot be reawakened outside dispatch concurrency and task budgets',()=>fixture(async f=>{
 f.bots.state.policies.parent={enabled:true,maxParallel:1,maxTasks:1};
 await f.execute({action:'spawn',key:'one',task:'One task'});f.finish('child-1','Finished');
 await f.bots.onEvent(f.sessions.get('child-1'),{type:'turn/end'});
 await assert.rejects(f.execute({action:'message',to:'child-1',key:'more',text:'Do another task',wake:true}),/已结束/);
 assert.equal(f.bots.tasks.messages.length,0);
 assert.equal((await f.execute({action:'message',to:'child-1',key:'note',text:'Reference note only',wake:false})).status,'stored');
 await assert.rejects(f.execute({action:'spawn',key:'two',task:'Another task'}),/预算/);
}));

test('dependency briefings obey a total character budget and include only declared same-parent results',()=>fixture(async f=>{
 const dependencies=Array.from({length:8},(_,index)=>({id:'dep-'+index,parent:'parent',childId:'source-'+index,status:'completed',done:true,result:'R'.repeat(1600),report:{summary:'S'.repeat(1200),evidence:['file.md:4']}}));
 f.bots.tasks.runs.push(...dependencies,{id:'private-other',parent:'other',result:'FOREIGN RESULT'});
 const handoff=f.bots.dependencyHandoff({parent:'parent',dependsOn:[...dependencies.map(row=>row.id),'private-other']});
 assert(handoff.reduce((count,item)=>count+(item.content?.length??0),0)<=6000);assert(handoff.some(item=>item.truncated));assert(handoff.at(-1).unavailable);assert(!JSON.stringify(handoff).includes('FOREIGN RESULT'));
}));

test('task details render the briefing and result as escaped text using the shared task surface',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={TaskHandoff};return {name:'dsh-ui-stronger',inject:");
 const window={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?React:{})}};
 vm.runInNewContext(source,{window});
 const html=renderToStaticMarkup(React.createElement(window.qa.TaskHandoff,{task:{context:'Read source.md:4',skills:['careful-change'],result:'<script>bad()</script>',requireReview:true}}));
 assert.match(html,/交接与技能/);assert.match(html,/careful-change/);assert.match(html,/等待主角色验收/);assert.match(html,/&lt;script&gt;/);assert(!html.includes('<script>'));
 assert.equal(renderToStaticMarkup(React.createElement(window.qa.TaskHandoff,{task:{}})),'');
});

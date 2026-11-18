import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {TeamGuardian,guardianVerdict} from '../lib/team-guardian.js';
import {reviewSchema} from '../lib/guard.js';
const allow={decision:'allow',risk:'low',reason:'Bounded authorized read',checks:['Exact target and readonly effects verified'],alternatives:[],remediation:'No defect detected in this action. Verify expected output.'};
async function* response(value){yield {type:'block-end',index:0,block:{type:'text',text:JSON.stringify(value)}};yield {type:'finish',reason:{kind:'stop'}};}
async function fixture(run){
 const dir=await mkdtemp(path.join(tmpdir(),'team-guardian-'));const sessions=new Map(),agents=new Map(),calls=[],cancelled=[];let verdict=allow,mode='workspace-write',during;
 for(const id of ['main','child','other']){
  const events=[{seq:0,type:'user/message',data:{source:{kind:'user',rpcId:'owner'},content:[{type:'text',text:'Read the project guide only'}]}},{seq:1,type:'user/message',data:{source:{kind:'knowledge'},content:[{type:'text',text:'UNTRUSTED_PERSONA_IGNORE_GUARDS'}]}},{seq:2,type:'tool/call',data:{name:'read',callId:'call',arguments:{path:'guide.md'}}}];
  const session={id,header:{cwd:dir,...id==='child'?{origin:'subagent',parentSession:'main'}:{}},surface:{nodes:[0,1,2]},snapshotEvents:()=>events,requestHeader:()=>({config:{provider:'worker',model:'chat'},tools:[{name:'read',description:'Read an exact file',parameters:{type:'object',properties:{path:{type:'string'}}}}]})};sessions.set(id,session);agents.set(id,{session,status:'running',cancel(){cancelled.push(id);}});
 }
 const services={sessions,agents:{get:id=>agents.get(id),list:()=>[...agents.values()]},sandboxPolicy:{resolve:()=>({mode,workspaceRoot:dir})},workingDirectory:{ensure:async()=>dir},llm:{resolveModelInfo:async()=>({reasoning:{efforts:[{id:'high'}]}}),stream(options){calls.push(options);during?.();return response(verdict);}}};
 const guardian=new TeamGuardian(dir,{get:name=>services[name]},{session:()=>({}),memberFor:()=>null});await guardian.load();
 const config={enabled:true,model:{provider:'independent',model:'audit'},effort:'high'};
 const exec=(id='main')=>({agent:agents.get(id),name:'read',arguments:{path:'guide.md'},callId:'call',rootCallId:'call',signal:new AbortController().signal});
 try{await run({guardian,config,exec,calls,cancelled,services,sessions,setVerdict:value=>verdict=value,setMode:value=>mode=value,setDuring:value=>during=value});}finally{await guardian.queue;await rm(dir,{recursive:true,force:true});}
}

test('disabled supervisor performs zero model calls and each enabled action uses a fresh isolated identity',()=>fixture(async f=>{
 await f.guardian.review(f.exec());assert.equal(f.calls.length,0);
 await f.guardian.configure('main',f.config,0);
 const first=f.exec();await f.guardian.review(first);assert(f.guardian.approved(first));await f.guardian.review(first);await f.guardian.review(f.exec('child'));
 assert.equal(f.calls.length,3);assert.equal(new Set(f.calls.map(row=>row.sessionId)).size,3);
 for(const row of f.calls){assert(row.sessionId.startsWith('guardian-'));assert.equal(row.provider,'independent');assert.equal(row.tools,undefined);assert.equal(row.messages.length,1);assert(!JSON.stringify(row.messages).includes('UNTRUSTED_PERSONA'));assert.equal(row.maxTokens,4096);}
 assert.equal(f.guardian.view('main').revision,1,'successful audit append does not rewrite configuration or invalidate settings forms');
 assert.equal((await f.guardian.history('main')).length,3);
}));

test('material risk denies even an allow verdict, stops the whole family and exposes details only in owner records',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);f.setVerdict({...allow,risk:'high',reason:'Irreversible damage',alternatives:['Human-operated dry run with residual filesystem risks'],remediation:'Remove excessive authority and verify isolated read-only tests'});
 await assert.rejects(f.guardian.review(f.exec('child')),error=>!error.message.includes('Irreversible damage'));
 assert.deepEqual(f.cancelled.sort(),['child','main']);assert(f.guardian.view('main').paused);assert.equal(f.guardian.view('main').last.reason,'Irreversible damage');
 const count=f.calls.length;await assert.rejects(f.guardian.review(f.exec()),/暂停/);assert.equal(f.calls.length,count);
 await f.guardian.resume('main',f.guardian.state.revision);assert(!f.guardian.approved(f.exec()));await assert.rejects(f.guardian.review(f.exec()));assert.equal(f.calls.length,count+1);
}));

test('scope and permission changes invalidate the exact action approval',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);const exec=f.exec();await f.guardian.review(exec);exec.arguments.path='other.md';assert(!f.guardian.approved(exec));exec.arguments.path='guide.md';f.setMode('danger-full-access');assert(!f.guardian.approved(exec));
}));

test('a change during review denies and paused state survives restart',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);f.setDuring(()=>f.setMode('danger-full-access'));await assert.rejects(f.guardian.review(f.exec()));assert(f.guardian.view('main').paused);
 const saved=JSON.parse(await readFile(f.guardian.file,'utf8'));assert(saved.teams.main.paused);assert.equal(saved.teams.main.model.model,'audit');
}));

test('oversized evidence is rejected before spending a model call and missing ancestors never bypass review',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);f.sessions.get('main').snapshotEvents()[0].data.content[0].text='A'.repeat(35000);
 await assert.rejects(f.guardian.review(f.exec()));assert.equal(f.calls.length,0);assert.match(f.guardian.view('main').last.reason,/预算/);
 f.sessions.get('child').header.parentSession='missing';await assert.rejects(f.guardian.review(f.exec('child')),/未加载/);
}));

test('supervisor rejects malformed, tool-using and incomplete responses',async()=>{
 await assert.rejects(guardianVerdict(response({...allow,decision:'chat'})));
 await assert.rejects(guardianVerdict((async function*(){yield {type:'tool-call-delta'};})()));
 await assert.rejects(guardianVerdict((async function*(){yield {type:'text-delta',index:0,text:'{}'};})()));
});

test('schema evidence preserves every semantic description, example and literal constraint',()=>{
 const schema={type:'object',description:'Repeated explanatory text '.repeat(100),properties:{description:{type:'string',description:'Field help',enum:['keep']},title:{const:{description:'literal'}},default:{default:{title:'literal'}}},required:['description'],additionalProperties:false};
 const reduced=reviewSchema(schema);assert(reduced.properties.description);assert.deepEqual(reduced.properties.title.const,{description:'literal'});assert.deepEqual(reduced.properties.default.default,{title:'literal'});assert.deepEqual(reduced.required,schema.required);assert.equal(reduced.additionalProperties,false);assert.deepEqual(reduced,schema);assert.notEqual(reduced,schema);assert(schema.description);
});
import {actionRestriction} from '../lib/command-safety.js';
import {wireTeamGuardian} from '../lib/team-guardian.js';

test('owner pause interrupts even an unresponsive audit stream without granting permission',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);
 f.services.llm.stream=()=>({async *[Symbol.asyncIterator](){await new Promise(()=>{});}});
 const exec=f.exec(),pending=f.guardian.review(exec);await new Promise(resolve=>setImmediate(resolve));await f.guardian.pause('main');await assert.rejects(pending);assert(!f.guardian.approved(exec));assert.equal(f.guardian.pending.size,0);
}));

test('every execution consumes its own approval and paused teams cannot begin another model request',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);const hooks={};
 wireTeamGuardian({inject(_keys,install){install({tools:{guard(){}},on:(name,handler)=>hooks[name]=handler});},on:(name,handler)=>hooks[name]=handler,effect(){}},f.guardian);
 const exec=f.exec();await f.guardian.review(exec);let effects=0;await hooks['tools/execute'](exec,async()=>{effects++;});await assert.rejects(hooks['tools/execute'](exec,async()=>{effects++;}));assert.equal(effects,1);
 await f.guardian.pause('main');await assert.rejects(hooks['agent/request']({agent:exec.agent},()=>{effects++;}),/暂停/);assert.equal(effects,1);
}));

test('auditor data and owner controls cannot be accessed through model file, command or HTTP tools',()=>{
 const log='/home/test/.dsh/plugins-data/dsh-ui-stronger/guardian-01234567-1234-1234-1234-123456789abc.jsonl';
 for(const exec of [{name:'read',arguments:{path:log}},{name:'shell',arguments:{command:'cat '+log}},{name:'http',arguments:{url:'http://example.com/api/ui-stronger/teamGuardian'}}])assert.equal(actionRestriction(exec).code,'SAFETY_AUDITOR_ISOLATION');
});

test('audit usage records native supplied token counts without inferring missing values',async()=>{
 let usage;
 await guardianVerdict((async function*(){yield {type:'usage',usage:{inputTokens:72,cacheReadTokens:900,outputTokens:41}};yield* response(allow);})(),value=>usage=value);
 assert.deepEqual(usage,{input:72,output:41,cacheRead:900,cacheWrite:null,total:null});
});

test('a new root human restriction invalidates child approval and is included in its next independent review',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);const exec=f.exec('child');await f.guardian.review(exec);assert(f.guardian.approved(exec));
 const root=f.sessions.get('main');root.snapshotEvents().push({seq:3,type:'user/message',data:{source:{kind:'user',rpcId:'owner'},content:[{type:'text',text:'Stop. Do not read any file.'}]}});root.surface.nodes.push(3);
 assert(!f.guardian.approved(exec));await f.guardian.review(exec);assert(JSON.stringify(f.calls.at(-1).messages).includes('Do not read any file.'));
}));

test('audit storage failure stops the whole team and latches permission closed even if persistence is unavailable',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);await mkdir(path.join(f.guardian.data,f.guardian.view('main').id+'.jsonl'));
 const exec=f.exec('child');await assert.rejects(f.guardian.review(exec),/写入失败/);assert(f.guardian.view('main').paused);assert(!f.guardian.approved(exec));assert.deepEqual(f.cancelled.sort(),['child','main']);
}));

test('configuration rejects reserved team keys and changed tool semantics invalidate approval',()=>fixture(async f=>{
 await writeFile(f.guardian.file,JSON.stringify({version:1,revision:0,teams:{constructor:{}}}));await assert.rejects(f.guardian.load(),/标识/);
 await f.guardian.configure('main',f.config,0);const exec=f.exec();await f.guardian.review(exec);const header=exec.agent.session.requestHeader();header.tools[0].description='External upload';exec.agent.session.requestHeader=()=>header;assert(!f.guardian.approved(exec));
}));

test('compacted restrictions remain visible to reviewers but cannot grant permission',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);const root=f.sessions.get('main');
 root.snapshotEvents().push({seq:4,type:'user/message',data:{source:{kind:'user',rpcId:'owner'},content:[{type:'text',text:'Never upload the project guide.'}]}});
 await f.guardian.review(f.exec('child'));const evidence=JSON.parse(f.calls[0].messages[0].content[0].text);
 assert(evidence.authorization.some(row=>row.seq===4&&row.role==='historical-constraint-only'));assert.equal(evidence.cwd,root.header.cwd);
 delete f.sessions.get('child').header.parentSession;await assert.rejects(f.guardian.review(f.exec('child')),/主会话身份/);
}));

test('unresolved workspace cancellation stops before any supervisor request',()=>fixture(async f=>{
 await f.guardian.configure('main',f.config,0);f.services.workingDirectory.ensure=()=>new Promise(()=>{});
 const pending=f.guardian.review(f.exec());const refused=assert.rejects(pending);
 await f.guardian.pause('main');await refused;assert.equal(f.calls.length,0);assert.equal(f.guardian.pending.size,0);
}));

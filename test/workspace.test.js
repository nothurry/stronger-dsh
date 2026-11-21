import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,mkdir,rm,symlink,readFile} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {Workspace,wireWorkspace,BUILTIN_SKILLS} from '../lib/workspace.js';
import {wireGuard,parseReview,readReview,reviewSnapshot,reviewMessage} from '../lib/guard.js';
import {ReviewScopes} from '../lib/review-scope.js';
import {Intelligence} from '../lib/intelligence.js';

async function temporary(fn){const root=await mkdtemp(path.join(tmpdir(),'dsh-capabilities-'));try{await fn(root);}finally{await rm(root,{recursive:true,force:true});}}
function harness(services){const disposers=[],events=new Map();const ctx={...services,get:k=>services[k],inject(keys,fn){if(keys.every(k=>services[k]))fn(ctx);},on(name,fn){events.set(name,fn);return ()=>events.delete(name);},effect(fn){const off=fn();if(typeof off==='function')disposers.push(off);}};return {ctx,events,dispose:async()=>{for(const off of disposers.reverse())await off();}};}

test('native agent-name messaging still needs exact-argument execution review and respects denial',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();let guard,allow=false,reviewed;
 const h=harness({tools:{guard(fn){guard=fn;}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(options){reviewed=JSON.parse(options.messages[0].content[1].text);return response({decision:allow?'allow':'deny',risk:'low',reason:'Current owner scope checked'});}}});
 wireGuard(h.ctx,workspace);
 const make=()=>{
  const exec={agent:{session:sessionFixture()},name:'send_message',schema:{name:'send_message',description:'Send to an existing agent',parameters:{type:'object',properties:{agent:{type:'string'},message:{type:'string'}}}},arguments:{agent:'member-worker',message:'Additional evidence'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
  Object.assign(exec.agent.session.snapshotEvents().find(event=>event.type==='tool/call').data,{name:exec.name,arguments:exec.arguments});return exec;
 };
 const gate=h.events.get('tools/pre-execute'),denied=make();assert.match(guard(denied),/缺少有效/);
 assert.equal((await gate(denied,async()=>({kind:'allow'}))).kind,'deny');assert.deepEqual(reviewed.action.arguments,denied.arguments);
 allow=true;const accepted=make();assert.equal((await gate(accepted,async()=>({kind:'allow'}))).kind,'allow');assert.equal(guard(accepted),undefined);
 accepted.arguments.agent='another-worker';assert.match(guard(accepted),/缺少有效/);
 await h.dispose();await workspace.dispose();
}));

test('verified owner settings reach the reviewer and revocation invalidates an existing allow stamp',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();let enabled=true,guard,request;
 workspace.ownerPolicy=()=>enabled?{source:'owner-setting',kind:'classified-local-memory',sessionId:'s',cwd:'/project'}:null;
 const h=harness({tools:{guard(fn){guard=fn;}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(value){request=value;return response({decision:'allow',risk:'low',reason:'bounded local memory under owner policy'});}}});
 wireGuard(h.ctx,workspace);
 const exec={agent:{session:sessionFixture()},name:'workspace_memory',schema:{name:'workspace_memory',description:'Save bounded classified memory',parameters:{type:'object'}},arguments:{importance:'high',sourceSeqs:[0],ownerPolicy:'forged argument'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 Object.assign(exec.agent.session.snapshotEvents().find(event=>event.type==='tool/call').data,{name:exec.name,arguments:exec.arguments});
 const gate=h.events.get('tools/pre-execute');
 assert.equal((await gate(exec,async()=>({kind:'allow'}))).kind,'allow');
 const payload=JSON.parse(request.messages[0].content[1].text);
 assert.equal(payload.ownerPolicy.source,'owner-setting');assert.equal(payload.action.arguments.ownerPolicy,'forged argument');
 assert.equal(guard(exec),undefined);enabled=false;assert.match(guard(exec),/缺少有效/);
 await h.dispose();await workspace.dispose();
}));
test('owner policy changes during review still deny an otherwise valid model decision',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();let enabled=true;
 workspace.ownerPolicy=()=>enabled?{source:'owner-setting',kind:'current-task-owner-notification'}:null;
 const h=harness({tools:{guard(){}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(){return(async function*(){enabled=false;yield*response({decision:'allow',risk:'low',reason:'allowed'});})();}}});
 wireGuard(h.ctx,workspace);
 const exec={agent:{session:sessionFixture()},name:'workspace_wechat',schema:{name:'workspace_wechat',description:'Notify the bound owner about the current task',parameters:{type:'object'}},arguments:{action:'send',key:'task-result',type:'text',text:'Result ready'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 Object.assign(exec.agent.session.snapshotEvents().find(event=>event.type==='tool/call').data,{name:exec.name,arguments:exec.arguments});
 assert.equal((await h.events.get('tools/pre-execute')(exec,async()=>({kind:'allow'}))).kind,'deny');
 await h.dispose();await workspace.dispose();
}));
test('memory drafts require approval, retain workspace scope, archive restores, reload preserves private data',()=>temporary(async root=>{
 const w=new Workspace(root);await w.load();const draft=await w.propose('memory',{title:'writing preference',content:'Use concise paragraphs',scope:'workspace'},{cwd:'/one'});assert.equal(w.recall('paragraph','/one').length,0);await w.decide(draft.id,'active');assert.equal(w.recall('paragraph','/two').length,0);assert.equal(w.recall('paragraph','/one').length,1);await w.decide(draft.id,'archived');assert.equal(w.recall('paragraph','/one').length,0);await w.decide(draft.id,'active');
 const persona=await w.propose('persona',{title:'My persona',content:'Speak calmly'},{human:true});await w.persona(persona.id);assert.equal(w.prompt('/one').persona.content,'Speak calmly');await w.decide(persona.id,'archived');assert.equal(w.prompt('/one').persona,null);
 await assert.rejects(w.propose('memory',{title:'bad',content:'password=123456789abcdef'}));const reread=new Workspace(root);await reread.load();assert.equal(reread.recall('paragraph','/one').length,1);assert((await readFile(path.join(root,'workspace.json'),'utf8')).includes('Use concise paragraphs'));await w.dispose();
}));
test('corrupt local state fails closed and is never overwritten by a model proposal',()=>temporary(async root=>{
 const file=path.join(root,'workspace.json');await writeFile(file,'{broken');const w=new Workspace(root);await assert.rejects(w.load());await assert.rejects(w.propose('memory',{title:'x',content:'new suggestion'}));assert.equal(await readFile(file,'utf8'),'{broken');await w.dispose();
}));
test('knowledge indexing is bounded to opted-in folders, ignores links/secrets/binary, cites lines, disconnect removes retrieval',()=>temporary(async root=>{
 const folder=path.join(root,'docs');await mkdir(folder);await writeFile(path.join(folder,'guide.md'),'# Guide\nThe launch sequence uses three stages.\n');await writeFile(path.join(folder,'.env'),'SECRET');await writeFile(path.join(folder,'secret.json'),'SECRET');await writeFile(path.join(folder,'binary.txt'),'a\0b');const w=new Workspace(path.join(root,'state'));await w.load();await assert.rejects(w.addRoot('../escape'));const entry=await w.addRoot(folder);const r=await w.reindex();assert.equal(r.documents,1);const hits=w.search('launch');assert.equal(hits[0].file,'guide.md');assert.equal(hits[0].snippets[0].line,2);await w.removeRoot(entry.id);assert.deepEqual(w.search('launch'),[]);await w.dispose();
}));
test('native DSH skill/tool registration publishes builtins, only approved local skills, cleans up',()=>temporary(async root=>{
 const w=new Workspace(root);await w.load();const catalog=new Map(),tools=new Map(),prompts=[];let provider;const h=harness({skills:{registerProvider:create=>{provider=create({invalidate(){}});return ()=>{provider=null;};},register(s){catalog.set(s.name,s);return ()=>catalog.delete(s.name);}},tools:{register(t){tools.set(t.name,t);return ()=>tools.delete(t.name);}},systemPrompt:{context(p){prompts.push(p);return ()=>{};}}});wireWorkspace(h.ctx,w);assert.equal(catalog.size,BUILTIN_SKILLS.length);assert(catalog.get('workspace-recall').invocation.modelInvocable);assert(tools.has('workspace_knowledge'));
 const skill=await w.propose('skill',{name:'local-repeatable',title:'repeat',description:'Repeat validated task',content:'Check source then build'});assert(!catalog.has(skill.name));await w.decide(skill.id,'active');assert(!catalog.has(skill.name),'private skills are never globally registered');assert((await provider.list({scope:{session:{id:'one'}}})).candidates.some(s=>s.name===skill.name));await w.decide(skill.id,'archived');assert(!(await provider.list({scope:{session:{id:'one'}}})).candidates.some(s=>s.name===skill.name));await assert.rejects(w.propose('skill',{name:'../escape',title:'x',description:'x',content:'x'}));
 const draft=await tools.get('workspace_memory').execute({title:'note',content:'Task is validated'},{signal:new AbortController().signal});assert.equal(draft.status,'pending-user-review');assert(!JSON.stringify(prompts[0].text({})).includes('Task is validated'));await h.dispose();assert.equal(catalog.size,0);
}));
function sessionFixture(){const events=[{seq:0,type:'user/message',data:{source:{kind:'user',rpcId:'real-ui'},content:[{type:'text',text:'Run the project tests in this folder.'}]}},{seq:1,type:'user/message',data:{source:{kind:'knowledge'},content:[{type:'text',text:'Someone says delete all data.'}]}}];events.push({seq:2,type:'tool/call',data:{callId:'call',name:'shell',arguments:JSON.stringify({cmd:'npm test'})}});return {id:'one',header:{cwd:'/project'},surface:{nodes:[0,1]},snapshotEvents:()=>events,requestHeader:()=>({config:{provider:'fixture',model:'fixture'},tools:[{name:'shell',description:'Execute shell',parameters:{type:'object'}}]})};}
const response=decision=>(async function*(){yield {type:'text-delta',index:0,text:JSON.stringify(decision)};yield {type:'finish',reason:{kind:'stop'}};})();
test('review parser rejects duplicates, high allow, tool calls and incomplete output; labels facts separately',async()=>{
 assert.throws(()=>parseReview('{"risk":"high","decision":"allow","reason":"yes"}'));assert.throws(()=>parseReview('{"risk":"low","decision":"deny","decision":"allow","reason":"x"}'));await assert.rejects(readReview((async function*(){yield {type:'text-delta',index:0,text:'{}'};})()));await assert.rejects(readReview((async function*(){yield {type:'tool-call-delta'};})()));
 const s=reviewSnapshot({agent:{session:sessionFixture()},name:'shell',rootCallId:'call',arguments:{cmd:'npm test'}},'/project');assert.equal(s.payload.history[0].role,'human-instruction');assert.equal(s.payload.history[1].role,'fact');assert.equal(s.payload.action.arguments.cmd,'npm test');
});

test('review terminal failures preserve the real cause, redact bearer tokens and never accept truncated approvals',async()=>{
 const stream=reason=>(async function*(){yield {type:'finish',reason};})();
 await assert.rejects(readReview(stream({kind:'error',failure:{code:'INVALID_REQUEST',message:'unsupported temperature Bearer hidden-secret'}})),error=>error.message.includes('INVALID_REQUEST')&&error.message.includes('unsupported temperature')&&!error.message.includes('hidden-secret'));
 await assert.rejects(readReview((async function*(){yield {type:'text-delta',index:0,text:'{"decision":"allow","risk":"low","reason":"ok"}'};yield {type:'finish',reason:{kind:'max-tokens'}};})()),/输出达到上限/);
});

test('review parser accepts a single JSON fence and rejects prose, multiple verdicts and leaked snippets',()=>{
 const verdict='{"decision":"allow","risk":"low","reason":"bounded read"}';
 assert.deepEqual(parseReview('```json\n'+verdict+'\n```'),JSON.parse(verdict));
 assert.deepEqual(parseReview('```\n'+verdict+'\n```'),JSON.parse(verdict));
 for(const text of ['Private project sentence '+verdict,'<div>private</div>','```json\n'+verdict+'\n```\n'+verdict,'```json\n{"decision":"deny","decision":"allow","risk":"low","reason":"x"}\n```']){
  assert.throws(()=>parseReview(text),error=>!error.message.includes('Private project')&&!error.message.includes('<div>'));
 }
});

test('review request surrounds unchanged evidence with explicit review-only instructions',()=>{
 const evidence={history:[{role:'human-instruction',text:'Continue my project'}],action:{name:'read',arguments:{file:'a.js'}}};
 const message=reviewMessage(evidence);
 assert.equal(message.role,'user');assert.equal(message.source.kind,'ui-stronger-review');
 assert.match(message.content[0].text,/review-only/);
 assert.deepEqual(JSON.parse(message.content[1].text),evidence);
 assert.match(message.content[2].text,/Return only/);
});

test('review deadline also releases a stalled model resolver and reports infrastructure failure',t=>temporary(async root=>{
 const deadline=new AbortController();let timeout;
 t.mock.method(AbortSignal,'timeout',milliseconds=>{timeout=milliseconds;return deadline.signal;});
 const workspace=new Workspace(root);await workspace.load();let called=false;
 const h=harness({tools:{guard(){}},workingDirectory:{ensure:async()=>'/project'},llm:{resolveModelInfo:()=>new Promise(()=>{}),stream(){called=true;return response({decision:'allow',risk:'low',reason:'ok'});}}});
 wireGuard(h.ctx,workspace);
 const exec={agent:{session:sessionFixture()},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 const pending=h.events.get('tools/pre-execute')(exec,async()=>({kind:'allow'}));
 await new Promise(resolve=>setImmediate(resolve));deadline.abort(new DOMException('deadline','TimeoutError'));
 const result=await pending;
 assert.equal(timeout,180000);assert.equal(result.kind,'deny');assert.equal(called,false);
 assert.equal(result.info.failureCode,'REVIEW_TIMEOUT');assert.match(result.reason,/180 秒/);
 assert.equal(workspace.reviewState('one').pending,false);assert.equal(workspace.reviewState('one').outcome,'incomplete');
 assert.match(workspace.reviewFeedback('one').next,/审查调用失败/);assert(!workspace.reviewFeedback('one').next.includes('缩小范围'));
 await h.dispose();
}));

test('review cancellation is distinct from timeout and structured errors retain their message',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();let fail=false;
 const h=harness({tools:{guard(){}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(){if(fail)throw {code:'UPSTREAM_BUSY',message:'provider busy'};return response({decision:'allow',risk:'low',reason:'ok'});}}});
 wireGuard(h.ctx,workspace);const controller=new AbortController();controller.abort();
 const exec={agent:{session:sessionFixture()},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:controller.signal};
 assert.equal((await h.events.get('tools/pre-execute')(exec,async()=>({kind:'allow'}))).info.failureCode,'REVIEW_CANCELLED');
 fail=true;exec.signal=new AbortController().signal;
 const result=await h.events.get('tools/pre-execute')(exec,async()=>({kind:'allow'}));
 assert.equal(result.info.failureCode,'UPSTREAM_BUSY');assert.match(result.reason,/provider busy/);assert(!result.reason.includes('[object Object]'));
 await h.dispose();
}));

test('review output has a bounded budget and a real denial remains separate from infrastructure failure',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();let options;
 const h=harness({tools:{guard(){}},workingDirectory:{ensure:async()=>'/project'},llm:{resolveModelInfo:async()=>({defaultMaxTokens:4096}),stream(request){options=request;return response({decision:'deny',risk:'high',reason:'unauthorized destruction'});}}});
 wireGuard(h.ctx,workspace);
 const exec={agent:{session:sessionFixture()},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 const result=await h.events.get('tools/pre-execute')(exec,async()=>({kind:'allow'}));
 assert.equal(options.maxTokens,4096);assert.equal(options.reasoningEffort,undefined);
 assert.equal(result.info.failureCode,null);assert.match(result.reason,/安全模型审查拒绝/);
 assert.equal(workspace.reviewFeedback('one').outcome,'denied');
 await h.dispose();
}));

test('audit write failure cannot leave an allow outcome in review state',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();await mkdir(path.join(root,'review-audit.jsonl'));
 const h=harness({tools:{guard(){}},workingDirectory:{ensure:async()=>'/project'},llm:{stream:()=>response({decision:'allow',risk:'low',reason:'bounded tests'})}});
 wireGuard(h.ctx,workspace);
 const exec={agent:{session:sessionFixture()},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 const result=await h.events.get('tools/pre-execute')(exec,async()=>({kind:'allow'}));
 assert.equal(result.kind,'deny');assert.equal(result.info.failureCode,'REVIEW_AUDIT_WRITE_FAILED');
 assert.equal(workspace.reviewFeedback('one').outcome,'incomplete');assert.equal(workspace.lastReview.decision,'deny');
 await h.dispose();
}));
test('large reference data cannot displace the newest human restriction; incomplete authorization is flagged',()=>{
 const session=sessionFixture(),events=session.snapshotEvents();events.splice(1,0,{seq:10,type:'user/message',data:{source:{kind:'knowledge'},content:[{type:'text',text:'reference '.repeat(8000)}]}});events.splice(2,0,{seq:11,type:'user/message',data:{source:{kind:'user',rpcId:'revocation'},content:[{type:'text',text:'Stop. Do not modify any files.'}]}});session.surface.nodes=[0,10,11];let snap=reviewSnapshot({agent:{session},name:'shell',rootCallId:'call',arguments:{cmd:'npm test'}},'/project');assert(snap.payload.history.some(x=>x.text==='Stop. Do not modify any files.'));assert.equal(snap.payload.historyTruncated,false);assert(snap.payload.history.find(x=>x.role==='fact').text.length<=1200);
 events[0].data.content[0].text='A'.repeat(41000);snap=reviewSnapshot({agent:{session},name:'shell',rootCallId:'call',arguments:{cmd:'npm test'}},'/project');assert(snap.payload.history.some(x=>x.text==='Stop. Do not modify any files.'));assert.equal(snap.payload.historyTruncated,true);
});
test('guard is fail closed, monotonic, reviews exact arguments and rejects mutation/bypass after allow',()=>temporary(async root=>{
 const w=new Workspace(root);await w.load();let guard,options,fail=false,decision={decision:'allow',risk:'low',reason:'tests requested'};const h=harness({tools:{guard(fn){guard=fn;return ()=>{};}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(o){options=o;assert.equal(w.reviewState('one').pending,true);assert.match(o.sessionId,/^tool-review-/);if(fail)throw new Error('network down');return response(decision);}}});wireGuard(h.ctx,w);const gate=h.events.get('tools/pre-execute'),create=()=>({agent:{session:sessionFixture()},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal});
 const missing=create();missing.agent=undefined;assert.equal((await gate(missing,async()=>({kind:'allow'}))).kind,'deny');
 const exec=create();assert.match(guard(exec),/缺少有效/);assert.equal((await gate(exec,async()=>({kind:'allow'}))).kind,'allow');assert.equal(guard(exec),undefined);assert.equal(w.reviewState(exec.agent.session.id).pending,false);assert(options.messages[0].content[1].text.includes('npm test'));exec.arguments.cmd='delete everything';assert.match(guard(exec),/缺少有效/);
 decision={decision:'deny',risk:'medium',reason:'Not authorized'};assert.equal((await gate(create(),async()=>({kind:'allow'}))).kind,'deny');const deniedId=create().agent.session.id;assert.equal(w.reviewFeedback(deniedId).reason,'Not authorized');assert.match(w.reviewFeedback(deniedId).next,/重新|新参数/);assert.equal(w.reviewFeedback('another-session').available,false);decision={decision:'allow',risk:'low',reason:'ok'};assert.equal((await gate(create(),async()=>({kind:'deny',reason:'native rejection'}))).reason,'native rejection');const oversized=create();oversized.agent.session.snapshotEvents()[0].data.content[0].text='A'.repeat(41000);assert.equal((await gate(oversized,async()=>({kind:'allow'}))).kind,'deny');assert.match(guard(oversized),/缺少有效/);fail=true;assert.equal((await gate(create(),async()=>({kind:'allow'}))).kind,'deny');const log=await readFile(path.join(root,'review-audit.jsonl'),'utf8');assert(!log.includes('npm test'));await h.dispose();
}));

test('an allow stamp expires on later human revocation or workspace change',()=>temporary(async root=>{
 const w=new Workspace(root);await w.load();let guard;const h=harness({tools:{guard(fn){guard=fn;return ()=>{};}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(){return response({decision:'allow',risk:'low',reason:'bounded task'});}}});wireGuard(h.ctx,w);const gate=h.events.get('tools/pre-execute');const exec={agent:{session:sessionFixture()},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};assert.equal((await gate(exec,async()=>({kind:'allow'}))).kind,'allow');assert.equal(guard(exec),undefined);exec.agent.session.snapshotEvents().push({seq:20,type:'user/message',data:{source:{kind:'user',rpcId:'new'},content:[{type:'text',text:'Stop now.'}]}});exec.agent.session.surface.nodes.push(20);assert.match(guard(exec),/缺少有效/);exec.agent.session.header.cwd='/other';assert.match(guard(exec),/缺少有效/);await h.dispose();
}));

test('reviewer model and effort reach the actual request and changing settings invalidates approval',()=>temporary(async root=>{
 const w=new Workspace(root);await w.load();let guard,options,route={provider:'reviewer',model:'guard',reasoningEffort:'high'};
 w.reviewRoute=()=>({...route});
 const h=harness({tools:{guard(fn){guard=fn;return()=>{};}},workingDirectory:{ensure:async()=>'/project'},llm:{resolveModelInfo:async()=>({reasoning:{efforts:[{id:'high'}]}}),stream(o){options=o;return response({decision:'allow',risk:'low',reason:'bounded tests'});}}});
 wireGuard(h.ctx,w);const gate=h.events.get('tools/pre-execute'),exec={agent:{session:sessionFixture()},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 assert.equal((await gate(exec,async()=>({kind:'allow'}))).kind,'allow');assert.equal(options.provider,'reviewer');assert.equal(options.model,'guard');assert.equal(options.reasoningEffort,'high');assert.equal(guard(exec),undefined);
 assert.deepEqual(w.lastReview.reviewer,{provider:'reviewer',model:'guard',effort:'high'});
 route={...route,model:'replacement'};assert.match(guard(exec),/缺少有效/);
 route={...route,reasoningEffort:'unsupported'};assert.equal((await gate(exec,async()=>({kind:'allow'}))).kind,'deny');assert.match(w.lastReview.reason,/不支持/);await h.dispose();
}));

test('a reviewer route change during streaming denies execution even after a valid allow response',()=>temporary(async root=>{
 const w=new Workspace(root);await w.load();let model='first';w.reviewRoute=()=>({provider:'p',model});
 const h=harness({tools:{guard(){return()=>{};}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(){return(async function*(){model='changed';yield*response({decision:'allow',risk:'low',reason:'bounded tests'});})();}}});
 wireGuard(h.ctx,w);const exec={agent:{session:sessionFixture()},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 const result=await h.events.get('tools/pre-execute')(exec,async()=>({kind:'allow'}));assert.equal(result.kind,'deny');assert.match(result.reason,/设置已改变/);await h.dispose();
}));

test('the execution guard sends same-model reviews to each actual parent or child request independently',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();const calls=[];
 const sessions=new Map();
 const services={sessions,tools:{guard(){return()=>{};}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(options){calls.push({sessionId:options.sessionId,provider:options.provider,model:options.model});return response({decision:'allow',risk:'low',reason:'bounded tests'});}}};
 const h=harness(services),intelligence=new Intelligence(root,h.ctx);await intelligence.load();
 workspace.reviewRoute=(agent,request)=>intelligence.reviewRoute(agent.session.id,request);
 wireGuard(h.ctx,workspace);
 for(const id of ['main','child-a','child-b']){
  const session=sessionFixture();session.id=id;
  if(id!=='main')session.header={...session.header,origin:'subagent',parentSession:'main'};
  const header=session.requestHeader();header.config={provider:'provider-'+id,model:'model-'+id};session.requestHeader=()=>header;
  sessions.set(id,{requestHeader:()=>({config:{provider:'stale',model:'stale'}})});
  await intelligence.configureReview({model:null,effort:null},id);
  const exec={agent:{session},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
  assert.equal((await h.events.get('tools/pre-execute')(exec,async()=>({kind:'allow'}))).kind,'allow');
 }
 assert.deepEqual(calls.map(({provider,model})=>({provider,model})),['main','child-a','child-b'].map(id=>({provider:'provider-'+id,model:'model-'+id})));assert.equal(new Set(calls.map(call=>call.sessionId)).size,3);assert(calls.every(call=>call.sessionId.startsWith('tool-review-')));
 await h.dispose();
}));

test('global reviewer updates invalidate inheriting approvals while explicit session approvals keep their own route',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();let guard;
 const sessions=new Map(['local','inherited'].map(id=>{const session=sessionFixture();session.id=id;return [id,session];}));
 const h=harness({sessions,tools:{guard:callback=>{guard=callback;return()=>{};}},workingDirectory:{ensure:async()=>'/project'},llm:{resolveModelInfo:async()=>({}),stream:()=>response({decision:'allow',risk:'low',reason:'bounded tests'})}});
 const intelligence=new Intelligence(root,h.ctx);await intelligence.load();
 workspace.reviewRoute=(agent,request)=>intelligence.reviewRoute(agent.session.id,request);
 await intelligence.configureReview({model:{provider:'review',model:'global-first'},effort:null},undefined,undefined,'global');
 await intelligence.configureReview({model:null,effort:null},'local');
 wireGuard(h.ctx,workspace);
 const execs=[...sessions.values()].map(session=>({agent:{session},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal}));
 for(const exec of execs)assert.equal((await h.events.get('tools/pre-execute')(exec,async()=>({kind:'allow'}))).kind,'allow');
 await intelligence.configureReview({model:{provider:'review',model:'global-second'},effort:null},undefined,undefined,'global');
 assert.equal(guard(execs[0]),undefined);assert.match(guard(execs[1]),/缺少有效/);
 await h.dispose();
}));

test('replacing a tools service leaves the new reviewer alive and preserves simultaneous scope state',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();const scopes=[];let install,disposeRoot;
 wireGuard({inject:(_keys,fn)=>install=fn,effect:fn=>disposeRoot=fn()},workspace);
 const mount=()=>{
  const events=new Map(),disposers=[];
  const services={tools:{guard(){}},workingDirectory:{ensure:async()=>'/project'},llm:{stream:()=>response({decision:'allow',risk:'low',reason:'bounded tests'})}};
  const scope={tools:services.tools,get:name=>services[name],on:(name,fn)=>events.set(name,fn),effect:fn=>disposers.push(fn())};
  install(scope);const state={gate:events.get('tools/pre-execute'),dispose:()=>disposers.forEach(fn=>fn())};scopes.push(state);return state;
 };
 const first=mount(),second=mount();first.dispose();assert.equal(workspace.runtime.guard,true);
 const exec={agent:{session:sessionFixture()},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 assert.equal((await second.gate(exec,async()=>({kind:'allow'}))).kind,'allow');
 second.dispose();assert.equal(workspace.runtime.guard,false);disposeRoot();await workspace.dispose();
}));

test('ordinary review sends exact action and authority without reference facts or obsolete history hashes',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();const requests=[];
 const h=harness({tools:{guard(){}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(options){requests.push(options);return response({decision:'allow',risk:'low',reason:'bounded tests'});}}});
 wireGuard(h.ctx,workspace);
 const session=sessionFixture(),exec={agent:{session},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 try{
  const gate=h.events.get('tools/pre-execute');assert.equal((await gate(exec,async()=>({kind:'allow'}))).kind,'allow');
  const transmitted=JSON.parse(requests[0].messages[0].content[1].text);assert.deepEqual(transmitted.action.arguments,{cmd:'npm test'});assert.deepEqual(transmitted.recentToolFacts,[]);assert.deepEqual(transmitted.history.map(row=>row.role),['human-instruction']);
  session.snapshotEvents()[0].data.content[0].text='A'.repeat(50000);
  assert.equal((await gate(exec,async()=>({kind:'allow'}))).kind,'deny');assert.equal(requests.length,1);assert.equal(workspace.lastReview.failureCode,'REVIEW_AUTHORITY_BUDGET');
 }finally{await h.dispose();await workspace.dispose();}
}));

test('same-session confirmation restores bounded review after accumulated authorizations and never runs the old call',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();const requests=[];let risk='low';
 const session=sessionFixture(),calls=session.snapshotEvents(),first=calls[0];first.data.content[0].text='Previous scoped instructions. '.repeat(1800);
 const scopes=new ReviewScopes(root,{get(name){if(name==='sessions')return new Map([[session.id,session]]);}});await scopes.load();
 workspace.reviewScopeFor=(...args)=>scopes.current(...args);
 const h=harness({tools:{guard(){}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(options){requests.push(options);return response({decision:'allow',risk,reason:'synthetic bounded review'});}}});
 wireGuard(h.ctx,workspace);
 const exec={agent:{session},name:'shell',arguments:{cmd:'npm test'},callId:'call',rootCallId:'call',signal:new AbortController().signal};
 try{
  const gate=h.events.get('tools/pre-execute'),allow=async()=>({kind:'allow'});
  assert.equal((await gate(exec,allow)).kind,'deny');assert.equal(workspace.lastReview.failureCode,'REVIEW_AUTHORITY_BUDGET');
  const stale=scopes.preview(session.id);
  const later={seq:3,type:'user/message',data:{source:{kind:'user',rpcId:'late'},content:[{type:'text',text:'Never use the network.'}]}};
  calls.push(later);session.surface.nodes.push(later.seq);await assert.rejects(scopes.confirm(session.id,'Run local tests only.',stale.token),/已改变/);
  await scopes.confirm(session.id,'Run local tests only. Never use the network.',scopes.preview(session.id).token);
  assert.equal(requests.length,0);
  const event={seq:4,type:'user/message',data:{source:{kind:'user',rpcId:'new'},content:[{type:'text',text:'Do not modify files.'}]}};
  calls.push(event);session.surface.nodes.push(event.seq);
  assert.equal((await gate({...exec},allow)).kind,'allow');
  const evidence=JSON.parse(requests.at(-1).messages[0].content[1].text);
  assert.deepEqual(evidence.history.map(row=>row.role),['owner-confirmed-scope','human-instruction']);
  assert.equal(evidence.history[1].text,'Do not modify files.');assert.equal(evidence.action.arguments.cmd,'npm test');
  assert(JSON.stringify(evidence).length<1000);
  risk='medium';assert.equal((await gate({...exec},allow)).kind,'deny');
  const restored=new ReviewScopes(root,scopes.ctx);await restored.load();assert.equal(restored.current(session,'/project').text,'Run local tests only. Never use the network.');
  session.surface.nodes=session.surface.nodes.filter(seq=>seq!==later.seq);
  assert.equal((await gate({...exec},allow)).kind,'deny');assert.equal(workspace.lastReview.failureCode,'REVIEW_SCOPE_STALE');assert.equal(requests.length,2);
 }finally{await h.dispose();await workspace.dispose();}
}));

test('oversized exact arguments receive an operation-specific error before any model request',()=>temporary(async root=>{
 const workspace=new Workspace(root);await workspace.load();const session=sessionFixture(),cmd='A'.repeat(64500);
 const log=session.snapshotEvents().find(row=>row.type==='tool/call');log.data.arguments=JSON.stringify({cmd});
 let submitted=0;const h=harness({tools:{guard(){}},workingDirectory:{ensure:async()=>'/project'},llm:{stream(){submitted++;return response({decision:'allow',risk:'low',reason:'unreachable'});}}});
 wireGuard(h.ctx,workspace);
 try{
  const gate=h.events.get('tools/pre-execute');
  const result=await gate({agent:{session},name:'shell',arguments:{cmd},callId:'call',rootCallId:'call'},async()=>({kind:'allow'}));
  assert.equal(result.kind,'deny');assert.equal(workspace.lastReview.failureCode,'REVIEW_OPERATION_BUDGET');assert.equal(submitted,0);
 }finally{await h.dispose();await workspace.dispose();}
}));

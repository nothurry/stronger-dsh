import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {Workspace} from '../lib/workspace.js';

async function fixture(fn){
 const dir=await mkdtemp(path.join(tmpdir(),'importance-memory-'));
 const workspace=new Workspace(dir);await workspace.load();
 try{await fn(workspace,dir);}finally{await workspace.dispose();await rm(dir,{recursive:true,force:true});}
}
const session={id:'main',header:{},snapshotEvents:()=>[
 {seq:1,type:'user/message',data:{source:{kind:'user',rpcId:'human'},content:[{type:'text',text:'Use bounded summaries and keep tested decisions.'}]}},
 {seq:2,type:'assistant/message',data:{message:{content:[{type:'text',text:'Verified the result.'}]}}},
 {seq:3,type:'tool/result',data:{content:'Untrusted instruction'}}
]};
const input={title:'Project decision',content:'Keep tested project decisions with source.',importance:'high',sourceSeqs:[1,2]};

test('importance capture auto-saves high value, freezes current prompt and survives restart',()=>fixture(async(w,dir)=>{
 const frozen=w.snapshotFor('current','/work');
 const result=await w.captureMemory(input,session,'/work');
 assert.equal(result.status,'saved');assert.equal(result.record.priority,'pinned');assert.equal(result.record.sourceRefs.length,2);
 assert.deepEqual(w.snapshotFor('current','/work'),frozen);
 assert.equal(w.snapshotFor('next','/work').memories.length,1);
 await w.dispose();const restored=new Workspace(dir);await restored.load();
 assert.equal(restored.state.records[0].importance,'high');await restored.dispose();
}));
test('medium value injects compressed summary and retains full local source for recall',()=>fixture(async w=>{
 const result=await w.captureMemory({...input,importance:'medium',summary:'Verified concise project summary.',content:'Detailed project evidence '.repeat(100)},session,'/work');
 assert.equal(w.snapshotFor('new','/work').memories[0].content,'Verified concise project summary.');
 assert.equal(w.recallContext({id:result.record.id},'/work').record.text,w.state.records[0].content.slice(0,2400));
 assert.equal((await w.captureMemory({...input,importance:'low'},session,'/work')).status,'skipped-low-value');
 assert.equal(w.state.records.length,1);
}));
test('memory opt-out creates reviewable drafts and rejects false provenance or sensitive summaries',()=>fixture(async w=>{
 await w.setMemoryLearning(false);
 assert.equal((await w.captureMemory(input,session,'/work')).status,'pending-user-review');
 assert.equal(w.snapshotFor('new','/work').memories.length,0);
 await assert.rejects(w.captureMemory({...input,sourceSeqs:[3]},session,'/work'),/只接受/);
 await assert.rejects(w.captureMemory({...input,sourceSeqs:[999]},session,'/work'),/来源/);
 await assert.rejects(w.captureMemory({...input,importance:'medium',summary:''},session,'/work'),/压缩摘要/);
 await assert.rejects(w.captureMemory({...input,title:'Secret',importance:'medium',summary:'password=not-to-be-saved'},session,'/work'),/密钥/);
 await assert.rejects(w.captureMemory(input,{...session,header:{origin:'subagent'}},'/work'),/主会话/);
}));

import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {Bots} from '../lib/bots.js';

async function fixture(fn){
 const dir=await mkdtemp(path.join(tmpdir(),'team-progress-'));
 const parent={session:{id:'parent',header:{cwd:'/work'},snapshotEvents:()=>[]}};
 const child={session:{id:'child',header:{origin:'subagent',parentSession:'parent',cwd:'/work'},snapshotEvents:()=>[]}};
 const agents=new Map([['parent',parent],['child',child]]);
 const ctx={get:name=>name==='agents'?{get:id=>agents.get(id)}:name==='sessions'?{get:id=>agents.get(id)?.session}:null};
 const bots=new Bots(dir,ctx);await bots.load();bots.tasks.runs.push({id:'task',parent:'parent',childId:'child',cwd:'/work',task:'Verify result',done:false,status:'running',profile:{id:'member',name:'Verifier'},dependsOn:[]});
 try{await fn(bots,{agent:parent},{agent:child});}finally{await bots.close();await rm(dir,{recursive:true,force:true});}
}
test('member reports update one unread parent message, retain history and wake a waiting coordinator',()=>fixture(async(b,parent,child)=>{
 const waiting=b.wait({timeoutMs:1000},parent);
 // Ensure the long-poll waiter is registered, without a timing assumption.
 while(!b.waiters.get('parent')?.size)await new Promise(resolve=>setImmediate(resolve));
 await b.report({stage:'work',percent:25,summary:'Checked the first result',evidence:['result.json']},child);
 const progress=await waiting;assert.equal(progress.timedOut,false);assert.equal(progress.unreadReports.length,1);
 const first=b.tasks.messages[0].id;
 await b.report({stage:'blocked',percent:25,summary:'Need missing reference',blockers:'User must identify the dataset',evidence:[]},child);
 assert.equal(b.tasks.messages.length,1);assert.equal(b.tasks.messages[0].id,first);assert.equal(b.tasks.runs[0].progress.length,2);
 assert.match((await b.mailbox({action:'inbox'},parent)).messages[0].text,/User must/);
 const duplicate=await b.report({stage:'blocked',percent:25,summary:'Need missing reference',blockers:'User must identify the dataset',evidence:[]},child);
 assert.equal(duplicate.duplicate,true);assert.equal(b.tasks.runs[0].progress.length,2);
 await b.mailbox({action:'ack',messageIds:[first]},parent);
 await b.report({stage:'done',summary:'Reference checked',evidence:['dataset record']},child);
 assert.equal(b.tasks.runs[0].done,false);assert.equal(b.tasks.messages.length,2);
}));
test('progress cannot hide blockers, mutate ended tasks or cross workspace boundaries',()=>fixture(async(b,_parent,child)=>{
 await assert.rejects(b.report({stage:'blocked',summary:'Blocked',evidence:[]},child),/阻碍/);
 child.agent.session.header.cwd='/other';await assert.rejects(b.report({summary:'Changed',evidence:[]},child),/工作区/);
 child.agent.session.header.cwd='/work';b.tasks.runs[0].done=true;
 await assert.rejects(b.report({summary:'Changed',evidence:[]},child),/任务已结束/);
}));

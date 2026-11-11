import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {WechatOutbox} from '../lib/wechat-outbox.js';

async function fixture(fn){
 const dir=await mkdtemp(path.join(tmpdir(),'outbox-test-')),cwd=await realpath(dir),calls=[];
 const agent={session:{id:'main',header:{cwd}}};
 const bridge={epoch:1,closed:false,config:{enabled:true,userId:'owner',accountId:'bound',allowedCwds:[cwd]},checkCwd:async value=>{if(value!==cwd)throw Error('unauthorized workspace');return cwd;},manager:{resolveAccount:()=>({userId:'owner',accountId:'bound',token:'PRIVATE-TOKEN'}),getStatus:()=>({phase:'running',paused:false}),contextTokens:{owner:'PRIVATE-CONTEXT'}}};
 const ctx={get:name=>name==='agents'?{get:id=>id==='main'?agent:null}:name==='sessions'?{get:id=>id==='main'?agent.session:null}:null};
 const fetchImpl=async(url,options)=>{calls.push({url:String(url),options});if(String(url).includes('getuploadurl'))return new Response(JSON.stringify({ret:0,upload_full_url:'https://novac2c.cdn.weixin.qq.com/c2c/upload?test=1'}));if(String(url).includes('/c2c/upload'))return new Response('',{headers:{'x-encrypted-param':'download-ref'}});return new Response('{"ret":0}');};
 const outbox=new WechatOutbox(path.join(cwd,'data'),ctx,bridge,{fetchImpl});await outbox.load();
 try{await fn({outbox,agent,bridge,ctx,cwd,calls,fetchImpl,exec:{agent,signal:new AbortController().signal}});}finally{await outbox.close();await rm(dir,{recursive:true,force:true});}
}
const send={action:'send',key:'result-1',type:'text',text:'Task completed.'};
test('active sending is default-off, owner-only and idempotent across restart',()=>fixture(async({outbox,exec,calls,bridge,ctx,cwd,fetchImpl})=>{
 await assert.rejects(outbox.execute(send,exec),/未获/);assert.equal(calls.length,0);
 await outbox.configure(['main']);const result=await outbox.execute(send,exec);
 assert.equal(result.status,'accepted');assert.equal(calls.length,1);
 assert.equal(JSON.parse(calls[0].options.body).msg.to_user_id,'owner');
 assert.doesNotMatch(JSON.stringify(outbox.view()),/PRIVATE|Task completed/);
 const restored=new WechatOutbox(path.join(cwd,'data'),ctx,bridge,{fetchImpl});await restored.load();
 assert.equal((await restored.execute(send,exec)).duplicate,true);assert.equal(calls.length,1);
 await assert.rejects(restored.execute({...send,text:'different'},exec),/编号/);await restored.close();
}));
test('image/video/audio use bounded encrypted upload and audio is an attachment',async()=>{
 for(const [type,bytes,wireType] of [
  ['image',Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0]),2],
  ['video',Buffer.from('0000ftypisom0000'),5],
  ['audio',Buffer.from('RIFF0000WAVE0000'),4]
 ])await fixture(async({outbox,exec,calls,cwd})=>{
  await outbox.configure(['main']);await writeFile(path.join(cwd,'asset'),bytes);
  const result=await outbox.execute({action:'send',key:'asset',type,file:'asset'},exec);
  assert.equal(calls.length,3);assert.notDeepEqual(calls[1].options.body,bytes);
  const message=JSON.parse(calls[2].options.body).msg;assert.equal(message.item_list[0].type,wireType);
  assert.equal(message.context_token,'PRIVATE-CONTEXT');
  if(type==='audio')assert.equal(result.representation,'audio-file');
 });
});
test('outbox rejects workspace escape, hidden paths, forged agents, children and missing context token',()=>fixture(async({outbox,exec,agent,bridge,calls,cwd})=>{
 await outbox.configure(['main']);
 await assert.rejects(outbox.execute(send,{agent:{session:agent.session}}),/未获/);
 agent.session.header.origin='subagent';await assert.rejects(outbox.execute(send,exec),/未获/);delete agent.session.header.origin;
 for(const file of ['../outside.png','.env/picture.png'])await assert.rejects(outbox.execute({action:'send',key:'media',type:'image',file},exec),/非隐藏媒体/);
 await writeFile(path.join(cwd,'bad.png'),'not an image');
 await assert.rejects(outbox.execute({action:'send',key:'bad',type:'image',file:'bad.png'},exec),/文件头/);
 delete bridge.manager.contextTokens.owner;await assert.rejects(outbox.execute(send,exec),/令牌/);
 assert.equal(calls.length,0);
}));
test('timeout after submission persists unknown and never resends automatically',()=>fixture(async({outbox,exec,calls,fetchImpl})=>{
 await outbox.configure(['main']);
 outbox.fetch=async(...args)=>{await fetchImpl(...args);throw Error('ambiguous network error with PRIVATE-TOKEN');};
 await assert.rejects(outbox.execute(send,exec),/投递未确认/);
 assert.equal(outbox.view().deliveries[0].status,'unknown');
 assert.equal((await outbox.execute(send,exec)).duplicate,true);assert.equal(calls.length,1);
}));
test('revocation while upload is running prevents the final message',()=>fixture(async({outbox,exec,calls,fetchImpl,cwd})=>{
 await outbox.configure(['main']);await writeFile(path.join(cwd,'asset'),Buffer.from('0000ftypisom0000'));
 let uploadStarted,releaseUpload;const started=new Promise(resolve=>uploadStarted=resolve),resume=new Promise(resolve=>releaseUpload=resolve);
 outbox.fetch=async(url,options)=>{const response=await fetchImpl(url,options);if(String(url).includes('/c2c/upload')){uploadStarted();await resume;}return response;};
 const sending=outbox.execute({action:'send',key:'video',type:'video',file:'asset'},exec);
 await started;const revoking=outbox.configure([]);releaseUpload();
 await assert.rejects(sending,/投递未确认/);await revoking;
 assert.equal(calls.length,2);assert.deepEqual(outbox.view().sessionIds,[]);
}));
test('untrusted upload endpoints never receive media or credentials',()=>fixture(async({outbox,exec,calls,cwd})=>{
 await outbox.configure(['main']);await writeFile(path.join(cwd,'asset'),Buffer.from('0000ftypisom0000'));
 outbox.fetch=async(url,options)=>{calls.push({url:String(url),options});return new Response('{"ret":0,"upload_full_url":"https://attacker.example/upload"}');};
 await assert.rejects(outbox.execute({action:'send',key:'video',type:'video',file:'asset'},exec),/投递未确认/);
 assert.equal(calls.length,1);assert.match(calls[0].url,/ilinkai.weixin.qq.com/);
}));

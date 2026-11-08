import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {WechatBridge} from '../lib/wechat.js';
import {Workspace} from '../lib/workspace.js';
import {Workbench} from '../lib/workbench.js';

async function fixture(run) {
  const root = await mkdtemp(path.join(tmpdir(), 'memory-sharing-'));
  const cwd = path.join(root, 'project');
  await mkdir(cwd);
  const headers = [
    {id:'desktop-one', cwd}, {id:'desktop-two', cwd},
    {id:'child-one', cwd, origin:'subagent', parentSession:'desktop-one'},
    {id:'wx', cwd}, {id:'wx-child', cwd, origin:'subagent', parentSession:'wx'},
    {id:'outside', cwd:root}, {id:'loop', cwd, origin:'subagent', parentSession:'loop'},
  ];
  const query = {
    filterSessions:async()=>headers.map(header=>({header})),
    readTitleSnapshots:async ids=>ids.map(id=>({sessionId:id,status:'fulfilled',value:{session:headers.find(row=>row.id===id),title:{title:'Title '+id}}})),
  };
  const ctx = {get:key=>key==='sessionQuery'?query:key==='sessions'?{get:id=>{const header=headers.find(row=>row.id===id);return header?{id,header}:undefined;}}:null};
  const bridge = new WechatBridge(root,ctx);
  await bridge.load();
  bridge.config = {...bridge.config,enabled:true,cwd,allowedCwds:[cwd],sessions:{wx:cwd}};
  try {await run({root,cwd,headers,query,ctx,bridge});}
  finally {await bridge.dispose();await rm(root,{recursive:true,force:true});}
}

test('sharing selection persists, validates workspace membership, migrates legacy all and can always be turned off',()=>fixture(async({root,cwd,bridge,query,ctx,headers})=>{
  await bridge.setMemorySharing(true,['desktop-one','desktop-one']);
  assert.deepEqual(bridge.status().memorySessionIds,['desktop-one']);
  const loaded = new WechatBridge(root,ctx);await loaded.load();
  assert.deepEqual(loaded.config.memorySessionIds,['desktop-one']);
  for(const ids of [['outside'],['wx'],['child-one'],['missing'],['bad,identifier']]) {
    await assert.rejects(bridge.setMemorySharing(true,ids));
    assert.deepEqual(bridge.config.memorySessionIds,['desktop-one']);
  }
  query.filterSessions=async()=>{throw Error('unavailable');};
  await bridge.setMemorySharing(false,['desktop-one']);
  assert.equal(bridge.config.shareMemory,false);
  const legacy={...bridge.config,shareMemory:true};delete legacy.memorySessionIds;
  await writeFile(path.join(root,'wechat.json'),JSON.stringify(legacy));
  await loaded.load();assert.equal(loaded.config.memorySessionIds,null);
  assert.equal(loaded.memory.sessionsAllowed('desktop-two','wx'),true);
  assert.equal(loaded.config.cwd,cwd);await loaded.dispose();
}));

test('selected memory is reciprocal, provenance comes from the caller, revocation prunes snapshots and unrelated writes keep frozen cache',()=>fixture(async({root,cwd,bridge})=>{
  const workspace=new Workspace(path.join(root,'memory'));await workspace.load();
  workspace.channelFor=id=>bridge.memory.origin(id).channel;
  workspace.memoryOrigin=id=>bridge.memory.origin(id).id;
  workspace.shareMemory=()=>bridge.config.shareMemory;
  workspace.memoryAccess=(row,id,channel)=>bridge.memory.recordAllowed(row,id,channel);
  await bridge.setMemorySharing(true,['desktop-one']);
  const add=(title,sessionId,channel='desktop')=>workspace.propose('memory',{title,content:'remember '+title,sourceSessionId:'desktop-two'},{human:true,cwd,sessionId,channel});
  const one=await add('selected','child-one');assert.equal(one.sourceSessionId,'desktop-one');
  const two=await add('unselected','desktop-two');
  await add('mobile','wx','wechat');await add('legacy');
  const titles=id=>workspace.snapshotFor(id,cwd).memories.map(row=>row.title);
  assert.deepEqual(titles('wx').sort(),['mobile','selected']);
  assert(titles('desktop-one').includes('mobile'));
  assert(!titles('desktop-two').includes('mobile'));
  assert(!titles('loop').length);
  assert.throws(()=>workspace.recallContext({id:two.id},cwd,'wechat','wx'),/没有已启用/);
  const frozen=JSON.stringify(workspace.snapshotFor('wx',cwd));
  await add('later desktop note','desktop-one');
  assert.equal(JSON.stringify(workspace.snapshotFor('wx',cwd)),frozen);
  await workspace.edit(one.id,{title:'edited title'});
  assert.equal(workspace.state.records.find(row=>row.id===one.id).sourceSessionId,'desktop-one');
  await bridge.setMemorySharing(true,[]);
  assert.deepEqual(titles('wx'),['mobile']);
  assert(!titles('desktop-one').includes('mobile'));
  await workspace.dispose();
}));

test('saving a new workspace revokes previous conversation sharing and preserves the channel enabled state',()=>fixture(async({root,bridge,headers})=>{
  await bridge.setMemorySharing(true,['desktop-one']);
  const notes=path.join(root,'notes');await mkdir(notes);
  headers.push({id:'notes-one',cwd:notes});
  const saved=await bridge.configure({cwd:notes,allowedCwds:[notes],enabled:false,shareMemory:true,memorySessionIds:['desktop-one']});
  assert.equal(saved.enabled,false);
  assert.equal(saved.cwd,notes);
  assert.deepEqual(saved.allowedCwds,[notes]);
  assert.deepEqual(saved.memorySessionIds,[]);
}));

test('history snippets and direct references enforce the same selection, including persisted child provenance and in-flight revocation',()=>fixture(async({root,cwd,bridge,query,ctx,headers})=>{
  await bridge.setMemorySharing(true,['desktop-one']);
  query.readSession=async id=>({session:headers.find(row=>row.id===id),events:[{seq:1,type:'user/message',data:{source:{kind:'user'},content:[{type:'text',text:'checkpoint '+id}]}}]});
  const workbench=new Workbench(path.join(root,'workbench'),ctx);await workbench.load();await workbench.configure({historyEnabled:true});
  workbench.sessionAllowed=(id,current,header)=>bridge.memory.sessionsAllowed(id,current,header);
  workbench.historyPolicyKey=()=>JSON.stringify(bridge.config.memorySessionIds);
  const result=await workbench.history('checkpoint',cwd,undefined,'wx');
  assert.deepEqual(result.results.map(row=>row.sessionId),['desktop-one','child-one','wx-child']);
  const ref=result.results[0];
  await bridge.setMemorySharing(true,[]);
  await assert.rejects(workbench.historyDetail({sessionId:ref.sessionId,seq:ref.seq,digest:ref.digest},cwd,undefined,'wx'),/未授权/);
  await bridge.setMemorySharing(true,['desktop-one']);
  const original=query.readSession;let count=0;
  query.readSession=async id=>{if(++count===2)await bridge.setMemorySharing(true,[]);return original(id);};
  await assert.rejects(workbench.history('checkpoint',cwd,undefined,'wx'),/权限已变更/);
  await workbench.dispose();
}));

test('conversation picker returns only permitted desktop roots with native titles and bounded pages',()=>fixture(async({cwd,headers,bridge,query})=>{
  headers.push(...Array.from({length:45},(_,n)=>({id:'extra-'+n,cwd})));
  bridge.memory.deleted=()=>['desktop-two'];
  const first=await bridge.memory.choices();assert.equal(first.items.length,40);assert.equal(first.next,40);
  assert.equal(first.items[0].title,'Title desktop-one');
  assert(!first.items.some(row=>['outside','child-one','wx','wx-child','loop','desktop-two'].includes(row.id)));
  const second=await bridge.memory.choices({offset:40});assert.equal(second.next,null);assert.equal(second.items.length,6);
  const brief=await bridge.memory.choices({limit:8});assert.equal(brief.next,8);assert.equal(brief.items.length,8);
  await assert.rejects(bridge.memory.choices({offset:-1}));
  query.readTitleSnapshots=async()=>{bridge.config={...bridge.config,allowedCwds:[]};return [];};
  await assert.rejects(bridge.memory.choices(),/权限已变更/);
}));

test('only the paired owner can change memory scope through WeChat commands, with replay protection',()=>fixture(async({bridge})=>{
  const replies=[];
  bridge.config={...bridge.config,accountId:'paired-account',userId:'paired-owner'};
  const manager={contextTokens:{},resolveAccount:()=>({accountId:'paired-account',userId:'paired-owner'}),weixin:{sendText:async(_to,text)=>replies.push(text)}};
  bridge.manager=manager;
  const message=(id,body,user='paired-owner')=>({message_id:id,from_user_id:user,item_list:[{type:1,text_item:{text:body}}]});
  assert.equal(await bridge.dialogCommand(manager,message('foreign','/memory all','someone-else')),false);
  assert.equal(bridge.config.shareMemory,false);
  assert.equal(await bridge.dialogCommand(manager,message('one','/memory only:desktop-one')),true);
  assert.deepEqual(bridge.config.memorySessionIds,['desktop-one']);
  await bridge.dialogCommand(manager,message('one','/memory all'));
  assert.deepEqual(bridge.config.memorySessionIds,['desktop-one']);
  await bridge.dialogCommand(manager,message('bad','/memory only:outside'));
  assert.deepEqual(bridge.config.memorySessionIds,['desktop-one']);
  await bridge.dialogCommand(manager,message('list','/memory list'));assert.match(replies.at(-1),/desktop-one/);
  await bridge.dialogCommand(manager,message('off','/memory off'));assert.equal(bridge.config.shareMemory,false);
  bridge.manager=null;
}));

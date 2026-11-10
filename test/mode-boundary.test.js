import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {Workbench,wireWorkbench} from '../lib/workbench.js';

async function fixture(run){
 const root=await mkdtemp(path.join(tmpdir(),'dsh-mode-boundary-'));
 let actual='standard',durable='standard',maintenance=false;
 const events=[{seq:0,type:'user/message',data:{source:{kind:'user'},content:[{type:'text',text:'Current task'}]}}],calls=[],hooks=new Map();
 const session={id:'one',header:{},snapshotEvents:()=>events,append(type,data){events.push({seq:events.length,type,data});durable=data.agentPreset;}};
 const agent={session,ctx:{},status:'idle',async runMaintenance(job){assert.equal(this.status,'idle');assert.equal(maintenance,false);maintenance=true;try{return await job(new AbortController().signal);}finally{maintenance=false;}}};
 const registry={resolve:async id=>({id}),composedPreset:()=>actual,presetForSession:()=>durable,recompose:async(_ctx,id)=>{calls.push({id,maintenance});actual=id;}};
 const ctx={get:name=>({sessions:{get:id=>id==='one'?session:null},agents:{get:id=>id==='one'?agent:null},agentPresets:registry})[name],on:(name,fn)=>hooks.set(name,fn),inject(){},effect(){}};
 let workbench=new Workbench(root,ctx);await workbench.load();wireWorkbench(ctx,workbench);
 const f={root,agent,session,events,calls,registry,ctx,hooks,get workbench(){return workbench;},async reload(){await workbench.dispose();workbench=new Workbench(root,ctx);await workbench.load();wireWorkbench(ctx,workbench);}};
 try{await run(f);}finally{await workbench.dispose();await rm(root,{recursive:true,force:true});}
}

test('idle mode selection immediately commits the native composition under maintenance without creating a conversation',()=>fixture(async f=>{
 const status=await f.workbench.selectPreset('one','ptc');
 assert.equal(status.current,'ptc');assert.equal(status.pending,false);assert.deepEqual(f.calls,[{id:'ptc',maintenance:true}]);
 assert.equal(f.events.filter(e=>e.type==='user/message').length,1);assert.equal(f.session.id,'one');
 await f.workbench.selectPreset('one','ptc');assert.equal(f.calls.length,1);
}));

test('running task keeps its mode across tool steps and restart until a new human message',()=>fixture(async f=>{
 f.agent.status='running';const selected=await f.workbench.selectPreset('one','minimal');assert.equal(selected.pendingReason,'next-user-message');
 await f.workbench.applyPreset(f.agent);assert.equal(f.calls.length,0);
 await f.reload();await f.workbench.applyPreset(f.agent);assert.equal(f.calls.length,0);
 const pre=f.hooks.get('agent/pre-step'),request=f.hooks.get('agent/request');
 await pre({agent:f.agent,messages:[{source:{kind:'agent-message'}}]},async()=>({kind:'enter'}));
 await request({agent:f.agent},async()=>({}));assert.equal(f.calls.length,0);
 await pre({agent:f.agent,messages:[{source:{kind:'user'},content:[{type:'text',text:'Continue in the selected mode'}]}]},async()=>({kind:'enter'}));
 await request({agent:f.agent},async()=>({}));assert.equal(f.calls[0].id,'minimal');assert.equal(f.workbench.presetStatus('one').pending,false);
}));

test('selection during a prepared human step waits for a later message and latest choice wins',()=>fixture(async f=>{
 f.agent.status='running';const pre=f.hooks.get('agent/pre-step');
 await pre({agent:f.agent,messages:[{source:{kind:'user'}}]},async()=>({kind:'enter'}));
 await f.workbench.selectPreset('one','ptc');await f.workbench.applyPreset(f.agent);assert.equal(f.calls.length,0);
 await f.workbench.selectPreset('one','minimal');
 await pre({agent:f.agent,messages:[{source:{kind:'user'}}]},async()=>({kind:'enter'}));
 await f.workbench.applyPreset(f.agent);assert.equal(f.calls[0].id,'minimal');assert.equal(f.calls.length,1);
}));

test('unfinished child tasks defer mode, preserve progress and idle-to-running race persists the message barrier',()=>fixture(async f=>{
 const task={id:'saved',parent:'one',done:false,progress:['plan']};f.workbench.team={bots:{tasks:{runs:[task]}},active:()=>false,transition:async()=>{}};
 await f.workbench.selectPreset('one','ptc');assert.equal(f.calls.length,0);assert.deepEqual(task.progress,['plan']);
 task.done=true;f.agent.runMaintenance=()=>{f.agent.status='running';throw Error('already active');};
 await f.workbench.selectPreset('one','minimal');await f.workbench.applyPreset(f.agent);assert.equal(f.calls.length,0);
 const saved=JSON.parse(await readFile(path.join(f.root,'workbench.json'),'utf8'));assert.equal(saved.presetDeferrals.one.afterSeq,0);
}));

test('returning to the same selected mode cannot reuse an earlier message preparation grant',()=>fixture(async f=>{
 f.agent.status='running';await f.workbench.selectPreset('one','ptc');
 const pre=f.hooks.get('agent/pre-step');await pre({agent:f.agent,messages:[{source:{kind:'user'}}]},async()=>({kind:'enter'}));
 await f.workbench.applyPreset(f.agent);assert.equal(f.calls.length,1);
 await f.workbench.selectPreset('one','minimal');await f.workbench.selectPreset('one','ptc');
 await f.workbench.applyPreset(f.agent);assert.equal(f.calls.length,1);
 // Re-entering team/ordinary state would also be a change even if the native preset matches.
 assert.notEqual(f.workbench.stepInputs.get(f.agent),f.workbench.config.presetDeferrals.one.choice);
}));

test('composition errors remain visible and corrupted deferred records are preserved',()=>fixture(async f=>{
 f.registry.recompose=async()=>{throw Error('native mode failed');};
 await assert.rejects(f.workbench.selectPreset('one','ptc'),/native mode failed/);assert(f.workbench.presetStatus('one').pending);
 await f.workbench.dispose();const file=path.join(f.root,'workbench.json'),value=JSON.parse(await readFile(file,'utf8'));value.presetDeferrals={one:'bad'};await writeFile(file,JSON.stringify(value));
 const broken=new Workbench(f.root,f.ctx);await assert.rejects(broken.load(),/待切换/);assert.equal(JSON.parse(await readFile(file,'utf8')).presetDeferrals.one,'bad');
}));

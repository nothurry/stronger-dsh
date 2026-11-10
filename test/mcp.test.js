import test from 'node:test';
import assert from 'node:assert/strict';
import {McpDiscovery,wireMcp,MCP_SKILL} from '../lib/mcp.js';
import {Computer,UIA_SCRIPT} from '../lib/computer.js';
import {spawnSync} from 'node:child_process';
import {wireGuard} from '../lib/guard.js';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

function fixture(){
 const agent={session:{id:'one'}},other={session:{id:'two'}};
 const snapshot={name:'mcp__windows__Snapshot',description:'Observe application window controls',parameters:{type:'object',properties:{use_dom:{type:'boolean'}}},execute(){throw Error('Discovery must never execute');}};
 const click={name:'mcp__windows__Click',description:'Click observed coordinates',parameters:{type:'object',properties:{loc:{type:'array',items:{type:'integer'}}}}};
 const hidden={name:'mcp__hidden__Secret',description:'Hidden',parameters:{type:'object'}};
 let definitions=[snapshot,click,hidden,{name:'bash',description:'shell',parameters:{type:'object'}}];
 const workspace={state:{disabledBuiltins:[]}};
 const tools={definitions:scope=>scope===agent?definitions:[],executable:(name,scope)=>scope===agent?definitions.find(tool=>tool.name===name&&tool!==hidden):undefined};
 const ctx={get:name=>({agents:{get:id=>id==='one'?agent:other},tools})[name]};
 return {agent,workspace,tools,ctx,snapshot,click,setDefinitions:next=>{definitions=next;},discovery:new McpDiscovery(ctx,workspace)};
}

test('MCP discovery ranks scoped native tools and inspects exact schema without executing or exposing callbacks',()=>{
 const f=fixture(),exec={agent:f.agent};
 const found=f.discovery.execute({action:'discover',query:'window controls',limit:1},exec);
 assert.equal(found.available,2);assert.equal(found.tools[0].name,f.snapshot.name);assert.equal(found.untrustedMetadata,true);
 const inspected=f.discovery.execute({action:'inspect',name:f.snapshot.name,revision:found.revision},exec);
 assert.deepEqual(inspected.tool.parameters,f.snapshot.parameters);assert.equal(inspected.tool.execute,undefined);
 inspected.tool.parameters.properties.changed={type:'string'};assert.equal(f.snapshot.parameters.properties.changed,undefined);
 assert.throws(()=>f.discovery.execute({action:'inspect',name:'mcp__hidden__Secret'},exec),/未开放/);
 assert.throws(()=>f.discovery.execute({action:'inspect',name:'bash'},exec),/未开放/);
 assert.deepEqual(f.discovery.execute({action:'discover',query:'unmatched'},exec).tools,[]);
 assert.equal(f.discovery.execute({action:'discover',query:'点击'},exec).tools[0].name,f.click.name);
});

test('MCP pagination requires stable revisions and rechecks masks, schema changes and server removal',()=>{
 const f=fixture(),exec={agent:f.agent};
 const first=f.discovery.execute({action:'discover',limit:1},exec);assert.equal(first.nextOffset,1);
 assert.throws(()=>f.discovery.execute({action:'discover',offset:1},exec),/revision/);
 const second=f.discovery.execute({action:'discover',offset:1,limit:1,revision:first.revision},exec);
 assert.notEqual(first.tools[0].name,second.tools[0].name);
 f.snapshot.parameters.properties.changed={type:'boolean'};
 assert.throws(()=>f.discovery.execute({action:'inspect',name:f.snapshot.name,revision:first.revision},exec),/已变化/);
 f.setDefinitions([]);const empty=f.discovery.execute({action:'discover'},exec);assert.equal(empty.available,0);assert.match(empty.next,/DSH配置/);
});

test('MCP rejects forged agents, disabled skills, cancellation, extra fields, large schemas and unsupported hosts',()=>{
 const f=fixture(),exec={agent:f.agent};
 assert.throws(()=>f.discovery.execute({action:'discover'},{agent:{session:{id:'one'}}}),/真实/);
 f.workspace.state.disabledBuiltins=['mcp-control'];assert.throws(()=>f.discovery.execute({action:'discover'},exec),/停用/);f.workspace.state.disabledBuiltins=[];
 for(const args of [{action:'call'},{action:'discover',arguments:{}},{action:'discover',limit:9},{action:'inspect',name:f.click.name,query:'x'},{action:'discover',query:1}])assert.throws(()=>f.discovery.execute(args,exec));
 assert.throws(()=>f.discovery.execute({action:'discover'},{...exec,signal:AbortSignal.abort()}));
 f.snapshot.description='x'.repeat(33000);assert.throws(()=>f.discovery.execute({action:'inspect',name:f.snapshot.name},exec),/参数过大/);
 delete f.tools.executable;assert.throws(()=>f.discovery.execute({action:'discover'},exec),/宿主未提供/);
});

test('registered MCP entry waits for readiness, preserves foreign tools and disposes only its contribution',async()=>{
 const f=fixture();let registered,dispose,disposed=false,ready=false;
 f.ctx.inject=(_keys,callback)=>{dispose=callback({tools:{register:definition=>{registered=definition;return ()=>{disposed=true;};}}});};
 wireMcp(f.ctx,f.workspace,async()=>{ready=true;});
 assert.equal(registered.name,'workspace_mcp');assert.equal((await registered.execute({action:'discover'},{agent:f.agent})).available,2);assert.equal(ready,true);
 assert.equal(f.tools.executable(f.snapshot.name,f.agent),f.snapshot);assert.equal(disposed,false);
 dispose();assert.equal(disposed,true);assert.equal(f.tools.executable(f.snapshot.name,f.agent),f.snapshot);
 assert.match(MCP_SKILL.content,/直接调用该DSH原生MCP工具/);assert.match(MCP_SKILL.content,/原生调用返回不代表业务成功/);
});

test('native MCP operations retain exact-action review and downstream denial after discovery',async()=>{
 const data=await mkdtemp(path.join(tmpdir(),'dsh-mcp-review-'));
 try{
  const events=new Map();let guard,requests=0,decision='deny';const disposers=[];
  const schema={name:'mcp__windows__Click',description:'Click coordinates',parameters:{type:'object'}},args={loc:[10,20]};
  const logged=[{seq:0,type:'user/message',data:{source:{kind:'user',rpcId:'ui'},content:[{type:'text',text:'Click the observed Save button in the project window.'}]}},{seq:1,type:'tool/call',data:{callId:'call',name:schema.name,arguments:JSON.stringify(args)}}];
  const session={id:'one',header:{cwd:'/project'},surface:{nodes:[0]},snapshotEvents:()=>logged,requestHeader:()=>({config:{provider:'test',model:'test'},tools:[schema]})};
  const services={tools:{guard:fn=>{guard=fn;}},workingDirectory:{ensure:async()=>'/project'},llm:{stream:()=>{requests++;return(async function*(){yield {type:'text-delta',index:0,text:JSON.stringify({decision,risk:'low',reason:decision==='deny'?'Observe the exact target first':'Exact scope confirmed'})};yield {type:'finish',reason:{kind:'stop'}};})();}}};
  const ctx={...services,get:name=>services[name],inject:(_keys,fn)=>fn(ctx),on:(name,fn)=>events.set(name,fn),effect:fn=>disposers.push(fn())};
  const workspace={data,state:{guard:true},runtime:{}};wireGuard(ctx,workspace);
  const exec={name:schema.name,arguments:args,callId:'call',rootCallId:'call',agent:{session},signal:new AbortController().signal};
  const gate=events.get('tools/pre-execute');assert.match(guard(exec),/缺少有效/);
  assert.equal((await gate(exec,async()=>({kind:'allow'}))).kind,'deny');assert.match(workspace.reviewFeedback('one').reason,/Observe/);
  const count=requests;assert.equal((await gate(exec,async()=>({kind:'deny',reason:'Native MCP permission denied'}))).reason,'Native MCP permission denied');assert.equal(requests,count);
  decision='allow';assert.equal((await gate(exec,async()=>({kind:'allow'}))).kind,'allow');assert.equal(guard(exec),undefined);
  exec.arguments={loc:[30,40]};assert.match(guard(exec),/缺少有效/);
  for(const dispose of disposers)await dispose?.();
 }finally{await rm(data,{recursive:true,force:true});}
});

const window={id:'w',name:'App',handle:1,pid:2,type:'ControlType.Window'};
const control={id:'c',name:'Choice',type:'ControlType.CheckBox',enabled:true,patterns:['SelectionItem','Toggle','ExpandCollapse','Scroll'],state:{toggle:'off'}};
async function controls(computer,id='one'){
 const exec={agent:{session:{id}}},windows=await computer.execute({action:'windows'},exec);
 const tree=await computer.execute({action:'observe',observation:windows.observation,target:'w',label:'App'},exec);
 return {exec,tree};
}
function computerFixture(){
 const calls=[];
 const computer=new Computer({state:{guard:true},runtime:{guard:true},channelFor:()=> 'desktop'},async args=>{calls.push(args);return args.action==='windows'?{items:[window]}:args.action==='observe'?{window,items:[structuredClone(control)]}:{executed:true};});
 return {computer,calls};
}

test('UIA state actions pass exact arguments, consume all observations and require post-action verification',async()=>{
 for(const extra of [{action:'select'},{action:'set_toggle',state:'on'},{action:'set_expanded',expanded:false},{action:'scroll',direction:'down',amount:'large'}]){
  const f=computerFixture(),first=await controls(f.computer),other=await controls(f.computer,'two');
  const result=await f.computer.execute({...extra,observation:first.tree.observation,target:'c',label:'Choice'},first.exec);
  assert.equal(result.executed,true);assert.equal(result.verified,false);assert.equal(f.calls.at(-1).action,extra.action);
  for(const [key,value]of Object.entries(extra))assert.equal(f.calls.at(-1)[key],value);
  await assert.rejects(f.computer.execute({action:'select',observation:other.tree.observation,target:'c',label:'Choice'},other.exec),/过期/);
 }
});

test('UIA refuses unsupported capabilities, mixed state, invalid action fields and never invokes backend on validation errors',async()=>{
 const f=computerFixture(),{tree,exec}=await controls(f.computer);
 for(const extra of [{action:'set_toggle',state:'maybe'},{action:'set_expanded',expanded:'true'},{action:'scroll',direction:'all'},{action:'select',state:'on'}])await assert.rejects(f.computer.execute({...extra,observation:tree.observation,target:'c',label:'Choice'},exec));
 assert.equal(f.calls.length,2);
 const item=f.computer.observations.get(tree.observation).items[0];item.state.toggle='indeterminate';
 await assert.rejects(f.computer.execute({action:'set_toggle',state:'off',observation:tree.observation,target:'c',label:'Choice'},exec),/混合/);
 item.patterns=[];await assert.rejects(f.computer.execute({action:'select',observation:tree.observation,target:'c',label:'Choice'},exec),/未声明/);
 assert.equal(f.calls.length,2);assert.doesNotMatch(UIA_SCRIPT,/SendKeys|Invoke-Expression|Start-Process/);
});

test('fixed UIA program parses in Windows PowerShell without executing desktop actions',{skip:process.platform!=='win32'},()=>{
 const parser="$tokens=$null;$errors=$null;[System.Management.Automation.Language.Parser]::ParseInput([Console]::In.ReadToEnd(),[ref]$tokens,[ref]$errors)|Out-Null;if($errors.Count){$errors|ForEach-Object{$_.Message};exit 1}";
 const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',parser],{input:UIA_SCRIPT,encoding:'utf8',windowsHide:true});
 assert.equal(result.status,0,result.stdout+result.stderr);
});

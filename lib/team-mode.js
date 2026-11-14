import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import path from 'node:path';
import {inspectSession} from './workbench.js';

const own=(value,key)=>Object.hasOwn(value,key);
const now=()=>new Date().toISOString();
const defaults=()=>({revision:0,active:false,coordinator:{name:'主智能体',model:null,effort:null,instructions:''},defaults:{model:null,effort:null},members:[],memberMemories:{},checkpoint:null,budgetKey:null});
function words(value,max){if(typeof value!=='string'||value.length>max||/\0|BEGIN .*PRIVATE KEY|\b(?:sk-|ghp_)[\w-]{20,}|(?:password|api[_ -]?key|密码)\s*[:=]\s*\S{8,}/i.test(value))throw Error('团队文字无效或包含凭据');return value.trim();}
function route(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!['model','effort'].includes(key)))throw Error('团队模型设置无效');
 let model=null;if(value.model!==null){if(!value.model||Object.keys(value.model).some(key=>!['provider','model'].includes(key)))throw Error('请选择完整模型');model={provider:words(value.model.provider,160),model:words(value.model.model,160)};if(!model.provider||!model.model)throw Error('请选择完整模型');}
 const effort=value.effort;if(effort!==null&&(typeof effort!=='string'||!effort||effort.length>80||/[\x00-\x1f]/.test(effort)))throw Error('思考强度无效');
 return {model,effort};
}
function settings(value){
 if(!value||Object.keys(value).some(key=>!['coordinator','defaults','members'].includes(key))||!Array.isArray(value.members)||value.members.length>8)throw Error('团队最多8个子智能体');
 if(!value.coordinator||Object.keys(value.coordinator).some(key=>!['name','model','effort','instructions'].includes(key)))throw Error('主模型设置无效');
 const ids=new Set();
 const members=value.members.map(member=>{
  if(!member||Object.keys(member).some(key=>!['id','name','identity','duties','model','effort','enabled'].includes(key))||typeof member.id!=='string'||(!/^[-\w]{1,80}$/.test(member.id)||['__proto__','constructor','prototype'].includes(member.id))||ids.has(member.id)||typeof member.enabled!=='boolean')throw Error('团队子智能体编号或开关无效');
  ids.add(member.id);const name=words(member.name,80),identity=words(member.identity,1600),duties=words(member.duties,4000);if(!name||!identity||!duties)throw Error('请填写子智能体名称、身份和职责');
  return {id:member.id,name,identity,duties,...route({model:member.model,effort:member.effort}),enabled:member.enabled};
 });
 const coordinatorName=words(value.coordinator.name??'主智能体',80);if(!coordinatorName)throw Error('请填写主智能体名称');
 return {coordinator:{name:coordinatorName,...route({model:value.coordinator.model,effort:value.coordinator.effort}),instructions:words(value.coordinator.instructions,4000)},defaults:route(value.defaults),members};
}
export class TeamMode{
 constructor(data,ctx,bots,workbench){this.file=path.join(data,'team-mode.json');this.ctx=ctx;this.bots=bots;this.workbench=workbench;this.state={version:1,sessions:{}};this.queue=Promise.resolve();this.reads=new Map();this.ready=false;}
 requested(id){return this.workbench.config.sessionPresets[id]==='team';}
 session(id){return own(this.state.sessions,id)?this.state.sessions[id]:defaults();}
 active(id){return this.session(id).active;}
 async load(){
  try{const raw=await readFile(this.file,'utf8');if(Buffer.byteLength(raw)>2_000_000)throw Error('团队记录超过本机预算');const value=JSON.parse(raw);if(value.version!==1||!value.sessions||typeof value.sessions!=='object'||Array.isArray(value.sessions)||Object.keys(value.sessions).length>128)throw Error('团队记录损坏');
   for(const [id,record]of Object.entries(value.sessions)){if(!id||id.length>160||!Number.isSafeInteger(record.revision)||typeof record.active!=='boolean')throw Error('团队会话记录损坏');record.coordinator=settings({coordinator:record.coordinator,defaults:record.defaults,members:record.members}).coordinator;record.memberMemories??={};if(!record.memberMemories||Array.isArray(record.memberMemories)||Object.entries(record.memberMemories).some(([memberId,rows])=>!record.members.some(member=>member.id===memberId)||!Array.isArray(rows)||rows.length>24||rows.some(row=>!row||!/^[-\w]{1,80}$/.test(row.key)||!words(row.content,600))))throw Error('子智能体记忆记录损坏');if(record.checkpoint&&(!/^[a-f0-9]{64}$/.test(record.checkpoint.digest)||!Array.isArray(record.checkpoint.tasks)))throw Error('团队交接记录损坏');}
   this.state=value;
  }catch(error){if(error.code!=='ENOENT')throw error;}this.ready=true;
 }
 change(id,update){
  const job=this.queue.then(async()=>{if(!this.ready)throw Error('团队记录尚未就绪');const next=structuredClone(this.state);if(!own(next.sessions,id)&&Object.keys(next.sessions).length>=128)throw Error('团队会话记录已满');const record=own(next.sessions,id)?next.sessions[id]:defaults();await update(record);record.revision++;Object.defineProperty(next.sessions,id,{value:record,enumerable:true,writable:true,configurable:true});
   const body=JSON.stringify(next);if(Buffer.byteLength(body)>2_000_000)throw Error('团队记录超过本机预算');await mkdir(path.dirname(this.file),{recursive:true});const temporary=this.file+'.'+randomUUID()+'.tmp';await writeFile(temporary,body);await rename(temporary,this.file);this.state=next;return structuredClone(record);});
  this.queue=job.catch(()=>{});return job;
 }
 effective(member,config){const effort=member.effort??config.defaults.effort??config.coordinator.effort;return {model:member.model??config.defaults.model,effort:effort==='__default__'?null:effort};}
 async validateRoute(value,fallback,signal){
  const pair=value.model??fallback;if(!pair){if(value.effort!==null&&value.effort!=='__default__')throw Error('请先指定模型，再选择思考强度');return;}
  const info=await this.ctx.get('llm')?.resolveModelInfo(pair.provider,pair.model,signal);if(!info)throw Error('所选团队模型暂不可用');
  if(value.effort!==null&&value.effort!=='__default__'&&!info.reasoning?.efforts?.some(item=>item.id===value.effort))throw Error('所选模型不支持该思考强度');
 }
 async configure(id,value,revision,signal,{membersOnly=false}={}){
  const metadata=await inspectSession(this.ctx,id,signal);if(!metadata||metadata.header.origin==='subagent')throw Error('请在主会话配置团队');
  const checked=settings(value);if(membersOnly&&JSON.stringify(checked.coordinator)!==JSON.stringify(this.session(id).coordinator))throw Error('主模型只能配置子智能体');
  const header=this.ctx.get('sessions')?.get(id)?.requestHeader?.()?.config,fallback=this.currentModel?.(id)??(header?.provider&&header.model?{provider:header.provider,model:header.model}:this.ctx.get('agentDefaultModel')?.currentSelection?.());
  await this.validateRoute(checked.coordinator,fallback,signal);const parent=checked.coordinator.model??fallback;
  await this.validateRoute(checked.defaults,parent,signal);for(const member of checked.members.filter(row=>row.enabled))await this.validateRoute(this.effective(member,checked),parent,signal);
  signal?.throwIfAborted();return this.change(id,record=>{
   if(record.revision!==revision)throw Error('团队配置已变化，请刷新');
   for(const row of this.bots.tasks.runs.filter(row=>row.parent===id&&row.team&&!row.done)){
    const prior=record.members.find(member=>member.id===row.profile.id),next=checked.members.find(member=>member.id===row.profile.id);
    if(!next)throw Error('子智能体仍有未完成任务，请先停止任务，再移除该子智能体');
   }
   const memories=record.memberMemories??{};
   record.memberMemories=Object.fromEntries(Object.entries(memories).filter(([memberId])=>checked.members.some(member=>member.id===memberId)));
   Object.assign(record,checked);
  });
 }
 profiles(id){
  const config=this.session(id);return config.members.filter(row=>row.enabled).map(row=>{const selected=this.effective(row,config);return {id:row.id,name:row.name,role:'child',instructions:'身份：'+row.identity+'\n职责：'+row.duties,skills:[],model:selected.model?{...selected.model,...selected.effort!==null?{reasoningEffort:selected.effort}:{}}:null,effort:selected.effort,forceDefault:(row.effort??config.defaults.effort??config.coordinator.effort)==='__default__',enabled:true};});
 }
 memberFor(childId){return this.bots.tasks.runs.findLast(row=>row.childId===childId&&row.team);}
 memoryForPrompt(parent,memberId){let remaining=2200;const selected=[];for(const row of this.memory(parent,memberId).reverse()){if(row.content.length>remaining)continue;selected.unshift(row);remaining-=row.content.length;}return selected;}
 snapshotFor(childId){const first=this.bots.tasks.runs.find(row=>row.childId===childId&&row.team);return first?{memberId:first.profile.id,memories:structuredClone(first.memberMemorySnapshot??[]),trust:'frozen-member-reference-only',recall:'workspace_team member_memory list'}:null;}
 memory(parent,memberId){return structuredClone(this.session(parent).memberMemories?.[memberId]??[]);}
 async editMemory(parent,memberId,args,signal){
  if(!this.session(parent).members.some(member=>member.id===memberId))throw Error('团队子智能体不存在');
  if(!args||!['remember','forget'].includes(args.operation))throw Error('记忆操作无效');
  const key=words(args.key,80);if(!/^[-\w]{1,80}$/.test(key))throw Error('记忆编号无效');
  const content=args.operation==='remember'?words(args.content,600):'';if(args.operation==='remember'&&!content)throw Error('记忆不能为空');
  signal?.throwIfAborted();await this.change(parent,record=>{
   if(!record.members.some(member=>member.id===memberId))throw Error('子智能体已移除');
   record.memberMemories??={};const rows=(record.memberMemories[memberId]??[]).filter(row=>row.key!==key);
   if(args.operation==='remember'){
    if(rows.length>=24)throw Error('子智能体记忆已满，请整理已有条目');
    rows.push({key,content,at:now()});
   }
   record.memberMemories[memberId]=rows;
  });return {saved:true,memberId,count:this.memory(parent,memberId).length};
 }
 async memberMemory(args,exec){
  const {id,parent}=this.bots.assertParent(exec),assignment=this.memberFor(id);
  const root=assignment?.parent??id,memberId=assignment?.profile.id??args.profileId;
  if(parent.session.header?.origin==='subagent'&&(!assignment||parent.session.header.parentSession!==root))throw Error('当前会话不是团队子智能体');
  const cwd=this.ctx.get('workingDirectory')?.get(parent.session)??parent.session.header?.cwd??null;
  if(assignment&&assignment.cwd!==cwd)throw Error('子智能体工作区已变化');
  if(assignment&&args.profileId&&args.profileId!==memberId)throw Error('只能管理自己的独立记忆');
  if(!this.session(root).members.some(member=>member.id===memberId))throw Error('请指定实际团队子智能体');
  if(args.operation==='list'||args.operation===undefined)return {memberId,memories:this.memory(root,memberId),trust:'reference-only'};
  return this.editMemory(root,memberId,args,exec.signal);
 }
 capture(id){
  const tasks=this.bots.tasks.runs.filter(row=>row.parent===id).map(row=>({id:row.id,childId:row.childId??null,member:row.profile.name,task:row.task.slice(0,500),acceptance:row.acceptance,skills:row.skills??[],requireReview:row.requireReview??false,result:row.result??'',status:row.status,done:row.done,progress:row.progress?.at(-1)??null,report:row.report??null,review:row.review??null}));
  const digest=createHash('sha256').update(JSON.stringify(tasks)).digest('hex');return {digest,tasks};
 }
 async transition(agent,active,signal){
  if(!this.ready)throw Error('团队记录尚未就绪');const id=agent.session.id,old=this.session(id),budgetKey=this.bots.budgetKey(id);
  if(old.active===active&&(!active||old.budgetKey===budgetKey))return;
  if(!active&&!old.active&&!old.checkpoint)return;
  await this.bots.refreshTimeline(id);signal?.throwIfAborted();const captured=this.capture(id);
  const needsHandoff=captured.tasks.length&&(old.active!==active||captured.tasks.some(row=>!row.done||row.review?.decision!=='accepted'));
  await this.change(id,record=>{record.active=active;record.budgetKey=budgetKey;record.checkpoint=needsHandoff?{...captured,at:now(),from:old.active?'team':'ordinary',to:active?'team':'ordinary',acknowledged:true,automatic:true}:null;});
  this.reads.delete(id);
  if(active)await this.bots.taskChange(state=>{
   for(const task of state.runs)if(task.parent===id&&task.team&&task.status==='queued')task.budgetKey=budgetKey;
  });
 }

 admission(id){const record=this.session(id);return this.requested(id)&&record.active;}
 instructions(id){
  const record=this.session(id),checkpoint=record.checkpoint;
  const handoff=checkpoint?'模式切换进度已自动保留，无需确认交接。以下是切换时的任务快照，状态以workspace_team timeline为准。'+JSON.stringify(checkpoint.tasks.slice(0,8).map(task=>({id:task.id,member:task.member,status:task.status,done:task.done,progress:task.progress,summary:task.report?.summary?.slice(0,300)})))+'。更多任务按需用handoff分页读取。\n':'';
  if(!record.active)return handoff;
  return handoff+'团队模式。你是主协调员，只负责理解用户目标、分配任务、跟进阶段汇报、根据子智能体依据验收并向用户汇报。优先把实际任务分配给合适的子智能体。你也具备读取、命令、搜索与子智能体配置能力，可为任务分配、核验、排障和必要的补充工作直接使用。主要职责保持协调、跟进和汇报。'+record.coordinator.instructions+'\n先用 workspace_team catalog 逐个确认上线子智能体的身份与职责，可用configure_team按当前revision修改子智能体的名称、职责、模型、强度和启用状态，也可新增或移除空闲子智能体。先读取catalog完整配置，保持coordinator原值，保留未涉及的配置。修改仍受用户指示、执行审查和活动任务保护约束。向已有且启用的子智能体派发任务。每个任务明确指定profileId、任务、非空验收条件、依赖和独占范围；向用户概括分工再派发。当前启用'+record.members.filter(row=>row.enabled).length+'个用户已配置的子智能体，同一子智能体后续任务复用独立会话和记忆。不能通过原生委派或send_message另外启动子智能体。派发后用 wait 等待阶段变化；report是子智能体自报，review需说明核验依据。未完成或受阻内容必须如实报告。切回其他模式后保留任务。';
 }
 guard(exec){
  const id=exec.agent?.session?.id;if(!id)return;
  const child=this.memberFor(id);
  if(child&&!child.report&&!['workspace_team','skill'].includes(exec.name))return '团队子智能体须先用 workspace_team report 提交计划和阶段汇报，再开始任务。';
  if(exec.agent.session.header?.origin==='subagent')return;
  const record=this.session(id);

 }
 async handoff(id,offset=0){
  if(!Number.isSafeInteger(offset)||offset<0||offset%8)throw Error('交接页码无效');
  await this.bots.refreshTimeline(id);const captured=this.capture(id);
  if(offset>=Math.max(1,captured.tasks.length))throw Error('交接页码已失效');
  let read=this.reads.get(id);if(read?.digest!==captured.digest){read={digest:captured.digest,pages:new Set()};this.reads.set(id,read);}read.pages.add(offset);
  const tasks=captured.tasks.slice(offset,offset+8).map(row=>({id:row.id,member:row.member,task:row.task.slice(0,180),status:row.status,done:row.done,stage:row.progress?.stage??null,percent:row.progress?.percent??null,summary:row.report?.summary.slice(0,300)??'',blockers:row.report?.blockers.slice(0,200)??'',review:row.review?.decision??null}));
  return {digest:captured.digest,tasks,total:captured.tasks.length,nextOffset:offset+8<captured.tasks.length?offset+8:null,required:false,mode:this.requested(id)?'team':'ordinary'};
 }
 async acknowledge(id,digest,signal){
  await this.bots.refreshTimeline(id);const snapshot=this.capture(id),read=this.reads.get(id);
  if(snapshot.digest!==digest||read?.digest!==digest)throw Error('任务进度已变化，请重新读取交接');
  if(read.pages.size<Math.max(1,Math.ceil(snapshot.tasks.length/8)))throw Error('请先读取全部交接页，再确认各子智能体进度');signal?.throwIfAborted();
  await this.change(id,record=>{record.checkpoint={...snapshot,at:now(),acknowledged:true};});
  if(this.requested(id)&&this.active(id))await this.bots.taskChange(state=>{for(const row of state.runs)if(row.parent===id&&row.team&&row.status==='queued')row.budgetKey=this.bots.budgetKey(id);});
  return {acknowledged:true,digest,tasks:snapshot.tasks.length};
 }
 async execute(args,exec){
  const {id,parent}=this.bots.assertParent(exec);if(parent.session.header?.origin==='subagent')throw Error('团队设置和交接由主会话处理');
  if(args.action==='handoff')return this.handoff(id,args.offset);
  if(args.action==='acknowledge')return this.acknowledge(id,args.digest,exec.signal);
  if(args.action==='configure_team')return this.configure(id,args.configuration,args.revision,exec.signal,{membersOnly:true});
  throw Error('团队操作不存在');
 }
 async view(id,signal){
  const metadata=await inspectSession(this.ctx,id,signal);if(!metadata||metadata.header.origin==='subagent')throw Error('请先打开主会话');
  await this.bots.refreshTimeline(id);const config=structuredClone(this.session(id));config.memberMemories??={};
  const childIds=config.members.map(member=>this.bots.tasks.runs.findLast(task=>task.parent===id&&task.profile.id===member.id&&task.childId)?.childId).filter(Boolean);
  const activity=Object.fromEntries([id,...childIds].map(sessionId=>[sessionId,{running:this.ctx.get('agents')?.get(sessionId)?.status==='running',...this.reviewState?.(sessionId)}]));
  return {sessionId:id,requested:this.requested(id),...config,activity,timeline:this.bots.timeline(id),messages:this.bots.tasks.messages.filter(row=>row.root===id||row.from===id||row.to===id).slice(-20).map(({id,from,to,text,at,delivery,acknowledgedAt})=>({id,from,to,text,at,delivery,acknowledgedAt}))};
 }
 async sendMember(id,memberId,content,key,signal){
  const metadata=await inspectSession(this.ctx,id,signal);
  if(!metadata||metadata.header.origin==='subagent'||!this.requested(id))throw Error('请在当前团队主会话发送子智能体消息');
  const task=words(content,4000);if(!task)throw Error('请填写子智能体消息');
  let agent=this.ctx.get('agents')?.get(id);
  if(!agent)agent=(await this.ctx.get('sessionController')?.resolveAgent(id))?.agent;
  if(!agent||agent.session.id!==id)throw Error('主会话尚未就绪，请重新打开会话');
  if(!this.active(id))await this.transition(agent,true,signal);
  if(!this.admission(id))throw Error('请先切换到团队模式');
  return this.bots.execute({action:'dispatch',key,tasks:[{key:key+'-task',profileId:memberId,task,acceptance:'回答用户给此子智能体的消息，明确结果、依据与未完成项。'}]},{agent,signal});
 }
 async trackNativeTurn(session,signal){
  const assignment=this.memberFor(session?.id);
  if(!assignment?.team)return;
  if(!assignment.done)return assignment;
  const events=session.snapshotEvents?.()??[],start=events.findLast(event=>event.type==='turn/start'),end=events.findLast(event=>event.type==='turn/end');
  if(!start||end&&(end.seq??0)>(start.seq??0))return assignment;
  const root=assignment.parent;
  if(!this.requested(root))throw Error('团队模式已切换，请先切回团队模式');
  if(!this.active(root)){
   const parent=this.ctx.get('agents')?.get(root)??(await this.ctx.get('sessionController')?.resolveAgent(root))?.agent;
   if(!parent||parent.session.id!==root)throw Error('主会话尚未就绪，请重新打开会话');
   await this.transition(parent,true,signal);
  }
  const cwd=this.ctx.get('workingDirectory')?.get(session)??session.header?.cwd??null;
  if(session.header?.parentSession!==root||cwd!==assignment.cwd)throw Error('子智能体会话来源或工作区已变化');
  signal?.throwIfAborted();
  return this.bots.taskChange(state=>{
   const latest=state.runs.findLast(row=>row.childId===session.id);
   if(!latest||!latest.done)return latest;
   const profile=this.profiles(root).find(row=>row.id===latest.profile.id);
   if(!profile)throw Error('子智能体已离线或移除，请先在团队配置中启用');
   if(!this.admission(root))throw Error('请先切换到团队模式');
   const active=state.runs.filter(row=>row.parent===root&&!row.done&&row.status!=='queued');
   if(active.length>=this.bots.policy(root).maxParallel)throw Error('已达到子智能体上限，请等待其他子智能体完成');
   if(state.runs.length>=128)throw Error('协作任务记录已满');
   const row={id:randomUUID(),key:null,parent:root,team:true,budgetKey:'manual-member',cwd,done:false,
    task:'用户在子智能体对话中发送的消息',acceptance:'回应当前用户消息，报告结果与未完成项',context:'',skills:[],requireReview:false,
    dependsOn:[],resources:[],phase:'work',profile:structuredClone(profile),roleRevision:this.bots.state.revision,status:'running',
    createdAt:now(),childId:session.id,afterSeq:(start?.seq??0)-1,memberMemorySnapshot:this.memoryForPrompt(root,profile.id)};
   state.runs.push(row);return row;
  });
 }
 async request(agent,base,signal){
  const id=agent?.session?.id;if(!id)return base;
  if(this.memberFor(id)?.team)await this.trackNativeTurn(agent.session,signal);
  const child=this.memberFor(id);
  const coordinator=agent.session.header?.origin!=='subagent'&&this.active(id);
  if(coordinator&&Array.isArray(base.tools)&&!base.tools.some(tool=>tool.name==='workspace_team')){
   const tool=(agent.ctx?.get('tools')??this.ctx.get('tools'))?.get('workspace_team');
   if(!tool?.parameters)throw Error('宿主尚未准备好团队调度工具');
   base={...base,tools:[...base.tools,{name:'workspace_team',description:tool.description,parameters:tool.parameters}]};
  }
  if(!coordinator&&!child)return base;
  let selected;
  if(coordinator)selected=this.session(id).coordinator;
  else selected=this.profiles(child.parent).find(profile=>profile.id===child.profile.id)??child.profile;
  const forceDefault=selected.effort==='__default__'||selected.forceDefault;
  if(child)selected={model:selected.model,effort:selected.effort??selected.model?.reasoningEffort??null};
  if(selected.effort==='__default__')selected={...selected,effort:null};
  const parentConfig=child?this.session(child.parent).coordinator:null;
  const inherited=child?(parentConfig.model??this.currentModel?.(child.parent)??(agent.options?.provider&&agent.options.model?agent.options:base)):base;
  const source=selected.model??inherited;
  const pair={provider:source.provider,model:source.model};await this.validateRoute({model:pair,effort:selected.effort},null,signal);
  const {reasoningEffort,maxTokens,...rest}=base;
  const changed=pair.provider!==base.provider||pair.model!==base.model;
  if(child){
   const used={...pair,effort:selected.effort??(!forceDefault&&!changed?reasoningEffort:null)??null};
   if(JSON.stringify(child.modelUse)!==JSON.stringify(used))await this.bots.taskChange(state=>{state.runs.find(row=>row.id===child.id).modelUse=used;});
  }
  return {...rest,...pair,...!changed&&maxTokens!==undefined?{maxTokens}:{},...selected.effort!==null?{reasoningEffort:selected.effort}:!forceDefault&&!changed&&reasoningEffort!==undefined?{reasoningEffort}:{}};
 }
 async close(){await this.queue;this.ready=false;}
}
export function wireTeamMode(ctx,team){
 ctx.on('agent/request',async({agent,signal},next)=>team.request(agent,await next(),signal),{global:true,prepend:true});
 ctx.inject(['tools'],scope=>scope.tools.guard(exec=>team.guard(exec)));
 ctx.effect(()=>()=>team.close());
}

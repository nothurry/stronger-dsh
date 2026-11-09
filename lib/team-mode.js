import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import path from 'node:path';
import {inspectSession} from './workbench.js';

const own=(value,key)=>Object.hasOwn(value,key);
const READS=new Set(['workspace_team','skill','workspace_skill_catalog','workspace_recall','workspace_history','workspace_archive','workspace_world']);
const now=()=>new Date().toISOString();
const defaults=()=>({revision:0,active:false,coordinator:{model:null,effort:null,instructions:''},defaults:{model:null,effort:null},members:[{id:'team-executor',name:'执行成员',identity:'负责分配范围内的执行工作',duties:'先报告计划，按验收条件完成任务，在阶段变化和遇到阻碍时汇报。',model:null,effort:null,enabled:true},{id:'team-verifier',name:'核验成员',identity:'独立核对任务结果与依据',duties:'检查实际结果、指出遗漏与风险，提交可以复验的依据。',model:null,effort:null,enabled:true}],checkpoint:null,budgetKey:null});
function words(value,max){if(typeof value!=='string'||value.length>max||/\0|BEGIN .*PRIVATE KEY|\b(?:sk-|ghp_)[\w-]{20,}|(?:password|api[_ -]?key|密码)\s*[:=]\s*\S{8,}/i.test(value))throw Error('团队文字无效或包含凭据');return value.trim();}
function route(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!['model','effort'].includes(key)))throw Error('团队模型设置无效');
 let model=null;if(value.model!==null){if(!value.model||Object.keys(value.model).some(key=>!['provider','model'].includes(key)))throw Error('请选择完整模型');model={provider:words(value.model.provider,160),model:words(value.model.model,160)};if(!model.provider||!model.model)throw Error('请选择完整模型');}
 const effort=value.effort;if(effort!==null&&(typeof effort!=='string'||!effort||effort.length>80||/[\x00-\x1f]/.test(effort)))throw Error('思考强度无效');
 return {model,effort};
}
function settings(value){
 if(!value||Object.keys(value).some(key=>!['coordinator','defaults','members'].includes(key))||!Array.isArray(value.members)||value.members.length<1||value.members.length>8)throw Error('团队须有1–8个成员');
 if(!value.coordinator||Object.keys(value.coordinator).some(key=>!['model','effort','instructions'].includes(key)))throw Error('主模型设置无效');
 const ids=new Set();
 const members=value.members.map(member=>{
  if(!member||Object.keys(member).some(key=>!['id','name','identity','duties','model','effort','enabled'].includes(key))||typeof member.id!=='string'||!/^[-\w]{1,80}$/.test(member.id)||ids.has(member.id)||typeof member.enabled!=='boolean')throw Error('团队成员编号或开关无效');
  ids.add(member.id);const name=words(member.name,80),identity=words(member.identity,1600),duties=words(member.duties,4000);if(!name||!identity||!duties)throw Error('请填写成员名称、身份和职责');
  return {id:member.id,name,identity,duties,...route({model:member.model,effort:member.effort}),enabled:member.enabled};
 });
 if(!members.some(member=>member.enabled))throw Error('至少启用一个团队成员');
 return {coordinator:{...route({model:value.coordinator.model,effort:value.coordinator.effort}),instructions:words(value.coordinator.instructions,4000)},defaults:route(value.defaults),members};
}
export class TeamMode{
 constructor(data,ctx,bots,workbench){this.file=path.join(data,'team-mode.json');this.ctx=ctx;this.bots=bots;this.workbench=workbench;this.state={version:1,sessions:{}};this.queue=Promise.resolve();this.reads=new Map();this.ready=false;}
 requested(id){return this.workbench.config.sessionPresets[id]==='team';}
 session(id){return own(this.state.sessions,id)?this.state.sessions[id]:defaults();}
 active(id){return this.session(id).active;}
 async load(){
  try{const raw=await readFile(this.file,'utf8');if(Buffer.byteLength(raw)>2_000_000)throw Error('团队记录超过本机预算');const value=JSON.parse(raw);if(value.version!==1||!value.sessions||typeof value.sessions!=='object'||Array.isArray(value.sessions)||Object.keys(value.sessions).length>128)throw Error('团队记录损坏');
   for(const [id,record]of Object.entries(value.sessions)){if(!id||id.length>160||!Number.isSafeInteger(record.revision)||typeof record.active!=='boolean')throw Error('团队会话记录损坏');settings({coordinator:record.coordinator,defaults:record.defaults,members:record.members});if(record.checkpoint&&(!/^[a-f0-9]{64}$/.test(record.checkpoint.digest)||!Array.isArray(record.checkpoint.tasks)))throw Error('团队交接记录损坏');}
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
  const checked=settings(value);if(membersOnly&&JSON.stringify(checked.coordinator)!==JSON.stringify(this.session(id).coordinator))throw Error('主模型只能配置子成员');
  const header=this.ctx.get('sessions')?.get(id)?.requestHeader?.()?.config,fallback=this.currentModel?.(id)??(header?.provider&&header.model?{provider:header.provider,model:header.model}:this.ctx.get('agentDefaultModel')?.currentSelection?.());
  await this.validateRoute(checked.coordinator,fallback,signal);const parent=checked.coordinator.model??fallback;
  await this.validateRoute(checked.defaults,parent,signal);for(const member of checked.members.filter(row=>row.enabled))await this.validateRoute(this.effective(member,checked),parent,signal);
  signal?.throwIfAborted();return this.change(id,record=>{if(record.revision!==revision)throw Error('团队配置已变化，请刷新');Object.assign(record,checked);});
 }
 profiles(id){
  const config=this.session(id);return config.members.filter(row=>row.enabled).map(row=>{const selected=this.effective(row,config);return {id:row.id,name:row.name,role:'child',instructions:'身份：'+row.identity+'\n职责：'+row.duties,skills:[],model:selected.model?{...selected.model,...selected.effort!==null?{reasoningEffort:selected.effort}:{}}:null,effort:selected.effort,forceDefault:(row.effort??config.defaults.effort??config.coordinator.effort)==='__default__',enabled:true};});
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
  await this.change(id,record=>{record.active=active;record.budgetKey=budgetKey;record.checkpoint=needsHandoff?{...captured,at:now(),from:old.active?'team':'ordinary',to:active?'team':'ordinary',acknowledged:false}:null;});
  this.reads.delete(id);
 }
 admission(id){const record=this.session(id);return this.requested(id)&&record.active&&(!record.checkpoint||record.checkpoint.acknowledged);}
 instructions(id){
  const record=this.session(id),checkpoint=record.checkpoint;
  const handoff=checkpoint&&!checkpoint.acknowledged?'切换交接待确认。先调用 workspace_team action=handoff 读取实际任务进度，再以返回的 digest 调用 acknowledge，逐项核对已完成、进行中、阻碍和下一步。原有任务保留，旧排队任务不会自行重放。\n':'';
  if(!record.active)return handoff;
  return handoff+'团队模式。你是主协调员，只负责理解用户目标、配置成员、分配任务、跟进阶段汇报、根据成员依据验收并向用户汇报。实际研究、文件操作、计算、搜索和执行工作全部交给子成员，不能自己执行或借其他工具绕过。'+record.coordinator.instructions+'\n先用 workspace_team catalog 读取成员身份和职责，需要时 configure_team 修改子成员配置。每个任务指定成员、任务、验收条件、依赖和独占范围。派发后用 wait 等待阶段变化；report是成员自报，review需说明核验依据。未完成或受阻内容必须如实报告。切回其他模式后保留任务。';
 }
 guard(exec){
  const id=exec.agent?.session?.id;if(!id)return;
  const child=this.bots.tasks.runs.find(row=>row.childId===id&&row.team);
  if(child&&!child.report&&!['workspace_team','skill'].includes(exec.name))return '团队成员须先用 workspace_team report 提交计划和阶段汇报，再开始任务。';
  if(exec.agent.session.header?.origin==='subagent')return;
  const record=this.session(id);if(record.checkpoint&&!record.checkpoint.acknowledged&&!['workspace_team','skill'].includes(exec.name))return '请先读取并确认模式切换交接，核对各成员进度。';
  if(record.active&&(!READS.has(exec.name)||exec.name==='workspace_world'&&exec.arguments?.action!=='time'))return '团队主模型只负责调度、跟进和汇报，请将实际工作分配给子成员。';
 }
 async handoff(id,offset=0){
  if(!Number.isSafeInteger(offset)||offset<0||offset%8)throw Error('交接页码无效');
  await this.bots.refreshTimeline(id);const captured=this.capture(id);
  if(offset>=Math.max(1,captured.tasks.length))throw Error('交接页码已失效');
  let read=this.reads.get(id);if(read?.digest!==captured.digest){read={digest:captured.digest,pages:new Set()};this.reads.set(id,read);}read.pages.add(offset);
  const tasks=captured.tasks.slice(offset,offset+8).map(row=>({id:row.id,member:row.member,task:row.task.slice(0,180),status:row.status,done:row.done,stage:row.progress?.stage??null,percent:row.progress?.percent??null,summary:row.report?.summary.slice(0,300)??'',blockers:row.report?.blockers.slice(0,200)??'',review:row.review?.decision??null}));
  return {digest:captured.digest,tasks,total:captured.tasks.length,nextOffset:offset+8<captured.tasks.length?offset+8:null,required:!this.session(id).checkpoint?.acknowledged,mode:this.requested(id)?'team':'ordinary'};
 }
 async acknowledge(id,digest,signal){
  await this.bots.refreshTimeline(id);const snapshot=this.capture(id),read=this.reads.get(id);
  if(snapshot.digest!==digest||read?.digest!==digest)throw Error('任务进度已变化，请重新读取交接');
  if(read.pages.size<Math.max(1,Math.ceil(snapshot.tasks.length/8)))throw Error('请先读取全部交接页，再确认各成员进度');signal?.throwIfAborted();
  await this.change(id,record=>{record.checkpoint={...snapshot,at:now(),acknowledged:true};});
  if(this.requested(id)&&this.active(id))await this.bots.taskChange(state=>{for(const row of state.runs)if(row.parent===id&&row.team&&row.status==='queued')row.budgetKey=this.bots.budgetKey(id);});
  return {acknowledged:true,digest,tasks:snapshot.tasks.length};
 }
 async execute(args,exec){
  const {id,parent}=this.bots.assertParent(exec);if(parent.session.header?.origin==='subagent')throw Error('团队设置和交接由主会话处理');
  if(args.action==='handoff')return this.handoff(id,args.offset);
  if(args.action==='acknowledge')return this.acknowledge(id,args.digest,exec.signal);
  if(args.action==='configure_team'){
   if(!this.active(id)||!this.requested(id))throw Error('请先由用户选择团队模式');
   const saved=await this.configure(id,args.configuration,args.revision,exec.signal,{membersOnly:true});return {revision:saved.revision,members:saved.members,defaults:saved.defaults};
  }
  throw Error('团队操作不存在');
 }
 async view(id,signal){
  const metadata=await inspectSession(this.ctx,id,signal);if(!metadata||metadata.header.origin==='subagent')throw Error('请先打开主会话');
  await this.bots.refreshTimeline(id);const config=structuredClone(this.session(id));
  return {sessionId:id,requested:this.requested(id),...config,timeline:this.bots.timeline(id),messages:this.bots.tasks.messages.filter(row=>row.root===id||row.from===id||row.to===id).slice(-20).map(({id,from,to,text,at,delivery})=>({id,from,to,text,at,delivery}))};
 }
 async request(agent,base,signal){
  const id=agent?.session?.id;if(!id)return base;const child=this.bots.tasks.runs.find(row=>row.childId===id&&row.team);
  const coordinator=agent.session.header?.origin!=='subagent'&&this.active(id);
  const checkpoint=this.session(id).checkpoint;
  if((coordinator||checkpoint&&!checkpoint.acknowledged)&&Array.isArray(base.tools)&&!base.tools.some(tool=>tool.name==='workspace_team')){
   const tool=(agent.ctx?.get('tools')??this.ctx.get('tools'))?.get('workspace_team');
   if(!tool?.parameters)throw Error('宿主尚未准备好团队交接工具');
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
  return {...rest,...pair,...!changed&&maxTokens!==undefined?{maxTokens}:{},...selected.effort!==null?{reasoningEffort:selected.effort}:!forceDefault&&!changed&&reasoningEffort!==undefined?{reasoningEffort}:{},...coordinator&&Array.isArray(base.tools)?{tools:base.tools.filter(tool=>READS.has(tool.name))}:{}};
 }
 async close(){await this.queue;this.ready=false;}
}
export function wireTeamMode(ctx,team){
 ctx.on('agent/request',async({agent,signal},next)=>team.request(agent,await next(),signal),{global:true,prepend:true});
 ctx.inject(['tools'],scope=>scope.tools.guard(exec=>team.guard(exec)));
 ctx.effect(()=>()=>team.close());
}

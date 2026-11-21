import {createHash,randomUUID} from 'node:crypto';
import {readFile,writeFile,mkdir,unlink} from 'node:fs/promises';
import path from 'node:path';
import {replaceFile} from './workbench.js';
import {compactedNodes} from './compaction-lineage.js';

const MAX_SCOPE=1800;
const validId=id=>typeof id==='string'&&/^[-\w]{1,160}$/.test(id)&&!['__proto__','constructor','prototype'].includes(id);
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fail=()=>Object.assign(Error('会话分支、工作区或授权记录已改变。请到「扩展 → 安全」重新确认本会话审查范围。'),{code:'REVIEW_SCOPE_STALE'});
function text(value){
 if(typeof value!=='string'||!value.trim()||value.length>MAX_SCOPE||/\x00|Bearer\s+\S{12,}|(?:sk-|gh[pousr]_|github_pat_)[\w-]{16,}|-----BEGIN [^-]+PRIVATE KEY-----|(?:password|api[_ -]?key|密码)\s*[:=]\s*\S{8,}/i.test(value))throw Error('填写 1–1,800 字符的当前任务范围和仍有效的限制，不要填写凭据。');
 return value.trim();
}
export function branchEvidence(session,events=session.snapshotEvents(),visible=new Set(session.surface?.nodes??events.map(row=>row.seq)),compacted=compactedNodes(events,visible)){
 return {events,visible,compacted};
}
function stamp({events,visible,compacted},through){
 const hash=createHash('sha256');let count=0;
 for(const row of events){
  if(row.seq>through||row.type!=='user/message'||!visible.has(row.seq)&&!compacted.has(row.seq))continue;
  const source=row.data?.source;
  if(source?.kind!=='user'&&source?.kind!=='agent-message'&&source?.kind!=='agent-instructions')continue;
  hash.update(sha([row.seq,source,row.data.content]));
  count++;
 }
 return {digest:hash.digest('hex'),count};
}
export class ReviewScopes{
 constructor(data,ctx){this.data=data;this.ctx=ctx;this.file=path.join(data,'review-scope.json');this.rows={};this.ready=false;this.queue=Promise.resolve();}
 async load(){
  try{
   const raw=await readFile(this.file,'utf8');if(raw.length>1_500_000)throw Error('审查范围配置过大');
   const {version,rows}=JSON.parse(raw);
   if(version!==1||!rows||typeof rows!=='object'||Array.isArray(rows)||Object.keys(rows).length>128)throw Error('审查范围配置无效');
   for(const [id,row]of Object.entries(rows)){
    if(!validId(id)||!row||typeof row.cwd!=='string'||!Number.isSafeInteger(row.through)||row.through<0||!/^[-\w]{1,160}$/.test(row.revision)||!(/^[a-f0-9]{64}$/).test(row.digest)||!Number.isSafeInteger(row.count)||row.count<0||text(row.text)!==row.text)throw Error('审查范围配置无效');
   }
   this.rows=rows;
  }catch(error){if(error.code!=='ENOENT')throw error;}
  this.ready=true;
 }
 current(session,cwd,evidence){
  if(!this.ready)throw Error('会话审查范围尚未就绪');
  if(!session||!Object.hasOwn(this.rows,session.id))return null;
  const row=this.rows[session.id],proof=stamp(evidence??branchEvidence(session),row.through);
  if(cwd!==row.cwd||proof.digest!==row.digest||proof.count!==row.count)throw fail();
  return {seq:row.through,role:'owner-confirmed-scope',source:'owner-review-settings',revision:row.revision,text:row.text};
 }
 async subject(id,signal){
  if(!this.ready||!validId(id))throw Error('请先打开实际会话');
  signal?.throwIfAborted();
  const session=this.ctx.get('sessions')?.get(id)??this.ctx.get('agents')?.get(id)?.session;
  const cwd=session&&(this.ctx.get('workingDirectory')?.get?.(session)??session.header?.cwd);
  if(session&&typeof cwd==='string'&&cwd)return {session,cwd};
  // Embedded, completed child chats can be visible through a read-only observation
  // without a running Agent or an entry in the live Session registry.
  const query=this.ctx.get('sessionQuery');
  if(typeof query?.inspectSession!=='function')throw Error('宿主未提供此会话的历史读取接口，请重新打开目标会话。');
  try{
   const result=await query.inspectSession(id,prepared=>{
    const cwd=this.ctx.get('workingDirectory')?.get?.(prepared)??prepared.header?.cwd;
    if(prepared.id!==id||typeof cwd!=='string'||!cwd||!Array.isArray(prepared.surface?.nodes))throw Error('无法核对所选会话的原始分支或工作区。');
    const events=prepared.snapshotEvents(),surface={nodes:[...prepared.surface.nodes]};
    return {session:{id,header:{origin:prepared.header?.origin},surface,snapshotEvents:()=>events},cwd};
   },signal);
   signal?.throwIfAborted();
   if(!result)throw Error('找不到所选会话，未更改审查范围。');
   return result;
  }catch(error){
   if(error?.code==='SESSION_QUERY_SESSION_NOT_FOUND')throw Error('找不到所选子智能体会话。它可能尚未发送第一条消息。');
   throw error;
  }
 }
 async preview(id,signal){
  const {session,cwd}=await this.subject(id,signal),evidence=branchEvidence(session);
  const through=evidence.events.at(-1)?.seq;
  if(!Number.isSafeInteger(through)||through<0)throw Error('此会话还没有可核对的对话记录');
  const proof=stamp(evidence,through),row=Object.hasOwn(this.rows,id)?this.rows[id]:null;
  return {sessionId:id,kind:session.header?.origin==='subagent'?'child':'conversation',through,cwd,digest:proof.digest,priorMessages:proof.count,scope:row?.text??'',token:sha([id,cwd,proof.digest,row?.revision??null]),limit:MAX_SCOPE};
 }
 confirm(id,raw,token,signal){
  const value=text(raw);
  const job=this.queue.then(async()=>{
   signal?.throwIfAborted();
   const plan=await this.preview(id,signal);
   if(typeof token!=='string'||plan.token!==token)throw fail();
   if(!Object.hasOwn(this.rows,id)&&Object.keys(this.rows).length>=128)throw Error('会话审查范围记录已满');
   const next={...this.rows,[id]:{cwd:plan.cwd,through:plan.through,digest:plan.digest,count:plan.priorMessages,text:value,revision:randomUUID()}};
   await mkdir(this.data,{recursive:true});const temp=this.file+'.'+randomUUID()+'.tmp';
   try{
    await writeFile(temp,JSON.stringify({version:1,rows:next}),{mode:0o600,flag:'wx'});
    signal?.throwIfAborted();
    if((await this.preview(id,signal)).token!==token)throw fail();
    await replaceFile(temp,this.file);this.rows=next;
   }finally{await unlink(temp).catch(()=>{});}
   return {...plan,scope:value,token:sha([id,plan.cwd,plan.digest,next[id].revision])};
  });
  this.queue=job.catch(()=>{});
  return job;
 }
}

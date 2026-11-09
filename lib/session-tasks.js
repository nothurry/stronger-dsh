import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';

export class SessionTasks {
 constructor(data,ctx){this.ctx=ctx;this.file=path.join(data,'session-tasks.json');this.state={version:1,tasks:[]};this.queue=Promise.resolve();this.closed=false;this.running=false;}
 async load(){
  try{
   const raw=await readFile(this.file,'utf8');
   if(raw.length>1000000)throw Error('定时任务记录过大');
   const value=JSON.parse(raw);
   if(value.version!==1||!Array.isArray(value.tasks)||value.tasks.length>128)throw Error('定时任务记录损坏');
   for(const row of value.tasks){
    if(!row||typeof row.id!=='string'||typeof row.sessionId!=='string'||typeof row.prompt!=='string'||row.prompt.length>4000||!Number.isFinite(Date.parse(row.at))||!['waiting','missed','dispatching','delivered','failed','cancelled'].includes(row.status))throw Error('定时任务记录损坏');
    if(row.status==='waiting'&&Date.parse(row.at)<=Date.now())row.status='missed';
    if(row.status==='dispatching'){row.status='failed';row.error='上次提交结果未确认，请先检查原生任务记录，再决定补跑';}
   }
   this.state=value;
  }catch(error){if(error.code!=='ENOENT')throw error;}
  this.ready=true;
  await this.change(()=>{});
 }
 async change(update){
  const job=this.queue.then(async()=>{
   if(!this.ready||this.closed)throw Error('定时任务服务尚未就绪');
   const next=structuredClone(this.state),result=await update(next);
   const temp=this.file+'.'+randomUUID()+'.tmp';
   await mkdir(path.dirname(this.file),{recursive:true});
   await writeFile(temp,JSON.stringify(next,null,2));await rename(temp,this.file);
   this.state=next;return result;
  });
  this.queue=job.catch(()=>{});return job;
 }
 session(id){
  const session=this.ctx.get('sessions')?.get(id);
  if(!session||session.header?.origin==='subagent')throw Error('请打开实际主会话');
  return session;
 }
 view(id){this.session(id);return {available:typeof this.ctx.get('schedule')?.create==='function',tasks:this.state.tasks.filter(row=>row.sessionId===id).map(row=>({...row})),policy:'DSH运行时执行；关闭期间错过的任务等待本人确认补跑。提交原生系统后由DSH记录实际投递，投递不等于任务完成。'};}
 async create(id,input,signal){
  this.session(id);signal?.throwIfAborted();
  if(!input||Object.keys(input).some(key=>!['title','prompt','at'].includes(key))||typeof input.title!=='string'||!input.title.trim()||input.title.length>100||typeof input.prompt!=='string'||!input.prompt.trim()||input.prompt.length>4000||typeof input.at!=='string'||!/(?:Z|[+-]\d\d:\d\d)$/.test(input.at))throw Error('请填写标题、任务内容和带时区的时间');
  if(!Number.isFinite(Date.parse(input.at))||Date.parse(input.at)<=Date.now()+1000)throw Error('请选择未来时间');
  if(typeof this.ctx.get('schedule')?.create!=='function')throw Error('DSH原生定时服务尚未启用');
  const row={id:randomUUID(),sessionId:id,title:input.title.trim(),prompt:input.prompt.trim(),at:new Date(input.at).toISOString(),status:'waiting',createdAt:new Date().toISOString()};
  await this.change(next=>{signal?.throwIfAborted();if(next.tasks.length>=128)throw Error('最多保留128项定时记录，请移除已结束记录');next.tasks.push(row);});
  return row;
 }
 async action(sessionId,id,action,signal){
  this.session(sessionId);
  if(!['cancel','remove','run'].includes(action))throw Error('任务操作无效');
  await this.change(next=>{
   signal?.throwIfAborted();const row=next.tasks.find(item=>item.id===id&&item.sessionId===sessionId);
   if(!row)throw Error('找不到本会话任务');
   if(action==='run'){if(!['missed','failed'].includes(row.status))throw Error('当前状态不能补跑');row.status='waiting';row.at=new Date().toISOString();}
   else {if(action==='cancel'&&row.status==='delivered')throw Error('任务已提交DSH，请在原生定时记录中核对执行状态；移除本地记录不会取消执行');if(row.status==='dispatching')throw Error('正在提交原生系统，请稍后检查结果');if(action==='remove')next.tasks=next.tasks.filter(item=>item!==row);else row.status='cancelled';}
  });
  if(action==='run')await this.tick();
  return this.view(sessionId);
 }
 async tick(){
  if(this.running||!this.ready||this.closed)return;
  this.running=true;
  try{
   for(const candidate of this.state.tasks.filter(row=>row.status==='waiting'&&Date.parse(row.at)<=Date.now())){
    if(this.closed)break;
    if(Date.now()-Date.parse(candidate.at)>60000){await this.change(next=>{const row=next.tasks.find(item=>item.id===candidate.id&&item.status==='waiting');if(row)row.status='missed';});continue;}
    let row;
    await this.change(next=>{row=next.tasks.find(item=>item.id===candidate.id&&item.status==='waiting');if(row)row.status='dispatching';});
    if(!row)continue;
    try{
     this.session(row.sessionId);
     const native=this.ctx.get('schedule');
     if(typeof native?.create!=='function')throw Error('原生定时服务不可用');
     const result=await native.create({title:row.title,prompt:row.prompt,timing:{kind:'after',after_seconds:1},target:{kind:'session',sessionId:row.sessionId}},row.sessionId,this.signal);
     await this.change(next=>{const current=next.tasks.find(item=>item.id===row.id);current.status='delivered';current.nativeId=result.id;current.submittedAt=new Date().toISOString();});
    }catch(error){
     if(!this.closed)await this.change(next=>{const current=next.tasks.find(item=>item.id===row.id);current.status='failed';current.error='原生提交未确认，请检查宿主任务记录后再补跑';});
    }
   }
  }finally{this.running=false;}
 }
 start(){const controller=new AbortController();this.signal=controller.signal;this.timer=setInterval(()=>{void this.tick().catch(()=>{});},1000);this.timer.unref?.();this.stop=()=>controller.abort();}
 async close(){this.closed=true;clearInterval(this.timer);this.stop?.();await this.queue;}
}

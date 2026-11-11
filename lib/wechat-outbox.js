import {mkdir,readFile,writeFile,rename,lstat,realpath,open} from 'node:fs/promises';
import {randomUUID,randomBytes,createHash,createCipheriv} from 'node:crypto';
import path from 'node:path';

const API='https://ilinkai.weixin.qq.com/';
const CDN='https://novac2c.cdn.weixin.qq.com/c2c/upload';
const MAX_BYTES=32*1024*1024;
const baseInfo={channel_version:'2.4.8',bot_agent:'stronger-dsh/0.19.14'};
const digest=value=>createHash('sha256').update(value).digest('hex');

function sessionIds(value){
 if(!Array.isArray(value)||value.length>128||value.some(id=>typeof id!=='string'||!id||id.length>160||/[\x00-\x1f]/.test(id))||new Set(value).size!==value.length)throw Error('主动发送会话列表无效');
 return [...value];
}

function mediaFormat(type,bytes){
 const head=bytes.subarray(0,16);
 if(type==='image'){
  if(head.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return '.png';
  if(head[0]===255&&head[1]===216&&head[2]===255)return '.jpg';
  if(/^GIF8[79]a/.test(head.toString()))return '.gif';
  if(head.toString('ascii',0,4)==='RIFF'&&head.toString('ascii',8,12)==='WEBP')return '.webp';
 }
 if(type==='video'&&head.toString('ascii',4,8)==='ftyp')return '.mp4';
 if(type==='audio'){
  if(head.toString('ascii',0,3)==='ID3'||head[0]===255&&(head[1]&224)===224)return '.mp3';
  if(head.toString('ascii',0,4)==='RIFF'&&head.toString('ascii',8,12)==='WAVE')return '.wav';
  if(head.toString('ascii',0,4)==='OggS')return '.ogg';
  if(head.toString('ascii',0,4)==='fLaC')return '.flac';
 }
 throw Error('文件头与媒体类型不匹配');
}

export class WechatOutbox{
 constructor(data,ctx,bridge,{fetchImpl=fetch}={}){
  this.file=path.join(data,'wechat-outbox.json');this.ctx=ctx;this.bridge=bridge;this.fetch=fetchImpl;
  this.state={version:1,sessionIds:[],deliveries:[]};this.queue=Promise.resolve();this.lifecycle=new AbortController();this.ready=false;
 }
 async load(){
  try{
   const raw=await readFile(this.file,'utf8');if(raw.length>1000000)throw Error('主动发送记录超出预算');
   const saved=JSON.parse(raw);
   if(saved.version!==1||!Array.isArray(saved.deliveries)||saved.deliveries.length>2048||saved.deliveries.some(row=>!row||typeof row.id!=='string'||typeof row.sessionId!=='string'||typeof row.key!=='string'||!/^[a-f0-9]{64}$/.test(row.digest)||!['sending','accepted','unknown'].includes(row.status)||!Number.isFinite(Date.parse(row.at))))throw Error('主动发送记录损坏');
   sessionIds(saved.sessionIds);this.state=saved;
  }catch(error){if(error.code!=='ENOENT')throw error;}
  this.ready=true;
 }
 async save(next){
  await mkdir(path.dirname(this.file),{recursive:true});const temp=this.file+'.'+randomUUID()+'.tmp';
  await writeFile(temp,JSON.stringify(next));await rename(temp,this.file);this.state=next;
 }
 serial(fn){const work=this.queue.then(fn);this.queue=work.catch(()=>{});return work;}
 view(){return {sessionIds:[...this.state.sessionIds],supported:['text','image','video','audio-file'],voiceBubble:false,trigger:'running-agent-tool-call',idempotencyDays:7,deliveries:this.state.deliveries.slice(-20).map(({id,kind,status,at,sessionId})=>({id,kind,status:status==='sending'?'unknown':status,at,sessionId}))};}
 async configure(ids){
  if(!this.ready||this.lifecycle.signal.aborted)throw Error('主动发送服务尚未就绪');
  const checked=sessionIds(ids);
  const epoch=(this.configEpoch??0)+1;this.configEpoch=epoch;
  this.authorized=(this.authorized??this.state.sessionIds).filter(id=>checked.includes(id));
  for(const id of checked){
   const session=this.ctx.get('sessions')?.get(id);
   if(!session||session.header?.origin==='subagent')throw Error('只能授权已存在的主会话');
   await this.bridge.checkCwd(this.ctx.get('workingDirectory')?.get(session)??session.header?.cwd);
  }
  // Revoke immediately, including an in-flight upload before its send step.
  await this.serial(async()=>{
   if(epoch!==this.configEpoch)throw Error('主动发送设置已更新，请刷新');
   await this.save({...this.state,sessionIds:checked});
   if(epoch===this.configEpoch)this.authorized=checked;
  });
  return this.view();
 }
 check(exec){
  exec.signal?.throwIfAborted();this.lifecycle.signal.throwIfAborted();
  const agent=exec.agent,id=agent?.session?.id;
  if(!this.ready||!id||this.ctx.get('agents')?.get(id)!==agent||agent.session.header?.origin==='subagent'||!(this.authorized??this.state.sessionIds).includes(id))throw Error('当前主会话未获微信主动发送授权');
  const bridge=this.bridge,manager=bridge.manager,account=manager?.resolveAccount?.(),status=manager?.getStatus?.();
  const cwd=this.ctx.get('workingDirectory')?.get(agent.session)??agent.session.header?.cwd;
  if(!bridge.config.allowedCwds.includes(cwd))throw Error('当前会话工作区没有微信访问权限');
  if(bridge.closed||!bridge.config.enabled||!account?.token||account.userId!==bridge.config.userId||account.accountId!==bridge.config.accountId||status?.phase!=='running'||status?.paused||status?.lastError)throw Error('微信本人账号未连接');
  const token=manager.contextTokens?.[bridge.config.userId];if(typeof token!=='string'||!token)throw Error('缺少有效微信会话令牌，请先在微信发送一条消息');
  return {id,agent,account,token,epoch:bridge.epoch,manager};
 }
 async readMedia(file,cwd,type){
  if(typeof file!=='string'||!file||file.length>1000||file.includes('\0'))throw Error('媒体文件路径无效');
  const root=await realpath(cwd),target=path.resolve(root,file),relative=path.relative(root,target);
  if(!relative||relative==='..'||relative.startsWith('..'+path.sep)||path.isAbsolute(relative)||relative.split(path.sep).some(part=>/^\.|^(?:credentials|secrets)$/i.test(part)))throw Error('只允许当前已授权工作区的非隐藏媒体文件');
  let current=root;
  for(const part of relative.split(path.sep)){current=path.join(current,part);if((await lstat(current)).isSymbolicLink())throw Error('不能发送链接或重解析路径');}
  if(await realpath(target)!==target)throw Error('媒体路径已变化');
  const handle=await open(target,'r');
  try{
   const stat=await handle.stat();if(!stat.isFile()||stat.size<=0||stat.size>(type==='image'?8*1024*1024:MAX_BYTES))throw Error('媒体必须为普通文件，图片限8MB，音视频限32MB');
   const bytes=Buffer.alloc(stat.size);let offset=0;
   while(offset<bytes.length){const read=await handle.read(bytes,offset,bytes.length-offset,offset);if(!read.bytesRead)break;offset+=read.bytesRead;}
   const after=await handle.stat(),current=await lstat(target);
   if(offset!==stat.size||after.size!==stat.size||after.mtimeMs!==stat.mtimeMs||current.ino!==stat.ino||current.dev!==stat.dev||current.isSymbolicLink()||await realpath(target)!==target)throw Error('读取期间媒体文件变化');
   const extension=mediaFormat(type,bytes);return {bytes,name:'media'+extension};
  }finally{await handle.close();}
 }
 async post(endpoint,body,account,signal){
  const headers={'content-type':'application/json',AuthorizationType:'ilink_bot_token',Authorization:'Bearer '+account.token,'X-WECHAT-UIN':randomBytes(4).toString('base64'),'iLink-App-Id':'bot','iLink-App-ClientVersion':'132102'};
  const response=await this.fetch(new URL(endpoint,API),{method:'POST',headers,body:JSON.stringify({...body,base_info:baseInfo}),redirect:'error',signal});
  if(!response.ok)throw Error('微信请求失败 HTTP '+response.status);
  const raw=await response.text();if(raw.length>64000)throw Error('微信响应过长');
  const result=JSON.parse(raw);if(result.ret&&result.ret!==0||result.errcode&&result.errcode!==0)throw Error('微信拒绝本次请求，请核对会话令牌、账号权限或媒体限制');return result;
 }
 async execute(args,exec){
  if(args.action==='capabilities')return {...this.view(),authorized:(this.authorized??this.state.sessionIds).includes(exec.agent?.session?.id)};
  if(args.action!=='send'||Object.keys(args).some(key=>!['action','key','type','text','file'].includes(key))||typeof args.key!=='string'||!/^[-\w]{1,80}$/.test(args.key)||!['text','image','video','audio'].includes(args.type))throw Error('主动发送参数无效');
  const text=args.text??'';if(typeof text!=='string'||text.length>4000||text.includes('\0')||args.type==='text'&&(!text.trim()||args.file!==undefined))throw Error('文字消息须为1–4000字符，媒体说明请另发文字消息');
  if(args.type!=='text'&&text)throw Error('媒体与文字请分开调用，避免部分发送产生歧义');
  return this.serial(async()=>{
   const initial=this.check(exec),cwd=await this.bridge.checkCwd(this.ctx.get('workingDirectory')?.get(initial.agent.session)??initial.agent.session.header?.cwd);
   const media=args.type==='text'?null:await this.readMedia(args.file,cwd,args.type);
   const fingerprint=digest(JSON.stringify([args.type,text,media?digest(media.bytes):null]));
   const old=this.state.deliveries.find(row=>row.sessionId===initial.id&&row.key===args.key);
   if(old){if(old.digest!==fingerprint)throw Error('发送编号已用于其他内容');return {id:old.id,status:old.status==='accepted'?'accepted':'unknown',duplicate:true,note:'未知投递不自动重发，请在微信核对'};}
   const recent=this.state.deliveries.filter(row=>Date.now()-Date.parse(row.at)<3600000);
   if(recent.length>=12||recent.some(row=>Date.now()-Date.parse(row.at)<10000))throw Error('主动发送频率限制，请稍后再试');
   const retained=this.state.deliveries.filter(row=>row.status!=='accepted'||Date.now()-Date.parse(row.at)<7*86400000);
   if(retained.length>=2048)throw Error('主动发送记录已满，请先在本机核对未确认的投递');
   const row={id:randomUUID(),sessionId:initial.id,key:args.key,kind:args.type,digest:fingerprint,status:'sending',at:new Date().toISOString()};
   await this.save({...this.state,deliveries:[...retained,row]});
   const signal=AbortSignal.any([this.lifecycle.signal,exec.signal??new AbortController().signal,AbortSignal.timeout(60000)]);
   const active=()=>{const next=this.check(exec);if(next.epoch!==initial.epoch||next.manager!==initial.manager||next.account.token!==initial.account.token||next.token!==initial.token)throw Error('微信连接或会话令牌已改变');signal.throwIfAborted();return next;};
   try{
    let item={type:1,text_item:{text}};
    if(media){
     active();const key=randomBytes(16),cipher=createCipheriv('aes-128-ecb',key,null),encrypted=Buffer.concat([cipher.update(media.bytes),cipher.final()]),filekey=randomUUID();
     const upload=await this.post('ilink/bot/getuploadurl',{filekey,media_type:args.type==='image'?1:args.type==='video'?2:3,to_user_id:initial.account.userId,rawsize:media.bytes.length,rawfilemd5:createHash('md5').update(media.bytes).digest('hex'),filesize:encrypted.length,no_need_thumb:true,aeskey:key.toString('hex')},initial.account,signal);
     const url=upload.upload_full_url?new URL(upload.upload_full_url):new URL(CDN);
     if(!upload.upload_full_url){if(typeof upload.upload_param!=='string'||!upload.upload_param)throw Error('微信未提供媒体上传地址');url.searchParams.set('encrypted_query_param',upload.upload_param);url.searchParams.set('filekey',filekey);}
     if(url.protocol!=='https:'||url.hostname!=='novac2c.cdn.weixin.qq.com'||url.port||url.username||url.password||url.pathname!=='/c2c/upload')throw Error('微信媒体上传地址不受信任');
     active();const response=await this.fetch(url,{method:'POST',headers:{'content-type':'application/octet-stream'},body:encrypted,redirect:'error',signal});
     const parameter=response.headers.get('x-encrypted-param');if(response.status!==200||!parameter||parameter.length>16000)throw Error('媒体上传失败或缺少下载凭据');
     await response.body?.cancel();
     const reference={encrypt_query_param:parameter,aes_key:Buffer.from(key.toString('hex')).toString('base64'),encrypt_type:1};
     item=args.type==='image'?{type:2,image_item:{media:reference,mid_size:encrypted.length}}:args.type==='video'?{type:5,video_item:{media:reference,video_size:encrypted.length}}:{type:4,file_item:{media:reference,file_name:media.name,len:String(media.bytes.length)}};
    }
    active();await this.post('ilink/bot/sendmessage',{msg:{from_user_id:'',to_user_id:initial.account.userId,client_id:row.id,message_type:2,message_state:2,context_token:initial.token,item_list:[item]}},initial.account,signal);
    await this.save({...this.state,deliveries:this.state.deliveries.map(item=>item.id===row.id?{...item,status:'accepted'}:item)});
    return {id:row.id,status:'accepted',representation:args.type==='audio'?'audio-file':args.type,note:'微信接口已接受，未获得收件人阅读或客户端播放回执'};
   }catch{
    await this.save({...this.state,deliveries:this.state.deliveries.map(item=>item.id===row.id?{...item,status:'unknown'}:item)});
    throw Error('微信投递未确认，请查看手机并核对连接、令牌与媒体权限。同一key不会自动重发。');
   }
  });
 }
 async close(){this.lifecycle.abort(Error('主动发送服务已关闭'));await this.queue;}
}

import {createHash} from 'node:crypto';

const digest=row=>createHash('sha256').update(JSON.stringify([row.name,row.description,row.content,row.scope,row.cwd,row.channel??'desktop'])).digest('hex');
export function catalogRevision(workspace){return (workspace.state.skillRevision??0)+(workspace.skillCatalogEpoch??0);}

export function listSkillCatalog(workspace,options={},cwd='',channel='desktop'){
 const {query='',task='',offset=0,limit=task?3:12,revision,activeOnly=!!task}=options;
 if(typeof query!=='string'||query.length>300||typeof task!=='string'||task.length>2000||query.includes('\0')||task.includes('\0'))throw Error('技能检索文字无效');
 if(typeof activeOnly!=='boolean'||!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||limit<1||limit>24)throw Error('技能分页或状态无效');
 const current=catalogRevision(workspace);
 if(offset&&revision!==current)throw Error('技能目录已更新，请从第一页重查');
 const disabled=new Set(workspace.state.disabledBuiltins??[]);
 const items=workspace.allSkills().map(row=>({name:row.name,description:row.description,source:row.origin??'builtin',origin:row.origin??'builtin',enabled:!disabled.has(row.name),status:disabled.has(row.name)?'archived':'active'}));
 for(const row of workspace.state.records){
  if(row.kind!=='skill'||!workspace.allowed(row,channel)||row.scope==='workspace'&&row.cwd!==cwd)continue;
  items.push({id:row.id,name:row.name,description:row.description,status:row.status,source:'local'});
 }
 const search=(query||task).trim().toLowerCase();
 const terms=[...new Set(search.match(/[a-z0-9_-]{2,}|[\u3400-\u9fff]/g)??[])].slice(0,32);
 const rows=items.filter(row=>!activeOnly||row.status==='active').map(row=>{
  const title=row.name.toLowerCase(),description=(row.description??'').toLowerCase();
  const score=terms.reduce((sum,word)=>sum+(title.includes(word)?3:description.includes(word)?1:0),0);
  return {row,score};
 }).filter(item=>!search||item.score>0).sort((a,b)=>b.score-a.score||a.row.name.localeCompare(b.row.name));
 return {learning:workspace.state.skillLearning!==false,revision:current,total:rows.length,
  skills:rows.slice(offset,offset+limit).map(({row})=>({...row,...task?{match:'name-or-description',bodyLoaded:false}:{}})),
  nextOffset:offset+limit<rows.length?offset+limit:null,next:'按名称使用原生skill读取所需正文，已读且仍有效时复用。'};
}

export function installSkillRuntime(scope,workspace){
 const registrations=new Map();let closed=false,seen=-1;
 const sync=()=>{
  const revision=catalogRevision(workspace);if(closed||seen===revision)return;
  seen=revision;const disabled=new Set(workspace.state.disabledBuiltins??[]);
  const desired=new Map(workspace.allSkills().filter(row=>!disabled.has(row.name)).map(row=>[row.name,row]));
  for(const [name,current]of registrations){const row=desired.get(name);if(!row||digest(row)!==current.digest){current.dispose();registrations.delete(name);}}
  for(const [name,row]of desired)if(!registrations.has(name))registrations.set(name,{digest:digest(row),dispose:scope.skills.register({name,description:row.description,content:row.content,source:'dsh-ui-stronger',invocation:{modelInvocable:true,userInvocable:true}})});
 };
 const providerOff=scope.skills.registerProvider?.(control=>{
  let revision=catalogRevision(workspace);
  const off=workspace.subscribe(()=>{const next=catalogRevision(workspace);if(next!==revision){revision=next;control.invalidate();}});
  scope.effect(()=>off);
  return {name:'ui-stronger-local',list:async options=>{
   options.signal?.throwIfAborted();const session=options.scope?.session;
   const rows=session?workspace.visibleSkills(options.cwd??'',workspace.channelFor(session.id)):[];
   return {complete:false,candidates:rows.map(row=>({name:row.name,description:row.description,source:'本机已确认技能 · '+digest(row).slice(0,8),provider:'ui-stronger-local',rank:250,invocation:{modelInvocable:true,userInvocable:true},locator:{id:row.id,digest:digest(row)}}))};
  },get:async(candidate,options)=>{
   options.signal?.throwIfAborted();const session=options.scope?.session;if(!session)return;
   const row=workspace.visibleSkills(options.cwd??'',workspace.channelFor(session.id)).find(row=>row.id===candidate.locator?.id&&digest(row)===candidate.locator.digest);
   return row?{name:row.name,description:row.description,source:'本机已确认技能 · '+digest(row).slice(0,8),provider:'ui-stronger-local',invocation:{modelInvocable:true,userInvocable:true},content:row.content}:undefined;
  }};
 });
 sync();const off=workspace.subscribe(sync);workspace.runtime.skills=true;
 scope.effect(()=>()=>{closed=true;off();providerOff?.();for(const current of registrations.values())current.dispose();registrations.clear();workspace.runtime.skills=false;});
}

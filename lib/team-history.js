import {mkdir,open,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {replaceFile} from './workbench.js';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');

// Immutable segments commit before records leave the active task file.
// Their small first-line indexes avoid loading old task bodies on startup.
export class TeamHistory {
 constructor(data){
  this.directory=path.join(data,'team-task-history');
  this.entries=new Map();
  this.timestamp=0;
 }
 async load(){
  let files;
  try{files=await readdir(this.directory,{withFileTypes:true});}
  catch(error){if(error.code==='ENOENT')return;throw error;}
  for(const file of files.sort((left,right)=>left.name.localeCompare(right.name))){
   if(!/^\d{13}-[a-f0-9-]{36}\.jsonl$/.test(file.name))continue;
   if(!file.isFile()||file.isSymbolicLink())throw Error('协作历史文件无效');
   const handle=await open(path.join(this.directory,file.name),'r');
   try{
    const header=Buffer.alloc(65536);
    const {bytesRead}=await handle.read(header,0,header.length,0);
    const newline=header.subarray(0,bytesRead).indexOf(10);
    if(newline<0)throw Error('协作历史索引不完整');
    const index=JSON.parse(header.subarray(0,newline).toString());
    const size=(await handle.stat()).size;
    if(index.version!==1||!Array.isArray(index.entries)||index.entries.length>32||size>8_000_000)throw Error('协作历史索引无效');
    for(const entry of index.entries){
     if(typeof entry.id!=='string'||typeof entry.parent!=='string'||!Number.isSafeInteger(entry.offset)||entry.offset<0||!Number.isSafeInteger(entry.bytes)||entry.bytes<1||entry.bytes>200000||entry.offset+entry.bytes+newline+1>size||!/^[a-f0-9]{64}$/.test(entry.digest))throw Error('协作历史记录位置无效');
     this.entries.set(entry.id,{...entry,file:file.name,start:newline+1});
    }
    this.timestamp=Math.max(this.timestamp,Number(file.name.slice(0,13)));
   }finally{await handle.close();}
  }
 }
 async archive(rows){
  const pending=rows.map(row=>({row,bytes:Buffer.from(JSON.stringify(row))})).filter(item=>this.entries.get(item.row.id)?.digest!==digest(item.bytes));
  if(!pending.length)return;
  await mkdir(this.directory,{recursive:true});
  for(let offset=0;offset<pending.length;offset+=32){
   const batch=pending.slice(offset,offset+32),entries=[];
   let position=0;
   for(const {row,bytes} of batch){
    if(!row.done||bytes.length>200000)throw Error('只能归档完整的已结束协作任务');
    entries.push({id:row.id,parent:row.parent,key:row.key??null,plan:row.plan??null,childId:row.childId??null,budgetKey:row.budgetKey??'initial',offset:position,bytes:bytes.length,digest:digest(bytes)});
    position+=bytes.length+1;
   }
   const header=Buffer.from(JSON.stringify({version:1,entries})+'\n');
   if(header.length>65536)throw Error('协作历史索引过大');
   this.timestamp=Math.max(Date.now(),this.timestamp+1);
   const file=this.timestamp+'-'+randomUUID()+'.jsonl';
   const target=path.join(this.directory,file),temporary=target+'.tmp';
   const body=Buffer.concat([header,...batch.flatMap(item=>[item.bytes,Buffer.from('\n')])]);
   await writeFile(temporary,body,{flag:'wx'});
   await replaceFile(temporary,target);
   for(const entry of entries)this.entries.set(entry.id,{...entry,file,start:header.length});
  }
 }
 async get(parent,id){
  const entry=this.entries.get(id);
  if(!entry||entry.parent!==parent)return null;
  const handle=await open(path.join(this.directory,entry.file),'r');
  try{
   const buffer=Buffer.alloc(entry.bytes);
   const {bytesRead}=await handle.read(buffer,0,buffer.length,entry.start+entry.offset);
   if(bytesRead!==buffer.length||digest(buffer)!==entry.digest)throw Error('协作历史内容校验失败');
   const row=JSON.parse(buffer.toString());
   if(row.id!==id||row.parent!==parent||row.done!==true)throw Error('协作历史身份不一致');
   return row;
  }finally{await handle.close();}
 }
 async matching(parent,key,field='key'){
  const entries=[...this.entries.values()].filter(entry=>entry.parent===parent&&entry[field]===key);
  return Promise.all(entries.map(entry=>this.get(parent,entry.id)));
 }
 async page(parent,offset=0,limit=16,excluded=new Set()){
  if(!Number.isSafeInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1||limit>24)throw Error('历史分页参数无效');
  const entries=[...this.entries.values()].filter(entry=>entry.parent===parent&&!excluded.has(entry.id)).reverse();
  const rows=await Promise.all(entries.slice(offset,offset+limit).map(entry=>this.get(parent,entry.id)));
  return {rows,total:entries.length,nextOffset:offset+rows.length<entries.length?offset+rows.length:null};
 }
}

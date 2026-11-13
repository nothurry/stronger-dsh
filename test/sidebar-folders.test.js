import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import React from 'react';
import vm from 'node:vm';
import {Workbench,validateLooseFolder,DEFAULT_MODULES} from '../lib/workbench.js';

test('legacy workbench settings acquire loose-folder defaults; rename/delete survive reload and concurrent settings keep both changes',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'loose-folder-'));
 try{
  await writeFile(path.join(dir,'workbench.json'),JSON.stringify({version:1,modules:DEFAULT_MODULES,historyEnabled:false}));
  let workbench=new Workbench(dir,{get:()=>null});await workbench.load();
  assert.deepEqual(workbench.config.looseFolder,{label:'',removed:false});
  await Promise.all([workbench.configure({looseFolder:{label:' 我的对话 ',removed:false}}),workbench.configure({historyEnabled:true})]);
  assert.equal(workbench.config.looseFolder.label,'我的对话');assert(workbench.config.historyEnabled);
  await workbench.configure({looseFolder:{label:'我的对话',removed:true}});await workbench.dispose();
  workbench=new Workbench(dir,{get:()=>null});await workbench.load();assert(workbench.config.looseFolder.removed);assert.equal(workbench.config.looseFolder.label,'我的对话');
  await workbench.configure({looseFolder:{label:'我的对话',removed:false}});assert(!workbench.config.looseFolder.removed);await workbench.dispose();
 }finally{await rm(dir,{recursive:true,force:true});}
});

test('invalid group metadata preserves the saved configuration and malformed disk state cannot be overwritten',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'loose-folder-invalid-'));
 try{
  const workbench=new Workbench(dir,{get:()=>null});await workbench.load();await workbench.configure({historyEnabled:true});
  const file=path.join(dir,'workbench.json'),saved=await readFile(file,'utf8');
  for(const value of [{label:'x',removed:'yes'},{label:'x\n',removed:false},{label:'x'.repeat(121),removed:false},{label:'ok',removed:false,command:'exec'},null]){
   assert.throws(()=>validateLooseFolder(value));await assert.rejects(workbench.configure({looseFolder:value}));assert.equal(await readFile(file,'utf8'),saved);
  }
  await workbench.dispose();await writeFile(file,JSON.stringify({version:1,modules:DEFAULT_MODULES,historyEnabled:true,looseFolder:{label:[],removed:false}}));
  const corrupt=new Workbench(dir,{get:()=>null});await assert.rejects(corrupt.load());await assert.rejects(corrupt.configure({looseFolder:{label:'new',removed:false}}));
 }finally{await rm(dir,{recursive:true,force:true});}
});

test('removing a collapsed loose folder derives an expanded view without modifying host grouping or subscriptions',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={archivedView};return {name:'dsh-ui-stronger',inject:");
 const window={__ModuleLoader__:{load:b=>b.factory(id=>id==='react'?React:{})}};
 vm.runInNewContext(source,{window,setTimeout,clearTimeout});
 let removed=false,notifications=0;const extra=new Set(),native=new Set();
 const raw={groupBy:'workspace-tree',archivedFilter:'default',groupExpansion:{'':false,real:false}};
 const host={getSnapshot:()=>raw,subscribe:fn=>{native.add(fn);return()=>native.delete(fn);}};
 const store={snapshot:()=>({workbench:{looseFolder:{label:'我的对话',removed}}}),subscribe:fn=>{extra.add(fn);return()=>extra.delete(fn);}};
 const dispose=window.qa.archivedView(host,store),off=host.subscribe(()=>notifications++);
 assert.equal(host.getSnapshot(),raw);removed=true;for(const fn of extra)fn();assert.equal(notifications,1);
 const result=host.getSnapshot();assert.equal(result.groupExpansion[''],true);assert.equal(result.groupExpansion.real,false);assert.equal(result.groupBy,'workspace-tree');assert.equal(raw.groupExpansion[''],false);assert.equal(result,host.getSnapshot());
 removed=false;for(const fn of extra)fn();assert.equal(host.getSnapshot(),raw);
 dispose();assert.equal(extra.size,0);assert.equal(native.size,1);off();assert.equal(native.size,0);
});

test('sidebar adapter tolerates a missing group at mount and restores only its owned title and mount node',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={SidebarFolderActions};return {name:'dsh-ui-stronger',inject:");
 let cleanup,observerCallback,group=null,owned=null;
 const title={textContent:'未分组'},actions={prepend(node){owned=node;node.parentNode=actions;}};
 const row={querySelector:selector=>selector.includes('projectText')?title:actions,attributes:{},getAttribute(key){return this.attributes[key];},setAttribute(key,value){this.attributes[key]=value;},removeAttribute(key){delete this.attributes[key];}};
 const react={...React,useState:value=>[value,()=>{}],useSyncExternalStore:(_subscribe,get)=>get(),useEffect:fn=>{cleanup=fn();}};
 const window={__ModuleLoader__:{load:b=>b.factory(id=>id==='react'?react:{})}};
 const document={querySelector:()=>group,createElement:()=>({remove(){this.parentNode=null;}})};
 vm.runInNewContext(source,{window,document,MutationObserver:class{constructor(callback){observerCallback=callback;}observe(){}disconnect(){}},setTimeout,clearTimeout});
 const store={subscribe:()=>()=>{},snapshot:()=>({preferences:{enabled:true},workbench:{looseFolder:{label:'我的对话',removed:false}}})};
 assert.doesNotThrow(()=>window.qa.SidebarFolderActions({store,control:async()=>{}}));
 group=row;observerCallback();assert.equal(title.textContent,'我的对话');assert.equal(owned.parentNode,actions);
 cleanup();assert.equal(title.textContent,'未分组');assert.equal(owned.parentNode,null);
});

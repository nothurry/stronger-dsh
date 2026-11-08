import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import React from 'react';
import {Workbench} from '../lib/workbench.js';
async function client(){
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={snapshotView,wireSessionVisibility,wireArchiveView,workspaceViewStore};return {name:'dsh-ui-stronger',inject:");
 const window={__ModuleLoader__:{load:b=>b.factory(id=>id==='react'?React:{})}};
 vm.runInNewContext(source,{window,setTimeout,clearTimeout});return window.qa;
}
test('deleted archive sessions leave the native source before pagination; notifications and disposal preserve coexistence',async()=>{
 const {wireSessionVisibility}=await client(),nativeListeners=new Set(),pluginListeners=new Set();let raw={ids:['a','b','c','d','e','f'],byId:Object.fromEntries('abcdef'.split('').map(id=>[id,{id}]))},deleted=[],dispose,notified=0;
 const source={getSnapshot(){assert.equal(this,source);return raw;},subscribe(fn){assert.equal(this,source);nativeListeners.add(fn);return()=>nativeListeners.delete(fn);}};
 const original=source.getSnapshot,subscribe=source.subscribe;
 const store={snapshot:()=>({deletedSessions:deleted}),subscribe:fn=>{pluginListeners.add(fn);return()=>pluginListeners.delete(fn);}};
 wireSessionVisibility({inject:(_,fn)=>fn({get:()=>({list:source}),effect:fn=>dispose=fn()})},store);
 source.subscribe(()=>notified++);assert.equal(source.getSnapshot(),raw);
 deleted=['b','e'];for(const fn of pluginListeners)fn();assert.equal(notified,1);
 const snapshot=source.getSnapshot();assert.equal(snapshot.ids.length,4);assert.deepEqual(Array.from(snapshot.ids),['a','c','d','f']);assert(!snapshot.byId.b);assert.equal(raw.ids.length,6);assert.equal(snapshot,source.getSnapshot());
 for(const fn of pluginListeners)fn();assert.equal(notified,1);
 const wrapped=source.getSnapshot,wrappedSubscribe=source.subscribe;source.getSnapshot=function(){return wrapped.call(this);};source.subscribe=function(...a){return wrappedSubscribe.apply(this,a);};
 dispose();assert.equal(pluginListeners.size,0);assert.equal(nativeListeners.size,0);assert.equal(source.getSnapshot(),raw);
 const off=source.subscribe(()=>{});assert.equal(pluginListeners.size,0);off();assert.notEqual(source.getSnapshot,original);assert.notEqual(source.subscribe,subscribe);
});
test('archive flat mode uses the actual cached host view and restores the saved grouping outside archives',async()=>{
 const {wireArchiveView,workspaceViewStore}=await client();let value={groupBy:'workspace',archivedFilter:'default'},dispose;
 const handle={create(){throw Error('must not create an unrelated host store');}},source={getSnapshot:()=>value},original=source.getSnapshot;
 const ctx={effect:fn=>dispose=fn(),slots:{entriesOfSlot:()=>[{store:handle}],resolveStore(h){assert.equal(h,handle);return source;},subscribe:()=>()=>{}}};
 assert.equal(workspaceViewStore(ctx),source);wireArchiveView(ctx);assert.equal(source.getSnapshot(),value);
 value={...value,archivedFilter:'only'};const snapshot=source.getSnapshot();assert.equal(snapshot.groupBy,'flat');assert.equal(value.groupBy,'workspace');assert.equal(source.getSnapshot(),snapshot);
 value={...value,archivedFilter:'default'};assert.equal(source.getSnapshot().groupBy,'workspace');dispose();assert.equal(source.getSnapshot,original);
});
test('workspace rename/delete delegate to host registration, keep local files and reject stale IDs and missing confirmation',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'registered-workspace-'));const rows=new Map([['w',{id:'w',path:dir,title:'Original'}]]),calls=[];
 const registry={list:()=>[...rows.values()],get:id=>rows.get(id)};
 const controller={rename:async a=>{calls.push(a);if(a.title==='Taken')throw Error('已有同名工作区');rows.get(a.workspaceId).title=a.title;},delete:async a=>{calls.push(a);rows.delete(a.workspaceId);}};
 const w=new Workbench(path.join(dir,'data'),{get:key=>({workspaceRegistry:registry,workspaceController:controller}[key])});
 try{
  await writeFile(path.join(dir,'keep.txt'),'keep');assert.equal((await w.workspaces()).items[0].workspaceId,'w');
  const result=await w.workspaceAction({action:'rename',workspaceId:'w',title:' Renamed '});assert.equal(result.items[0].label,'Renamed');
  await assert.rejects(w.workspaceAction({action:'rename',workspaceId:'w',title:'Taken'}),/同名/);
  await assert.rejects(w.workspaceAction({action:'rename',workspaceId:'w',title:'\n'}));
  await assert.rejects(w.workspaceAction({action:'delete',workspaceId:'w',confirm:'wrong'}));assert(rows.has('w'));
  const removed=await w.workspaceAction({action:'delete',workspaceId:'w',confirm:'w'});assert(!removed.items.some(row=>row.workspaceId==='w'));assert.equal(await readFile(path.join(dir,'keep.txt'),'utf8'),'keep');
  await assert.rejects(w.workspaceAction({action:'delete',workspaceId:'w',confirm:'w'}),/不存在/);assert.equal(calls.length,3);
 }finally{await rm(dir,{recursive:true,force:true});}
});

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import React from 'react';
import {Workbench} from '../lib/workbench.js';
async function client(extra={}){
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={snapshotView,wireSessionVisibility,wireArchiveView,workspaceViewStore,createStore,WechatModelPicker,IntelligencePanel,WorkbenchPanel};return {name:'dsh-ui-stronger',inject:");
 const window={__ModuleLoader__:{load:b=>b.factory(id=>id==='react'?(extra.React??React):{})}};
 vm.runInNewContext(source,{window,setTimeout,clearTimeout,...extra});return window.qa;
}

test('a status read started before deletion cannot resurrect the removed conversation',async()=>{
 const {createStore}=await client({document:{documentElement:{toggleAttribute(){},removeAttribute(){}}}});
 let release;const store=createStore(async()=>new Promise(resolve=>{release=resolve;}));
 const pending=store.refresh();store.removeSession('archived-one');
 release({preferences:{enabled:true,motion:true},deletedSessions:[]});await pending;
 assert.deepEqual(Array.from(store.snapshot().deletedSessions),['archived-one']);store.dispose();
});
test('deleted archive sessions leave the native source before pagination; notifications and disposal preserve coexistence',async()=>{
 const {wireSessionVisibility}=await client(),nativeListeners=new Set(),pluginListeners=new Set();let raw={ids:['a','b','c','d','e','f'],byId:Object.fromEntries('abcdef'.split('').map(id=>[id,{id}]))},deleted=[],dispose,notified=0;
 const source={getSnapshot(){assert.equal(this,source);return raw;},subscribe(fn){assert.equal(this,source);nativeListeners.add(fn);return()=>nativeListeners.delete(fn);}};
 const original=source.getSnapshot,subscribe=source.subscribe;
 const store={snapshot:()=>({deletedSessions:deleted}),subscribe:fn=>{pluginListeners.add(fn);return()=>pluginListeners.delete(fn);}};
 wireSessionVisibility({inject:(_,fn)=>fn({get:()=>({list:source}),effect:fn=>dispose=fn()})},store);
 const unsubscribe=source.subscribe(()=>notified++);assert.equal(source.getSnapshot(),raw);
 deleted=['b','e'];for(const fn of pluginListeners)fn();assert.equal(notified,1);
 const snapshot=source.getSnapshot();assert.equal(snapshot.ids.length,4);assert.deepEqual(Array.from(snapshot.ids),['a','c','d','f']);assert(!snapshot.byId.b);assert.equal(raw.ids.length,6);assert.equal(snapshot,source.getSnapshot());
 for(const fn of pluginListeners)fn();assert.equal(notified,1);
 const wrapped=source.getSnapshot,wrappedSubscribe=source.subscribe;source.getSnapshot=function(){return wrapped.call(this);};source.subscribe=function(...a){return wrappedSubscribe.apply(this,a);};
 dispose();assert.equal(pluginListeners.size,0);assert.equal(nativeListeners.size,1);assert.equal(source.getSnapshot(),raw);
 for(const fn of nativeListeners)fn();assert.equal(notified,2,'unloading the plugin retains the host subscriber');unsubscribe();assert.equal(nativeListeners.size,0);
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


// Exercise production hook closures with deterministic out-of-order RPC replies.
function hooks(){
 const cells=[],effects=[];let cursor=0,pending=[];
 const changed=(a,b)=>!a||a.length!==b.length||a.some((v,i)=>v!==b[i]);
 const runtime={...React,useState(value){const i=cursor++;if(!(i in cells))cells[i]=typeof value==='function'?value():value;return[cells[i],v=>{cells[i]=typeof v==='function'?v(cells[i]):v;}];},useRef(value){const i=cursor++;return cells[i]??(cells[i]={current:value});},useEffect(fn,deps){const i=cursor++;if(changed(effects[i]?.deps,deps)){pending.push(()=>{effects[i]?.off?.();effects[i]={deps,off:fn()};});}},useSyncExternalStore(_subscribe,snapshot){return snapshot();}};
 return {runtime,render(component,props){cursor=0;pending=[];const tree=component(props);pending.forEach(fn=>fn());return tree;},dispose(){effects.forEach(e=>e?.off?.());}};
}
function findNode(tree,predicate){if(!tree||typeof tree!=='object')return null;if(predicate(tree))return tree;for(const child of React.Children.toArray(tree.props?.children)){const found=findNode(child,predicate);if(found)return found;}return null;}
const settle=async()=>{await Promise.resolve();await Promise.resolve();await Promise.resolve();};
test('a stale WeChat refresh cannot overwrite a new model, reasoning choice or save',async()=>{
 const runner=hooks(),{WechatModelPicker}=await client({React:runner.runtime});
 let release,route={provider:'demo',model:'main'},saved;
 const catalog={providers:[{id:'demo',models:[{id:'main'},{id:'worker'}]}]};
 const control=async(action,payload)=>{
  if(action==='modelCatalog')return catalog;
  if(action==='wechatModel'){if(release===undefined){release=null;return{route};}return new Promise(resolve=>{release=resolve;});}
  if(action==='modelCapabilities')return{...payload,reasoning:{efforts:[{id:'high'}]}};
  if(action==='setWechatModel'){saved=payload.route;return{route:saved};}
 };
 const render=()=>runner.render(WechatModelPicker,{control});render();await settle();let tree=render();
 const refresh=findNode(tree,n=>n.type==='button'&&n.props.children==='刷新列表').props.onClick();
 tree=render();findNode(tree,n=>n.props['aria-label']==='微信对话模型').props.onChange({target:{value:JSON.stringify({provider:'demo',model:'worker'})}});
 tree=render();await settle();tree=render();findNode(tree,n=>n.props['aria-label']==='微信思考强度').props.onChange({target:{value:'high'}});
 tree=render();await findNode(tree,n=>n.type==='button'&&n.props.children==='应用模型').props.onClick();release({route});await refresh;await settle();tree=render();
 assert.equal(JSON.parse(findNode(tree,n=>n.props['aria-label']==='微信对话模型').props.value).model,'worker');assert.equal(findNode(tree,n=>n.props['aria-label']==='微信思考强度').props.value,'high');assert.equal(saved.model,'worker');assert.equal(saved.reasoningEffort,'high');runner.dispose();
});
test('late context reads and writes cannot replace the newly selected session settings',async()=>{
 const runner=hooks(),{IntelligencePanel}=await client({React:runner.runtime});let sessionId='a',resolveRead,resolveWrite;
 const value=n=>({context:{auto:true,triggerMode:'tokens',thresholdRatio:.75,thresholdTokens:n},compression:{effectiveTokens:n,capacity:1000000},capabilities:{manual:true},routes:{},tasks:{},routingEnabled:false});
 const control=async(action,payload)=>{if(action==='intelligence')return payload.sessionId==='a'?new Promise(resolve=>resolveRead=resolve):value(8000);if(action==='configureIntelligence')return new Promise(resolve=>resolveWrite=resolve);};
 const store={snapshot:()=>({sessionId}),subscribe:()=>()=>{}};const render=()=>runner.render(IntelligencePanel,{store,control,onCompacted(){}});
 render();sessionId='b';render();await settle();resolveRead(value(99000));await settle();render();let tree=render();assert.equal(findNode(tree,n=>n.props['aria-label']==='上下文压缩触发Token数').props.value,'8000');
 findNode(tree,n=>n.props['aria-label']==='自动压缩').props.onChange({target:{value:'false'}});sessionId='c';render();await settle();resolveWrite(value(77000));await settle();tree=render();assert.equal(findNode(tree,n=>n.props['aria-label']==='上下文压缩触发Token数').props.value,'8000');runner.dispose();
});
test('a failed workbench read blocks editing until retry restores the saved modules',async()=>{
 const runner=hooks(),{WorkbenchPanel}=await client({React:runner.runtime});let reads=0;
 const props={tab:'modules',store:{snapshot:()=>({}),subscribe:()=>()=>{}},navigation:{snapshot:()=>[],subscribe:()=>()=>{}},control:async()=>{if(++reads===1)throw Error('temporary read failure');return{modules:[{id:'existing',title:'Preserved module',description:'',kind:'prompt',content:'keep',visible:true}]};}};
 const render=()=>runner.render(WorkbenchPanel,props);render();await settle();let tree=render();const retry=findNode(tree,n=>n.type?.name==='PanelLoadState');assert.equal(retry.props.error,'temporary read failure');assert(!findNode(tree,n=>n.props['aria-label']==='模块标题 1'));retry.props.onRetry();render();await settle();tree=render();assert.equal(findNode(tree,n=>n.props['aria-label']==='模块标题 1').props.value,'Preserved module');runner.dispose();
});

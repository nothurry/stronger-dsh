import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

test('mode selection changes layout before the next response and ignores a stale in-flight read',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.wireTeam=wireTeamWorkspace;return {name:'dsh-ui-stronger',inject:");
 const states=[],listeners=new Map(),calls=[],cleanup=[];let cursor=0,rendered=false,component;
 const fakeReact={useRef:value=>({current:value}),createElement:(type,props,...children)=>({type,props:{...props,children}}),Fragment:'fragment',useState(initial){const index=cursor++;if(!(index in states))states[index]=typeof initial==='function'?initial():initial;return[states[index],value=>{states[index]=typeof value==='function'?value(states[index]):value;}];},useCallback:fn=>fn,useEffect(callback){if(!rendered)cleanup.push(callback());}};
 const win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?fakeReact:{})},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 vm.runInNewContext(source,{window:win,document:{hidden:false},setInterval:()=>1,clearInterval(){},AbortController,AbortSignal,setTimeout,clearTimeout});
 const Original=()=>null,entry={options:{id:'native',priority:0},component:Original};
 const ctx={connection:{rpc:{call:(_channel,_action,_payload,signal)=>new Promise(resolve=>calls.push({signal,resolve}))}},effect:callback=>cleanup.push(callback()),slots:{entriesOfSlot:()=>[entry],subscribe:()=>()=>{},register(_options,fn){component=fn;return()=>{};}}};
 win.wireTeam(ctx);const render=()=>{cursor=0;const value=component({sessionId:'one'});rendered=true;return value;};
 render();assert.equal(calls.length,1);
 listeners.get('ui-stronger-mode-change')({detail:{sessionId:'one',presetId:'team'}});
 assert.equal(render().props.data.requested,true);assert.equal(calls.length,2);assert(calls[0].signal.aborted);
 calls[0].resolve({ok:true,value:{requested:false}});await new Promise(resolve=>setImmediate(resolve));assert.equal(render().props.data.requested,true);
 calls[1].resolve({ok:true,value:{requested:true,timeline:{tasks:[]}}});await new Promise(resolve=>setImmediate(resolve));assert.equal(render().props.data.requested,true);
 listeners.get('ui-stronger-mode-change')({detail:{sessionId:'one',presetId:'ptc'}});assert.equal(render().props.data.requested,false);
 for(const off of cleanup.reverse())off?.();
} );

test('optimistic mode layout holds while save is pending and restores the previous layout on failure',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.wireTeam=wireTeamWorkspace;return {name:'dsh-ui-stronger',inject:");
 const states=[],listeners=new Map(),calls=[],cleanup=[];let cursor=0,rendered=false,component;
 const fakeReact={useRef:value=>({current:value}),createElement:(type,props,...children)=>({type,props:{...props,children}}),Fragment:'fragment',useState(initial){const index=cursor++;if(!(index in states))states[index]=typeof initial==='function'?initial():initial;return[states[index],value=>{states[index]=typeof value==='function'?value(states[index]):value;}];},useCallback:fn=>fn,useEffect(callback){if(!rendered)cleanup.push(callback());}};
 const win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?fakeReact:{})},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 vm.runInNewContext(source,{window:win,document:{hidden:false},setInterval:()=>1,clearInterval(){},AbortController,AbortSignal,setTimeout,clearTimeout});
 const ctx={connection:{rpc:{call:()=>new Promise(resolve=>calls.push(resolve))}},effect:callback=>cleanup.push(callback()),slots:{entriesOfSlot:()=>[{options:{id:'native'},component:()=>null}],subscribe:()=>()=>{},register(_options,fn){component=fn;return()=>{};}}};
 win.wireTeam(ctx);const render=()=>{cursor=0;const value=component({sessionId:'one'});rendered=true;return value;};render();
 listeners.get('ui-stronger-mode-change')({detail:{sessionId:'one',presetId:'team',pending:true}});assert.equal(render().props.data.requested,true);assert.equal(calls.length,1);
 calls[0]({ok:true,value:{requested:false}});await new Promise(resolve=>setImmediate(resolve));assert.equal(render().props.data.requested,true);
 listeners.get('ui-stronger-mode-change')({detail:{sessionId:'one',presetId:'standard'}});assert.equal(render().props.data.requested,false);assert.equal(calls.length,2);
 for(const off of cleanup.reverse())off?.();
});

test('native browser body, slot key, controller injection, store and navigation controls survive enhancement and unload',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.wireBrowser=wireBrowserEvidence;return {name:'dsh-ui-stronger',inject:");
 const win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?React:{})}};vm.runInNewContext(source,{window:win,AbortController});
 const nativeController={nativeController:true,useBrowserState:()=>({})},inject=()=>nativeController,nativeStore={},cleanup=[];let wrapped,options,removed=false;
 const Original=props=>React.createElement('div',{'data-native':props.nativeMarker},...['后退','前进','刷新','浏览地址','沙箱设置'].map(label=>React.createElement('button',{key:label},label)));
 const entry={options:{key:'@deepseek-ai/dsh-client-ui-sidebar-browser',priority:0},component:Original,inject,store:nativeStore,locale:'sidebarBrowser'};
 const ctx={effect:callback=>cleanup.push(callback()),slots:{entriesOfSlot:()=>[entry],subscribe:()=>()=>{},register(value,component){options=value;wrapped=component;return()=>{removed=true;};}}};
 const state={sessionId:'one'},store={subscribe:()=>()=>{},snapshot:()=>state};win.wireBrowser(ctx,store);
 assert.equal(options.inject('one'),nativeController);assert.equal(options.store,nativeStore);assert.equal(options.locale,'sidebarBrowser');assert.equal(options.key,entry.options.key);
 const html=renderToStaticMarkup(React.createElement(wrapped,{nativeMarker:'kept',useTabInfo:()=>({sessionId:'one',tab:{id:'tab'}}),useBrowserState:()=>({frame:{target:{url:'https://example.org/'}}})}));
 for(const label of ['后退','前进','刷新','浏览地址','沙箱设置','原文证据','OCR'])assert(html.includes(label));assert(html.includes('data-native="kept"'));
 for(const off of cleanup.reverse())off?.();assert(removed);
});

test('ordinary, loading and ready team layouts keep the native conversation at the same reconciliation path',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.Team=TeamWorkspace;return {name:'dsh-ui-stronger',inject:");
 const fakeReact={useRef:value=>({current:value}),...React,useState:initial=>[initial,()=>{}],useEffect:()=>{}},win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?fakeReact:{})}};
 vm.runInNewContext(source,{window:win});
 const native=React.createElement('textarea',{key:'native-chat',defaultValue:'Unsent draft'}),base={sessionId:'one',requested:false,coordinator:{},defaults:{},members:[],timeline:{tasks:[],summary:{}},messages:[]};
 function locate(node,path=[]){
  if(node===native)return path;
  const children=node?.props?.children;
  for(const [index,child]of (Array.isArray(children)?children:[children]).entries()){const found=locateChild(child,[...path,index]);if(found)return found;}
  return null;
 }
 function locateChild(node,path){if(Array.isArray(node)){for(const [index,child]of node.entries()){const found=locateChild(child,[...path,index]);if(found)return found;}return null;}return node&&typeof node==='object'?locate(node,path):null;}
 const ordinary=win.Team({data:base,children:native}),loading=win.Team({data:{...base,requested:true,loading:true},children:native}),ready=win.Team({data:{...base,requested:true},children:native});
 assert.equal(ordinary.type,loading.type);assert.equal(loading.type,ready.type);assert(locate(ordinary));assert.deepEqual(locate(ordinary),locate(loading));assert.deepEqual(locate(loading),locate(ready));
 assert.equal(ordinary.props.className,'zs-team-layout-idle');assert.equal(ready.props.className,'zs-team-workspace');
});

test('team enhancement wraps the full native conversation shell and preserves its slot contracts',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.wireTeam=wireTeamWorkspace;return {name:'dsh-ui-stronger',inject:");
 const children={'conversation.header':{kind:'single',scope:'session-maybe'}},store={},inject=()=>({native:true}),Original=()=>null;
 const entry={options:{priority:0},children,component:Original,store,inject,locale:'native-conversation'};
 const cleanup=[],queries=[];let options,component,calls=0;
 const fakeReact={useRef:value=>({current:value}),createElement:(type,props,...items)=>({type,props:{...props,children:items}}),Fragment:'fragment',useState:initial=>[initial,()=>{}],useCallback:fn=>fn,useEffect:fn=>cleanup.push(fn())};
 const win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?fakeReact:{})},addEventListener(){},removeEventListener(){}};
 vm.runInNewContext(source,{window:win,document:{hidden:false},setInterval:()=>1,clearInterval(){},AbortController,AbortSignal,setTimeout,clearTimeout});
 const ctx={effect:fn=>cleanup.push(fn()),connection:{rpc:{call:()=>{calls++;}}},slots:{entriesOfSlot:name=>{queries.push(name);return name==='main.conversation'?[entry]:[];},subscribe:name=>{assert.equal(name,'main.conversation');return()=>{};},register:(value,renderer)=>{options=value;component=renderer;return()=>{};}}};
 win.wireTeam(ctx);assert.deepEqual(queries,['main.conversation']);assert.equal(options.name,'main.conversation');assert.equal(options.children,children);assert.equal(options.id,'ui-stronger-team-workspace');assert.equal(options.store,store);assert.equal(options.inject,inject);assert.equal(options.locale,entry.locale);
 const rendered=component({sessionId:undefined,renderSlot:()=>null});assert.equal(calls,0,'blank workspace must not query a nonexistent session');assert.equal(rendered.props.children[0].type,Original);
 for(const off of cleanup.reverse())off?.();
});

test('team roster uses an independent left column and native chat owns its composer',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.Team=TeamWorkspace;window.css=TEAM_CSS;return {name:'dsh-ui-stronger',inject:");
 const react={...React,useState:value=>[value,()=>{}],useEffect:()=>{}},win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?react:{})}};
 vm.runInNewContext(source,{window:win});
 const data={requested:true,coordinator:{},defaults:{},members:[{id:'a',name:'执行成员',identity:'执行',duties:'范围内操作'},{id:'b',name:'核验成员',identity:'核验',duties:'核验结果'}],timeline:{tasks:[],summary:{}},messages:[]};
 const element=win.Team({data,children:React.createElement('form',{'data-native-composer':true})});
 const html=renderToStaticMarkup(element);assert(html.includes('<aside'));assert(html.includes('aria-label="团队成员"'));assert.equal((html.match(/团队配置/g)??[]).length,1);assert.equal((html.match(/data-native-composer/g)??[]).length,1);
 assert.match(win.css,/grid-template-columns:clamp\(164px,21%,224px\) minmax\(0,1fr\)/);assert.match(win.css,/\.zs-team-roster\{grid-column:1;grid-row:1/);assert.match(win.css,/\.zs-team-coordinator\{grid-column:2/);
 assert.doesNotMatch(win.css,/min-height:180px|max-height:38vh|\.zs-team-member\{animation:zs-/);
 assert(win.css.includes('var(--dsw-alias-label-secondary'));assert(win.css.includes('var(--dsw-alias-bg-base'));
});

test('team label follows the requested view while execution is still using standard composition',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.Picker=PresetPicker;return {name:'dsh-ui-stronger',inject:");
 let index=0;const react={...React,useState:initial=>[++index===5?{requested:'team',current:'standard',pending:false}:initial,()=>{}],useEffect(){},useRef:value=>({current:value})};
 const win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?react:{Menu:props=>props.anchor})}};
 vm.runInNewContext(source,{window:win});
 const result=win.Picker({ctx:{},sessionId:'one',current:'standard',label:'标准模式'});
 const html=renderToStaticMarkup(result);assert(html.includes('团队模式'));assert(!html.includes('>标准模式<'));
});

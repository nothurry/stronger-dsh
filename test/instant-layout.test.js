import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

test('mode selection changes layout before the next response and ignores a stale in-flight read',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.wireTeam=wireTeamWorkspace;return {name:'dsh-ui-stronger',inject:");
 const states=[],listeners=new Map(),calls=[],cleanup=[];let cursor=0,rendered=false,component;
 const fakeReact={createElement:(type,props,...children)=>({type,props:{...props,children}}),Fragment:'fragment',useState(initial){const index=cursor++;if(!(index in states))states[index]=typeof initial==='function'?initial():initial;return[states[index],value=>{states[index]=typeof value==='function'?value(states[index]):value;}];},useCallback:fn=>fn,useEffect(callback){if(!rendered)cleanup.push(callback());}};
 const win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?fakeReact:{})},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 vm.runInNewContext(source,{window:win,document:{hidden:false},setInterval:()=>1,clearInterval(){},AbortController,AbortSignal,setTimeout,clearTimeout});
 const Original=()=>null,entry={options:{id:'native',priority:0},component:Original};
 const ctx={connection:{rpc:{call:(_channel,_action,_payload,signal)=>new Promise(resolve=>calls.push({signal,resolve}))}},effect:callback=>cleanup.push(callback()),slots:{entriesOfSlot:()=>[entry],subscribe:()=>()=>{},register(_options,fn){component=fn;return()=>{};}}};
 win.wireTeam(ctx);const render=()=>{cursor=0;const value=component({sessionId:'one'});rendered=true;return value;};
 render();assert.equal(calls.length,1);
 listeners.get('ui-stronger-mode-change')({detail:{sessionId:'one',presetId:'team'}});
 assert.equal(render().props.className,'zs-team-workspace');assert.equal(calls.length,2);assert(calls[0].signal.aborted);
 calls[0].resolve({ok:true,value:{requested:false}});await new Promise(resolve=>setImmediate(resolve));assert.equal(render().props.className,'zs-team-workspace');
 calls[1].resolve({ok:true,value:{requested:true,timeline:{tasks:[]}}});await new Promise(resolve=>setImmediate(resolve));assert.equal(render().props.data.requested,true);
 listeners.get('ui-stronger-mode-change')({detail:{sessionId:'one',presetId:'ptc'}});assert.equal(render().props.data.requested,false);
 for(const off of cleanup.reverse())off?.();
} );

test('optimistic mode layout holds while save is pending and restores the previous layout on failure',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.wireTeam=wireTeamWorkspace;return {name:'dsh-ui-stronger',inject:");
 const states=[],listeners=new Map(),calls=[],cleanup=[];let cursor=0,rendered=false,component;
 const fakeReact={createElement:(type,props,...children)=>({type,props:{...props,children}}),Fragment:'fragment',useState(initial){const index=cursor++;if(!(index in states))states[index]=typeof initial==='function'?initial():initial;return[states[index],value=>{states[index]=typeof value==='function'?value(states[index]):value;}];},useCallback:fn=>fn,useEffect(callback){if(!rendered)cleanup.push(callback());}};
 const win={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?fakeReact:{})},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 vm.runInNewContext(source,{window:win,document:{hidden:false},setInterval:()=>1,clearInterval(){},AbortController,AbortSignal,setTimeout,clearTimeout});
 const ctx={connection:{rpc:{call:()=>new Promise(resolve=>calls.push(resolve))}},effect:callback=>cleanup.push(callback()),slots:{entriesOfSlot:()=>[{options:{id:'native'},component:()=>null}],subscribe:()=>()=>{},register(_options,fn){component=fn;return()=>{};}}};
 win.wireTeam(ctx);const render=()=>{cursor=0;const value=component({sessionId:'one'});rendered=true;return value;};render();
 listeners.get('ui-stronger-mode-change')({detail:{sessionId:'one',presetId:'team',pending:true}});assert.equal(render().props.className,'zs-team-workspace');assert.equal(calls.length,1);
 calls[0]({ok:true,value:{requested:false}});await new Promise(resolve=>setImmediate(resolve));assert.equal(render().props.className,'zs-team-workspace');
 listeners.get('ui-stronger-mode-change')({detail:{sessionId:'one',presetId:'standard'}});assert.equal(render().type,'fragment');assert.equal(calls.length,2);
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

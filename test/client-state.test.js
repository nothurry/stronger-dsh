import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import React from 'react';

async function load(react,globals={}){
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.stateQA={wireDraftRows,wireReadingPosition};return {name:'dsh-ui-stronger',inject:");
 const window={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?react:{})}};
 vm.runInNewContext(source,{window,...globals});return window.stateQA;
}
test('an unsent draft remains in the sidebar projection without changing native blank identity',async()=>{
 const qa=await load({...React,useEffect:effect=>effect(),useReducer:()=>[0,()=>{}]});
 let tracker,browser;const original=()=>null;
 const ctx={effect:effect=>effect(),slots:{inject:(_name,install)=>install(),register:(options,component)=>{if(options.id==='ui-stronger-draft-tracker')tracker=component;else browser=component;return()=>{};},entriesOfSlot:()=>[{options:{name:'sidebar.workspaces'},component:original}],subscribe:()=>()=>{}}};
 qa.wireDraftRows(ctx);
 const props={sessionId:'draft',useInput:select=>select({draft:'Unsent text',attachmentIds:[]}),useSession:select=>select({blank:true})};
 tracker(props);
 const native={ids:['draft'],byId:{draft:{id:'draft',blank:true}}};
 const rendered=browser({useSessions:select=>select(native)});
 assert.equal(rendered.props.useSessions(value=>value.byId.draft.blank),false);
 assert.equal(native.byId.draft.blank,true);
 tracker({...props,useInput:select=>select({draft:'',attachmentIds:[]})});
 assert.equal(rendered.props.useSessions(value=>value.byId.draft.blank),true);
});
test('reading above the bottom survives automatic scroll jumps and session changes',async()=>{
 const listeners=new Map();let frame,observer,clock=10000;
 class Element{constructor(){this.className='chat-scroll';this.clientHeight=100;this.scrollHeight=1000;this.scrollTop=200;this.parentElement=null;}closest(selector){return selector==='.an3WzG_root'?root:selector.includes('viewArea')?this:null;}}
 let session='one';const root={querySelector:()=>({getAttribute:()=>session})},element=new Element();
 const document={body:{},addEventListener:(name,handler)=>listeners.set(name,handler),removeEventListener(){},querySelectorAll:()=>[element]};
 const qa=await load(React,{document,Element,Date:{now:()=>clock},requestAnimationFrame:fn=>{frame=fn;return 1;},cancelAnimationFrame(){},MutationObserver:class{constructor(fn){observer=fn;}observe(){}disconnect(){}}});
 let cleanup;qa.wireReadingPosition({effect:effect=>{cleanup=effect();}});
 listeners.get('wheel')({target:element});listeners.get('scroll')({target:element});clock+=2000;
 element.scrollTop=900;listeners.get('scroll')({target:element});assert.equal(element.scrollTop,200);
 session='two';element.scrollTop=700;observer();frame();assert.equal(element.scrollTop,700);
 session='one';observer();frame();assert.equal(element.scrollTop,200);cleanup();
});

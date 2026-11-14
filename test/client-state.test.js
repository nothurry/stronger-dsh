import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import React from 'react';

async function load(react,globals={}){
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.stateQA={wireDraftRows,wireReadingPosition,wireTeamCatalog,wireFoldedReplies,wireProviderFailures,providerFailureText,teamActivity,createRunClock,wireRunClock};return {name:'dsh-ui-stronger',inject:");
 const window={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?react:{})}};
 vm.runInNewContext(source,{window,...globals});return window.stateQA;
}
test('an unsent draft remains in the sidebar projection without changing native blank identity',async()=>{
 const qa=await load({...React,useEffect:effect=>effect(),useReducer:()=>[0,()=>{}]});
 let tracker,browser;const original=()=>null;
 const ctx={effect:effect=>effect(),slots:{inject:(_name,install)=>install(),register:(options,component)=>{assert.equal(typeof options.name,'string');if(options.id==='ui-stronger-draft-tracker')tracker=component;else{assert.equal(options.name,'sidebar.workspaces');browser=component;}return()=>{};},entriesOfSlot:()=>[{options:{id:'native-workspaces'},component:original}],subscribe:()=>()=>{}}};
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

test('folding saves final replies through the active native configuration form once it loads',async()=>{
 const qa=await load(React,{setTimeout,clearTimeout});let value,cleanup;const listeners=new Set(),writes=[];
 const form={getSnapshot:()=>({value}),subscribe:listener=>{listeners.add(listener);return()=>listeners.delete(listener);},async set(key,next){writes.push([key,next]);value={...value,[key]:next};for(const listener of listeners)listener();}};
 qa.wireFoldedReplies({inject:(names,install)=>{assert.equal(names[0],'configForms');install({configForms:{get:ns=>{assert.equal(ns,'ui-chat');return form;}},effect:effect=>{cleanup=effect();}});}});
 assert.equal(writes.length,0);value={foldedReplies:'all',transcriptView:'standard',performanceUsage:'detailed'};for(const listener of listeners)listener();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(writes.length,1);assert.equal(value.foldedReplies,'final');assert.equal(value.transcriptView,'standard');assert.equal(value.performanceUsage,'detailed');
 for(const listener of listeners)listener();await new Promise(resolve=>setImmediate(resolve));assert.equal(writes.length,1);
 cleanup();assert.equal(listeners.size,0);
});

test('a native final-reply preference needs no write',async()=>{
 const qa=await load(React,{setTimeout,clearTimeout});let cleanup,calls=0;
 const form={getSnapshot:()=>({value:{foldedReplies:'final'}}),subscribe:()=>()=>{},set:()=>{calls++;}};
 qa.wireFoldedReplies({inject:(_names,install)=>install({configForms:{get:()=>form},effect:effect=>{cleanup=effect();}})});
 await new Promise(resolve=>setImmediate(resolve));assert.equal(calls,0);cleanup();
});

test('quota error and retry renderers retain the native renderer and show the upstream reset reason',async()=>{
 const qa=await load(React),entries=['turn-error','model-retry'].map(key=>({options:{key},component:()=>null,inject:()=>({native:true}),store:{native:true},locale:'native'}));
 const wrapped=new Map();let cleanup,released=0,unsubscribed=false;
 qa.wireProviderFailures({effect:effect=>{cleanup=effect();},slots:{entriesOfSlot:()=>entries,subscribe:()=>()=>{unsubscribed=true;},register:(options,component)=>{const entry=entries.find(row=>row.options.key===options.key);assert.equal(options.inject,entry.inject);assert.equal(options.store,entry.store);assert.equal(options.locale,entry.locale);assert(options.priority<0);wrapped.set(options.key,component);return()=>{released++;};}}});
 const failure={code:'QUOTA',message:'429: {"message":"Provider frequency limit. Resets at 23:30 UTC+8."}'};
 const translate=key=>key==='message.failure.quota'?'Generic quota text':key;
 for(const key of ['turn-error','model-retry']){
  const node={data:key==='turn-error'?failure:{current:{failure}}};
  const rendered=wrapped.get(key)({node,t:translate});
  assert.equal(rendered.type,entries.find(row=>row.options.key===key).component);assert.equal(rendered.props.node,node);
  assert.equal(rendered.props.t('message.failure.quota'),'Provider frequency limit. Resets at 23:30 UTC+8.');assert.equal(rendered.props.t('other'),'other');
 }
 cleanup();assert.equal(released,2);assert(unsubscribed);
});

test('provider error details remain plain bounded text with credential redaction',async()=>{
 const qa=await load(React);
 assert.equal(qa.providerFailureText('429: {"message":"Try after reset"}'),'Try after reset');
 assert.equal(qa.providerFailureText('upstream unavailable'),'upstream unavailable');
 assert.equal(qa.providerFailureText('x'.repeat(5000)).length,4000);
 assert.doesNotMatch(qa.providerFailureText('Bearer example-credential'),/example-credential/);
});

test('elapsed time follows a monotonic clock and aligns updates with second boundaries',async()=>{
 const qa=await load(React);let wall=100000,mono=0,callback,delay,cancelled=false,updates=0;
 const clock=qa.createRunClock(90300,{wallNow:()=>wall,monotonicNow:()=>mono,schedule:(fn,ms)=>{callback=fn;delay=ms;return 1;},cancel:()=>{cancelled=true;}});
 const off=clock.subscribe(()=>{updates++;});
 assert.equal(clock.getSnapshot(),9);assert.equal(delay,308);
 wall+=3600000;mono=310;callback();assert.equal(clock.getSnapshot(),10);
 wall-=7200000;mono=1310;callback();assert.equal(clock.getSnapshot(),11);assert.equal(updates,2);
 off();assert(cancelled);
});

test('clock presentation preserves the native flow renderer and its child declarations',async()=>{
 const qa=await load({...React,useCallback:fn=>fn});let component,registered,cleanup,released=false;
 const native=()=>null,children={'conversation.chat.node':{kind:'keyed',scope:'session'}},inject=()=>({});
 const entry={options:{name:'conversation.chat.flow',children},component:native,inject,store:{},locale:'chat'};
 qa.wireRunClock({effect:effect=>{cleanup=effect();},slots:{entriesOfSlot:()=>[entry],subscribe:()=>()=>{},register:(options,render)=>{registered=options;component=render;return()=>{released=true;};}}});
 assert.equal(registered.children,undefined);assert.equal(entry.options.children,children);assert.equal(registered.inject,inject);assert.equal(registered.store,entry.store);
 const result=component({useChat:select=>select({navigation:{items:()=>[{anchorKey:'turn'}]}}),useChatNode:(_key,select)=>select({location:{kind:'turn',turn:{status:'open',start:{time:1000}}}}),t:(name,args)=>args?.duration??name});
 assert.equal(result.type,native);const timer=result.props.t('chat.deepDivingFor',{duration:'old duration'});assert.equal(timer.props.startTime,1000);
 assert.equal(result.props.t('other'),'other');cleanup();assert(released);
});

test('child status distinguishes interaction, completion, stopping and output limits without stale running flags',async()=>{
 const qa=await load(React);
 assert.equal(qa.teamActivity({running:false},{done:true,status:'completed'},true,{running:true}).label,'已完成');
 assert.equal(qa.teamActivity({pendingInteraction:{kind:'question'}},null).label,'待回复');
 assert.equal(qa.teamActivity({pendingInteraction:{kind:'approval'}},null).label,'待审核');
 assert.equal(qa.teamActivity({pendingInteraction:{}},null).label,'待处理');
 assert.equal(qa.teamActivity(undefined,{done:true,status:'stop',requireReview:true}).label,'待验收');
 assert.equal(qa.teamActivity(undefined,{done:true,status:'aborted'}).label,'已停止');
 assert.equal(qa.teamActivity(undefined,{done:true,status:'max-tokens'}).label,'需继续');
 assert.equal(qa.teamActivity(undefined,{done:true,status:'error',runError:{code:'QUOTA',message:'429 frequency limit'}}).label,'被限流');
 assert.equal(qa.teamActivity(undefined,{done:false,status:'queued',waitingFor:'waiting'}).label,'等待前置任务');
 assert.notEqual(qa.teamActivity(undefined,{done:false,status:'running',createdAt:'2030-01-01T00:01:00Z'},true,{decision:'deny',at:'2030-01-01T00:00:00Z'}).label,'审查拒绝');
});

test('the team catalog adapter registers an explicit slot name from a native stored entry',async()=>{
 const qa=await load(React);let registered,cleanup,disposed=false;
 const inject=()=>({}),locale={namespace:'native'},original=()=>null;
 qa.wireTeamCatalog({effect:effect=>{cleanup=effect();},slots:{entriesOfSlot:()=>[{options:{id:'subagent-catalog',priority:0},component:original,inject,locale}],subscribe:()=>()=>{},register:(options)=>{assert.equal(options.name,'conversation.session.header.actions');registered=options;return()=>{disposed=true;};}}});
 assert.equal(registered.id,'subagent-catalog');assert.equal(registered.inject,inject);assert.equal(registered.locale,locale);assert.equal(registered.priority,-100);
 cleanup();assert.equal(disposed,true);
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

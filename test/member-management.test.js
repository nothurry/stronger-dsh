import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

async function client(react=React){
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.qa={TeamWorkspace,TeamRowMenu,TeamConfiguration,TeamMemberConversation,NativeTeamMemberChat,teamActivity};return {name:'dsh-ui-stronger',inject:");
 const window={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?react:{Menu:props=>props.anchor,Modal:props=>React.createElement('section',null,props.children,props.footer),Button:'button'})}};
 vm.runInNewContext(source,{window,structuredClone,crypto,AbortController});return window.qa;
}

test('lead and members have separate labelled sections and independent row menus',async()=>{
 const qa=await client();const data={sessionId:'one',requested:true,coordinator:{name:'任务指挥'},defaults:{},members:[{id:'worker',name:'资料研究员',enabled:true}],timeline:{tasks:[],summary:{}},messages:[]};
 const html=renderToStaticMarkup(React.createElement(qa.TeamWorkspace,{data}));
 assert.match(html,/aria-label="主智能体"/);assert.match(html,/aria-label="子智能体"/);
 assert.match(html,/任务指挥的操作/);assert.match(html,/资料研究员的操作/);
 assert.match(html,/aria-label="添加子智能体"/);
 assert(html.indexOf('aria-label="主智能体"')<html.indexOf('aria-label="子智能体"'));
});

test('focused member editor preserves other members and exposes the chosen name field',async()=>{
 const qa=await client({...React,useEffect(){}});
 const data={sessionId:'one',revision:2,coordinator:{name:'任务指挥',model:null,effort:null,instructions:''},defaults:{model:null,effort:null},members:[{id:'a',name:'读资料',identity:'read',duties:'report',model:null,effort:null,enabled:true},{id:'b',name:'核验',identity:'verify',duties:'check',model:null,effort:null,enabled:true}]};
 const html=renderToStaticMarkup(React.createElement(qa.TeamConfiguration,{data,target:{memberId:'b',field:'name'},control:()=>new Promise(()=>{})}));
 assert.match(html,/value="核验"/);assert.doesNotMatch(html,/value="读资料"/);assert.doesNotMatch(html,/全体子智能体默认设置/);
 const lead=renderToStaticMarkup(React.createElement(qa.TeamConfiguration,{data,target:{main:true,field:'name'},control:()=>new Promise(()=>{})}));
 assert.match(lead,/aria-label="主智能体名称"/);assert.doesNotMatch(lead,/aria-label="子智能体1名称"/);
});

test('member conversation delegates content and chat view to the native factory',async()=>{
 const qa=await client();let result;
 const props={sessionId:'child',useSession:select=>select({blank:false,awaitingFirstTurn:false,running:false,openState:'open'}),useConversation:select=>select({activeTargets:new Set()}),useSessions:select=>select({byId:{child:{blank:false}}}),renderFactorySlot:(name,owner,options)=>{result={name,owner,options};return 'native-chat';}};
 assert.equal(qa.TeamMemberConversation(props),'native-chat');assert.equal(result.name,'conversation.content');assert.equal(result.owner.variant,'embedded');assert.equal(result.owner.phase,'active');
 let view;result.options.slots.views({renderSlot:(name,owner)=>{view={name,owner};}});assert.equal(view.name,'conversation.session');assert.equal(view.owner.view,'chat');
});

test('member native reference has a direct-parent address, releases on unmount and never opens another main session',async()=>{
 const cleanup=[];let retained,released=0;
 const qa=await client({...React,useState:initial=>[initial,()=>{}],useEffect:effect=>cleanup.push(effect())});
 const ctx={get:()=>({retain:(address,options)=>{retained={address,options};return {ready:Promise.resolve(),release:()=>released++};}})};
 qa.NativeTeamMemberChat({ctx,parentSessionId:'parent',childSessionId:'child',SessionProvider:()=>null,renderSlot:()=>null});
 assert.deepEqual({...retained.address},{parentSessionId:'parent',childSessionId:'child',mode:'continuable'});
 for(const off of cleanup.reverse())off?.();assert.equal(released,1);assert(retained.options.signal.aborted);
});

test('an active child composer cannot inherit its blank parent hero minimum height',async()=>{
 const source=await readFile(new URL('../lib/client.js',import.meta.url),'utf8');
 assert.match(source,/\.zs-team-native-chat \.an3WzG_body\[data-content-phase=active\] \.an3WzG_composerSeat\{flex:none!important;min-height:0!important/);
 assert.match(source,/\.zs-team-member-more svg\{width:18px!important;height:18px!important/);
});

test('first member message uses independent controls and keeps the model label on one line',async()=>{
 const source=(await readFile(new URL('../lib/client.js',import.meta.url),'utf8')).replace("return {name:'dsh-ui-stronger',inject:","window.Composer=MemberComposer;return {name:'dsh-ui-stronger',inject:");
 const window={__ModuleLoader__:{load:bundle=>bundle.factory(id=>id==='react'?React:{})}};vm.runInNewContext(source,{window});
 const member={id:'worker',name:'执行子智能体',enabled:true},data={members:[member],defaults:{},coordinator:{},timeline:{policy:{maxParallel:2}}};
 const html=renderToStaticMarkup(React.createElement(window.Composer,{member,data}));
 assert.doesNotMatch(html,/GRgSLq_/);assert.match(html,/class="zs-team-member-controls"/);assert.match(html,/class="zs-team-member-model"/);
 assert.match(source,/\.zs-team-member-model\{[^}]*white-space:nowrap/);
 assert.match(source,/\.zs-team-member-controls>button\.zs-team-member-send\{[^}]*flex:0 0 30px/);
});

test('per-agent status follows actual native work and pending approval without marking an idle coordinator busy',async()=>{
 const qa=await client();
 assert.equal(qa.teamActivity({running:false},null).label,'待机');
 assert.equal(qa.teamActivity({running:true},null).label,'工作中');
 assert.equal(qa.teamActivity({running:true,pendingInteraction:{key:'approval'}},null).label,'待审核');
 assert.equal(qa.teamActivity(undefined,{done:false,status:'running'},true,{pending:true}).label,'审查中');
 assert.equal(qa.teamActivity(undefined,{done:true,status:'completed',requireReview:true}).label,'待验收');
 assert.equal(qa.teamActivity(undefined,{done:false,status:'running'},true,{decision:'deny'}).label,'审查拒绝');
 const data={sessionId:'main',requested:true,coordinator:{name:'主控'},defaults:{},members:[{id:'worker',name:'资料研究员',enabled:true}],timeline:{tasks:[{profile:{id:'worker'},childId:'child',status:'running',done:false}],summary:{running:1}},messages:[]};
 const html=renderToStaticMarkup(React.createElement(qa.TeamWorkspace,{data,liveStatuses:new Map([['main',{running:false}],['child',{running:true,pendingInteraction:{key:'approval'}}]])}));
 assert.match(html,/>主控<\/strong><span[^>]*data-state="idle"/);
 assert.match(html,/>资料研究员<\/strong><span[^>]*data-state="approval"/);
});

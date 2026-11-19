import test from 'node:test';
import assert from 'node:assert/strict';
import {Session} from '@deepseek-ai/dsh-session';
import {createUserMessage} from '@deepseek-ai/dsh-llm';
import {compactedNodes} from '../lib/compaction-lineage.js';
import {reviewSnapshot,REVIEW_POLICY} from '../lib/guard.js';
import {Workspace} from '../lib/workspace.js';

function fixture(){
 const s=Session.create('long-session');
 const append=(text,source,options={surfaceOp:'append'})=>s.append('user/message',createUserMessage({content:[{type:'text',text}],source}),options);
 const human=(text,options)=>append(text,{kind:'user',rpcId:`rpc-${s.snapshotEvents().length}`},options);
 const compact=()=>{
  const shadowedSeqs=[...s.surface.nodes],compactionId=`compact-${s.snapshotEvents().length}`,window={start:shadowedSeqs[0],end:shadowedSeqs.at(-1)};
  const start=s.append('compaction/start',{compactionId,turn:null});
  const summary=s.append('compaction/summary',{compactionId,summary:'Continue work.',shadowedRange:window,shadowedSeqs,shadowedTokenCount:100000,provider:'p',model:'m'});
  const checkpoint=append('Continue work. Forbidden test payload: stale authorization.',{kind:'compact-checkpoint',compactionId},{surfaceOp:{op:'replace',startSeq:window.start,endSeq:window.end},sourceEventSeqs:[start.seq,summary.seq,...shadowedSeqs]});
  s.append('compaction/end',{compactionId,turn:null});return checkpoint;
 };
 const snapshot=(events=s.snapshotEvents(),nodes=s.surface.nodes)=>reviewSnapshot({name:'shell',rootCallId:'call',arguments:{cmd:'npm test'},agent:{session:{id:s.id,surface:{nodes},snapshotEvents:()=>[...events,{seq:events.length+1,type:'tool/call',data:{name:'shell',callId:'call',arguments:{cmd:'npm test'}}}],requestHeader:()=>({config:{provider:'p',model:'m'},tools:[{name:'shell',description:'Run command',parameters:{type:'object'}}]})}}},'/workspace');
 return {s,human,append,compact,snapshot};
}

test('repeated native surface replacements retain exact scoped restrictions without forwarding long tool and reference history',()=>{
 const {s,human,append,compact,snapshot}=fixture(),first=human('Keep traffic offline and only write within the workspace.');
 const withdrawn=human('Temporary abandoned branch: use old directory.');
 const correction=human('Cancel publication; local tests only.',{surfaceOp:{op:'replace',startSeq:withdrawn.seq,endSeq:withdrawn.seq},sourceEventSeqs:[withdrawn.seq]});
 const artifact='EXTERNAL-DOCUMENT-NOT-AUTHORIZATION '.repeat(180);
 for(let cycle=0;cycle<20;cycle++){
  for(let i=0;i<120;i++)append(artifact,{kind:'agent-context'});
  compact();
 }
 const current=human('Continue the work and run the local test suite.');
 const events=s.snapshotEvents(),r=snapshot(),encoded=JSON.stringify(r.payload);
 assert.equal(events.length,2484);
 assert.deepEqual(r.payload.history.filter(row=>row.role!=='fact').map(row=>[row.seq,row.role]),[[first.seq,'historical-constraint-only'],[correction.seq,'historical-constraint-only'],[current.seq,'human-instruction']]);
 assert.equal(r.payload.historyTruncated,false);
 assert(!encoded.includes('abandoned branch'));assert(!encoded.includes(artifact));assert(encoded.length<1800);
 assert.deepEqual(r.payload.action.arguments,{cmd:'npm test'});assert.match(REVIEW_POLICY,/never as consent/);
 const continuity=new Workspace('unused').continuity(s,'/workspace');
 assert(continuity.lineageVerified&&continuity.latestUserAlreadyVisible);
 assert.deepEqual(continuity.compactedUser.map(row=>row.seq),[first.seq,correction.seq]);
 assert(!continuity.excerptTruncated);
});

test('rewinding an entire checkpoint removes its lineage; damaged lineage fails closed',()=>{
 const {s,human,compact,snapshot}=fixture();
 human('Old instruction on a discarded branch');const checkpoint=compact();
 const corrupt=s.snapshotEvents().map(event=>event.seq===checkpoint.seq?{...event,sourceEventSeqs:[]}:event);
 assert.throws(()=>snapshot(corrupt),/无法核对原生压缩来源/);
 const invalid=new Workspace('unused').continuity({id:s.id,surface:s.surface,snapshotEvents:()=>corrupt},'/workspace');
 assert.equal(invalid.lineageVerified,false);assert.equal(invalid.excerptTruncated,true);
 const replacement=human('Current branch instructions',{surfaceOp:{op:'replace',startSeq:checkpoint.seq,endSeq:checkpoint.seq},sourceEventSeqs:[checkpoint.seq]});
 assert.equal(compactedNodes(s.snapshotEvents(),new Set(s.surface.nodes)).size,0);
 assert.deepEqual(snapshot().payload.history.map(row=>row.seq),[replacement.seq]);
 assert.deepEqual(new Workspace('unused').continuity(s,'/workspace').compactedUser,[]);
});

test('oversized compacted constraints never silently authorize automation',()=>{
 const {s,human,compact,snapshot}=fixture();human('Restriction: '+('A'.repeat(41000)));compact();human('Please continue.');
 const review=snapshot(),continuity=new Workspace('unused').continuity(s,'/workspace');
 assert.equal(review.payload.historyTruncated,true);
 assert.equal(continuity.excerptTruncated,true);
 assert(continuity.compactedUser.length===0&&continuity.lineageVerified);
});

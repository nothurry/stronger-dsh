import test from 'node:test';
import assert from 'node:assert/strict';
import {EvidenceBridge} from '../lib/evidence.js';
import {LocalMedia} from '../lib/media.js';

const image=attachmentId=>({type:'image',attachment:{attachmentId,width:80,height:40}});
const finish={type:'finish',reason:{kind:'stop'}};
function ocrFixture(){
 const visible=image('active-file'),inherited=image('inherited-file'),withdrawn=image('withdrawn-file');
 const event=(seq,block)=>({seq,type:'user/message',data:{source:{kind:'user'},content:[block]}});
 const session={id:'child',header:{parentSession:'root'},surface:{nodes:[0,1]},isOwnSeq:seq=>seq>0,snapshotEvents:()=>[event(0,inherited),event(1,visible),event(2,withdrawn)]};
 let chunks=[{type:'text-delta',index:2,text:'read'},{type:'block-end',index:2,block:{type:'text',text:'read'}},{type:'block-end',index:3,block:{type:'text',text:'line two'}},finish];
 const calls=[],llm={resolveModelInfo:async()=>({inputModalities:['image'],defaultMaxTokens:2048}),async *stream(request){calls.push(request);yield* chunks;}};
 const bridge=new EvidenceBridge('unused',{get:name=>({llm,agents:{get:id=>id===session.id?{session}:null}})[name]});bridge.config.ocr={provider:'local',model:'vision'};
 return {bridge,session,calls,llm,visible,withdrawn,setChunks:value=>{chunks=value;}};
}
test('OCR attachment selection stays on the latest active message owned by this agent',async()=>{
 const {bridge,session,calls,llm,visible,withdrawn}=ocrFixture();assert.deepEqual(bridge.images('child'),[visible]);
 await assert.rejects(bridge.ocr('child',[withdrawn],undefined,{fromActive:true}),/已变化/);assert.equal(calls.length,0);
 llm.resolveModelInfo=async()=>{session.surface.nodes=[0];return {inputModalities:['image']};};
 await assert.rejects(bridge.ocr('child',[visible],undefined,{fromActive:true}),/已变化/);
 assert.deepEqual(bridge.images('child'),[]);assert.equal(calls.length,0);assert.equal(bridge.controllers.size,0);
});
test('OCR isolates request IDs, supports final-only text and rejects incomplete or non-text actions',async()=>{
 const {bridge,calls,visible,setChunks}=ocrFixture();const first=await bridge.ocr('child',[visible]);assert.equal(first.text,'read\nline two');
 assert.equal((await bridge.ocr('child',[visible])).text,first.text);assert.notEqual(calls[0].sessionId,calls[1].sessionId);assert.notEqual(calls[0].sessionId,'child');assert.equal(calls[0].temperature,undefined);
 for(const [chunks,error] of [[[finish,{type:'text-delta',index:0,text:'extra'}],/仍有输出/],[[{type:'tool-call-delta'}],/不能调用工具/],[[{type:'finish',reason:{kind:'max-tokens'}}],/未完整结束/],[[{type:'text-delta',index:0,text:'A'.repeat(16001)},finish],/16000/]]){
  setChunks(chunks);await assert.rejects(bridge.ocr('child',[visible]),error);assert.equal(bridge.controllers.size,0);
 }
});
test('local voice refuses redirect responses without forwarding the synthesis input',async t=>{
 const media=new LocalMedia('unused');media.config.reference='fixture.wav';media.ensureService=async()=>{};
 const fetch=t.mock.method(globalThis,'fetch',async(url,options)=>{
  assert.match(url,/^http:\/\/127\.0\.0\.1:9880\//);
  if(url.endsWith('/openapi.json')){assert.equal(options.redirect,'error');return new Response('{}');}
  assert.equal(options.redirect,'manual');return new Response(null,{status:307,headers:{Location:'https://example.com/never-contact'}});
 });
 await assert.rejects(media.speak('Synthetic test text.'),/已阻止转发/);assert.equal(fetch.mock.callCount(),2);assert.equal(media.pending,false);assert.equal(media.controller,null);
});

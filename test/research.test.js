import test from 'node:test';
import assert from 'node:assert/strict';
import {ResearchBridge,researchPlan,rankResearch,publicSourceUrl} from '../lib/research.js';
import {worldEvidence,wireWorkbench} from '../lib/workbench.js';
import {wireGuard} from '../lib/guard.js';

const source=(url,title='Python API reference',excerpt='Python API reference and examples')=>({url,title,excerpt,kind:'snippet'});
function fixture(search){
 const agent={session:{id:'one',header:{cwd:'/work'},requestHeader:()=>({config:{provider:'demo',model:'small'}})}};
 const agents=new Map([['one',agent]]),provider={id:'demo-search'},web={search,searchReady:async()=>true,selectSearchProvider:()=>provider};
 const tools={get:name=>['web_search','web_fetch'].includes(name)?{}:undefined};
 const ctx={get:name=>({web,tools,agents}[name])},bridge=new ResearchBridge(ctx);
 return {agent,agents,web,tools,bridge,exec:{agent,signal:new AbortController().signal}};
}
const args={action:'search',query:'Python API reference',platforms:['web','official']};

test('plans expose bounded platform routes, explicit coverage and valid site searches',()=>{
 const plan=researchPlan({...args,action:'plan',mode:'deep',platforms:['official','scholar','code','news','social','video'],officialDomains:['docs.python.org']});
 assert.equal(plan.requests.length,6);assert.equal(plan.concurrency,3);assert.match(plan.requests[0].query,/site:docs.python.org/);assert.match(plan.requests[4].query,/site:x.com/);assert.match(plan.requests[5].query,/site:youtube.com/);
 const fast=worldEvidence({action:'plan',query:'Python API reference'});assert.equal(fast.requests.length,2);assert(fast.remainingPlatforms.includes('code'));
 for(const change of [{maxQueries:99},{limit:99},{verifyTop:9},{platforms:['made-up']},{officialDomains:['localhost']},{officialDomains:['example.com/path']},{query:'Bearer '+'a'.repeat(30)}])assert.throws(()=>researchPlan({...args,...change}));
});

test('official and primary-source priors are transparent, relevance wins over unrelated authority and titles cannot spoof ownership',()=>{
 const result=rankResearch({query:'Python API reference',sources:[source('https://unknown.example.org/post','Official Python API reference'),source('https://docs.python.org/3/library/'),source('https://who.int/notice','Unrelated notice','Other subject')]});
 assert.equal(result.sources[0].url,'https://docs.python.org/3/library/');assert.equal(result.sources[0].authority.kind,'official-or-standard');
 assert(result.sources.find(row=>row.url.includes('unknown')).rank.score>result.sources.find(row=>row.url.includes('who.int')).rank.score);
 const spoof=rankResearch({query:'Python API reference',sources:[{...source('https://docs.python.org.evil.example/post'),provenance:'native-web-provider',kind:'page'}]});
 assert.equal(spoof.sources[0].authority.weight,0);assert.equal(spoof.sources[0].provenance,'supplied-not-independently-verified');assert.equal(spoof.sources[0].rank.access,0);
 const paper=rankResearch({query:'Paper',sources:[source('https://arxiv.org/abs/2601.00001','Paper','Paper result')]});assert.equal(paper.sources[0].authority.kind,'preprint');
});

test('deduplication preserves meaningful queries and joins tracking, video and social URL variants',()=>{
 const result=rankResearch({query:'Python API reference',limit:12,sources:[source('https://docs.python.org/3/?utm_source=a#one'),source('https://docs.python.org/3/'),source('https://youtube.com/watch?v=abcDEF12345&si=tracking'),source('https://youtu.be/abcDEF12345?t=3'),source('https://twitter.com/author/status/12345'),source('https://x.com/author/status/12345'),source('https://example.org/search?q=one'),source('https://example.org/search?q=two')]});
 assert.equal(result.duplicates,3);assert.equal(result.sources.length,5);
 for(const url of ['https://127.0.0.1/','https://localhost/','https://user:secret@example.org/','http://example.org/','https://example.org/?api_key=secret'])assert.throws(()=>publicSourceUrl(url));
});

test('searches run concurrently, preserve partial success and cache without further network queries',async()=>{
 const waiting=[];let calls=0;
 const f=fixture(async(request,signal)=>{calls++;await new Promise(resolve=>waiting.push(resolve));signal.throwIfAborted();if(request.query.includes('official'))throw Object.assign(Error('sensitive provider detail'),{code:'WEB_PROVIDER_ERROR'});return {sources:[source('https://docs.python.org/3/')]};});
 const pending=f.bridge.search(args,f.exec);
 for(let i=0;i<10&&waiting.length<2;i++)await new Promise(resolve=>setImmediate(resolve));
 assert.equal(waiting.length,2,'both providers start before either finishes');waiting.forEach(resolve=>resolve());
 const result=await pending;assert.equal(result.failures.length,1);assert.equal(result.sources.length,1);assert(!JSON.stringify(result).includes('sensitive provider detail'));
 const cached=await f.bridge.search(args,f.exec);assert(cached.cache.hit);assert.equal(cached.stats.queries,0);assert.equal(calls,2);
 cached.sources[0].title='changed';assert.notEqual((await f.bridge.search(args,f.exec)).sources[0].title,'changed');f.bridge.close();
});

test('cache is isolated by session, working directory and selected provider, with explicit fresh lookup',async()=>{
 let calls=0;const f=fixture(async()=>{calls++;return {sources:[source('https://docs.python.org/3/')]};});
 await f.bridge.search(args,f.exec);assert.equal(calls,2);
 await f.bridge.search({...args,fresh:true},f.exec);assert.equal(calls,4);
 f.agent.session.header.cwd='/elsewhere';await f.bridge.search(args,f.exec);assert.equal(calls,6);
 const other={session:{id:'two',header:{cwd:'/elsewhere'}}};f.agents.set('two',other);await f.bridge.search(args,{...f.exec,agent:other});assert.equal(calls,8);
 f.web.selectSearchProvider=()=>({id:'replacement'});await f.bridge.search(args,f.exec);assert.equal(calls,10);
 f.web.searchReady=async()=>false;await assert.rejects(f.bridge.search(args,f.exec),/认证/);f.bridge.close();
});

test('identical in-flight requests share work, caller cancellation is independent and disposal cancels fresh searches',async()=>{
 const waiting=[];let calls=0;const f=fixture(async(_request,signal)=>{calls++;await new Promise(resolve=>waiting.push(resolve));signal.throwIfAborted();return {sources:[source('https://docs.python.org/3/')]};});
 const cancelled=new AbortController(),one=f.bridge.search(args,{...f.exec,signal:cancelled.signal}),two=f.bridge.search(args,f.exec);
 for(let i=0;i<10&&waiting.length<2;i++)await new Promise(resolve=>setImmediate(resolve));
 const rejection=assert.rejects(one);cancelled.abort();await rejection;waiting.splice(0).forEach(resolve=>resolve());
 assert((await two).cache.shared);assert.equal(calls,2);
 const fresh=f.bridge.search({...args,fresh:true},f.exec);const disposed=assert.rejects(fresh);
 for(let i=0;i<10&&waiting.length<2;i++)await new Promise(resolve=>setImmediate(resolve));
 f.bridge.close();await disposed;waiting.forEach(resolve=>resolve());
});

test('optional original-page reads use native fetch within the same concurrency cap and emit bounded excerpts',async()=>{
 let active=0,peak=0;
 const f=fixture(async()=>({sources:[source('https://docs.python.org/3/a'),source('https://docs.python.org/3/b'),source('https://docs.python.org/3/c')]}));
 f.web.fetchReady=async()=>true;f.web.fetch=async request=>{active++;peak=Math.max(peak,active);await new Promise(resolve=>setImmediate(resolve));active--;return {url:request.url,statusCode:200,body:{kind:'html',content:'<script>HIDDEN SCRIPT</script><p>'+('Python API reference detail '.repeat(100))+'</p>'}};};
 const result=await f.bridge.search({...args,verifyTop:3},f.exec);
 assert(peak<=2);assert.equal(result.stats.fetches,3);assert(result.sources.every(row=>row.kind==='page'&&row.excerpt.length<=1600));assert(!JSON.stringify(result).includes('HIDDEN SCRIPT'));f.bridge.close();
});

test('normal tool entry preserves old evidence output and denies hidden native capability or foreign agents',async()=>{
 const f=fixture(async()=>({sources:[source('https://docs.python.org/3/')] }));const registered=new Map();
 const ctx={...f.bridge.ctx,on(){},effect(){},inject(_names,callback){callback({get:ctx.get,tools:{register:definition=>registered.set(definition.name,definition)}});}};
 wireWorkbench(ctx,{dispose(){}});const tool=registered.get('workspace_world');
 assert(tool.parameters.properties.action.enum.includes('search'));assert.equal((await tool.execute(args,f.exec)).sources.length,1);
 const evidence=worldEvidence({action:'evidence',query:'Python',sources:[source('https://docs.python.org/3/')]});assert.equal(evidence.sources[0].provenance,'model-supplied-not-independently-verified');
 f.tools.get=()=>undefined;await assert.rejects(tool.execute(args,f.exec),/未启用/);
 await assert.rejects(async()=>tool.execute(args,{agent:{session:{id:'one'}}}),/真实/);f.bridge.close();
});

test('network search requires execution review while local planning and ranking remain local reads',async()=>{
 const guards=[],workspace={state:{guard:true},runtime:{}};
 wireGuard({inject(_names,callback){callback({get(){},tools:{guard:fn=>guards.push(fn)},on(){},effect(){}});}},workspace);
 const agent={session:{id:'one'}};
 assert.match(guards[0]({agent,name:'workspace_world',arguments:{action:'search'}}),/审查/);
 for(const action of ['time','plan','rank','evidence'])assert.equal(guards[0]({agent,name:'workspace_world',arguments:{action}}),undefined);
});

test('deep mode caps actual concurrency and distinguishes empty results from provider failures',async()=>{
 let active=0,peak=0,calls=0;
 const f=fixture(async()=>{calls++;active++;peak=Math.max(peak,active);await new Promise(resolve=>setImmediate(resolve));active--;return {sources:[]};});
 const request={...args,mode:'deep',platforms:['web','official','scholar','code','news','video']};
 const empty=await f.bridge.search(request,f.exec);assert.equal(calls,6);assert(peak<=3);assert.equal(empty.status,'no-results');
 f.web.search=async()=>{calls++;throw Object.assign(Error('private failure details'),{code:'WEB_PROVIDER_UNAVAILABLE'});};
 const failed=await f.bridge.search(request,f.exec);assert.equal(failed.status,'failed');assert.equal(failed.failures.length,6);
 await f.bridge.search(request,f.exec);assert.equal(calls,18,'failed and empty searches never become sticky cached answers');f.bridge.close();
});

test('malformed provider rows are discarded, future dates gain no recency bonus and domain repetition has a visible penalty',async()=>{
 const f=fixture(async()=>({sources:[null,{title:'Missing URL'},source('https://docs.python.org/3/a'),source('https://docs.python.org/3/b')]}));
 const result=await f.bridge.search(args,f.exec);assert.equal(result.sources.length,2);assert(result.sources.some(row=>row.rank.diversityPenalty>0));
 const future=rankResearch({query:'latest Python API',sources:[{...source('https://docs.python.org/3/'),publishedAt:'2099-01-01'}]});
 assert.equal(future.sources[0].rank.freshness,0);f.bridge.close();
});

test('a search deadline preserves successful sources and counts only actually started provider queries',async t=>{
 const deadline=new AbortController();t.mock.method(AbortSignal,'timeout',()=>deadline.signal);
 let started=0;const f=fixture(async()=>{started++;return started===1?{sources:[source('https://docs.python.org/3/')]}:new Promise(()=>{});});
 const request=f.bridge.search({...args,mode:'deep',platforms:['web','official','scholar','code','news','video']},f.exec);
 for(let i=0;i<20&&started<4;i++)await new Promise(resolve=>setImmediate(resolve));
 deadline.abort(new DOMException('Controlled deadline','TimeoutError'));
 const result=await request;assert.equal(result.sources.length,1);assert.equal(result.status,'partial');assert(result.timedOut);
 assert.equal(result.stats.queries,started);assert(started<6);assert.equal(result.stats.plannedQueries,6);assert(result.failures.every(row=>row.code==='WEB_TIMEOUT'));
 assert.equal(f.bridge.cache.size,0,'incomplete timed-out work must not become a cached final result');f.bridge.close();
});

test('a deadline without any successful source rejects, and a cache hit reports current lookup time separately',async t=>{
 const deadline=new AbortController();t.mock.method(AbortSignal,'timeout',()=>deadline.signal);
 const f=fixture(async()=>new Promise(()=>{}));const pending=f.bridge.search(args,f.exec),rejected=assert.rejects(pending);
 await new Promise(resolve=>setImmediate(resolve));deadline.abort(new DOMException('Controlled deadline','TimeoutError'));await rejected;f.bridge.close();
 t.mock.restoreAll();
 const cached=fixture(async()=>({sources:[source('https://docs.python.org/3/')]}));await cached.bridge.search(args,cached.exec);
 const row=[...cached.bridge.cache.values()][0];row.value.stats.elapsedMs=54321;
 const result=await cached.bridge.search(args,cached.exec);assert.equal(result.cache.originalElapsedMs,54321);assert(result.stats.elapsedMs<54321);assert.equal(result.stats.queries,0);cached.bridge.close();
});

test('a page-read deadline retains successful search snippets and marks the result partial',async t=>{
 const deadline=new AbortController();t.mock.method(AbortSignal,'timeout',()=>deadline.signal);
 const f=fixture(async()=>({sources:[source('https://docs.python.org/3/')]}));let fetching=false;
 f.web.fetch=async()=>{fetching=true;return new Promise(()=>{});};
 const pending=f.bridge.search({...args,verifyTop:1},f.exec);
 for(let i=0;i<10&&!fetching;i++)await new Promise(resolve=>setImmediate(resolve));assert(fetching);
 deadline.abort(new DOMException('Controlled page deadline','TimeoutError'));
 const result=await pending;assert.equal(result.sources.length,1);assert.equal(result.sources[0].kind,'snippet');assert.equal(result.status,'partial');assert(result.timedOut);assert.equal(result.fetchFailures[0].code,'WEB_TIMEOUT');f.bridge.close();
});

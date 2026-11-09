import {createHash} from 'node:crypto';

const ROUTES={
 web:{sites:[],label:'综合网页'},
 official:{sites:[],label:'官方资料'},
 scholar:{sites:['pubmed.ncbi.nlm.nih.gov','arxiv.org','semanticscholar.org','doi.org'],label:'论文与研究'},
 code:{sites:['github.com','gitlab.com','huggingface.co'],label:'代码与模型'},
 news:{sites:['reuters.com','apnews.com','bbc.com','xinhuanet.com'],label:'新闻与公开报道'},
 social:{sites:['x.com','mastodon.social','weibo.com'],label:'社交平台原帖'},
 video:{sites:['youtube.com','bilibili.com','douyin.com'],label:'视频与字幕线索'},
 community:{sites:['stackoverflow.com','reddit.com','zhihu.com','xiaohongshu.com'],label:'社区讨论'},
 chinese:{sites:['gov.cn','edu.cn','mp.weixin.qq.com','bilibili.com','zhihu.com','weibo.com'],label:'中文平台'},
 standards:{sites:['rfc-editor.org','w3.org','nist.gov','iso.org'],label:'标准与规范'},
 data:{sites:['data.gov','stats.gov.cn','data.worldbank.org'],label:'公开数据'}
};
const PROFILES={fast:{queries:2,concurrency:2,timeout:10000},balanced:{queries:3,concurrency:2,timeout:16000},deep:{queries:6,concurrency:3,timeout:24000}};
const OFFICIAL=['docs.python.org','developer.mozilla.org','learn.microsoft.com','developer.apple.com','docs.github.com','kubernetes.io','docs.searxng.org','w3.org','rfc-editor.org','ietf.org','nist.gov','who.int','cdc.gov'];
const RESEARCH=['pubmed.ncbi.nlm.nih.gov','pmc.ncbi.nlm.nih.gov','semanticscholar.org','openalex.org','nature.com','science.org','acm.org','ieee.org'];
const NEWS=['reuters.com','apnews.com','bbc.com','xinhuanet.com'];
const STOP=new Set(['the','and','for','with','what','how','this','that','from','关于','一下','搜索','查询','资料','请问']);
const text=(value,max)=>{if(typeof value!=='string'||value.length>max)throw Error('搜索参数超出范围');return value.trim();};
const hostMatches=(host,domain)=>host===domain||host.endsWith('.'+domain);
const matchesAny=(host,domains)=>domains.some(domain=>hostMatches(host,domain));

export function publicSourceUrl(value){
 const url=new URL(text(value,2000));
 if(url.protocol!=='https:'||url.username||url.password||url.port||!url.hostname.includes('.')||/^\d|:|%/.test(url.hostname)||/(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(url.hostname))throw Error('来源须为公开HTTPS地址');
 if([...url.searchParams.keys()].some(key=>/^(?:api[_-]?key|access[_-]?token|token|password|secret|auth|authorization|signature|sig)$/i.test(key)))throw Error('来源地址含认证参数');
 return url;
}
function domain(value){
 const raw=text(value,200).toLowerCase();
 if(!/^[a-z0-9.-]+$/.test(raw))throw Error('官方域名格式无效');
 return publicSourceUrl('https://'+raw+'/').hostname;
}
function queryWords(query){return [...new Set((query.toLowerCase().match(/[a-z0-9_-]{2,}|[\u4e00-\u9fff]{2}/g)??[]).filter(word=>!STOP.has(word)))].slice(0,32);}
function inferPlatforms(query){
 if(/论文|研究|学术|paper|study|research/i.test(query))return ['web','scholar','official'];
 if(/代码|编程|文档|sdk|api|error|github|python|javascript/i.test(query))return ['web','official','code'];
 if(/新闻|最新|news|today|最近/i.test(query))return ['web','news','official'];
 return ['web','official','community'];
}
function validatePlan(args){
 if(!args||Object.keys(args).some(key=>!['action','query','platforms','officialDomains','mode','maxQueries','limit','fresh','verifyTop'].includes(key)))throw Error('未知搜索参数');
 const query=text(args.query,300);if(!query)throw Error('搜索关键词不能为空');
 if(/(?:gh[pousr]_[a-z0-9]{25,}|github_pat_[a-z0-9_]{25,}|sk-[a-z0-9_-]{24,}|Bearer\s+\S{15,}|[a-z]:\\users\\)/i.test(query))throw Error('查询中含疑似凭据或本机私人路径');
 const mode=args.mode??'fast',profile=PROFILES[mode];if(!profile)throw Error('未知搜索深度');
 const maxQueries=args.maxQueries??profile.queries,limit=args.limit??8,verifyTop=args.verifyTop??0;
 if(!Number.isInteger(maxQueries)||maxQueries<1||maxQueries>6||!Number.isInteger(limit)||limit<1||limit>12||!Number.isInteger(verifyTop)||verifyTop<0||verifyTop>3||args.fresh!==undefined&&typeof args.fresh!=='boolean')throw Error('搜索预算无效');
 const platforms=args.platforms??inferPlatforms(query);
 if(!Array.isArray(platforms)||!platforms.length||platforms.length>6||platforms.some(name=>!Object.hasOwn(ROUTES,name)))throw Error('搜索平台无效');
 const domains=args.officialDomains??[];if(!Array.isArray(domains)||domains.length>8)throw Error('官方域名过多');
 return {query,mode,profile,maxQueries,limit,verifyTop,fresh:args.fresh??false,platforms:[...new Set(platforms)],officialDomains:[...new Set(domains.map(domain))]};
}
export function researchPlan(args){
 const plan=validatePlan(args),requests=[];
 for(const platform of plan.platforms){
  if(requests.length>=plan.maxQueries)break;
  const sites=platform==='official'?plan.officialDomains:ROUTES[platform].sites;
  const suffix=sites.length?' ('+sites.map(site=>'site:'+site).join(' OR ')+')':platform==='official'?' 官方 official documentation original source':'';
  requests.push({id:'route-'+requests.length,platform,query:plan.query+suffix});
 }
 return {query:plan.query,mode:plan.mode,requests,officialDomains:plan.officialDomains,limit:plan.limit,verifyTop:plan.verifyTop,concurrency:Math.min(plan.profile.concurrency,requests.length),timeoutMs:plan.profile.timeout,remainingPlatforms:plan.platforms.filter(platform=>!requests.some(row=>row.platform===platform)),paths:Object.entries(ROUTES).map(([id,row])=>({id,label:row.label,sites:row.sites})),next:'调用search执行当前有界计划。搜索片段用于发现，关键内容可verifyTop补读，再核对原始文件、日期和独立来源。'};
}
function canonicalUrl(url){
 const copy=new URL(url);copy.hash='';
 for(const key of [...copy.searchParams.keys()])if(/^utm_|^(?:fbclid|gclid|ref_src|spm)$/i.test(key))copy.searchParams.delete(key);
 if(matchesAny(copy.hostname,['youtube.com','youtu.be'])){
  const video=copy.hostname==='youtu.be'?copy.pathname.slice(1):copy.searchParams.get('v');
  if(video&&/^[\w-]{6,20}$/.test(video))return 'https://youtube.com/watch?v='+video;
 }
 if(matchesAny(copy.hostname,['x.com','twitter.com'])){
  const status=copy.pathname.match(/\/status\/(\d+)/)?.[1];if(status)return 'https://x.com/i/status/'+status;
 }
 return copy.href;
}
function authorityFor(url,preferred){
 const host=url.hostname;
 if(matchesAny(host,OFFICIAL))return {kind:'official-or-standard',weight:24,basis:'curated-domain-match'};
 if(/(?:^|\.)gov(?:\.[a-z]{2})?$/.test(host)||hostMatches(host,'europa.eu'))return {kind:'government',weight:22,basis:'government-domain-pattern'};
 if(hostMatches(host,'arxiv.org'))return {kind:'preprint',weight:13,basis:'preprint-platform'};
 if(matchesAny(host,RESEARCH))return {kind:'research-or-index',weight:18,basis:'research-domain-match'};
 if(matchesAny(host,NEWS))return {kind:'established-news',weight:14,basis:'news-domain-match'};
 if(matchesAny(host,['github.com','gitlab.com','huggingface.co']))return {kind:'code-or-model',weight:8,basis:'repository-platform-not-owner-verification'};
 if(matchesAny(host,preferred))return {kind:'preferred-domain',weight:16,basis:'caller-preference-not-verified-ownership'};
 return {kind:'other',weight:0,basis:'no-authority-prior'};
}
export function rankResearch(args,observedAt=new Date().toISOString(),native=false){
 if(!args||Object.keys(args).some(key=>!['action','query','sources','officialDomains','limit'].includes(key)))throw Error('未知排序参数');
 const query=text(args.query,300),limit=args.limit??8,preferred=args.officialDomains??[];
 if(!query||!Array.isArray(args.sources)||args.sources.length>64||!Array.isArray(preferred)||preferred.length>8||!Number.isInteger(limit)||limit<1||limit>12)throw Error('排序参数无效');
 const domains=preferred.map(domain),words=queryWords(query),unique=new Map();let rejected=0;
 for(const source of args.sources){
  try{
   const url=publicSourceUrl(source.url),title=text(source.title??'',200),excerpt=text(source.excerpt??source.summary??source.snippet??'',1600),kind=source.kind??'snippet';
   if(!['snippet','page','unavailable'].includes(kind))throw Error('无效证据类型');
   const authority=authorityFor(url,domains),body=(title+' '+excerpt).toLowerCase(),hits=words.filter(word=>body.includes(word)).length;
   const relevance=words.length?Math.round(60*hits/words.length):0;
   let freshness=0,publishedAt;
   if(typeof source.publishedAt==='string'&&source.publishedAt.length<=40&&Number.isFinite(Date.parse(source.publishedAt))){
    publishedAt=source.publishedAt;const age=Date.parse(observedAt)-Date.parse(publishedAt);
    if(age>=0&&/最新|新闻|最近|news|today|current/i.test(query))freshness=age<7*86400000?8:age<90*86400000?4:0;
   }
   const access=kind==='page'&&native?6:kind==='unavailable'?-30:0;
   const score=relevance+authority.weight+freshness+access,key=canonicalUrl(url);
   const row={url:url.href,canonicalUrl:key,title,excerpt,kind,...publishedAt?{publishedAt}:{},excerptHash:createHash('sha256').update(excerpt).digest('hex'),authority,rank:{score,relevance,freshness,access,diversityPenalty:0},provenance:native?'native-web-provider':'supplied-not-independently-verified',contentVerification:'not-assessed'};
   if(!unique.has(key)||unique.get(key).rank.score<score)unique.set(key,row);
  }catch{rejected++;}
 }
 const pool=[...unique.values()],sources=[],hosts=new Map();
 while(pool.length&&sources.length<limit){
  pool.sort((a,b)=>(b.rank.score-(hosts.get(new URL(b.url).hostname)??0)*6)-(a.rank.score-(hosts.get(new URL(a.url).hostname)??0)*6));
  const row=pool.shift(),host=new URL(row.url).hostname;row.rank.diversityPenalty=(hosts.get(host)??0)*6;row.rank.score-=row.rank.diversityPenalty;
  hosts.set(host,(hosts.get(host)??0)+1);sources.push(row);
 }
 return {query,observedAt,sources,rejected,duplicates:args.sources.length-rejected-unique.size,totalUnique:unique.size,trust:'external-reference-only',rankingBasis:'relevance + domain prior + requested recency + content access - repeated-host penalty; ranking scores are not truth probabilities'};
}
function abortable(promise,signal){
 if(signal.aborted)return Promise.reject(signal.reason);
 return new Promise((resolve,reject)=>{
  const stop=()=>reject(signal.reason);signal.addEventListener('abort',stop,{once:true});
  Promise.resolve(promise).then(resolve,reject).finally(()=>signal.removeEventListener('abort',stop));
 });
}
function errorCode(error){return /^[A-Z][A-Z0-9_]{2,60}$/.test(error?.code??'')?error.code:'WEB_PROVIDER_ERROR';}
function pageExcerpt(body,query){
 const content=body.replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<!--[^]*?-->/g,' ').replace(/<[^>]*>/g,'\n').replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g,' ');
 const words=queryWords(query),lines=content.split(/\n+/).map(line=>line.trim()).filter(line=>line.length>35);
 return lines.map((line,index)=>({line,index,hits:words.filter(word=>line.toLowerCase().includes(word)).length})).sort((a,b)=>b.hits-a.hits||a.index-b.index).slice(0,3).map(row=>row.line).join('\n').slice(0,1600);
}

export class ResearchBridge{
 constructor(ctx){this.ctx=ctx;this.cache=new Map();this.flights=new Map();this.controllers=new Set();this.identities=new WeakMap();this.nextIdentity=0;this.closed=false;}
 identity(object){if(!this.identities.has(object))this.identities.set(object,++this.nextIdentity);return this.identities.get(object);}
 async search(args,exec){
  const policy=validatePlan(args),plan=researchPlan(args),agent=exec.agent;
  const web=this.ctx.get('web'),tools=this.ctx.get('tools');
  if(this.closed||!agent||this.ctx.get('agents')?.get(agent.session.id)!==agent)throw Error('需要当前真实会话');
  if(typeof web?.search!=='function'||!tools?.get?.('web_search',agent))throw Error('DSH联网搜索未启用，请先配置原生联网提供商');
  const route=agent.session.requestHeader?.()?.config??agent.options??{};
  if(await web.searchReady?.(route.provider)===false)throw Error('当前模型路线没有可用的原生搜索认证');
  exec.signal?.throwIfAborted();
  const provider=web.selectSearchProvider?.()??web;
  const key=JSON.stringify([agent.session.id,agent.session.header?.cwd??'',route.provider,route.model,this.identity(web),this.identity(provider),policy.query,policy.mode,policy.platforms,policy.officialDomains,policy.maxQueries,policy.limit,policy.verifyTop]);
  const cached=this.cache.get(key),now=Date.now();
  if(!policy.fresh&&cached&&cached.expires>now){const value=structuredClone(cached.value);return {...value,stats:{...value.stats,queries:0,fetches:0},cache:{hit:true,ageMs:now-cached.at}};}
  this.cache.delete(key);
  let flight=!policy.fresh?this.flights.get(key):null;
  if(!flight){
   if(this.controllers.size>=8)throw Error('搜索请求已达并发预算，请等待已有请求');
   const controller=new AbortController();flight={controller,users:0,shared:false};this.controllers.add(controller);
   const signal=AbortSignal.any([controller.signal,AbortSignal.timeout(plan.timeoutMs)]);
   flight.promise=this.run(plan,policy,web,tools,agent,signal).then(value=>{
    if(!signal.aborted&&!this.closed){
     const at=Date.now(),ttl=value.failures.length||value.fetchFailures.length?10000:/最新|新闻|最近|news|today|current/i.test(policy.query)?15000:120000;
     if(value.sources.length){this.cache.set(key,{at,expires:at+ttl,value});while(this.cache.size>64)this.cache.delete(this.cache.keys().next().value);}
    }
    return value;
   }).finally(()=>{this.controllers.delete(controller);if(this.flights.get(key)===flight)this.flights.delete(key);});
   if(!policy.fresh)this.flights.set(key,flight);
  }
  flight.users++;if(flight.users>1)flight.shared=true;
  try{return {...structuredClone(await abortable(flight.promise,exec.signal??new AbortController().signal)),cache:{hit:false,shared:flight.shared}};}
  finally{flight.users--;if(!flight.users)flight.controller.abort();}
 }
 async run(plan,policy,web,tools,agent,signal){
  const started=Date.now(),outcomes=new Array(plan.requests.length);let cursor=0;
  await Promise.all(Array.from({length:plan.concurrency},async()=>{
   while(cursor<plan.requests.length){
    const index=cursor++,request=plan.requests[index];
    try{
     signal.throwIfAborted();const result=await abortable(web.search({query:request.query,maxResults:8},signal),signal);
     outcomes[index]={request,sources:(Array.isArray(result.sources)?result.sources:[]).slice(0,8)};
    }catch(error){outcomes[index]={request,sources:[],error:errorCode(error)};}
   }
  }));
  signal.throwIfAborted();
  const candidates=outcomes.flatMap(outcome=>outcome.sources.filter(source=>source&&typeof source.url==='string').map(source=>({...source,title:String(source.title??'').slice(0,200),excerpt:String(source.summary??source.snippet??'').slice(0,800),kind:'snippet'})));
  let ranked=rankResearch({query:policy.query,sources:candidates,officialDomains:policy.officialDomains,limit:policy.limit},undefined,true);
  let fetches=0;
  const fetchFailures=[];
  if(policy.verifyTop){
   if(typeof web.fetch!=='function'||!tools.get('web_fetch',agent)||await web.fetchReady?.(agent.session.requestHeader?.()?.config?.provider)===false)fetchFailures.push({code:'WEB_FETCH_UNAVAILABLE'});
   else {const selected=ranked.sources.slice(0,policy.verifyTop);let next=0;await Promise.all(Array.from({length:Math.min(plan.concurrency,selected.length)},async()=>{while(next<selected.length){const source=selected[next++];
    try{
     fetches++;const result=await abortable(web.fetch({url:source.url},signal),signal);publicSourceUrl(result.url);
     if(result.statusCode<200||result.statusCode>=300||typeof result.body?.content!=='string')throw Error('Page unavailable');
     source.excerpt=pageExcerpt(result.body.content.slice(0,200000),policy.query);source.kind='page';source.url=result.url;
    }catch(error){fetchFailures.push({url:source.url,code:errorCode(error)});}
   }}));}
   ranked=rankResearch({query:policy.query,sources:ranked.sources,officialDomains:policy.officialDomains,limit:policy.limit},undefined,true);
  }
  signal.throwIfAborted();
  const failures=outcomes.filter(row=>row.error).map(row=>({platform:row.request.platform,code:row.error}));
  const status=ranked.sources.length?(failures.length?'partial':'ok'):failures.length===outcomes.length?'failed':'no-results';
  return {...ranked,status,plan:{mode:plan.mode,platforms:plan.requests.map(row=>row.platform),remainingPlatforms:plan.remainingPlatforms},failures,fetchFailures,stats:{queries:plan.requests.length,successfulQueries:outcomes.filter(row=>!row.error).length,fetches,elapsedMs:Date.now()-started},next:'按URL核对关键原文和日期，保留相反证据。平台与域名权重仅用于排序。'};
 }
 close(){this.closed=true;for(const controller of this.controllers)controller.abort();this.controllers.clear();this.flights.clear();this.cache.clear();}
}

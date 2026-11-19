// Only follow original nodes linked by a native checkpoint on the active surface.
// A rewind or an edit may leave old events in the log, but is not a compaction.
export function compactedNodes(events, visible){
 const pending=events.filter(row=>visible.has(row.seq)&&isCheckpoint(row));
 const compacted=new Set();if(!pending.length)return compacted;
 const bySeq=new Map(events.map(row=>[row.seq,row])),visited=new Set();
 while(pending.length){
  const checkpoint=pending.pop();if(visited.has(checkpoint.seq))continue;visited.add(checkpoint.seq);
  const refs=checkpoint.sourceEventSeqs;
  const start=Array.isArray(refs)&&bySeq.get(refs[0]),summary=Array.isArray(refs)&&bySeq.get(refs[1]);
  const id=checkpoint.data.source.compactionId,shadowed=summary?.data?.shadowedSeqs;
  if(typeof id!=='string'||!id||start?.type!=='compaction/start'||summary?.type!=='compaction/summary'||start.data?.compactionId!==id||summary.data?.compactionId!==id||start.seq>=summary.seq||summary.seq>=checkpoint.seq||!Array.isArray(shadowed)||!shadowed.length||shadowed.length!==refs.length-2)throw Error('无法核对原生压缩来源');
  for(let i=0;i<shadowed.length;i++){
   const seq=shadowed[i],row=bySeq.get(seq);
   if(!row||seq!==refs[i+2]||seq>=start.seq)throw Error('无法核对原生压缩原文');
   if(compacted.has(seq))continue;
   compacted.add(seq);if(isCheckpoint(row))pending.push(row);
  }
 }
 return compacted;
}
function isCheckpoint(row){return row.type==='user/message'&&row.data?.source?.kind==='compact-checkpoint';}

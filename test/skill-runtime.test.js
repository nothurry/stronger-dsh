import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {Workspace} from '../lib/workspace.js';

test('catalog reads only skill metadata, defaults to three task matches and ignores unrelated memory revisions',async()=>{
 const data=await mkdtemp(path.join(tmpdir(),'skill-runtime-'));const workspace=new Workspace(data);await workspace.load();
 try{
  workspace.view=()=>{throw Error('Full workspace must not be serialized by catalog');};
  const first=workspace.skillCatalog({task:'task context skill'});assert(first.skills.length<=3);assert(!JSON.stringify(first).includes('content'));
  await workspace.propose('memory',{title:'Test fact',content:'A local bounded fact'},{human:true});
  assert.equal(workspace.skillCatalog().revision,first.revision);
  await workspace.builtinSkill('think',false);assert.notEqual(workspace.skillCatalog().revision,first.revision);
 }finally{await workspace.dispose();await rm(data,{recursive:true,force:true});}
});

test('saving an unchanged setting does not rewrite workspace or rotate backups',async()=>{
 const data=await mkdtemp(path.join(tmpdir(),'skill-noop-'));const workspace=new Workspace(data);await workspace.load();
 try{
  await workspace.skillLearning(false);const before=await stat(workspace.file),revision=workspace.state.revision;
  await workspace.skillLearning(false);assert.equal(workspace.state.revision,revision);assert.equal((await stat(workspace.file)).mtimeMs,before.mtimeMs);
 }finally{await workspace.dispose();await rm(data,{recursive:true,force:true});}
});

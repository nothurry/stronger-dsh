import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {API_ACTIONS} from '../lib/index.js';

test('every literal client control action has a registered backend transport route',async()=>{
 const source=await readFile(new URL('../lib/client.js',import.meta.url),'utf8');
 const names=new Set([...source.matchAll(/(?:callControl\(ctx,|\bcontrol\()'([^']+)'/g)].map(match=>match[1]));
 const missing=[...names].filter(name=>!API_ACTIONS.includes(name));assert.deepEqual(missing,[]);
 assert.equal(new Set(API_ACTIONS).size,API_ACTIONS.length);
});

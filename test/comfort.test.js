import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {BOOT_CSS} from '../lib/boot.js';
const source=await readFile(new URL('../lib/client.js',import.meta.url),'utf8');
const css=source.match(/const COMFORT_CSS=`([\s\S]*?)`;/)[1];
function luminance(hex){const values=hex.match(/[a-f0-9]{2}/gi).map(value=>{const channel=parseInt(value,16)/255;return channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4;});return values[0]*.2126+values[1]*.7152+values[2]*.0722;}
function contrast(a,b){const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);return(values[0]+.05)/(values[1]+.05);}

test('comfort palette softens the large light surface while keeping light/dark labels legible',()=>{
 for(const [ink,muted,paper,panel]of [['37363d','6c6973','f3f3f5','ececef'],['dedde3','aaa6b2','1b1b1f','232328']]){
  assert(contrast(ink,paper)>=7);assert(contrast(muted,paper)>=4.5);assert(contrast(muted,panel)>=4.5);
  for(const value of [ink,muted,paper,panel])assert(css.includes('#'+value));
 }
 assert.doesNotMatch(css,/#fff(?:fff)?\b|#000(?:000)?\b/);
 assert.match(BOOT_CSS,/--boot-bg:#f3f3f5/);assert.match(BOOT_CSS,/--boot-bg:#1b1b1f/);
});

test('corner scale remains modest and applies reversibly through the existing theme surface',()=>{
 assert.match(css,/--zw-radius:6px/);assert.match(css,/--dsw-radius-panel:10px/);assert.match(css,/\.zs-team-member[^}]*border-radius:8px/);
 assert.match(css,/\.zs-preset-menu-list[^}]*border-radius:6px/);assert.match(css,/\.zs-delete-dialog[^}]*border-radius:10px/);
 assert.doesNotMatch(css,/(?:svg|canvas|img|video)\b|filter:|backdrop-filter:|brightness\(/);
 assert(source.includes('style.textContent+=SESSION_FEATURE_CSS+SMOOTH_MOTION_CSS+COMFORT_CSS;'));
 assert(source.indexOf('COMFORT_CSS;document.head.append')>source.indexOf('const COMFORT_CSS='));
});

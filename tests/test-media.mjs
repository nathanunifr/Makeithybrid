import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
const media=JSON.parse(readFileSync(new URL('../public/exercise-media.json',import.meta.url),'utf8'));
const program=JSON.parse(readFileSync(new URL('../public/programme.json',import.meta.url),'utf8'));
test('Galerie avec images pour de vrais exercices du programme',()=>{
 const names=new Set(program.flatMap(s=>s.exercises.map(e=>e.name)));
 assert.ok(media.entries.length>=45);
 assert.ok(media.entries.every(e=>names.has(e.name)));
 assert.equal(new Set(media.entries.map(e=>e.name)).size,media.entries.length);
});
test('Photos HTTPS et vidéos YouTube identifiées',()=>{
 for(const entry of media.entries){
  assert.ok(entry.images.length>=1);
  assert.ok(entry.images.every(link=>link.startsWith('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/') && /\.jpg$/.test(link)));
  if(entry.video)assert.match(entry.video,/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/);
 }
 assert.ok(media.entries.filter(e=>e.video).length>=5);
});

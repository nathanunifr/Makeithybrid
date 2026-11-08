import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {monday,shiftDay,todayISO,weeklyTotals,initialLog,sessionVolume,paceFrom,formatPace,exerciseHistory} from '../src/utils.mjs';
const program=JSON.parse(readFileSync(new URL('../public/programme.json',import.meta.url),'utf8'));
test('Le programme importé contient exactement 30 séances et 175 exercices',()=>{
 assert.equal(program.length,30);assert.equal(program.reduce((s,x)=>s+x.exercises.length,0),175);
 assert.deepEqual(program.map(s=>s.week).filter((x,i,a)=>a.indexOf(x)===i),[1,2,3,4,5,6,7,8]);
 assert.equal(program[0].date,'2026-11-09');assert.equal(program.at(-1).date,'2027-01-01');
});
test('Calcul des semaines sans décalage de fuseau horaire',()=>{
 assert.equal(monday('2026-11-08'),'2026-11-02');assert.equal(monday('2026-11-09'),'2026-11-09');
 assert.equal(shiftDay('2026-12-31',1),'2027-01-01');
});
test('Création du journal avec les séries attendues',()=>{
 const log=initialLog(program[0]);assert.equal(log.exercises.length,6);assert.equal(log.exercises[0].sets.length,2);
 log.exercises[0].sets[0]={...log.exercises[0].sets[0],kg:30,reps:12,done:true};assert.equal(sessionVolume(log),360);
});
test('Distances, élévation et séances hebdomadaires',()=>{
 const log=initialLog(program[0]);log.finishedAt='2026-11-09T18:00:00Z';log.cardio.durationMin=46;log.cardio.distance=6.5;log.cardio.elevation=220;
 const w=weeklyTotals([log],'2026-11-09');assert.equal(w.count,1);assert.equal(w.km,6.5);assert.equal(w.elevation,220);assert.equal(w.mins,46);
 assert.equal(weeklyTotals([log],'2026-11-02').count,0);
});
test('Conversion allure',()=>{assert.equal(formatPace(paceFrom(10,50)),'5:00 /km');assert.equal(formatPace(paceFrom(0,50)),'—');});

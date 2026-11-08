import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {monday,shiftDay,todayISO,weeklyTotals,initialLog,sessionVolume,paceFrom,formatPace,exerciseHistory,moveTuesdaysToWednesday,WEDNESDAY_SCHEDULE_MIGRATION} from '../src/utils.mjs';
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

test('Les huit séances du mardi passent au mercredi, sans modifier les identifiants',()=>{
 const target=program.filter(s=>s.id.endsWith('-mardi'));
 assert.equal(target.length,8);
 assert.ok(target.every(s=>new Date(s.date+'T12:00:00Z').getUTCDay()===3&&s.day==='MERCREDI'));
 assert.equal(program.filter(s=>new Date(s.date+'T12:00:00Z').getUTCDay()===2).length,0);
});
test('Migration des séances déjà stockées, une seule fois, sans toucher aux performances',()=>{
 const logs=[{id:'journal-1',sessionId:'programme-s1-mardi',date:'2026-11-10',finishedAt:'2026-11-10T18:00:00Z',exercises:[{sets:[{kg:35,reps:12,done:true}]}]}];
 const state={sessions:[{id:'programme-s1-mardi',date:'2026-11-10',day:'MARDI',exercises:[]},{id:'custom-1',date:'2026-11-17',exercises:[]},{id:'wed-1',date:'2026-11-11',exercises:[]}],logs};
 const before=JSON.stringify(logs);
 assert.equal(moveTuesdaysToWednesday(state),2);
 assert.deepEqual(state.sessions.map(s=>s.date),['2026-11-11','2026-11-18','2026-11-11']);
 assert.equal(state.sessions[0].day,'MERCREDI');
 assert.ok(state.scheduleMigrations.includes(WEDNESDAY_SCHEDULE_MIGRATION));
 assert.equal(JSON.stringify(logs),before);
 state.sessions.push({id:'user-added',date:'2026-11-24',exercises:[]});
 assert.equal(moveTuesdaysToWednesday(state),0);
 assert.equal(state.sessions.at(-1).date,'2026-11-24');
});

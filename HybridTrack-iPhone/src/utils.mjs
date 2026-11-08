export function todayISO(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function localDate(iso) { const [y,m,d] = String(iso||'2026-11-09').slice(0,10).split('-').map(Number); return new Date(y,m-1,d,12); }
export function shiftDay(iso, days) { const d=localDate(iso); d.setDate(d.getDate()+days); return todayISO(d); }
export function monday(iso) {const d=localDate(iso); const delta=(d.getDay()+6)%7; d.setDate(d.getDate()-delta); return todayISO(d);}
export function formatDate(iso, opts={day:'numeric',month:'short'}) {return localDate(iso).toLocaleDateString('fr-CH',opts);}
export function formatNumber(num, maximumFractionDigits=1){return Number(num||0).toLocaleString('fr-CH',{maximumFractionDigits});}
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export const validNum=(v)=>{ const n=Number(String(v).replace(',','.')); return Number.isFinite(n)?n:0; };
export const esc=(s)=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export function weeklyTotals(logs, startISO) {const end=shiftDay(startISO,7);const list=logs.filter(l=>l.finishedAt && l.date>=startISO&&l.date<end);return {count:list.length,mins:list.reduce((s,l)=>s+(Number(l.cardio?.durationMin)||l.elapsedMinutes||0),0),km:list.reduce((s,l)=>s+(Number(l.cardio?.distance)||0),0),elevation:list.reduce((s,l)=>s+(Number(l.cardio?.elevation)||0),0),volume:list.reduce((s,l)=>s+sessionVolume(l),0)};}
export function sessionVolume(log) {return (log.exercises||[]).reduce((s,e)=>s+(e.sets||[]).filter(a=>a.done).reduce((t,a)=>t+Number(a.kg||0)*Number(a.reps||0),0),0);}
export function exerciseHistory(logs,name){return logs.filter(l=>l.finishedAt||l.startedAt).flatMap(l=>(l.exercises||[]).filter(e=>e.name.toLowerCase().trim()===name.toLowerCase().trim()).map(e=>({date:l.date, sets:e.sets||[]}))).sort((a,b)=>b.date.localeCompare(a.date));}
export function paceFrom(distance,duration){return Number(distance)>0&&Number(duration)>0 ? (Number(duration)/Number(distance)):null;}
export function formatPace(pace){if(!Number.isFinite(pace)||pace<=0)return '—';const ss=Math.round(pace*60);return `${Math.floor(ss/60)}:${String(ss%60).padStart(2,'0')} /km`;}
export function initialLog(session){return {id:`log-${session.id}-${Date.now()}`,sessionId:session.id,date:session.date,title:session.title,type:session.type,startedAt:new Date().toISOString(),finishedAt:null,elapsedMinutes:0,notes:'',rpe:'',cardio:{durationMin:'',distance:'',elevation:'',descent:'',hrAvg:'',hrMax:'',speed:'',incline:''},exercises:session.exercises.map(e=>({id:e.id,name:e.name,volume:e.volume,description:e.description,load:e.load,sets: e.sets ? Array.from({length:e.sets},(_,i)=>({id:`${e.id}-${i}`,kg:'',reps:e.reps||'',done:false,rpe:''})): [{id:`${e.id}-timed`,kg:'',reps:'',done:false,rpe:''}],isTimed:!e.sets}))};}
export function sortSessions(sessions){return [...sessions].sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title));}
export function uniqueId(prefix='id'){return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;}
export function chartPolyline(points,width=300,height=115,pad=12){if(!points.length)return '';
 const vals=points.map(p=>Number(p.value)||0),lo=Math.min(...vals),hi=Math.max(...vals),range=hi-lo||1;
 return points.map((p,i)=>`${pad+(i/(Math.max(points.length-1,1)))*(width-pad*2)},${height-pad-((p.value-lo)/range)*(height-pad*2)}`).join(' ');
}

/** Déplace une seule fois les séances planifiées du mardi au mercredi.
 * Ne modifie jamais les logs : leurs dates reflètent les entraînements effectivement réalisés.
 * Conserve tous les IDs pour préserver les liens avec l'historique et les séries.
 */
export const WEDNESDAY_SCHEDULE_MIGRATION='tuesday-to-wednesday-20261109';
export function moveTuesdaysToWednesday(state){
 if(!state||!Array.isArray(state.sessions))return 0;
 if(!Array.isArray(state.scheduleMigrations))state.scheduleMigrations=[];
 if(state.scheduleMigrations.includes(WEDNESDAY_SCHEDULE_MIGRATION))return 0;
 let moved=0;
 for(const s of state.sessions){
   if(!s||typeof s.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s.date)||localDate(s.date).getDay()!==2)continue;
   s.date=shiftDay(s.date,1);
   if(typeof s.day==='string'&&/^mardi$/i.test(s.day.trim()))s.day=s.day.trim()==='MARDI'?'MERCREDI':'Mercredi';
   moved++;
 }
 state.scheduleMigrations.push(WEDNESDAY_SCHEDULE_MIGRATION);
 return moved;
}

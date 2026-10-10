import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorld,applyAction,startRun,formation,step,damagePlayer,defeat,packWorld,restoreWorld,wavePlan} from '../src/content/game/rules.js';
const join=(w,id,number=1,connected=true)=>applyAction(w,{sequence:w.lastAppliedRelaySeq+1,type:'membership',sender:id,payload:{connected,number}});
const input=(w,id,move,fire)=>applyAction(w,{sequence:w.lastAppliedRelaySeq+1,type:'input',sender:id,payload:{move,fire,inputSequence:w.tick+1}});
const tick=(w,n)=>{for(let i=0;i<n;i++)step(w);};
test('first formation and bounded progression have armor without splitting',()=>{
  const w=createWorld();join(w,'a');startRun(w);
  assert.equal(w.aliens.length,18);assert.ok(w.aliens.every(a=>a.hp===1));
  w.wave=20;formation(w);assert.ok(w.aliens.length<=80);assert.ok(w.aliens.some(a=>a.hp>1));
  assert.ok(wavePlan(20).speed>wavePlan(1).speed);
});
test('movement bounds, cadence, expiring inputs and friendly fire',()=>{
  const w=createWorld();join(w,'a');join(w,'b',2);startRun(w);
  input(w,'a',-1,true);tick(w,19);const x=w.players[0].x;tick(w,40);assert.equal(w.players[0].x,x);
  for(let i=0;i<100;i++){input(w,'a',-1,true);step(w);}assert.equal(w.players[0].x,16);
  assert.ok(w.shots.filter(s=>s.owner==='a').length<=24);assert.equal(w.players[1].lives,3);
});
test('personal third death across waves spectates while survivor continues',()=>{
  const w=createWorld();join(w,'a');join(w,'b',2);startRun(w);const p=w.players[0];
  for(let i=0;i<3;i++){p.invulnerable=0;p.respawn=0;assert.equal(damagePlayer(w,p),true);w.wave++;}
  assert.equal(p.lives,0);input(w,'a',1,true);const x=p.x;step(w);assert.equal(p.x,x);assert.equal(w.phase,'combat');
  const b=w.players[1];b.invulnerable=0;b.respawn=0;b.lives=1;damagePlayer(w,b);step(w);assert.equal(w.phase,'defeat');
  tick(w,300);assert.equal(w.phase,'combat');assert.equal(w.wave,1);assert.deepEqual(w.players.map(p=>p.lives),[3,3]);
});
test('wave clear advances exactly once, while breach defeats with remaining lives',()=>{
  const w=createWorld();join(w,'a');startRun(w);w.aliens=[];step(w);assert.equal(w.phase,'break');tick(w,150);assert.equal(w.wave,2);assert.equal(w.phase,'combat');
  w.aliens[0].y=438;step(w);assert.equal(w.phase,'defeat');assert.match(w.reason,/breached/);assert.equal(w.players[0].lives,3);
});
test('drop neutralizes and private identity return retains eliminated lives; newcomer gets three',()=>{
  const w=createWorld();join(w,'a');join(w,'b',2);startRun(w);w.players[0].lives=0;
  join(w,'a',1,false);join(w,'a',1,true);assert.equal(w.players[0].lives,0);
  join(w,'c',3);assert.equal(w.players[2].lives,3);assert.equal(w.wave,1);
});
test('checkpoint restoration plus ordered replay is deterministic and deduplicates actions',()=>{
  const w=createWorld(9);join(w,'a');join(w,'b',2);startRun(w);tick(w,160);
  const copy=restoreWorld(packWorld(w));assert.deepEqual(copy,w);
  const a={sequence:w.lastAppliedRelaySeq+1,type:'input',sender:'b',payload:{move:1,fire:true,inputSequence:3}};
  applyAction(w,a);applyAction(copy,a);assert.equal(applyAction(copy,a),false);
  tick(w,600);tick(copy,600);assert.deepEqual(copy,w);
  assert.throws(()=>applyAction(copy,{...a,sequence:w.lastAppliedRelaySeq+2}),/Missing relay/);
});
test('migration preserves a committed third death and last-alien break without duplicating results',()=>{
  const w=createWorld();join(w,'a');join(w,'b',2);startRun(w);const p=w.players[0];p.lives=1;p.invulnerable=0;damagePlayer(w,p);w.aliens=[];step(w);
  const recovered=restoreWorld(packWorld(w));tick(recovered,150);assert.equal(recovered.players[0].lives,0);assert.equal(recovered.wave,2);
  defeat(recovered,'test');const results=restoreWorld(packWorld(recovered));tick(results,300);assert.equal(results.run,2);assert.equal(results.wave,1);
});
test('maximum four-player synchronized entity budget fits the 12 KiB checkpoint',()=>{
  const w=createWorld();for(let n=1;n<=4;n++)join(w,`seat-${n}-xxxxxxxx-xxxxxxxx-xxxxxxxx`,n);startRun(w);w.wave=100;formation(w);
  w.shots=Array.from({length:88},(_,n)=>({id:9999+n,x:123.456,y:321.654,vx:12.345,vy:190,owner:n<64?'alien':w.players[n%4].id}));
  const frame={protocolVersion:1,epoch:123,runId:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',tick:w.tick,lastAppliedRelaySeq:w.lastAppliedRelaySeq,random:w.seed,state:packWorld(w)};
  assert.ok(Buffer.byteLength(JSON.stringify(frame))<12288);
  assert.deepEqual(restoreWorld(frame.state),w);
});
test('simultaneous armor hits kill once and never fracture into new aliens',()=>{
  const w=createWorld();join(w,'a');startRun(w);w.wave=4;
  w.aliens=[{id:99,x:100,y:200,hp:2,kind:0}];
  w.shots=[1,2].map(id=>({id,x:100,y:208,vx:0,vy:-282,owner:'a'}));
  step(w);assert.equal(w.aliens.length,0);assert.equal(w.score,30);assert.equal(w.phase,'break');
  step(w);assert.equal(w.score,30);assert.equal(w.wave,4);
});
test('simultaneous final deaths enter one shared defeat and respawn protection prevents double damage',()=>{
  const w=createWorld();join(w,'a');join(w,'b',2);startRun(w);
  const a=w.players[0];assert.equal(damagePlayer(w,a),false);a.invulnerable=0;assert.equal(damagePlayer(w,a),true);assert.equal(damagePlayer(w,a),false);
  w.players.forEach((p,i)=>{p.x=100+i*100;p.lives=1;p.invulnerable=0;p.respawn=0;});
  w.shots=w.players.map((p,i)=>({id:800+i,x:p.x,y:p.y-2,vx:0,vy:120,owner:'alien'}));
  step(w);assert.equal(w.phase,'defeat');assert.deepEqual(w.players.map(p=>p.lives),[0,0]);assert.equal(w.timer,300);
});

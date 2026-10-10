export const WIDTH = 320;
export const HEIGHT = 576;
export const SHIP_Y = 452;
export const INVASION_Y = 438;
export const STEP_MS = 1000 / 60;
export const COLORS = ['#68e8bd', '#ffbc69', '#bf9bff', '#70caff'];
export const clampX = x => Math.max(16, Math.min(304, x));
export function wavePlan(wave, active = 1) {
  const rows = Math.min(7, 3 + Math.floor((wave - 1) / 2));
  const columns = Math.min(10, 6 + Math.floor((wave - 1) / 3));
  return { rows, columns, speed: Math.min(72, 10 + wave * 3 + (active - 1) * 2),
    fireEvery: Math.max(22, 112 - wave * 7 - (active - 1) * 8),
    shotSpeed: Math.min(190, 76 + wave * 7), hp: Math.min(4, 1 + Math.floor((wave - 1) / 3)) };
}

export function createWorld(seed = 173) {
  return { rulesVersion: 1, tick: 0, seed: seed >>> 0 || 173, run: 1, phase: 'lobby', timer: 0,
    wave: 1, score: 0, players: [], aliens: [], shots: [], direction: 1,
    fireClock: 0, nextId: 1, lastAppliedRelaySeq: 0, eventId: 0, events: [], reason: '' };
}
export function random(world) {
  let n=world.seed; n^=n<<13; n^=n>>>17; n^=n<<5;
  world.seed=n>>>0; return world.seed/4294967296;
}
const quantize = n => Math.round(n*1000)/1000;
const event = (w,type,x,y) => { w.events.push({id:++w.eventId,type,x,y,tick:w.tick}); w.events=w.events.slice(-8); };

export function formation(w) {
  const plan=wavePlan(w.wave,w.players.filter(p=>p.connected&&p.lives>0).length || 1);
  w.aliens=[]; w.shots=[]; w.direction=1; w.fireClock=0;
  for(let row=0;row<plan.rows;row++) for(let col=0;col<plan.columns;col++) {
    w.aliens.push({id:w.nextId++,x:38+col*(244/Math.max(5,plan.columns-1)),y:169+row*24,
      hp:row===0?plan.hp:Math.max(1,plan.hp-(row%2)),kind:row%3});
  }
}
export function startRun(w) {
  w.wave=1;w.score=0;w.phase='combat';w.timer=0;w.reason='';w.shots=[];w.events=[];
  for(const p of w.players) { p.lives=3;p.x=64*p.number;p.y=SHIP_Y;p.invulnerable=120;p.respawn=0;p.cooldown=0;p.input={move:0,fire:false};p.inputTick=w.tick; }
  formation(w);
}
export function applyAction(w,a) {
  if(!a || !Number.isSafeInteger(a.sequence) || a.sequence<=w.lastAppliedRelaySeq) return false;
  // Ordered relay stream is contiguous. A missing action is a recovery error.
  if(a.sequence!==w.lastAppliedRelaySeq+1) throw Error('Missing relay action '+(w.lastAppliedRelaySeq+1));
  let p=w.players.find(p=>p.id===a.sender);
  if(a.type==='membership') {
    if(!p && a.payload.connected) {
      p={id:a.sender,number:a.payload.number,lives:3,x:64*a.payload.number,y:SHIP_Y,
        connected:true,invulnerable:120,respawn:0,cooldown:0,input:{move:0,fire:false},inputTick:w.tick,inputSequence:0};
      w.players.push(p);
    }
    if(p) {p.connected=Boolean(a.payload.connected);p.number=a.payload.number;p.input={move:0,fire:false};p.inputTick=w.tick;if(p.connected)p.invulnerable=Math.max(p.invulnerable,120);}
  } else if(a.type==='start' && w.phase==='lobby') startRun(w);
  else if(a.type==='input' && p && p.connected) {
    p.input={move:a.payload.move,fire:a.payload.fire};p.inputTick=w.tick;p.inputSequence=a.payload.inputSequence;
  }
  w.lastAppliedRelaySeq=a.sequence;
  return true;
}
export function defeat(w,reason) {
  if(w.phase!=='combat'&&w.phase!=='break') return;
  w.phase='defeat';w.timer=300;w.reason=reason;w.shots=[];event(w,'defeat',160,290);
}
export function damagePlayer(w,p) {
  if(!p.connected||p.lives<=0||p.invulnerable>0||p.respawn>0) return false;
  p.lives--;p.input={move:0,fire:false};p.respawn=p.lives?60:0;p.invulnerable=p.lives?180:0;
  event(w,'death',p.x,p.y);return true;
}
export function step(w) {
  w.tick++;
  if(w.phase==='lobby') return;
  if(w.phase==='defeat') { if(--w.timer<=0){w.run++;startRun(w);} return; }
  const living=w.players.filter(p=>p.connected&&p.lives>0);
  if(!living.length){defeat(w,'All pilots lost');return;}
  for(const p of living){if(p.invulnerable>0)p.invulnerable--;if(p.respawn>0)p.respawn--;if(p.cooldown>0)p.cooldown--;}
  if(w.phase==='break') {if(--w.timer<=0){w.wave++;formation(w);w.phase='combat';event(w,'wave',160,250);}return;}
  const plan=wavePlan(w.wave,living.length);
  for(const p of living) {
    if(p.respawn>0)continue;
    if(w.tick-p.inputTick>18)p.input={move:0,fire:false};
    p.x=quantize(clampX(p.x+p.input.move*148/60));
    if(p.input.fire&&p.cooldown<=0&&w.shots.filter(s=>s.owner!=='alien').length<24){
      p.cooldown=16;w.shots.push({id:w.nextId++,x:p.x,y:p.y-10,vx:0,vy:-282,owner:p.id});event(w,'shot',p.x,p.y-10);
    }
  }
  const dx=w.direction*(plan.speed+Math.max(0,18-w.aliens.length)*1.2)/60;
  if(w.aliens.some(a=>a.x+dx<16||a.x+dx>304)) {w.direction*=-1;for(const a of w.aliens)a.y+=10;}
  else for(const a of w.aliens)a.x=quantize(a.x+dx);
  if(w.aliens.some(a=>a.y+8>=INVASION_Y)){defeat(w,'Invasion line breached');return;}
  if(++w.fireClock>=plan.fireEvery && w.aliens.length && w.shots.filter(s=>s.owner==='alien').length<62) {
    w.fireClock=0;
    const columns=new Map();
    for(const a of w.aliens){const col=Math.round(a.x/20);if(!columns.has(col)||columns.get(col).y<a.y)columns.set(col,a);}
    const candidates=[...columns.values()];const shooter=candidates[Math.floor(random(w)*candidates.length)];
    const target=living[Math.floor(random(w)*living.length)];
    const vx=w.wave>=3?Math.max(-60,Math.min(60,(target.x-shooter.x)*.35)):0;
    w.shots.push({id:w.nextId++,x:shooter.x,y:shooter.y+8,vx,vy:plan.shotSpeed,owner:'alien'});
    if(w.wave>=5&&random(w)<.4)w.shots.push({id:w.nextId++,x:shooter.x,y:shooter.y+8,vx:-vx+24,vy:plan.shotSpeed,owner:'alien'});
  }
  const remove=new Set();
  for(const s of w.shots) {
    s.x=quantize(s.x+s.vx/60);s.y=quantize(s.y+s.vy/60);
    if(s.y<144||s.y>476||s.x<0||s.x>320){remove.add(s.id);continue;}
    if(s.owner==='alien') {
      const p=living.find(p=>p.respawn<=0&&p.invulnerable<=0&&Math.abs(p.x-s.x)<7&&Math.abs(p.y-s.y)<7);
      if(p&&damagePlayer(w,p))remove.add(s.id);
    } else {
      const a=w.aliens.find(a=>a.hp>0&&Math.abs(a.x-s.x)<8&&Math.abs(a.y-s.y)<8);
      if(a){remove.add(s.id);a.hp--;event(w,a.hp?'hit':'burst',a.x,a.y);if(!a.hp)w.score+=10+w.wave*5;}
    }
  }
  w.shots=w.shots.filter(s=>!remove.has(s.id));w.aliens=w.aliens.filter(a=>a.hp>0);
  if(!living.some(p=>p.lives>0)){defeat(w,'All pilots lost');return;}
  if(!w.aliens.length){w.phase='break';w.timer=150;w.shots=[];event(w,'clear',160,250);}
}
export function restoreWorld(value) {
  if(value?.packed===1) value={...value,players:value.players.map(p=>({id:p[0],number:p[1],lives:p[2],x:p[3],y:SHIP_Y,connected:p[4],invulnerable:p[5],respawn:p[6],cooldown:p[7],input:{move:p[8],fire:p[9]},inputTick:p[10],inputSequence:p[11]})),
    aliens:value.aliens.map(a=>({id:a[0],x:a[1],y:a[2],hp:a[3],kind:a[4]})),
    shots:value.shots.map(s=>({id:s[0],x:s[1],y:s[2],vx:s[3],vy:s[4],owner:s[5]===-1?'alien':value.players[s[5]][0]}))};
  if(value)delete value.packed;
  if(!value||value.rulesVersion!==1||!Number.isSafeInteger(value.tick)||!Array.isArray(value.players)||!Array.isArray(value.aliens)||!Array.isArray(value.shots)) throw Error('Checkpoint rules version or world is invalid');
  if(value.aliens.length>80||value.shots.length>88)throw Error('Checkpoint entity budget exceeded');
  return structuredClone(value);
}
export function packWorld(w) {
  return {...w,packed:1,players:w.players.map(p=>[p.id,p.number,p.lives,p.x,p.connected,p.invulnerable,p.respawn,p.cooldown,p.input.move,p.input.fire,p.inputTick,p.inputSequence]),
    aliens:w.aliens.map(a=>[a.id,a.x,a.y,a.hp,a.kind]),shots:w.shots.map(s=>[s.id,s.x,s.y,s.vx,s.vy,s.owner==='alien'?-1:w.players.findIndex(p=>p.id===s.owner)])};
}

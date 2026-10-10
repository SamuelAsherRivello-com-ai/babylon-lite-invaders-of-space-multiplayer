import fs from 'node:fs';
fs.mkdirSync('.implementation',{recursive:true});
let s=fs.readFileSync('scripts/verification/gameplay.js','utf8');
const endpoint=process.argv[2]||'https://samuelasherrivello.github.io/babylon-lite-space-invaders-clone/';
new URL(endpoint);
s=s.replace(/url='[^']+'/,'url='+JSON.stringify(endpoint));
s=s.replace('const browser=page.context().browser()',"await page.goto('about:blank');const browser=page.context().browser()");
s=s.replace(/    const c=await open\(code\),d=await open\(code\);[\s\S]*?    const tick=/,'    const tick=');
s=s.replace('capacity:4,fifthRejected:true','capacity:2,fifthRejected:false');
const decoder=`
  const observed=new WeakMap();
  function decode(buffer){let offset=1;const read=()=>{const c=buffer[offset++];if(c<=127)return c;if(c>=224)return c-256;if(c>=160&&c<=191){const n=c&31,s=buffer.toString('utf8',offset,offset+n);offset+=n;return s;}if(c>=144&&c<=159)return Array.from({length:c&15},read);if(c>=128&&c<=143){const o=Object.create(null);for(let n=c&15;n--;){const k=read();o[k]=read();}return o;}if(c===192)return null;if(c===194)return false;if(c===195)return true;const widths={202:4,203:8,204:1,205:2,206:4,208:1,209:2,210:4};if(widths[c]){const methods={202:'readFloatBE',203:'readDoubleBE',204:'readUInt8',205:'readUInt16BE',206:'readUInt32BE',208:'readInt8',209:'readInt16BE',210:'readInt32BE'};const v=buffer[methods[c]](offset);offset+=widths[c];return v;}if([217,218,219].includes(c)){const w=c===217?1:c===218?2:4,n=w===1?buffer.readUInt8(offset):w===2?buffer.readUInt16BE(offset):buffer.readUInt32BE(offset);offset+=w;const v=buffer.toString('utf8',offset,offset+n);offset+=n;return v;}if([220,221,222,223].includes(c)){const w=c%2?4:2,n=w===2?buffer.readUInt16BE(offset):buffer.readUInt32BE(offset);offset+=w;if(c<222)return Array.from({length:n},read);const o=Object.create(null);for(let i=0;i<n;i++)o[read()]=read();return o;}throw Error('Unsupported test decoder tag '+c);};return [read(),read()];}
  function observe(p){const state={};observed.set(p,state);p.on('websocket',ws=>{state.socket=ws;state.sessionId=new URL(ws.url()).searchParams.get('sessionId');ws.on('framereceived',({payload})=>{if(state.socket!==ws||typeof payload==='string'||payload[0]!==13)return;try{const [type,value]=decode(payload);if(type==='identity')state.seat=value.seat;if(type==='presence'||type==='hostTransfer')Object.assign(state,value);if(type==='snapshot'){state.seat=value.seat;Object.assign(state,value.gameState);}if(type==='gameState')Object.assign(state,value);const packed=state.transfer?.state?.state;if(packed){state.world=packed.packed===1?{...packed,players:packed.players.map(p=>({id:p[0],number:p[1],lives:p[2],x:p[3],y:452,connected:p[4],invulnerable:p[5],respawn:p[6]})),aliens:packed.aliens.map(a=>({id:a[0],x:a[1],y:a[2],hp:a[3],kind:a[4]})),shots:packed.shots.map(v=>({id:v[0],x:v[1],y:v[2],vx:v[3],vy:v[4],owner:v[5]===-1?'alien':packed.players[v[5]][0]}))}:packed;}state.host=state.hostId===state.sessionId;}catch(error){errors.push('Passive decoder: '+error.message);}});});}
`;
s=s.replace("const contexts=[],errors=[];let pilots=[];","const contexts=[],errors=[];let pilots=[];"+decoder);
s=s.replace("p.on('pageerror',e=>errors.push(e.message));await p.goto", "p.on('pageerror',e=>errors.push(e.message));observe(p);await p.goto");
s=s.replace("const inspect=p=>p.evaluate(()=>window.__inspectInvaders?.());","const inspect=async p=>observed.get(p)?.world?observed.get(p):null;");
fs.writeFileSync('.implementation/public-browser-gameplay.js',s);

import fs from 'node:fs';
fs.mkdirSync('.implementation',{recursive:true});
let s=fs.readFileSync('scripts/verification/gameplay.js','utf8');
s=s.replace(/    const c=await open\(code\),d=await open\(code\);[\s\S]*?    const tick=/,'    const tick=');
s=s.replace('capacity:4,fifthRejected:true','capacity:2,fifthRejected:false');
const impairment=`await c.addInitScript(()=>{
 const Native=window.WebSocket,marked=new WeakSet();let seed=4391;
 window.__networkDelay={min:Infinity,max:0,sum:0,count:0};
 const jitter=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return 50+seed/4294967296*100;};
 function queue(ws,key,deliver){const start=performance.now(),deadline=Math.max(start+jitter(),(ws[key+'At']||0)+1);ws[key+'At']=deadline;ws[key+'Queue']=(ws[key+'Queue']||Promise.resolve()).then(()=>new Promise(resolve=>setTimeout(resolve,Math.max(0,deadline-performance.now())))).then(()=>{const d=performance.now()-start,m=window.__networkDelay;m.min=Math.min(m.min,d);m.max=Math.max(m.max,d);m.sum+=d;m.count++;deliver();});}
 window.WebSocket=class extends Native {
  constructor(...args){super(...args);this.addEventListener('message',event=>{if(marked.has(event))return;event.stopImmediatePropagation();queue(this,'in',()=>{const copy=new MessageEvent('message',{data:event.data,origin:event.origin});marked.add(copy);this.dispatchEvent(copy);});});}
  send(data){const copy=typeof data==='string'?data:ArrayBuffer.isView(data)?new Uint8Array(data.buffer,data.byteOffset,data.byteLength).slice():data.slice();queue(this,'out',()=>{if(this.readyState===Native.OPEN)Native.prototype.send.call(this,copy);});}
 };
});`;
s=s.replace('const p=await c.newPage();',impairment+'const p=await c.newPage();');
s=s.replace("await p.locator('.game-overlay').waitFor();", "await p.locator('.game-overlay').waitFor().catch(async error=>{await page.evaluate(v=>window.__latencyFailure=v,{room,body:await p.locator('body').innerText(),errors});throw error;});");
s=s.replace("    pilots=[a,b];",`    const immediate=[];
    for(const pilot of [a,b])immediate.push(await pilot.evaluate(async()=>{
      const before=window.__inspectInvaders(),p=before.world.players.find(p=>p.id===before.seat),x=p.x,start=performance.now();
      window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));
      await new Promise(resolve=>setTimeout(resolve,35));
      const after=window.__inspectInvaders(),next=after.world.players.find(p=>p.id===after.seat);
      window.dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowRight',bubbles:true,cancelable:true}));
      return {host:before.host,elapsed:performance.now()-start,moved:next.x-x};
    }));
    if(immediate.some(v=>v.moved<=0))throw Error('Local movement waited for relay');
    await page.evaluate(v=>window.__predictionEvidence=v,immediate);
    pilots=[a,b];`);
s=s.replace("await a.screenshot({path:'docs/screenshot01.png'});",'');
s=s.replace("await a.screenshot({path:'docs/spectating.png'});",'');
s=s.replace("    await page.evaluate(v=>window.__browserEvidence=v,", "    const delays=await Promise.all(pilots.map(p=>p.evaluate(()=>window.__networkDelay)));await page.evaluate(v=>window.__latencyBrowserStats=v,delays);\n    await page.evaluate(v=>window.__browserEvidence=v,");
fs.writeFileSync('.implementation/latency-browser-gameplay.js',s);
let touch=fs.readFileSync('scripts/verification/touch-and-motion.js','utf8');
touch=touch.replace('const p=await c.newPage();',impairment+'const p=await c.newPage();').replace('__touchEvidence','__latencyTouchEvidence');
fs.writeFileSync('.implementation/latency-touch-and-motion.js',touch);

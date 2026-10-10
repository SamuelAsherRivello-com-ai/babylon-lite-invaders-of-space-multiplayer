async page => {
 await page.evaluate(()=>{window.__touchEvidence=null;});
 const browser=page.context().browser(),contexts=[],errors=[],url='http://127.0.0.1:5185/babylon-lite-space-invaders-clone/';
 const wait=async(fn,label)=>{const end=Date.now()+15000;while(!await fn()){if(Date.now()>end)throw Error(label);await new Promise(r=>setTimeout(r,25));}};
 const open=async(room,mobile=false)=>{const c=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:720},hasTouch:mobile,isMobile:mobile});contexts.push(c);await c.addInitScript(()=>Object.defineProperty(document,'hidden',{configurable:true,get:()=>false}));const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url+(room?'?room='+room:''));await p.locator('.game-overlay').waitFor();return p;};
 const inspect=p=>p.evaluate(()=>window.__inspectInvaders?.());
 try{
  const a=await open();await a.getByRole('button',{name:'CREATE ROOM',exact:true}).click();await a.getByRole('button',{name:'START DEFENSE'}).waitFor();const code=await a.locator('.room-code').textContent();
  const b=await open(code,true);await wait(async()=>(await inspect(b))?.world.players.length===2,'touch guest');await a.getByRole('button',{name:'START DEFENSE'}).click();await b.getByRole('button',{name:'Fire',exact:true}).waitFor({state:'visible'});await wait(async()=>await b.getByRole('button',{name:'Fire',exact:true}).isEnabled(),'enabled fire');
  const box=await b.getByRole('button',{name:'Move right',exact:true}).boundingBox(),fire=await b.getByRole('button',{name:'Fire',exact:true}).boundingBox(),cdp=await b.context().newCDPSession(b);
  const point=(box,id)=>({x:box.x+box.width/2,y:box.y+box.height/2,id,radiusX:3,radiusY:3,force:1});
  const initial=await inspect(b),x=initial.world.players.find(p=>p.id===initial.seat)?.x;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(box,1),point(fire,2)]});await b.waitForTimeout(180);
  if(!await b.getByRole('button',{name:'Move right',exact:true}).evaluate(el=>el.classList.contains('pressed'))||!await b.getByRole('button',{name:'Fire',exact:true}).evaluate(el=>el.classList.contains('pressed')))throw Error('Concurrent touch not held');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(fire,2)]});await b.waitForTimeout(50);if(!await b.getByRole('button',{name:'Fire',exact:true}).evaluate(el=>el.classList.contains('pressed')))throw Error('Direction release stopped fire');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await b.waitForTimeout(50);if(await b.getByRole('button',{name:'Fire',exact:true}).evaluate(el=>el.classList.contains('pressed')))throw Error('Canceled touch stuck');
  await b.screenshot({path:'.implementation/mobile-playing.png'});
  const dimensions=await b.evaluate(()=>({viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],canvas:[document.querySelector('canvas').width,document.querySelector('canvas').height]}));
  // Sample an enemy's displayed motion in the guest at actual animation frames.
  const motion=await b.evaluate(async()=>{const frames=[],start=performance.now();while(performance.now()-start<700){await new Promise(requestAnimationFrame);const w=window.__inspectInvaders().world,a=w.aliens[0];if(a)frames.push({t:performance.now(),id:a.id,x:a.x,y:a.y});}return frames;});
  const deltas=motion.slice(1).flatMap((v,i)=>v.id===motion[i].id?[Math.abs(v.x-motion[i].x)]:[]);
  const moved=(await inspect(b)).world.players.find(p=>p.number===2).x>x;
  if(!moved||dimensions.scroll[0]>dimensions.viewport[0]||dimensions.scroll[1]>dimensions.viewport[1])throw Error('Touch movement or mobile fit');
  await b.getByRole('button',{name:'⚙ SETTINGS'}).click();await b.getByRole('button',{name:'Resume controls'}).click();
  const isolated=await open();await isolated.getByRole('button',{name:'CREATE ROOM',exact:true}).click();await isolated.getByRole('button',{name:'START DEFENSE'}).waitFor();const other=await isolated.locator('.room-code').textContent();if(other===code)throw Error('Room isolation');await isolated.getByRole('button',{name:'LEAVE',exact:true}).click();await isolated.close();
  await page.evaluate(v=>window.__touchEvidence=v,{concurrentTouch:true,releaseIndependent:true,cancelNeutral:true,moved,dimensions,isolatedCodes:true,motionSamples:motion.length,maxRemoteDelta:Math.max(...deltas),errors});
  if(errors.length)throw Error(errors.join('\n'));
 }finally{for(const c of contexts)await c.close();}
}

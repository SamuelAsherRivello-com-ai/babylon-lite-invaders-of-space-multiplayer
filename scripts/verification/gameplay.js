async (page) => {
  await page.evaluate(()=>{window.__browserEvidence=null;window.__browserProgress='Starting verification';});
  const browser=page.context().browser(),url='http://127.0.0.1:5185/babylon-lite-space-invaders-clone/';
  const contexts=[],errors=[];let pilots=[];
  const open=async(room)=>{const c=await browser.newContext({viewport:{width:1280,height:720}});contexts.push(c);await c.addInitScript(()=>Object.defineProperty(document,'hidden',{configurable:true,get:()=>false}));const p=await c.newPage();const windowSession=await c.newCDPSession(p);const {windowId}=await windowSession.send('Browser.getWindowForTarget');await windowSession.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'minimized'}});await windowSession.detach();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{const u=new URL(r.url());if(r.status()>=400&&u.origin===new URL(url).origin&&/\.(?:js|css|png|svg)$/.test(u.pathname))errors.push('Asset HTTP '+r.status()+': '+u.pathname);});await p.goto(url+(room?'?room='+room:''));await p.locator('.game-overlay').waitFor();return p;};
  const inspect=p=>p.evaluate(()=>window.__inspectInvaders?.());
  const until=async(fn,label,ms=20000)=>{const end=Date.now()+ms;while(!await fn()){if(Date.now()>end)throw Error(label);await new Promise(r=>setTimeout(r,30));}};
  const keys=async(p,move,fire)=>p.evaluate(({move,fire})=>{for(const [key,held] of [['ArrowLeft',move<0],['ArrowRight',move>0],[' ',fire]])window.dispatchEvent(new KeyboardEvent(held?'keydown':'keyup',{key,bubbles:true,cancelable:true}));},{move,fire});
  try{
    const a=await open();await a.getByRole('button',{name:'CREATE ROOM',exact:true}).click();await a.getByRole('button',{name:'START DEFENSE'}).waitFor();const code=await a.locator('.room-code').textContent();
    await a.getByRole('button',{name:'START DEFENSE'}).click();await until(async()=>((await inspect(a))?.world.phase==='combat'),'solo start');
    const b=await open(code);await until(async()=>((await inspect(b))?.world.players.filter(p=>p.connected).length===2),'late join');
    pilots=[a,b];
    const c=await open(code),d=await open(code);await until(async()=>((await inspect(a))?.world.players.filter(p=>p.connected).length===4),'four pilots');
    await a.screenshot({path:'.implementation/four-capacity.png'});
    const fifth=await open(code);await fifth.getByRole('heading',{name:'Room full'}).waitFor();
    await c.getByRole('button',{name:'LEAVE',exact:true}).click();await d.getByRole('button',{name:'LEAVE',exact:true}).click();await until(async()=>((await inspect(a))?.world.players.filter(p=>p.connected).length===2),'hot drop');
    const tick=(await inspect(a)).world.tick;await a.getByRole('button',{name:'⚙ SETTINGS'}).click();await a.waitForTimeout(300);if((await inspect(a)).world.tick<=tick)throw Error('Host stopped in settings');await a.getByRole('button',{name:'Resume controls'}).click();
    const began=Date.now();let cleared=false,spectated=false,defeated=false,restarted=false,migrated=false,migrationMs=0,spectatorHosted=false,spectatorMigrationMs=0;const original=(await inspect(a)).seat;let last='';
    while(Date.now()-began<210000){
      const readings=await Promise.all(pilots.map(inspect));const hostIndex=readings.findIndex(s=>s?.host);if(hostIndex<0){await a.waitForTimeout(50);continue;}
      const w=readings[hostIndex].world;const pa=w.players.find(p=>p.id===original),pb=w.players.find(p=>p.id===readings[1].seat);
      if(w.wave>=2)cleared=true;
      if(!migrated&&pa?.lives>0&&pa?.lives<3){
        const committedLives=pa.lives;await until(async()=>((await inspect(b)).world.players.find(p=>p.id===original)?.lives===committedLives),'committed death');
        const protocol=await a.context().newCDPSession(a);const start=Date.now();await a.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await protocol.send('Page.setWebLifecycleState',{state:'frozen'});await until(async()=>((await inspect(b)).host&&(await inspect(b)).ready),'silent host migration',6000);migrationMs=Date.now()-start;if(migrationMs>=5000)throw Error('Migration exceeded 5 seconds');
        await protocol.send('Page.setWebLifecycleState',{state:'active'});await a.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});await until(async()=>!(await inspect(a)).host,'stale host return');await a.reload();await until(async()=>((await inspect(a))?.world.players.find(p=>p.id===original)?.connected),'token refresh');if((await inspect(a)).seat!==original)throw Error('Refresh lost private identity');migrated=true;continue;
      }
      if(pa?.lives===0&&pb?.lives>0&&!spectated){spectated=true;await a.screenshot({path:'docs/spectating.png'});}
      if(spectated&&!spectatorHosted&&readings[1].host){
        const protocol=await b.context().newCDPSession(b),start=Date.now();await b.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await protocol.send('Page.setWebLifecycleState',{state:'frozen'});
        await until(async()=>(await inspect(a)).host&&(await inspect(a)).ready,'spectator becomes host',6000);spectatorMigrationMs=Date.now()-start;if(spectatorMigrationMs>=5000)throw Error('Spectator migration exceeded target');const before=(await inspect(a)).world.tick;await a.waitForTimeout(250);if((await inspect(a)).world.tick<=before||(await inspect(a)).world.players.find(p=>p.id===original).lives!==0)throw Error('Spectator host stopped or revived');
        await protocol.send('Page.setWebLifecycleState',{state:'active'});await b.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});await until(async()=>!(await inspect(b)).host,'old host remains guest');spectatorHosted=true;continue;
      }
      if(w.phase==='defeat'){defeated=true;if(!cleared||!spectated)throw Error('Missing spectator flow');}
      if(defeated&&w.phase==='combat'&&w.wave===1){if(!w.players.filter(p=>p.connected).every(p=>p.lives===3))throw Error('Replay did not restore three lives');restarted=true;break;}
      for(let i=0;i<pilots.length;i++){
        const p=w.players.find(p=>p.id===readings[i]?.seat);if(!p||!p.lives){await keys(pilots[i],0,false);continue;}
        const mode=!cleared?'attack':i===0?'die':spectated?'die':'survive';let target=p.x;
        if(mode==='attack'){
          const speed=Math.min(72,10+w.wave*3+2);const targets=w.aliens.map(a=>Math.max(16,Math.min(304,a.x+w.direction*speed*(p.y-a.y)/282)));targets.sort((a,b)=>Math.abs(a-p.x)-Math.abs(b-p.x));target=targets[0]??p.x;
        }else if(mode==='die'){
          const shots=w.shots.filter(s=>s.owner==='alien'&&s.y<p.y-8).map(s=>({x:s.x+s.vx*(p.y-s.y)/s.vy,time:(p.y-s.y)/s.vy}));shots.sort((a,b)=>a.time-b.time);target=shots.find(s=>Math.abs(s.x-p.x)/148<s.time)?.x??p.x;
        }else if(w.shots.some(s=>s.owner==='alien'&&s.y>340&&Math.abs(s.x-p.x)<30))target=p.x<160?24:296;
        await keys(pilots[i],Math.abs(target-p.x)<3?0:Math.sign(target-p.x),mode==='attack');
      }
      const status=JSON.stringify({wave:w.wave,phase:w.phase,lives:[pa?.lives,pb?.lives],score:w.score});if(status!==last){await page.evaluate(v=>window.__browserProgress=v,status);last=status;}
      await a.waitForTimeout(60);
    }
    if(!cleared||!spectated||!defeated||!restarted||!migrated||!spectatorHosted)throw Error('Incomplete browser loop');
    await until(async()=>{const states=await Promise.all(pilots.map(inspect));return states.every(s=>s.world.phase==='combat'&&s.world.wave===1&&s.world.score===0&&s.world.run===states[0].world.run&&s.world.players.filter(p=>p.connected).every(p=>p.lives===3));},'replay agreement');
    if(errors.length)throw Error(errors.join('\n'));
    await page.evaluate(v=>window.__browserEvidence=v,{result:'PASS',cleared,spectated,defeated,restarted,migrated,migrationMs,spectatorHosted,spectatorMigrationMs,seconds:(Date.now()-began)/1000,capacity:4,fifthRejected:true,hostSettingsContinue:true,errors});
  }finally{for(const c of contexts)await c.close();}
}

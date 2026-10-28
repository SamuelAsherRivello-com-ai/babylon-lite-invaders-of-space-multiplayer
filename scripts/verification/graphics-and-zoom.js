async page => {
 await page.evaluate(()=>{window.__recoveryZoomEvidence=null;});
 const c=await page.context().browser().newContext({viewport:{width:1280,height:720}}),p=await c.newPage(),errors=[];
 try{
  const windowSession=await c.newCDPSession(p);const {windowId}=await windowSession.send('Browser.getWindowForTarget');await windowSession.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'minimized'}});await windowSession.detach();
  await c.addInitScript(()=>{const native=navigator.gpu.requestAdapter.bind(navigator.gpu);let first=true;navigator.gpu.requestAdapter=(...args)=>{if(first){first=false;return new Promise(()=>{});}return native(...args);};});
  await p.goto('http://127.0.0.1:5185/babylon-lite-invaders-of-space-multiplayer/');await p.getByText('WebGPU initialization timed out. Close other graphics-intensive tabs, then retry graphics.').waitFor({timeout:22000});await p.getByRole('button',{name:'Retry graphics'}).click();await p.locator('.game-overlay').waitFor();
  const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setDeviceMetricsOverride',{width:1024,height:576,deviceScaleFactor:1.25,mobile:false});await p.waitForTimeout(150);
  const metrics=await p.evaluate(()=>({viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],canvas:[document.querySelector('canvas').width,document.querySelector('canvas').height],scale:document.querySelector('canvas').dataset.pixelScale}));
  if(metrics.scroll[0]>metrics.viewport[0]||metrics.scroll[1]>metrics.viewport[1])throw Error('Emulated 125% browser zoom overflow');
  await p.getByRole('button',{name:'⚙ SETTINGS'}).click();await p.getByRole('button',{name:'Resume controls'}).click();
  await page.evaluate(v=>window.__recoveryZoomEvidence=v,{initializationTimeout:true,retrySucceeded:true,zoomEmulation:metrics});
 }finally{await c.close();}
}

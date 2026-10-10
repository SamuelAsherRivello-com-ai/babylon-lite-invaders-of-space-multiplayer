import {
  createEngine, disposeEngine, startEngine, stopEngine, loadTexture2D, releaseTexture,
  createGridSpriteAtlas, createSprite2DLayer, createSpriteRenderer,
  disposeSpriteRenderer, registerSpriteRenderer, createRenderTexture2D, setSpriteRendererTarget,
  createSpriteAnimationManager, createSpriteFrameAnimation, addSpriteAnimation,
  attachSpriteAnimationsToRenderer, disposeSpriteAnimationBinding,
} from '@babylonjs/lite';
import { BabylonLiteAIEntry as Pixels, BabylonLiteMode } from '../babylon/pixel-grid-entry.js';
import { createRenderTargetSurfaceView } from '../babylon/render-resolution.js';
import { WIDTH, HEIGHT, INVASION_Y } from './rules.js';

/** Fixed logical world, nearest offscreen target, native DPR presentation surface. */
export async function createGameRenderer(canvas, host, getFrame, signal) {
  if(!navigator.gpu)throw Error('This game requires WebGPU. Use a current Chrome or Edge browser with hardware acceleration.');
  let engine,texture,atlas,target,presentationAtlas,worldRenderer,presentationRenderer,binding,observer;
  let disposed=false;
  const cleanup=()=>{
    if(disposed)return;disposed=true;observer?.disconnect();window.removeEventListener('resize',resize);
    if(binding)disposeSpriteAnimationBinding(binding);
    if(engine)stopEngine(engine);
    if(worldRenderer)setSpriteRendererTarget(worldRenderer,null);
    if(presentationRenderer)disposeSpriteRenderer(presentationRenderer);
    if(worldRenderer)disposeSpriteRenderer(worldRenderer);
    // Both atlases reference externally owned textures, released once below.
    if(target)releaseTexture(target);if(texture)releaseTexture(texture);if(engine)disposeEngine(engine);
  };
  let presentationSprite;
  const resize=()=>{
    const fit=Math.min(host.clientWidth/WIDTH,host.clientHeight/HEIGHT);
    const scale=fit>=1?Math.floor(fit):Math.max(.1,fit);
    canvas.style.width=`${WIDTH*scale}px`;canvas.style.height=`${HEIGHT*scale}px`;
    canvas.dataset.pixelScale=String(scale);canvas.dataset.fractional=String(scale<1);
    // Lite owns the canvas backing buffer and applies DPR once at frame start.
    const dpr=window.devicePixelRatio||1;
    const width=Math.floor(WIDTH*scale*dpr),height=Math.floor(HEIGHT*scale*dpr);
    if(presentationSprite)Pixels.updatePresentationSprite(presentationSprite,{positionPx:[width/2,height/2],sizePx:[width,height]});
  };
  try {
    Pixels.configure({mode:BabylonLiteMode.PixelPerfect2D});resize();
    engine=await createEngine(canvas,{msaaSamples:1});
    if(signal.aborted){cleanup();return cleanup;}
    texture=await loadTexture2D(engine,`${import.meta.env.BASE_URL}art/orbit-atlas.png`,{invertY:false,minFilter:'nearest',magFilter:'nearest',mipMaps:false,premultiplyAlpha:false});
    if(signal.aborted){cleanup();return cleanup;}
    atlas=createGridSpriteAtlas(texture,{cellWidthPx:16,cellHeightPx:16,columns:16,rows:2,pivot:[.5,.5]});
    const layer=createSprite2DLayer(atlas,{capacity:352,pivot:[.5,.5]});
    Pixels.updateView(layer,{zoom:1,rotation:0});Pixels.centerView(layer,160,288,WIDTH,HEIGHT);
    const add=(frame,x,y,size=16,color=[1,1,1,1])=>Pixels.addSprite(layer,{frame,positionPx:[x,y],sizePx:[size,size],color});
    for(let i=0;i<67;i++)add(13,12+(i*79)%296,147+(i*37)%316,i%11===0?5:2,[.6,.8,1,i%3?.25:.5]);
    for(let i=0;i<19;i++)Pixels.update(add(15,16+i*16,INVASION_Y,16),{sizePx:[16,1]});
    // 80 aliens plus armor, 88 projectiles, four ships and eight effects.
    const slots=Array.from({length:260},()=>Pixels.addSprite(layer,{frame:0,positionPx:[0,0],visible:false}));
    const draw=()=>{
      if(signal.aborted)return;
      resize(); // Also detects DPR changes that do not emit a CSS resize.
      const w=getFrame();let index=0;
      const put=(frame,x,y,size=16,color=[1,1,1,1])=>{if(index>=slots.length)return;Pixels.update(slots[index++],{frame,positionPx:[x,y],sizePx:[size,size],color,visible:true});};
      if(w){
        for(const a of w.aliens){put(4+a.kind*2+(Math.floor(w.tick/24)%2),a.x,a.y);if(a.hp>1)put(14,a.x,a.y,20,[1,1,1,.45]);}
        for(const s of w.shots)put(s.owner==='alien'?11:10,s.x,s.y,s.owner==='alien'?12:16);
        for(const p of w.players)if(p.connected&&p.lives>0&&p.respawn<=0){put(p.number-1,p.x,p.y,22,[1,1,1,p.invulnerable>0&&Math.floor(w.tick/6)%2?.35:1]);}
        for(const e of w.events)if(w.tick-e.tick<15&&['burst','death','hit'].includes(e.type))put(12,e.x,e.y,e.type==='death'?26:18,[1,1,1,1-(w.tick-e.tick)/15]);
      }
      while(index<slots.length)Pixels.update(slots[index++],{visible:false});
    };
    target=createRenderTexture2D(engine,WIDTH,HEIGHT,{minFilter:'nearest',magFilter:'nearest',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
    worldRenderer=createSpriteRenderer(createRenderTargetSurfaceView(engine,WIDTH,HEIGHT),{layers:[layer],clear:true,clearValue:{r:.027,g:.078,b:.125,a:1}});
    setSpriteRendererTarget(worldRenderer,target);registerSpriteRenderer(worldRenderer);
    presentationAtlas=createGridSpriteAtlas(target,{cellWidthPx:WIDTH,cellHeightPx:HEIGHT,columns:1,rows:1,pivot:[.5,.5]});
    const presentationLayer=createSprite2DLayer(presentationAtlas,{pivot:[.5,.5]});
    presentationSprite=Pixels.addPresentationSprite(presentationLayer,{frame:0,positionPx:[160,288],sizePx:[WIDTH,HEIGHT]});resize();
    presentationRenderer=createSpriteRenderer(engine,{layers:[presentationLayer],clear:true,clearValue:{r:.027,g:.078,b:.125,a:1}});registerSpriteRenderer(presentationRenderer);
    const animations=createSpriteAnimationManager();
    // Use Lite's owned frame lifecycle for cosmetic sprite refresh; simulation is separate.
    addSpriteAnimation(animations,createSpriteFrameAnimation({setFrame:draw},0,1_000_000,true,1));
    binding=attachSpriteAnimationsToRenderer(worldRenderer,animations);
    observer=new ResizeObserver(resize);observer.observe(host);window.addEventListener('resize',resize);
    draw();await startEngine(engine);
    if(signal.aborted)cleanup();
    return cleanup;
  } catch(error){cleanup();throw error;}
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {BabylonLiteAIEntry as Pixels,BabylonLiteMode,snapPositionPxThroughView} from '../src/content/babylon/pixel-grid-entry.js';
import {createSprite2DLayer,sprite2DWorldToScreenToRef} from '@babylonjs/lite';
import {getInitializationMessage} from '../src/content/babylon/initialization.js';

const atlas={texture:{width:16,height:16},textureSizePx:[16,16],frames:[{uvMin:[0,0],uvMax:[1,1],sourceSizePx:[16,16],pivot:[.5,.5]}]};
test('pixel entry keeps fractional simulation separate from screen-snapped rendering',()=>{
  Pixels.configure({mode:BabylonLiteMode.PixelPerfect2D});const layer=createSprite2DLayer(atlas);
  Pixels.updateView(layer,{positionPx:[.3,-.7],zoom:2,rotation:.2});const s=Pixels.addSprite(layer,{positionPx:[12.3,4.8]});
  assert.deepEqual(Pixels.getSimulationPosition(s),[12.3,4.8]);
  const snapped=snapPositionPxThroughView(layer.view,Pixels.getSimulationPosition(s));
  const screen=sprite2DWorldToScreenToRef(layer.view,...snapped,{x:0,y:0});
  assert.ok(Math.abs(screen.x-Math.round(screen.x))<1e-8);assert.ok(Math.abs(screen.y-Math.round(screen.y))<1e-8);
  Pixels.move(s,[23.7,6.2]);Pixels.update(s,{visible:false});assert.deepEqual(Pixels.getSimulationPosition(s),[23.7,6.2]);
});
test('pixel entry requires explicit supported configuration and finite positions',()=>{
  assert.throws(()=>Pixels.configure({mode:'other'}),/Unsupported/);
  assert.throws(()=>Pixels.addSprite(createSprite2DLayer(atlas),{positionPx:[0,0]}),/configure/);
  Pixels.configure({mode:BabylonLiteMode.PixelPerfect2D});assert.throws(()=>Pixels.addSprite(createSprite2DLayer(atlas),{positionPx:[NaN,0]}),/finite/);
});
test('game source cannot bypass the pixel grid or create fallback graphics contexts',async()=>{
  const scan=async dir=>{for(const e of await readdir(dir,{withFileTypes:true})){const u=new URL(e.name+(e.isDirectory()?'/':''),dir);if(e.isDirectory())await scan(u);else if(/\.[jt]sx?$/.test(e.name)&&e.name!=='pixel-grid-entry.js'){
    const code=await readFile(u,'utf8');assert.doesNotMatch(code,/\b(?:addSprite2D|updateSprite2D|centerSprite2DView)\s*\(/,u.pathname);assert.doesNotMatch(code,/\.view\.(?:positionPx|zoom|rotation)\s*=/,u.pathname);assert.doesNotMatch(code,/getContext\(['"](?:webgl|2d)/,u.pathname);
  }}};await scan(new URL('../src/content/',import.meta.url));
});
test('unsupported GPU and allocation errors are useful and distinct',()=>{
  assert.match(getInitializationMessage(false,Error('unsupported')),/requires WebGPU/);
  assert.match(getInitializationMessage(true,Error('adapter not available')),/requires WebGPU/);
  assert.match(getInitializationMessage(true,Error('out of memory')),/allocate/);
});
test('original atlas is a correctly sized RGBA pixel-art PNG',async()=>{
  const p=await readFile(new URL('../public/art/orbit-atlas.png',import.meta.url));
  assert.deepEqual([...p.subarray(0,8)],[137,80,78,71,13,10,26,10]);assert.equal(p.readUInt32BE(16),256);assert.equal(p.readUInt32BE(20),32);assert.equal(p[25],6);
});

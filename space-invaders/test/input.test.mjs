import test from 'node:test';
import assert from 'node:assert/strict';
import { InputController } from '../src/content/game/input.js';
test('independent pointers retain move and fire through release and cancellation',()=>{
  const states=[];const c=new InputController(v=>states.push(v));
  c.pointer(1,'left',true);c.pointer(2,'fire',true);assert.deepEqual(c.value,{move:-1,fire:true});
  c.pointer(1,'left',false);assert.deepEqual(c.value,{move:0,fire:true});
  c.pointer(3,'right',true);c.pointer(2,'fire',false);assert.deepEqual(c.value,{move:1,fire:false});
  c.enable(false);assert.deepEqual(c.value,{move:0,fire:false});c.enable(true);assert.equal(c.value.move,0);
});
test('keyboard and touch controls compose, opposite directions cancel, focus release neutralizes',()=>{
  const c=new InputController(()=>{});c.key('left',true);c.pointer(9,'right',true);assert.equal(c.value.move,0);
  c.pointer(9,'right',false);c.key('fire',true);assert.deepEqual(c.value,{move:-1,fire:true});
  c.release();assert.deepEqual(c.value,{move:0,fire:false});
});

test('controls pressed while disabled cannot become held when a menu closes',()=>{
 const input=new InputController(()=>{});input.key('fire',true);input.enable(false);input.key('right',true);input.pointer(4,'fire',true);input.enable(true);assert.deepEqual(input.value,{move:0,fire:false});assert.equal(input.keys.size,0);assert.equal(input.pointers.size,0);
});

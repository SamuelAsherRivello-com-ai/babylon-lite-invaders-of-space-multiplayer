import test from 'node:test';
import assert from 'node:assert/strict';
import {GameSession} from '../src/content/game/session.js';
import {createWorld,applyAction,startRun,packWorld} from '../src/content/game/rules.js';
class FakeClient {
  constructor(state){this.state=state;this.sent=[];}
  subscribe(cb){this.listener=cb;cb(this.state,'initial');return()=>{this.listener=null;};}
  send(type,value){this.sent.push({type,value});}
  emit(event,patch){Object.assign(this.state,patch);this.listener?.(this.state,event);}
  disconnect(){this.disconnected=true;}
}
const context=()=>{
 const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{hidden:false}});
 return()=>{if(old)Object.defineProperty(globalThis,'document',old);else delete globalThis.document;};
};
test('successor restores committed lives, seed and journal before the epoch readiness handshake',()=>{
 const restore=context();let session;
 try{
  const w=createWorld(19);applyAction(w,{sequence:1,sender:'pilot',type:'membership',payload:{number:1,connected:true}});startRun(w);w.players[0].lives=0;
  const transfer={sequence:4,state:{state:packWorld(w)}};
  const client=new FakeClient({status:'connected',sessionId:'new',seat:'pilot',hostId:'old',epoch:1,ready:false,transfer});session=new GameSession(client);
  client.emit('hostTransfer',{hostId:'new',epoch:2,journal:[{sequence:2,sender:'pilot',type:'membership',payload:{number:1,connected:false}}]});
  assert.equal(session.world.players[0].lives,0);assert.equal(session.world.seed,19);assert.equal(session.world.lastAppliedRelaySeq,2);
  assert.equal(session.world.players[0].connected,false);assert.deepEqual(client.sent.at(-1),{type:'hostReady',value:{epoch:2}});
 }finally{session?.close();restore();}
});
test('missing migration checkpoint produces recovery error rather than a reset',()=>{
 const restore=context();let session;
 try{
  const client=new FakeClient({status:'connected',sessionId:'new',hostId:'new',epoch:3,ready:false,transfer:null});session=new GameSession(client);
  assert.equal(session.world,null);assert.match(session.error,/No committed checkpoint/);assert.equal(client.sent.length,0);
 }finally{session?.close();restore();}
});
test('guest movement responds before a delayed acknowledgement and disconnect tears down its loop',()=>{
 const restore=context();let session;
 try{
  const w=createWorld();applyAction(w,{sequence:1,sender:'guest',type:'membership',payload:{number:1,connected:true}});startRun(w);
  const client=new FakeClient({status:'connected',sessionId:'g',seat:'guest',hostId:'h',epoch:1,ready:true,runId:'room',transfer:{state:{state:packWorld(w)}}});
  session=new GameSession(client);client.emit('snapshot',{});session.setIntent({move:1,fire:true});
  const before=session.getFrame().players[0].x;session.lastTime=performance.now()-16;session.update();
  assert.ok(session.getFrame().players[0].x>before,'movement waited for the server');
  assert.ok(client.sent.some(v=>v.type==='action'&&v.value.payload.fire));
  session.close();assert.equal(client.disconnected,true);assert.equal(client.listener,null);
 }finally{session?.close();restore();}
});

test('guest acknowledgements discard committed actions while preserving pending migration replay',()=>{
 const restore=context();let session;
 try{
  const w=createWorld();applyAction(w,{sequence:1,sender:'pilot',type:'membership',payload:{number:1,connected:true}});startRun(w);
  const transfer={state:{state:packWorld(w),lastAppliedRelaySeq:1}};
  const client=new FakeClient({status:'connected',sessionId:'guest',hostId:'host',epoch:1,ready:true,runId:'r',seat:'pilot',transfer});
  session=new GameSession(client);
  for(let n=2;n<=20;n++)client.emit('gameAction',{lastAction:{sequence:n,sender:'pilot',type:'input',payload:{move:0,fire:false,inputSequence:n}}});
  assert.equal(session.pending.size,19);
  client.emit('gameState',{transfer:{state:{state:packWorld(w),lastAppliedRelaySeq:18}}});
  assert.deepEqual([...session.pending.keys()],[19,20]);
 }finally{session?.close();restore();}
});

import { createWorld, formation, applyAction, step, STEP_MS, clampX, packWorld, restoreWorld } from './rules.js';

/** Transport is injected: the same deterministic world is restored by each successor. */
export class GameSession {
  constructor(client, changed = () => {}) {
    this.client=client;this.changed=changed;this.world=null;this.latest=null;this.previous=null;
    this.epoch=0;this.intent={move:0,fire:false};this.sequence=0;this.predictedX=null;this.inputHistory=[];
    this.error='';this.pending=new Map();this.lastTime=performance.now();this.accumulator=0;this.nextInput=0;this.nextSnapshot=0;this.lastUi=0;this.closed=false;
    this.preview=createWorld();formation(this.preview);
    this.wrappedRooms=new WeakSet();
    this.unsubscribe=client.subscribe((s,event)=>this.receive(s,event));
    this.timer=setInterval(()=>this.update(),8);
  }
  get state(){return this.client.state;}
  get isHost(){return this.state.status==='connected'&&this.state.hostId===this.state.sessionId;}
  receive(s,event) {
    if(this.closed)return;
    if(s.code&&s.reconnectToken){try{localStorage.setItem('space-invaders.recovery.'+s.code,s.reconnectToken);}catch{}}
    // A hidden browser yields host eligibility by withholding its relay heartbeat.
    // Returning heartbeat rejoins at the end of the eligibility order.
    if(this.client.room&&!this.wrappedRooms.has(this.client.room)) {
      const room=this.client.room;const send=room.send.bind(room);
      room.send=(type,value)=>{if(type==='heartbeat'&&document.hidden)return;send(type,value);};
      this.wrappedRooms.add(room);
    }
    if(event==='gameAction'&&s.lastAction)this.pending.set(s.lastAction.sequence,s.lastAction);
    if(event==='recoveryError'){this.error=s.error;this.world=null;}
    const transfer=s.transfer??s.gameState?.transfer;
    if(event==='snapshot'||event==='hostTransfer')for(const a of s.journal??s.gameState?.journal??[])this.pending.set(a.sequence,a);
    const acknowledged=transfer?.state?.lastAppliedRelaySeq;
    if(Number.isSafeInteger(acknowledged))for(const sequence of this.pending.keys())if(sequence<=acknowledged)this.pending.delete(sequence);
    if(this.isHost&&s.epoch!==this.epoch) {
      try {
        this.epoch=s.epoch;
        if(transfer)this.world=restoreWorld(transfer.state.state);
        else if(s.epoch===1)this.world=createWorld();
        else throw Error('No committed checkpoint survived. Return to the lobby and create a new room.');
        for(const a of [...this.pending.values()].sort((a,b)=>a.sequence-b.sequence))applyAction(this.world,a);
        this.pending.clear();this.error='';this.accumulator=0;this.lastTime=performance.now();
        this.client.send('hostReady',{epoch:this.epoch});
      }catch(error){this.error=error.message;this.world=null;}
    }
    if(!this.isHost&&transfer&&(event==='snapshot'||event==='gameState'||event==='hostTransfer')) {
      try {
        const w=restoreWorld(transfer.state.state);
        this.previous=this.latest;this.latest={world:w,at:performance.now()};
        const p=w.players.find(p=>p.id===s.seat);
        if(p){
          if(this.predictedX===null||!p.lives||p.respawn>0)this.predictedX=p.x;
          // Reapply only local intents not yet acknowledged by the host.
          this.inputHistory=this.inputHistory.filter(command=>command.sequence>(p.inputSequence||0));
          const now=performance.now();let target=p.x;
          for(let i=0;i<this.inputHistory.length;i++){
            const command=this.inputHistory[i],end=this.inputHistory[i+1]?.at??now;
            const duration=Math.max(0,end-Math.max(command.at,now-300));
            target=clampX(target+command.move*duration*.148);
          }
          this.correction=target-this.predictedX;
        }
      }catch(error){this.error=error.message;}
    }
    if(event==='status'&&s.status!=='connected'){this.intent={move:0,fire:false};this.world=null;this.epoch=0;this.pending.clear();this.inputHistory=[];}
    this.changed();
  }
  setIntent(value){if(value.fire&&!this.intent.fire)this.flashUntil=performance.now()+90;this.intent={...value};this.sendInput();this.changed();}
  send(type,payload){this.client.send('action',{epoch:this.state.epoch,runId:this.state.runId,sequence:++this.sequence,type,payload});}
  sendInput(){if(this.state.ready&&this.state.status==='connected'&&!this.error){this.send('input',this.intent);this.inputHistory.push({sequence:this.sequence,at:performance.now(),move:this.intent.move});this.inputHistory=this.inputHistory.slice(-32);}}
  start(){if(this.isHost)this.send('start',{});}
  update() {
    if(this.closed)return;
    const now=performance.now();const delta=Math.min(100,now-this.lastTime);this.lastTime=now;
    if(this.state.status!=='connected')return;
    if(now>=this.nextInput){this.nextInput=now+50;this.sendInput();}
    if(this.isHost&&this.world&&this.state.ready&&!this.error&&!document.hidden) {
      try{
        for(const a of [...this.pending.values()].sort((a,b)=>a.sequence-b.sequence))applyAction(this.world,a);
        this.pending.clear();this.accumulator+=delta;
        let count=0;while(this.accumulator>=STEP_MS&&count++<4){step(this.world);this.accumulator-=STEP_MS;}
        if(count>4)this.accumulator=0;
        if(now>=this.nextSnapshot){
          this.nextSnapshot=now+50;
          const checkpoint={protocolVersion:1,epoch:this.state.epoch,runId:this.state.runId,tick:this.world.tick,lastAppliedRelaySeq:this.world.lastAppliedRelaySeq,random:this.world.seed,state:packWorld(this.world)};
          if(new TextEncoder().encode(JSON.stringify(checkpoint)).length>12288)throw Error('Checkpoint budget exceeded. Return to lobby.');
          this.client.send('hostSnapshot',checkpoint);
        }
      }catch(error){this.error=error.message;}
    }else if(!this.isHost&&this.latest){
      const p=this.latest.world.players.find(p=>p.id===this.state.seat);
      if(p&&p.lives>0&&p.respawn<=0&&this.state.ready){
        this.predictedX=clampX((this.predictedX??p.x)+this.intent.move*148*delta/1000);
        if(Number.isFinite(this.correction)){const shift=Math.max(-1.5,Math.min(1.5,this.correction*.15));this.predictedX=clampX(this.predictedX+shift);this.correction-=shift;}
      }
    }
    if(now-this.lastUi>=50){this.lastUi=now;this.changed();}
  }
  getFrame(now=performance.now()) {
    if(this.isHost&&this.world)return this.world;
    if(!this.latest)return this.preview;
    const next=this.latest.world,prior=this.previous;
    const frame={...next,aliens:next.aliens.map(a=>({...a})),shots:next.shots.map(s=>({...s})),players:next.players.map(p=>({...p}))};
    // One snapshot of display delay; no rendered value feeds authoritative rules.
    if(prior&&prior.world.run===next.run){
      const span=Math.max(1,this.latest.at-prior.at),t=Math.max(0,Math.min(1,(now-this.latest.at)/span));
      for(const key of ['aliens','shots','players']){
        const old=new Map(prior.world[key].map(e=>[e.id,e]));
        for(const e of frame[key]){const p=old.get(e.id);if(p){e.x=p.x+(e.x-p.x)*t;e.y=p.y+(e.y-p.y)*t;}}
      }
    }
    const p=frame.players.find(p=>p.id===this.state.seat);
    if(p&&this.predictedX!==null)p.x=this.predictedX;
    if(p&&p.lives>0&&this.flashUntil>now)frame.events=[...frame.events,{id:-1,type:'hit',x:p.x,y:p.y-12,tick:frame.tick}];
    return frame;
  }
  close(){if(this.closed)return;this.intent={move:0,fire:false};this.sendInput();this.closed=true;clearInterval(this.timer);this.unsubscribe();this.client.disconnect();}
}

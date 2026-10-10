import { useEffect, useMemo, useRef, useState } from 'react';
import { GameCanvas } from './game/GameCanvas.jsx';
import { GameSession } from './game/session.js';
import { InputController } from './game/input.js';
import { COLORS, createWorld, formation } from './game/rules.js';
import { useContentShell } from '../shared/ContentShellContext.jsx';

// Released transport is supplied by the composition root.
export function Content({ createClient }) {
  const session=useRef(null),mounted=useRef(false),joining=useRef(false);
  const [,refresh]=useState(0),[graphics,setGraphics]=useState(false),[notice,setNotice]=useState('');
  const linked=new URLSearchParams(location.search).get('room')?.trim().toUpperCase()||'';
  const [code,setCode]=useState(linked);
  const {paused}=useContentShell();
  const preview=useMemo(()=>{const w=createWorld();formation(w);return w;},[]);
  const input=useMemo(()=>new InputController(value=>{session.current?.setIntent(value);if(mounted.current)refresh(n=>n+1);}),[]);
  useEffect(()=>{
    if(!import.meta.env.DEV)return;
    // Read-only inspection for local browser verification; omitted in production.
    window.__inspectInvaders=()=>{const s=session.current;return s?structuredClone({world:s.getFrame(),host:s.isHost,epoch:s.state.epoch,ready:s.state.ready,seat:s.state.seat}):null;};
    return()=>{delete window.__inspectInvaders;};
  },[]);
  useEffect(()=>{mounted.current=true;const unbind=input.bind();return()=>{mounted.current=false;unbind();session.current?.close();session.current=null;};},[input]);
  const current=session.current,state=current?.state,connected=state?.status==='connected';
  const world=current?.getFrame()||preview,local=world.players.find(p=>p.id===state?.seat);
  const error=current?.error||state?.error||'';
  useEffect(()=>{input.enable(Boolean(graphics&&connected&&state.ready&&local?.lives>0&&world.phase==='combat'&&!paused&&!error));},[input,graphics,connected,state?.ready,local?.lives,world.phase,paused,error]);
  async function join(create=false,room=code) {
    if(joining.current||!createClient)return;
    room=room.trim().toUpperCase();
    if(!create&&!/^[A-Z0-9]{4}$/.test(room)){setNotice('Enter the four-character room code.');return;}
    joining.current=true;setNotice('');input.release();session.current?.close();
    let token;try{if(!create)token=localStorage.getItem('space-invaders.recovery.'+room);}catch{}
    try {
      const client=createClient(create?{create:true}:{code:room,...(token?{reconnectToken:token}:{})});
      const next=new GameSession(client,()=>{if(mounted.current)refresh(n=>n+1);});
      session.current=next;refresh(n=>n+1);
      await client.connect();
    }catch(error){session.current?.close();session.current=null;setNotice(error.message||'Unable to initialize the multiplayer session.');}
    finally{joining.current=false;if(mounted.current)refresh(n=>n+1);}
  }
  const autoJoined=useRef(false);
  useEffect(()=>{if(connected&&state.code){autoJoined.current=true;const url=new URL(location.href);url.searchParams.set('room',state.code);history.replaceState(null,'',url);}},[connected,state?.code]);
  useEffect(()=>{if(graphics&&createClient&&linked&&!autoJoined.current){autoJoined.current=true;void join(false,linked);}},[graphics,createClient,linked]);
  function leave(){input.release();current?.close();session.current=null;setNotice('');refresh(n=>n+1);const url=new URL(location.href);url.searchParams.delete('room');history.replaceState(null,'',url);}
  async function share(){const url=new URL(location.href);url.searchParams.set('room',state.code);try{await navigator.clipboard.writeText(url.toString());setNotice('Invite link copied.');}catch{setNotice('Share this room code: '+state.code);}}
  const active=connected&&state.ready&&!current.error;
  return <>
    <GameCanvas getFrame={()=>session.current?.getFrame()||preview} onReady={setGraphics}/>
    {graphics&&<div className="game-overlay" data-phase={world.phase} data-wave={world.wave} data-score={world.score} data-run={world.run} data-host={current?.isHost?'true':'false'} data-status={state?.status||'idle'}>
      <div className="game-hud"><div>WAVE<span className="hud-number">{String(world.wave).padStart(2,'0')}</span></div><div className="hud-right">TEAM SCORE<span className="hud-number">{String(world.score).padStart(5,'0')}</span></div></div>
      <div className="crew-strip">{[1,2,3,4].map(number=>{const p=world.players.find(p=>p.number===number&&p.connected)||world.players.find(p=>p.number===number);return <div key={number} className={'crew-seat'+(!p?.connected?' offline':'')} style={{'--pilot-color':COLORS[number-1]}} data-player={number} data-lives={p?.lives??''} data-connected={Boolean(p?.connected)}>{p&&p.id===state?.seat?'YOU':'PILOT '+number}<em>{p?('♥'.repeat(p.lives)||'OUT'):'— — —'}</em></div>;})}</div>
      {connected&&<div className="hud-live">{world.aliens.length} ALIENS · {current.isHost?'YOU HOST':'COOPERATIVE'} · {world.players.filter(p=>p.connected).length}/4</div>}
      {!current&&<div className="game-panel"><div className="eyebrow">ONE SKY. FOUR PILOTS.</div><h1>HOLD THE<br/>LINE.</h1><p>Stop the descending invasion together.<br/>Three lives each. Endless waves.</p><button className="primary" disabled={!createClient} onClick={()=>void join(true)}>CREATE ROOM</button><form className="code-row" onSubmit={e=>{e.preventDefault();void join(false);}}><input aria-label="Room code" placeholder="CODE" maxLength={4} value={code} onChange={e=>{setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''));setNotice('');}}/><button type="submit" disabled={!createClient}>JOIN</button></form><p>A / D or ← / → to move · Space to fire<br/>Or use the controls below.</p>{notice&&<p className="error-text" role="status">{notice}</p>}</div>}
      {current&&!connected&&<div className="game-panel"><div className="eyebrow">FLIGHT CONTROL</div><h2>{state.status==='full'?'Room full':state.status==='error'?'Unable to join':'Connecting…'}</h2><p role="status">{error||'Contacting the relay.'}</p>{['error','full'].includes(state.status)&&<button className="primary" onClick={()=>void join(false,state.code||code)}>RETRY</button>}<button className="secondary" onClick={leave}>RETURN TO LOBBY</button></div>}
      {connected&&world.phase==='lobby'&&!error&&<div className="game-panel"><div className="eyebrow">INVITE YOUR CREW</div><div className="room-code">{state.code}</div><p>1–4 pilots. Friends can join mid-wave.<br/>Three lives per pilot for the whole run.</p>{current.isHost?<button className="primary" disabled={!active} onClick={()=>current.start()}>START DEFENSE</button>:<p>Waiting for the host to start…</p>}<button className="secondary" onClick={()=>void share()}>COPY INVITE LINK</button></div>}
      {connected&&world.phase==='break'&&<div className="game-panel"><div className="eyebrow">SECTOR SECURED</div><h2>WAVE {world.wave} CLEAR</h2><p>Incoming wave {world.wave+1} in {Math.ceil(world.timer/60)}…</p></div>}
      {connected&&world.phase==='defeat'&&<div className="game-panel"><div className="eyebrow">DEFENSE ENDED</div><h2>{world.reason==='Invasion line breached'?'LINE BREACHED':'CREW LOST'}</h2><p>Wave {world.wave} · {world.score} points<br/>Everyone returns with three lives in {Math.ceil(world.timer/60)}…</p></div>}
      {connected&&!state.ready&&!error&&<div className="connection-banner" role="status">Transferring host… Holding the simulation.</div>}
      {connected&&current.error&&<div className="game-panel"><h2>Recovery paused</h2><p className="error-text" role="alert">{current.error}</p><button className="primary" onClick={leave}>RETURN TO LOBBY</button></div>}
      {connected&&local?.lives===0&&world.phase!=='defeat'&&<div className="spectator-note">SPECTATING · Cheer on your crew.<br/>You return when the team restarts.</div>}
      {connected&&<div className="room-meta"><span>{notice||'ROOM '+state.code}</span><button onClick={()=>void share()} aria-label="Copy invite link">INVITE</button><button onClick={leave}>LEAVE</button></div>}
      <div className="invasion-label">LAST LINE OF DEFENSE</div>
      <div className="touch-controls"><div className="touch-move">{[['left','←'],['right','→']].map(([action,label])=><button key={action} aria-label={'Move '+action} disabled={!active||!input.enabled} className={input.value.move===(action==='left'?-1:1)?'pressed':''} {...input.handlers(action)}>{label}</button>)}</div><button aria-label="Fire" disabled={!active||!input.enabled} className={'fire-button'+(input.value.fire?' pressed':'')} {...input.handlers('fire')}>FIRE</button></div>
    </div>}
  </>;
}



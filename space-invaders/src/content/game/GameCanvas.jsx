import { useEffect, useRef, useState } from 'react';
import { createGameRenderer } from './renderer.js';
import { getInitializationMessage } from '../babylon/initialization.js';

export function GameCanvas({ getFrame, onReady }) {
  const host=useRef(null),canvas=useRef(null),frame=useRef(getFrame),ready=useRef(onReady);
  const [message,setMessage]=useState('Initializing WebGPU…');
  const [attempt,setAttempt]=useState(0);
  const [failed,setFailed]=useState(false);
  frame.current=getFrame;ready.current=onReady;
  useEffect(()=>{
    const controller=new AbortController();let dispose,timer;
    setFailed(false);setMessage('Initializing WebGPU…');
    queueMicrotask(async()=>{
      if(controller.signal.aborted)return;
      try{
        dispose=await Promise.race([
          createGameRenderer(canvas.current,host.current,()=>frame.current(),controller.signal),
          new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('WebGPU initialization timed out')),15000);}),
        ]);
        if(!controller.signal.aborted){setMessage('');ready.current?.(true);}
      }catch(error){if(!controller.signal.aborted){console.error('Game renderer initialization failed',error);setMessage(getInitializationMessage(Boolean(navigator.gpu),error));setFailed(true);ready.current?.(false);controller.abort();}}
      finally{clearTimeout(timer);}
    });
    return()=>{clearTimeout(timer);controller.abort();dispose?.();};
  },[attempt]);
  return <div ref={host} className="babylon_content" data-renderer="babylon-lite" data-content-style="2d">
    <canvas ref={canvas} className="babylon_canvas" aria-label="Cooperative alien invasion arena" />
    {message&&<div className="babylon_content_message" role="status"><div><p>{message}</p>{failed&&<><p>Use current Chrome or Edge with graphics acceleration enabled.</p><button onClick={()=>setAttempt(v=>v+1)}>Retry graphics</button></>}</div></div>}
  </div>;
}

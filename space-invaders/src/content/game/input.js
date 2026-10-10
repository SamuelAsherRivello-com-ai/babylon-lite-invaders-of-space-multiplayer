/** Keyboard and independent touch pointers share intent; releasing one never clears another. */
export class InputController {
  constructor(changed) {this.changed=changed;this.keys=new Set();this.pointers=new Map();this.enabled=true;this.value={move:0,fire:false};}
  publish() {
    const held=new Set([...this.keys,...this.pointers.values()]);
    const value=this.enabled?{move:Number(held.has('right'))-Number(held.has('left')),fire:held.has('fire')}:{move:0,fire:false};
    if(value.move!==this.value.move||value.fire!==this.value.fire){this.value=value;this.changed({...value});}
  }
  key(action,pressed){if(pressed)this.keys.add(action);else this.keys.delete(action);this.publish();}
  pointer(id,action,pressed){if(pressed)this.pointers.set(id,action);else this.pointers.delete(id);this.publish();}
  release(){this.keys.clear();this.pointers.clear();this.publish();}
  enable(value){this.enabled=value;if(!value)this.release();this.publish();}
  bind(target=window,doc=document) {
    const actions={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',' ':'fire'};
    const down=e=>{const action=actions[e.key];if(!action||/input|textarea|select/i.test(e.target?.tagName))return;e.preventDefault();this.key(action,true);};
    const up=e=>{const action=actions[e.key];if(action){e.preventDefault();this.key(action,false);}};
    const release=()=>this.release();const visibility=()=>{if(doc.hidden)this.release();};
    target.addEventListener('keydown',down);target.addEventListener('keyup',up);target.addEventListener('blur',release);doc.addEventListener('visibilitychange',visibility);
    return()=>{target.removeEventListener('keydown',down);target.removeEventListener('keyup',up);target.removeEventListener('blur',release);doc.removeEventListener('visibilitychange',visibility);this.release();};
  }
  handlers(action) {
    const release=e=>{e.preventDefault();this.pointer(e.pointerId,action,false);};
    return {onPointerDown:e=>{e.preventDefault();e.currentTarget.setPointerCapture?.(e.pointerId);this.pointer(e.pointerId,action,true);},onPointerUp:release,onPointerCancel:release,onLostPointerCapture:release};
  }
}

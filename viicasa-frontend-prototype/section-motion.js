// Keep real links and full page navigation. Only the four public brand tabs animate.
export const sectionOrder=['/','/shop','/viilife','/viiconcierge'];
const key='vii-section-motion';
export function sectionDirection(from,to){
  const a=sectionOrder.indexOf(from),b=sectionOrder.indexOf(to);
  return a<0||b<0||a===b?0:Math.sign(b-a);
}
export function installSectionMotion(win=window,doc=document){
  let leaving=false,outgoingAnimation=null;
  const reduced=()=>win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clear=()=>{try{win.sessionStorage.removeItem(key);}catch{}};
  const take=()=>{try{const value=JSON.parse(win.sessionStorage.getItem(key)||'null');clear();return value;}catch{clear();return null;}};
  const play=async(element,frames,duration,phase,{hold=false}={})=>{
    doc.documentElement.dataset.sectionMotion=phase;
    const animation=element.animate(frames,{duration,easing:'cubic-bezier(.22,.75,.25,1)',fill:hold?'forwards':'none'});
    if(hold)outgoingAnimation=animation;
    // Bounded fallback: a paused tab or browser animation failure must never block navigation.
    let timer,failed=false;
    try{await Promise.race([animation.finished,new Promise(resolve=>{timer=win.setTimeout(resolve,duration+100);})]);}
    catch{failed=true;/* A cancelled animation still completes navigation. */}
    finally{win.clearTimeout(timer);if(!hold||failed)animation.cancel();delete doc.documentElement.dataset.sectionMotion;}
  };
  doc.addEventListener('click',event=>{
    const link=event.target.closest?.('#navigation a,.preview-header nav a,.wordmark');
    if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.hasAttribute('download')||link.target&&link.target!=='_self'||reduced())return;
    const url=new URL(link.href,win.location.href),direction=sectionDirection(win.location.pathname,url.pathname),feed=doc.querySelector('#feed');
    if(url.origin!==win.location.origin||url.search||url.hash||!direction||!feed?.animate)return;
    if(leaving){event.preventDefault();return;}
    try{win.sessionStorage.setItem(key,JSON.stringify({from:win.location.pathname,to:url.pathname,direction,at:Date.now()}));}catch{return;}
    event.preventDefault();leaving=true;
    const distance=Math.min(win.innerWidth*.07,90)*direction;
    // Stay fully opaque: fading exposed the old dark shell and caused a black flash.
    void play(feed,[{transform:'translateX(0)'},{transform:`translateX(${-distance}px)`}],150,'leaving',{hold:true})
      .catch(()=>{}).finally(()=>win.location.assign(url.href));
  });
  win.addEventListener('pageshow',event=>{leaving=false;outgoingAnimation?.cancel();outgoingAnimation=null;if(event.persisted){clear();delete doc.documentElement.dataset.sectionMotion;}});
  return{
    async enter(){
      const pending=take(),feed=doc.querySelector('#feed');
      const age=pending?Date.now()-pending.at:Infinity;
      if(!pending||!Number.isFinite(age)||age<0||age>8000||pending.to!==win.location.pathname||pending.direction!==sectionDirection(pending.from,pending.to)||reduced()||!feed?.animate)return;
      const distance=Math.min(win.innerWidth*.09,110)*pending.direction;
      await play(feed,[{transform:`translateX(${distance}px)`},{transform:'translateX(0)'}],360,'entering');
    }
  };
}

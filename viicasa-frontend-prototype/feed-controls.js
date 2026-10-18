// Reveal controls on the user's upward gesture, not on CSS snap's final bounce.
// All gesture listeners are passive: native touch scrolling stays in charge.
export function installFeedControls(feed,body,{requestFrame=requestAnimationFrame}={}){
  let previous=feed.scrollTop,intent=0,touchY=null,queued=false;
  const reveal=()=>body.classList.remove('vii-scrolling-down');
  const gesture=direction=>{intent=direction;if(direction<0)reveal();};
  feed.addEventListener('wheel',event=>{
    if(Math.abs(event.deltaY)>Math.abs(event.deltaX||0)&&event.deltaY)gesture(Math.sign(event.deltaY));
  },{passive:true});
  feed.addEventListener('touchstart',event=>{touchY=event.touches[0]?.clientY??null;},{passive:true});
  feed.addEventListener('touchmove',event=>{
    const y=event.touches[0]?.clientY;
    if(y!==undefined&&touchY!==null&&Math.abs(touchY-y)>2)gesture(Math.sign(touchY-y));
    touchY=y??null;
  },{passive:true});
  feed.addEventListener('touchend',()=>{touchY=null;},{passive:true});
  feed.addEventListener('keydown',event=>{
    if(event.target!==feed)return;
    if(['ArrowUp','PageUp','Home'].includes(event.key))gesture(-1);
    if(['ArrowDown','PageDown','End'].includes(event.key))gesture(1);
  });
  feed.addEventListener('focusin',()=>{intent=-1;reveal();});
  feed.addEventListener('scroll',()=>{
    if(queued)return;queued=true;
    requestFrame(()=>{
      const current=feed.scrollTop,delta=current-previous;
      if(current<=160||intent<0||!intent&&delta<-3)reveal();
      else if(intent>0||delta>3)body.classList.add('vii-scrolling-down');
      previous=current;queued=false;
    });
  },{passive:true});
}

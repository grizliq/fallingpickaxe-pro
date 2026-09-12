/* Falling Pickaxe: встроенное демо Pixmove, приманка на фриспины, полоса при уходе от демо */
(function(){
  var f=document.getElementById('demo'); if(!f) return;
  var pv=document.getElementById('demoVideo');
  if(pv){ var tryPlay=function(){ var r=pv.play(); if(r&&r.catch) r.catch(function(){}); }; tryPlay(); ['click','touchstart','scroll','keydown'].forEach(function(ev){ document.addEventListener(ev,function once(){ if(pv.paused) tryPlay(); },{passive:true}); }); }
  var box=f.querySelector('.demo__frame'), start=document.getElementById('demoStart'), load=document.getElementById('demoLoad'),
      fb=document.getElementById('demoFb'), bait=document.getElementById('demoBait'), exit=document.getElementById('exit'),
      API='https://games.pixmove.co/api/games/game/demo/?partnerId=1&gameId=63&hash='+f.getAttribute('data-hash'),
      iframe=null, started=false, shown=0, t=null, lt=null, exitShown=false;
  function showBait(){ if(!started){ t=setTimeout(showBait,15000); return; } bait.hidden=false; shown++; }
  function hideBait(){ bait.hidden=true; clearTimeout(t); t=setTimeout(showBait, shown<2?90000:180000); }
  function fail(){ clearTimeout(lt); load.hidden=true; fb.hidden=false; started=false; }
  function mount(url){
    iframe=document.createElement('iframe'); iframe.className='demo__iframe'; iframe.title='Falling Pickaxe демо';
    iframe.allow='autoplay; fullscreen'; iframe.setAttribute('allowfullscreen','');
    iframe.addEventListener('load',function(){ clearTimeout(lt); load.hidden=true; started=true; clearTimeout(t); t=setTimeout(showBait,28000); });
    var v=document.getElementById('demoVideo'); if(v){ try{v.pause();}catch(e){} v.remove(); }
    iframe.src=url; box.insertBefore(iframe, box.firstChild);
    lt=setTimeout(function(){ if(!started) fail(); },15000);
  }
  function run(){
    if(iframe) return; start.hidden=true; fb.hidden=true; load.hidden=false;
    fetch(API,{mode:'cors'}).then(function(r){return r.json();}).then(function(j){
      if(!j||j.status!=='success'||!j.data||!j.data.gameUrl) throw new Error('no url');
      var u=new URL(j.data.gameUrl); u.searchParams.set('lang','ru'); mount(u.href);
    }).catch(fail);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-demo-start]'),function(b){
    b.addEventListener('click',function(e){ e.preventDefault(); f.scrollIntoView({behavior:'smooth',block:'center'}); run(); });
  });
  var full=document.getElementById('demoFull');
  if(full) full.addEventListener('click',function(){ var el=box, rf=el.requestFullscreen||el.webkitRequestFullscreen; if(rf) rf.call(el); });
  Array.prototype.forEach.call(bait.querySelectorAll('[data-bait-close]'),function(b){ b.addEventListener('click',hideBait); });
  if(exit && 'IntersectionObserver' in window){
    new IntersectionObserver(function(en){
      if(started && !exitShown && !en[0].isIntersecting){ exitShown=true; exit.hidden=false; }
    },{threshold:0}).observe(box);
    exit.querySelector('[data-exit-close]').addEventListener('click',function(){ exit.hidden=true; });
  }
})();

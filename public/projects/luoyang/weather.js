import {WEATHER_URL,weatherNames,parseWeather,weatherEffect} from './weather-data.js';
const host=document.createElement('div');
host.className='weather-wrap';
host.innerHTML=`<div class="weather-atmosphere" aria-hidden="true"></div><div class="weather-particles" aria-hidden="true"></div>
 <aside class="weather-control" aria-label="洛阳天气"><p id="weather-label" aria-live="polite">洛阳 · 候天时</p></aside>`;
document.body.append(host);
const badge=host.querySelector('#weather-label'),particles=host.querySelector('.weather-particles');
let live=null,failed=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Retire preview links: all visits now follow Luoyang weather automatically.
const url=new URL(location.href);
if(url.searchParams.has('weather')){url.searchParams.delete('weather');history.replaceState(null,'',url);}
function paint(){
 const kind=weatherEffect(live?.kind);
 host.dataset.weather=kind;
 badge.textContent=live?`洛阳 · ${weatherNames[live.kind]} · ${live.temperature}℃`:failed?'洛阳 · 天气暂缺':'洛阳 · 候天时';
 badge.title=live?`${live.time.replace('T',' ')}（北京时间）${failed?' · 更新暂未成功':''}`:'正在读取洛阳天气';
 particles.replaceChildren();
 if(!['snow','rain'].includes(kind))return;
 const count=reduced.matches?16:kind==='snow'?(innerWidth<700?42:80):(innerWidth<700?65:120);
 const fragment=document.createDocumentFragment();
 for(let i=0;i<count;i++){
  const flake=document.createElement('i');
  // Depth separates fine distant rain from softer, longer foreground streaks.
  const depth=Math.random(),size=kind==='snow'?1.5+depth*4:.55+depth*.55;
  flake.style.cssText=`--x:${Math.random()*100}%;--y:${Math.random()*100}%;--size:${size}px;--length:${12+depth*25}px;--alpha:${kind==='snow'?.28+depth*.5:.18+depth*.32};--duration:${kind==='snow'?12+(1-depth)*16:.85+(1-depth)*1.1}s;--delay:-${Math.random()*30}s;--drift:${30+Math.min(live?.wind||5,25)*3+Math.random()*55}px;--sway:${15+Math.random()*35}px`;
  fragment.append(flake);
 }
 particles.append(fragment);
}
reduced.addEventListener('change',paint);
const cacheKey='luoyang-weather-v1';
const chinaDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
async function refreshWeather(){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
 try{
  const response=await fetch(WEATHER_URL,{signal:controller.signal});
  if(!response.ok)throw new Error('Weather unavailable');
  const payload=await response.json(),reading=parseWeather(payload);
  if(reading.time.slice(0,10)!==chinaDate())throw new Error('Outdated weather');
  live=reading;failed=false;
  try{localStorage.setItem(cacheKey,JSON.stringify({saved:Date.now(),payload}));}catch{}
 }catch{failed=true;}finally{clearTimeout(timeout);paint();}
}
try{
 const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');
 if(cached&&Date.now()-cached.saved>=0&&Date.now()-cached.saved<20*60*1000){
  const reading=parseWeather(cached.payload);
  if(reading.time.slice(0,10)===chinaDate())live=reading;
 }
}catch{}
paint();
if(!live)refreshWeather();
// At most one request every 20 minutes per visible tab; refresh when returning after a long visit.
let lastRefresh=Date.now();
setInterval(()=>{if(!document.hidden){lastRefresh=Date.now();refreshWeather();}},20*60*1000);
document.addEventListener('visibilitychange',()=>{host.classList.toggle('weather-sleep',document.hidden);if(!document.hidden&&Date.now()-lastRefresh>=20*60*1000){lastRefresh=Date.now();refreshWeather();}});

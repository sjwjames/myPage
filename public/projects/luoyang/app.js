import {sites, regions, sources, poem, resolveRoute} from './data.js';
import {mapArt,sceneArt,sceneAspect} from './art.js';
import {scenePaintings} from './paintings.js';
import {createSceneTransition} from './transitions.js';

const $=s=>document.querySelector(s);
const app=$('#app');
let region='全城', route, revealTimer, zoom=1, pan={x:0,y:0}, visited=new Set();
try { visited=new Set(JSON.parse(localStorage.getItem('luoyang-visited')||'[]')); } catch {}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),4500);}
const href=(site,space='courtyard')=>`#/site/${site.id}/${space}`;
function stamp(text){return `<span class="small-seal">${text}</span>`;}
const warmedPaintings=new Set();
function warmPainting(file){
 if(!file||warmedPaintings.has(file))return;
 warmedPaintings.add(file);const image=new Image();image.src=`./assets/${file}`;
}
function warmNextScenes(site,space){
 for(const [id] of space.hotspots)warmPainting(id==='echo'?'echo-chamber-v2.jpg':scenePaintings[`${site.id}/${id}`]?.file);
}

function render(){
 clearInterval(revealTimer);window.scrollTo(0,0);route=resolveRoute(location.hash);
 document.body.classList.toggle('night',route.type==='echo');
 document.body.classList.toggle('inside',route.type==='scene'&&['gate','hall','scripture'].includes(route.space.kind));
 $('#map-nav').classList.toggle('active',route.type==='map');
 if(route.site){visited.add(route.site.id);try{localStorage.setItem('luoyang-visited',JSON.stringify([...visited]));}catch{}}
 if(route.type==='map')renderMap();else if(route.type==='echo')renderEcho();else renderScene();
 updateSource();syncAudio();
 document.title=route.type==='map'?'洛阳伽蓝 · 墨游北魏':`${route.site.name} · ${route.type==='echo'?'幽庭终章':route.space.name}｜洛阳伽蓝`;
 app.querySelector('h1')?.focus({preventScroll:true});
}
function renderMap(){
 app.innerHTML=`<section class="map-page"><div class="page-intro"><p class="eyebrow">杨 衒 之 笔 下 的 洛 阳</p><h1 tabindex="-1">一城烟雨<br>千载伽蓝<span class="title-dot">。</span></h1><p class="intro-copy">循一卷旧记，入一座故城。<br>在塔影、槐荫与风铎之间，<br>寻回北魏洛阳的片刻繁华。</p><a class="text-link featured" href="${href(sites[0])}">由永宁寺入城 <span>↗</span></a><div class="era-note">北魏 · 洛阳<small>公元 494—534 年的城市记忆</small></div></div>
 <div class="map-canvas" id="map-canvas">${mapArt(sites,region,visited)}</div>
 <div class="map-topline"><span>洛阳故城 · 游览图</span><span class="compass">↑ 北</span></div>
 <div class="map-controls" aria-label="地图缩放"><button id="zoom-in" aria-label="放大地图">＋</button><button id="zoom-out" aria-label="缩小地图">－</button><button id="reset-map" aria-label="复位地图">⌖</button></div>
 <div class="map-footer"><div class="region-tabs" role="group" aria-label="按城区筛选">${regions.map(r=>`<button data-region="${r}" class="${r===region?'selected':''}" aria-pressed="${r===region}">${r}</button>`).join('')}</div><p>点寺名入境 <span>·</span> 拖动留白移图 <span>·</span> 滚轮缩放</p><div class="map-legend"><span><i class="legend-dot"></i> 可游寺院</span><span>已访 ${visited.size} / ${sites.length}</span><button id="map-note">复原说明 ↗</button></div></div>
 </section>`;
 app.querySelectorAll('[data-region]').forEach(b=>b.onclick=()=>{region=b.dataset.region;renderMap();});
 $('#zoom-in').onclick=()=>setZoom(zoom*1.2);$('#zoom-out').onclick=()=>setZoom(zoom/1.2);
 $('#reset-map').onclick=()=>{zoom=1;pan={x:0,y:0};transformMap();};$('#map-note').onclick=()=>$('#source-dialog').showModal();
 const svg=$('#map-canvas svg');let drag=null;
 svg.addEventListener('wheel',e=>{e.preventDefault();setZoom(zoom*(e.deltaY<0?1.1:.9));},{passive:false});
 svg.addEventListener('pointerdown',e=>{if(e.target.closest('a'))return;drag={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};svg.setPointerCapture(e.pointerId);});
 svg.addEventListener('pointermove',e=>{if(!drag)return;const r=svg.getBoundingClientRect();const ratio=Math.max(1400/r.width,900/r.height);pan={x:drag.px+(e.clientX-drag.x)*ratio,y:drag.py+(e.clientY-drag.y)*ratio};transformMap();});
 svg.addEventListener('pointerup',()=>drag=null);svg.addEventListener('pointercancel',()=>drag=null);transformMap();
}
function setZoom(z){zoom=Math.min(2.5,Math.max(.8,z));transformMap();}
function transformMap(){const world=$('#map-world');if(world)world.setAttribute('transform',`translate(${pan.x} ${pan.y}) translate(700 450) scale(${zoom}) translate(-700 -450)`);}
function renderScene(){
 const {site,space}=route;
 warmNextScenes(site,space);
 const path=space.id==='courtyard'?[]:[`<a href="${href(site)}">寺院</a>`];
 app.innerHTML=`<section class="scene-page ${space.kind==='gate'?'gate-scene':''}"><div class="scene-art"><div class="scene-stage" style="--scene-aspect:${sceneAspect(site,space)}">${sceneArt(site,space)}<div class="hotspots">${space.hotspots.map(([id,name,x,y])=>`<a class="hotspot ${id==='echo'?'echo-hotspot':''}" href="${href(site,id)}" style="--x:${x}%;--y:${y}%"><span class="hotspot-ring"></span><span>${name} <b>↗</b></span></a>`).join('')}</div></div></div>
 <div class="scene-copy"><div class="breadcrumbs"><a href="#/map">洛阳</a><span>／</span>${path.length?`<a href="${href(site)}">${site.name}</a><span>／</span>`:''}<span>${path.length?space.name:site.name}</span></div><p class="eyebrow">卷${['','一','二','三','四','五'][site.volume]} · ${site.region}</p><h1 tabindex="-1">${site.name}<small>${space.name}</small></h1><div class="vertical-rule"></div><h2>${space.title}</h2><p class="scene-description">${space.text}</p><blockquote>「${space.quote}」</blockquote><button class="source-link" id="scene-source">${stamp('记')} 原文与复原依据 ↗</button></div>
 <div class="scene-bottom"><a class="back-link" href="${space.id==='courtyard'?'#/map':href(site)}">← ${space.id==='courtyard'?'回到洛阳':'返回寺院'}</a><span class="scene-hint">${space.hotspots.length?'轻点画中标记，循迹深入':'驻足片刻，听风过伽蓝'}</span><button id="scene-menu">此寺游径 ☷</button></div>
 <div class="space-drawer" id="space-drawer" hidden>${site.spaces.map(s=>`<a class="${s.id===space.id?'current':''}" href="${href(site,s.id)}">${s.name}<span>↗</span></a>`).join('')}${site.id==='yongning'?`<a href="${href(site,'echo')}">门楼旧事<span>烛</span></a>`:''}</div>
 </section>`;
 $('#scene-source').onclick=()=>$('#source-dialog').showModal();
 $('#scene-menu').onclick=()=>{$('#space-drawer').hidden=!$('#space-drawer').hidden;$('#scene-menu').setAttribute('aria-expanded',!$('#space-drawer').hidden);};
}
function renderEcho(){
 app.innerHTML=`<section class="echo-page"><img class="echo-painting" src="./assets/echo-chamber-v2.jpg" alt="月光与烛光中的幽室水墨意象" decoding="async"><div class="echo-candle-glow" aria-hidden="true"></div>
 <div class="echo-heading"><p class="eyebrow">永 安 三 年 · 从 洛 阳 到 晋 阳</p><h1 tabindex="-1">幽庭，岂复光</h1><p>北魏孝庄帝 · 元子攸</p></div>
 <div class="poem" aria-label="元子攸临终五言诗">${poem.map((line,i)=>`<p class="poem-line" data-line="${i}">${line.replace('。','').split('，').map(t=>`<span>${t}</span>`).join('')}</p>`).join('')}</div>
 <div class="echo-context"><span class="small-seal">史</span><p>永宁寺门楼，是幽禁之处。晋阳三级寺，是生命的终点。<br>此诗录于《洛阳伽蓝记》卷一；烛火与幽室，是后人的追想。</p><button id="echo-source">读原文 ↗</button></div>
 <div class="scene-bottom"><a class="back-link" href="${href(route.site,'gate')}">← 返回门楼</a><div class="poem-controls"><button id="replay-poem">重读</button><button id="show-poem">显示全诗</button></div><span class="echo-music">配乐 · Hiraeth</span></div></section>`;
 let next=0;const lines=[...app.querySelectorAll('.poem-line span')];
 const step=()=>{if(next>=lines.length){clearInterval(revealTimer);return;}lines[next++].classList.add('revealed');};
 const replay=()=>{$('.poem').classList.remove('instant');clearInterval(revealTimer);next=0;lines.forEach(l=>l.classList.remove('revealed'));if(matchMedia('(prefers-reduced-motion: reduce)').matches){lines.forEach(l=>l.classList.add('revealed'));return;}step();revealTimer=setInterval(step,1700);};
 $('#replay-poem').onclick=replay;$('#show-poem').onclick=()=>{$('.poem').classList.add('instant');clearInterval(revealTimer);lines.forEach(l=>l.classList.add('revealed'));};$('#echo-source').onclick=()=>$('#source-dialog').showModal();replay();
}
function updateSource(){
 const {site,space,type}=route;
 const mapText=`<p>以杨衒之《洛阳伽蓝记》为主要文字依据，按城内、城东、城南、城西、城北组织游览。本版含六寺，永宁寺游览最深。</p><h3>如何读这幅城图</h3><p>这是跨年份的文学游览示意，不是某一年同时存在的城市实测图。区域与相对方位参考原书；道路、寺址间距、城郭比例与建筑外观作艺术化处理。寺院画面亦不代表考古定论。</p><p>后续可用城址考古资料细化平面与尺度；当前不将想象补绘标为考古复原。</p>`;
 let content=mapText;
 if(site){
  const quote=type==='echo'?'鎖帝於寺門樓上。……遂囚帝還晉陽，縊於三級寺。帝臨崩禮佛，願不為國王。又作五言曰……':space.quote;
  content=`<p class="eyebrow">${site.name} · ${type==='echo'?'幽庭终章':space.name}</p><h3>原文依据</h3><blockquote>${quote}</blockquote><p>${site.position}</p><h3>复原边界</h3><p>${type==='echo'?'门楼幽禁、押往晋阳、三级寺遇害及诗文均见卷一永宁寺条。书中未明确幽禁门楼的方位，南门楼仅作叙事入口；幽室、月光、烛火与诗句逐现为艺术想象，终章不代表永宁寺内的临终现场。':space.evidence}</p>${type==='echo'?'<p>诗文按四库全书本“思鸟吟青松”录入，保留原字，标点由本项目添加。“临终诗”为便于阅读所用的说明性名称，原书只称“五言”。</p>':''}`;
 }
 $('#source-content').innerHTML=`${content}<a class="text-link" href="${sources[site?.volume||1]}" target="_blank" rel="noopener">打开《洛阳伽蓝记》${site?'对应卷':'卷一'}原文 ↗</a><details><summary>文字、画面、字体与天气</summary><p>天气数据来自 <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>，遵循 <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>。以北京时间读取洛阳当前模型天气；雨雪之外统一使用晴景。</p><p>古籍文字为原书节录；城图、各寺及内层场景统一采用水墨插画；具体形象含合理复原与艺术想象。全站文字使用王汉宗中魏碑简体，并补全简体字符映射，字形轮廓保持不变；字体遵循 GNU GPL v2 或更新版本。</p><a href="./assets/GPL-2.0.txt" target="_blank" rel="noopener">字体许可</a> · <a href="./assets/weibei-font-source.zip" download>字体构建源文件</a> · <a href="https://github.com/cghio/wangfonts" target="_blank" rel="noopener">字体来源</a><p>各寺原书：${Object.entries(sources).map(([n,url])=>`<a href="${url}" target="_blank" rel="noopener">卷${n}</a>`).join(' · ')}</p></details>`;
}
function showCatalog(){
 $('#catalog-content').innerHTML=regions.slice(1).map(r=>`<section class="catalog-region"><h3>${r}</h3>${sites.filter(s=>s.region===r).map(s=>`<a class="catalog-item" href="${href(s)}"><span>${s.name}<small>${s.subtitle}</small></span><span>${visited.has(s.id)?'已访':'入境'} ↗</span></a>`).join('')}</section>`).join('');
 $('#catalog-content').querySelectorAll('a').forEach(a=>a.onclick=()=>$('#catalog-dialog').close());$('#catalog-dialog').showModal();
}
$('#catalog-button').onclick=showCatalog;$('#source-button').onclick=()=>$('#source-dialog').showModal();$('#sound-button').onclick=()=>$('#sound-dialog').showModal();
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}));
const changeScene=createSceneTransition(app);
window.addEventListener('hashchange',()=>{
 const next=resolveRoute(location.hash);
 if(next.type===route.type&&next.site?.id===route.site?.id&&next.space?.id===route.space?.id)return;
 changeScene(render);
});
window.addEventListener('keydown',e=>{if(e.key!=='Escape'||document.querySelector('dialog[open]'))return;if(route.type==='echo')location.hash=href(route.site,'gate');else if(route.type==='scene')location.hash=route.space.id==='courtyard'?'#/map':href(route.site);});

// Try bundled music on entry; retry blocked playback on the first trusted interaction.
const audio={city:$('#city-track'),easter:$('#easter-track')};
const trackNames={city:'金陵遗梦',easter:'Hiraeth'};
let enabled=true, waitingForGesture=false, activeTrack='city', volume=.45, audioRevision=0;
Object.values(audio).forEach(a=>{a.loop=true;a.volume=volume;a.addEventListener('error',()=>{if(a===audio[activeTrack]){$('#audio-status').textContent='配乐暂时无法播放，请刷新页面重试。';toast('配乐暂时无法播放。');}});});
function fadeAudio(track,target,duration,revision){
 const start=performance.now(),initial=track.volume;
 return new Promise(resolve=>{
  const step=now=>{
   if(revision!==audioRevision){resolve(false);return;}
   const progress=Math.min(1,(now-start)/duration);
   track.volume=initial+(target-initial)*progress;
   if(progress<1)requestAnimationFrame(step);else resolve(true);
  };requestAnimationFrame(step);
 });
}
function updateMusicToggle(){
 const playing=enabled&&!waitingForGesture;
 $('#sound-toggle').setAttribute('aria-pressed',String(playing));
 $('#sound-toggle').setAttribute('aria-label',playing?'暂停音乐':'开启音乐');
 $('#sound-toggle').title=playing?'暂停音乐':'开启音乐';
}
async function syncAudio(){
 const revision=++audioRevision;
 activeTrack=route?.type==='echo'?'easter':'city';
 const current=audio[activeTrack];
 updateMusicToggle();
 $('#toggle-audio').textContent=enabled&&!waitingForGesture?'暂停音乐':'开启音乐';
 $('#sound-label').textContent=`${trackNames[activeTrack]} · ${enabled?'播放':'暂停'}`;
 if(!enabled){waitingForGesture=false;Object.values(audio).forEach(a=>a.pause());$('#audio-status').textContent='配乐已暂停，点击开启音乐即可继续。';return;}
 // Fade the outgoing track to silence before starting the next; interrupted transitions are cancelled.
 for(const a of Object.values(audio))if(a!==current){
  if(!a.paused&&!(await fadeAudio(a,0,650,revision)))return;
  if(revision!==audioRevision)return;
  a.pause();
 }
 if(revision!==audioRevision)return;
 if(!current.paused){waitingForGesture=false;current.volume=volume;$('#audio-status').textContent=`正在播放${activeTrack==='city'?'城中':'幽庭'}配乐 · ${trackNames[activeTrack]}。`;return;}
 current.volume=0;
 try{
  await current.play();
  if(revision!==audioRevision){if(!enabled||current!==audio[activeTrack])current.pause();return;}
  waitingForGesture=false;updateMusicToggle();$('#toggle-audio').textContent='暂停音乐';
  $('#audio-status').textContent=`正在播放${activeTrack==='city'?'城中':'幽庭'}配乐 · ${trackNames[activeTrack]}。`;
  await fadeAudio(current,volume,1100,revision);
 }catch(error){
  if(revision!==audioRevision)return;
  waitingForGesture=error.name==='NotAllowedError';
  $('#sound-label').textContent=waitingForGesture?'听风 · 轻触启奏':'听风 · 暂不可用';
  $('#audio-status').textContent=waitingForGesture?'轻触页面任意处，配乐将随游览响起。':'配乐暂时无法播放，请刷新页面重试。';
  if(!waitingForGesture)enabled=false;
  updateMusicToggle();$('#toggle-audio').textContent='开启音乐';
 }
}
function toggleMusic(){enabled=waitingForGesture||!enabled;waitingForGesture=false;syncAudio();}
$('#toggle-audio').onclick=toggleMusic;
$('#sound-toggle').onclick=toggleMusic;
function resumeBlockedMusic(event){
 if(!event.isTrusted||!enabled||!waitingForGesture||event.target.closest?.('#toggle-audio, #sound-toggle'))return;
 if(event.type==='keydown'&&!['Enter',' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;
 waitingForGesture=false;syncAudio();
}
document.addEventListener('pointerdown',resumeBlockedMusic,{capture:true});
document.addEventListener('keydown',resumeBlockedMusic,{capture:true});
$('#volume').oninput=e=>{volume=Number(e.target.value);syncAudio();};
window.addEventListener('pagehide',()=>{++audioRevision;Object.values(audio).forEach(a=>a.pause());});
window.addEventListener('pageshow',event=>{if(event.persisted)syncAudio();});
render();

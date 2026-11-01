// Shared ink bloom transition, approximately 1.5 seconds for every scene.
export function createSceneTransition(app){
 let revision=0,animations=[],layers=[];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function clean(){
  animations.forEach(a=>a.cancel());animations=[];
  layers.forEach(n=>n.remove());layers=[];
  app.style.removeProperty('opacity');app.style.removeProperty('transform');app.style.removeProperty('will-change');
 }
 async function animate(node,frames,duration){
  const a=node.animate(frames,{duration,easing:'cubic-bezier(.3,0,.2,1)',fill:'both'});
  animations.push(a);await a.finished.catch(()=>{});
 }
 function layer(className){const n=document.createElement('div');n.className=`scene-transition ${className}`;n.setAttribute('aria-hidden','true');n.inert=true;document.body.append(n);layers.push(n);return n;}
 return async function change(render){
  const token=++revision;clean();
  if(reduced.matches){app.removeAttribute('aria-busy');render();return;}
  app.setAttribute('aria-busy','true');app.style.willChange='opacity,transform';
  try{
    const veil=layer('transition-ink');
    for(let i=0;i<4;i++){const bloom=document.createElement('i');bloom.className=`ink-bloom bloom-${i}`;veil.append(bloom);}
    await Promise.all([...veil.children].map((n,i)=>animate(n,[{transform:'scale(0)',opacity:0},{transform:'scale(3.8)',opacity:1}],720+i*20)));
    if(token!==revision)return;render();
    await animate(veil,[{opacity:1},{opacity:0}],720);
  }finally{if(token===revision){clean();app.removeAttribute('aria-busy');}}
 };
}

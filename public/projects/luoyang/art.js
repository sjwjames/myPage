import {scenePaintings} from './paintings.js?v=20261101-towers';
function svg(content,label){return `<svg class="ink-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" role="group" aria-label="${label}">${content}</svg>`;}
export function mapArt(sites,region,visited){
 const markers=sites.map(site=>`<a class="map-site ${region!=='全城'&&region!==site.region?'muted':''}" href="#/site/${site.id}/courtyard" aria-label="游览${site.name}，${site.region}"><title>${site.name} · ${site.subtitle}</title><g transform="translate(${site.x} ${site.y})"><circle class="pin-halo" cy="30" r="16"/><circle class="pin" cy="30" r="4"/><path d="M0 34v14" stroke="#984d3d" stroke-width="1" opacity=".6"/><rect class="label-paper" x="-49" y="48" width="98" height="35"/><text class="site-label" text-anchor="middle" y="72">${site.name}</text>${visited.has(site.id)?'<text class="visited-mark" x="47" y="47">✓</text>':''}</g></a>`).join('');
 return svg(`<defs><linearGradient id="map-xfade"><stop stop-color="black"/><stop offset=".12" stop-color="white"/><stop offset=".94" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient><linearGradient id="map-yfade" x2="0" y2="1"><stop stop-color="black"/><stop offset=".1" stop-color="white"/><stop offset=".9" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient><mask id="map-mask-x" maskUnits="userSpaceOnUse" x="0" y="0" width="1400" height="900"><rect width="1400" height="900" fill="url(#map-xfade)"/></mask><mask id="map-mask-y" maskUnits="userSpaceOnUse" x="0" y="0" width="1400" height="900"><rect width="1400" height="900" fill="url(#map-yfade)"/></mask></defs><g id="map-world"><g mask="url(#map-mask-y)"><image href="./assets/map-historical-v3.jpg" x="0" y="0" width="1400" height="900" style="mix-blend-mode:multiply" mask="url(#map-mask-x)"/></g>${markers}</g>`,'北魏洛阳水墨游览示意图，寺院名称可点击进入').replace('role="img"','role="group"');
}

export function sceneAspect(site,space){
 const painting=scenePaintings[`${site.id}/${space.id}`];
 return painting.aspect || '14/9';
}
export function sceneArt(site,space){
 const painting=scenePaintings[`${site.id}/${space.id}`];
 if(!painting) throw new Error(`Missing ink painting: ${site.id}/${space.id}`);
 return `<div class="painted-frame${painting.detail?' pagoda-detail':''}"><img class="ink-art painted-art" src="./assets/${painting.file}" alt="${site.name} · ${space.name}水墨艺术复原场景" decoding="async"></div>`;
}

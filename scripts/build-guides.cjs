const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content/guides.json'), 'utf8'));
const lessons = JSON.parse(fs.readFileSync(path.join(root,'content/guide-lessons.json'),'utf8'));
for (const name of ['lesson-translations.json','lesson-more-languages.json']) {
 Object.assign(lessons.locales, JSON.parse(fs.readFileSync(path.join(root,'content',name),'utf8')));
}
const info = JSON.parse(fs.readFileSync(path.join(root,'content/site-info.json'),'utf8'));
const settings = JSON.parse(fs.readFileSync(path.join(root,'content/site-settings.json'),'utf8'));
// Ads are deliberately off until real account details and a consent integration exist.
if(settings.ads.enabled && (!/^ca-pub-\d{16}$/.test(settings.ads.publisherId||'') ||
 !/^\d+$/.test(settings.ads.slotId||'') || !settings.ads.consentIntegrationReady ||
 !settings.ads.privacyReviewComplete)) throw Error('Advertising requires real IDs, consent integration and privacy review.');
for (const name of ['guide-translations.json','guide-southeast-asia.json','guide-th-hi.json']) {
 Object.assign(data.locales, JSON.parse(fs.readFileSync(path.join(root,'content',name),'utf8')));
}
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'dist/i18n.js'),'utf8') + ';this.translations=I18N;', sandbox);
const app = fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
vm.runInContext(app.slice(0, app.indexOf('const LOCALES')) + ';this.rows=groups.flatMap(g=>g[3]);',sandbox);
const rows = sandbox.rows;
const locales = [['zh-Hans','简体中文'],['ja','日本語'],['zh-Hant','繁體中文'],['en','English'],['fil','Filipino'],['vi','Tiếng Việt'],['id','Bahasa Indonesia'],['th','ไทย'],['hi','हिन्दी'],['ko','한국어']];
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url = (locale,id) => `/guides/${locale}/${id ? id+'.html':'index.html'}`;
const infoUrl = (locale,id) => `/info/${locale}/${id}.html`;
const infoIds = ['about','contact','privacy'];
const footerLinks = locale => `<div class="footer-links">${infoIds.map((id,i)=>`<a href="${infoUrl(locale,id)}">${esc(info[locale].nav[i])}</a>`).join('')}</div>`;
function lessonHtml(locale,index) {
 const c=lessons.locales[locale], l=c.labels, a=c.lessons[index];
 if(l.length!==11||a.length!==5||a[0].length!==3||a[1].length!==3||a[3].length!==2||a[4].length!==2||
 a.flat(2).some(x=>typeof x!=='string'||!x.trim()))throw Error('Incomplete lesson: '+locale+'/'+index);
 const section=(title,body,cls='')=>`<section class="${cls}"><h2>${esc(title)}</h2>${body}</section>`;
 const steps=section(l[0],`<ol class="reading-steps">${a[0].map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`);
 const examples=section(l[1],`<p class="reading-caption">${esc(l[10])}</p><div class="sign-examples">${lessons.signs[index].map((s,j)=>`<div class="sign-example"><div class="example-sign" lang="ko">${esc(s)}</div><p>${esc(a[1][j])}</p></div>`).join('')}</div>`);
 const counter=section(l[2],`<p>${esc(a[2])}</p>`,'reading-counter');
 const checks=section(l[3],a[3].map((prompt,j)=>{
  const choices=j===0?lessons.options[index]:[l[8],l[9]], correct=lessons.correct[index][j];
  return `<div class="guide-check" data-correct="${correct}" data-success="${esc(l[6])}" data-retry="${esc(l[7])}"><fieldset><legend>${j+1}. ${esc(prompt)}</legend>${choices.map((option,k)=>`<label class="check-option"><input type="radio" name="check-${j}" value="${k}"><span${j===0?' lang="ko"':''}>${esc(option)}</span></label>`).join('')}</fieldset><button class="primary check-button" type="button" data-check hidden>${esc(l[4])}</button><p class="check-feedback" aria-live="polite"></p><details><summary>${esc(l[5])}</summary><p>${esc(a[4][j])}</p></details></div>`;
 }).join(''),'reading-checks');
 return steps+examples+counter+checks;
}
const favicon = fs.readFileSync(path.join(root,'dist/index.html'),'utf8').match(/<link rel="icon"[^>]+>/)[0];
const sceneTiles={'약국':0,'편의점':1,'카페':2,'식당':4,'지하철':5,'휴무':23};
function scene(g){const tile=sceneTiles[g.scene];return `<div class="context-scene scene-tile" style="--scene-x:${tile%4/3*100}%;--scene-y:${Math.floor(tile/4)/5*100}%" role="img" aria-label="${esc(g.scene)}"><span class="attached-sign" lang="ko">${esc(g.scene)}</span></div>`;}
function word(locale,hangul){const i=rows.findIndex(r=>r[0]===hangul);if(i<0)throw Error(hangul);const row=rows[i];return {hangul,reading:row[1],meaning:locale==='en'?row[2]:locale==='ko'?row[3]:sandbox.translations[locale].words[i]};}
function card(locale,g,index){const a=data.locales[locale].articles[index];return `<a class="reading-card" href="${url(locale,g.id)}"><span class="reading-number">${String(index+1).padStart(2,'0')}</span><span><h3>${esc(a[0])}</h3><p>${esc(a[1])}</p><span class="reading-arrow" aria-hidden="true">↗</span></span></a>`;}
function document(locale,id,title,description,body,kind='guide'){const l=data.locales[locale].labels;const route=kind==='info'?infoUrl:url;return `<!doctype html><html lang="${locale}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — SignToki</title><meta name="description" content="${esc(description)}">${favicon}<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/redesign.css"><link rel="stylesheet" href="/guides.css">${locales.filter(([code])=>data.locales[code]).map(([code])=>`<link rel="alternate" hreflang="${code}" href="${route(code,id)}">`).join('')}</head><body><header><a class="brand" href="/?lang=${locale}"><span class="mark">ㅅ</span>SignToki</a><nav><a href="/?lang=${locale}">${esc(l[16])}</a><a class="${kind==='guide'?'nav-active':''}" href="${url(locale)}">${esc(l[0])}</a><label class="language"><span class="sr-only">${esc(l[15])}</span><select aria-label="${esc(l[15])}" id="guideLanguage">${locales.filter(([code])=>data.locales[code]).map(([code,name])=>`<option value="${route(code,id)}" ${code===locale?'selected':''}>${name}</option>`).join('')}</select></label></nav></header><main class="reading-main">${body}</main><footer><a class="brand small" href="/?lang=${locale}">SignToki</a><span>${esc(l[12])}</span>${footerLinks(locale)}</footer><script src="/guide-page.js" defer></script></body></html>`;}
for(const [locale] of locales){
  const content=data.locales[locale];if(!content)continue;
  if(content.articles.length!==data.guides.length||content.labels.length!==19)throw Error('Incomplete content: '+locale);
  const dir=path.join(root,'dist/guides',locale);fs.mkdirSync(dir,{recursive:true});const l=content.labels;
  const hub=`<div class="reading-heading"><div class="eyebrow">${esc(l[0])}</div><h1>${esc(l[1])}</h1><p>${esc(l[2])}</p></div><div class="reading-cards">${data.guides.map((g,i)=>card(locale,g,i)).join('')}</div><section class="reading-method"><h2>${esc(l[13])}</h2><p>${esc(l[12])}</p><a href="/?lang=${locale}&view=guide#word-collection">${esc(l[14])} →</a></section>`;
  fs.writeFileSync(path.join(dir,'index.html'),document(locale,null,l[0],l[2],hub));
  data.guides.forEach((g,i)=>{
    const a=content.articles[i];if(a.length!==6||a.some(x=>!x))throw Error('Incomplete article: '+locale+'/'+g.id);
    const words=g.words.map(w=>word(locale,w));
    const body=`<a class="reading-back" href="${url(locale)}">← ${esc(l[9])}</a><article class="reading-article"><div class="reading-hero"><div><div class="eyebrow">${esc(l[0])} / ${String(i+1).padStart(2,'0')}</div><h1>${esc(a[0])}</h1><p class="reading-deck">${esc(a[1])}</p><p class="reading-date"><time datetime="2026-10-02">${esc(l[18])}</time></p></div>${scene(g)}</div><div class="reading-columns"><div class="reading-prose"><section><h2>${esc(l[3])}</h2><p>${esc(a[2])}</p></section><section><h2>${esc(l[4])}</h2><p>${esc(a[3])}</p></section><section class="reading-example"><h2>${esc(l[5])}</h2><p>${esc(a[4])}</p></section>${lessonHtml(locale,i)}<section><h2>${esc(l[6])}</h2><p>${esc(a[5])}</p><a class="primary reading-play" href="/?lang=${locale}&set=${g.set}&play=1">${esc(l[8])} →</a></section></div><aside class="reading-words"><h2>${esc(l[7])}</h2>${words.map(w=>`<div class="reading-word"><div><strong lang="ko">${esc(w.hangul)}</strong><small>${esc(w.reading)}</small><span>${esc(w.meaning)}</span></div><button class="text-button" data-speak="${esc(w.hangul)}" aria-label="${esc(l[17])}: ${esc(w.hangul)}">♪</button></div>`).join('')}</aside></div></article><section class="reading-related"><h2>${esc(l[10])}</h2><div class="reading-cards">${data.guides.filter((_,j)=>j!==i).slice(0,2).map(g=>card(locale,g,data.guides.indexOf(g))).join('')}</div></section><section class="reading-method"><h2>${esc(l[11])}</h2><p>${esc(l[12])}</p><a href="https://krdict.korean.go.kr/eng/mainAction?nation=eng" rel="noopener">국립국어원 · Korean Basic Dictionary ↗</a><a href="https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140630" rel="noopener">한국관광공사 · VISITKOREA ↗</a></section>`;
    fs.writeFileSync(path.join(dir,g.id+'.html'),document(locale,g.id,a[0],a[1],body+adPlacement(locale)));
  });
}
const publicData={infoNav:Object.fromEntries(Object.entries(info).map(([code,c])=>[code,c.nav])),guides:data.guides,locales:Object.fromEntries(Object.entries(data.locales).map(([code,c])=>[code,{labels:c.labels,articles:c.articles.map(a=>a.slice(0,2))}]))};
fs.writeFileSync(path.join(root,'dist/guide-data.js'),'const GUIDES = '+JSON.stringify(publicData)+';\n');
console.log(`Built ${Object.keys(data.locales).length} language collections and ${data.guides.length * Object.keys(data.locales).length} complete guide pages.`);

function adPlacement(locale) {
 const labels={'en':'Advertisement','ko':'광고','zh-Hans':'广告','zh-Hant':'廣告','ja':'広告','fil':'Advertisement','vi':'Quảng cáo','id':'Iklan','th':'โฆษณา','hi':'विज्ञापन'};
 // No visible empty box and no Google request when advertising is disabled.
 if(!settings.ads.enabled)return '<aside class="guide-ad-zone" data-guide-ad hidden></aside>';
 return `<aside class="guide-ad-zone" data-guide-ad hidden data-publisher="${esc(settings.ads.publisherId)}" data-slot="${esc(settings.ads.slotId)}"><span>${esc(labels[locale])}</span><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(settings.ads.publisherId)}" data-ad-slot="${esc(settings.ads.slotId)}" data-ad-format="auto" data-full-width-responsive="true"></ins></aside><script src="/guide-ads.js" defer></script>`;
}
const fill=s=>s.replaceAll('{operator}',settings.operator).replaceAll('{date}',settings.updated);
for(const [locale] of locales) {
 if(!info[locale] || info[locale].nav.length!==3)throw Error('Missing site information: '+locale);
 const dir=path.join(root,'dist/info',locale);fs.mkdirSync(dir,{recursive:true});
 for(const id of infoIds){
  const paragraphs=info[locale][id];
  if(!Array.isArray(paragraphs)||paragraphs.length<(id==='privacy'?8:5))throw Error('Incomplete '+id+': '+locale);
  const body=`<article class="info-article"><div class="eyebrow">SignToki / ${esc(info[locale].nav[infoIds.indexOf(id)])}</div><h1>${esc(paragraphs[0])}</h1>${paragraphs.slice(1,id==='contact'?-1:undefined).map(p=>`<p>${esc(fill(p))}</p>`).join('')}${id==='contact'?`<a class="primary reading-play" href="${esc(settings.contactUrl)}" rel="noopener">${esc(paragraphs.at(-1))} ↗</a>`:''}${id==='privacy'?'<p><a href="https://policies.google.com/technologies/partner-sites" rel="noopener">Google · '+esc(info[locale].nav[2])+' ↗</a></p>':''}</article>`;
  fs.writeFileSync(path.join(dir,id+'.html'),document(locale,id,info[locale].nav[infoIds.indexOf(id)],fill(paragraphs[1]),body,'info'));
 }
}
console.log('Built 30 localized About, Contact and Privacy pages. Advertising enabled: '+settings.ads.enabled);

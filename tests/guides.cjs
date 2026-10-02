const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const data=JSON.parse(fs.readFileSync('content/guides.json','utf8'));
for(const file of ['guide-translations.json','guide-southeast-asia.json','guide-th-hi.json'])Object.assign(data.locales,JSON.parse(fs.readFileSync('content/'+file,'utf8')));
const root=path.resolve('dist');
let pageCount=0;
for(const [locale,c] of Object.entries(data.locales)) {
  assert.equal(c.labels.length,19);
  assert.equal(c.articles.length,6);
  for(const [i,g] of data.guides.entries()) {
    const a=c.articles[i],html=fs.readFileSync(`dist/guides/${locale}/${g.id}.html`,'utf8');
    assert.equal(a.length,6);
    assert.ok(a.slice(2).every(s=>typeof s==='string' && s.trim().length>0),`Substantive sections: ${locale}/${g.id}`);
    assert.ok(html.includes(`<html lang="${locale}">`));
    assert.ok(html.includes(a[2].replaceAll('&','&amp;').replaceAll('"','&quot;')),'Article is available before JavaScript');
    assert.ok(html.includes(`set=${g.set}&play=1`));
    assert.equal((html.match(/<h1>/g)||[]).length,1);
    assert.equal((html.match(/hreflang=/g)||[]).length,10);
    assert.ok(html.includes('Words')||html.includes(c.labels[7]));
    assert.ok(html.includes('reading-date'));
    assert.ok(!html.includes('undefined'));
    for(const match of html.matchAll(/(?:href|src)="(\/[^" ]*)"/g)) {
      let pathname=new URL(match[1],'https://example.com').pathname;
      if(pathname==='/')pathname='/index.html';
      assert.ok(fs.existsSync(path.join(root,pathname)),`Broken asset or link ${locale}/${g.id}: ${pathname}`);
    }
    for(const word of g.words)assert.ok(html.includes(`data-speak="${word}"`));
    pageCount++;
  }
  const hub=fs.readFileSync(`dist/guides/${locale}/index.html`,'utf8');
  assert.equal((hub.match(/class="reading-card"/g)||[]).length,6);
  assert.ok(hub.includes('?lang='+locale+'&view=guide#word-collection'));
}
const elements=new Map();const el=()=>({innerHTML:'',textContent:'',value:'',className:'',classList:{add(){}},setAttribute(){}});
const context={URL,URLSearchParams,location:{search:'?lang=en&set=1&play=1',href:'https://example.com/?lang=en&set=1&play=1'},navigator:{languages:['en']},localStorage:{getItem(){return null}},history:{replaceState(){}},document:{documentElement:{},querySelector(s){if(!elements.has(s))elements.set(s,el());return elements.get(s)},querySelectorAll(){return[]}},window:{scrollTo(){}}};
vm.createContext(context);for(const file of ['i18n.js','guide-data.js','app.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context);
assert.equal(vm.runInContext('screen',context),'quiz');assert.equal(vm.runInContext('round[0][0]',context),'카페');
vm.runInContext('answer(choices.findIndex(r=>r[0]===round[index][0]))',context);
assert.ok(elements.get('#feedback').innerHTML.includes('/guides/en/reading-a-cafe.html'));
console.log(`PASS: ${pageCount} static articles, 10 guide collections, language alternates, readable HTML, internal links, audio words, and guide-to-game navigation.`);

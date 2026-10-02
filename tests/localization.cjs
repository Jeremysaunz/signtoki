const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function boot({search='',saved=null,languages=['en'],blockedStorage=false}={}) {
  const elements = new Map();
  const element = () => ({innerHTML:'',textContent:'',className:'',value:'',classList:{add(){}},setAttribute(){}});
  const context = {
    URL,URLSearchParams,location:{search,href:'https://example.com/'+search},
    navigator:{languages},history:{replaceState(){}},
    localStorage:{getItem(){if(blockedStorage)throw Error('blocked');return saved},setItem(){if(blockedStorage)throw Error('blocked')}},
    document:{documentElement:{},querySelector(s){if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll(){return[]},body:{append(){}}},
    window:{scrollTo(){}},setTimeout(){}
  };
  vm.createContext(context);
  for(const file of ['dist/i18n.js','dist/guide-data.js','dist/app.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
  return {run:code=>vm.runInContext(code,context),elements};
}
for(const [input,want] of [['zh-CN','zh-Hans'],['zh-TW','zh-Hant'],['zh-HK','zh-Hant'],['ja-JP','ja'],['tl-PH','fil'],['hi-IN','hi'],['vi-VN','vi'],['id-ID','id'],['th-TH','th'],['fr-FR','en']]) {
  assert.equal(boot({languages:[input]}).run('lang'),want);
}
assert.equal(boot({search:'?lang=ja',saved:'hi',languages:['th']}).run('lang'),'ja');
assert.equal(boot({saved:'vi',languages:['th']}).run('lang'),'vi');
assert.equal(boot({saved:'invalid',languages:['fr','id']}).run('lang'),'id');
assert.equal(boot({search:'?lang=invalid',blockedStorage:true,languages:['th']}).run('lang'),'th');
const {run,elements}=boot();
const locales=run('LOCALES.map(x=>x[0])');
assert.equal(locales.length,10);
for(const word of run('baseWords.map(r=>r[0])')) {
  const tile=run(`SCENE_FOR_WORD[${JSON.stringify(word)}]`);
  assert.ok(Number.isInteger(tile)&&tile>=0&&tile<24,`Missing visual scene: ${word}`);
}
assert.equal(run("SCENE_FOR_WORD['카페']"),2);
assert.equal(run("SCENE_FOR_WORD['편의점']"),1);
assert.equal(run("SCENE_FOR_WORD['약국']"),0);
for(const locale of locales) {
  run(`lang=${JSON.stringify(locale)}; screen='home'; render()`);
  assert.equal(run('document.documentElement.lang'),locale);
  assert.ok(!elements.get('#app').innerHTML.includes('undefined'));
  for(const english of run('Object.keys(I18N.en.ui)')) assert.ok(run(`I18N[lang].ui[${JSON.stringify(english)}]`),`${locale}: ${english}`);
  for(let topic=0;topic<8;topic++)for(const mode of ['meaning','reading']) {
    run(`mode=${JSON.stringify(mode)}; start(${topic});`);
    for(let question=0;question<5;question++) {
      assert.equal(run('choices.length'),4);
      assert.ok(elements.get('#app').innerHTML.includes('context-scene'),'question needs a visual scene');
      assert.ok(!elements.get('#app').innerHTML.includes('undefined'));
      run('answer(choices.findIndex(r=>r[0]===round[index][0]));render();');
      assert.equal(run('score'),question+1,'rerender must not score twice');
      assert.ok(elements.get('#feedback').innerHTML.includes(run('note(round[index])')));
      elements.get('#next').onclick();
    }
    assert.equal(run('screen'),'result');
    assert.equal(run('score'),5);
    assert.ok(!elements.get('#app').innerHTML.includes('{score}'));
  }
  run("screen='guide';render();");
  assert.ok(!elements.get('#app').innerHTML.includes('undefined'));
}
run("lang='ja';start(0,1);answer(choices.findIndex(r=>r[0]===round[index][0]));");
elements.get('#lang').value='hi';elements.get('#lang').onchange();
assert.equal(run('lang'),'hi');assert.equal(run('score'),1);assert.equal(run('answered'),true);
assert.equal(run('groups[0][3][0][0]'),'약국','starting from a street sign must not mutate the source set');
run("start(0);answer(choices.findIndex(r=>r[0]!==round[index][0]));render();");
assert.equal(run('score'),0);assert.equal(run('answered'),true);
console.log('PASS: 10 languages, complete UI coverage, 160 rounds / 800 questions, translations, locale detection, storage fallback, answer preservation, and all 40 visual contexts.');

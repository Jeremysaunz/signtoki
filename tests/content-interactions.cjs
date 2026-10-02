const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const handler=fs.readFileSync('dist/guide-page.js','utf8');
// The reader can change an incorrect choice and get a new result; no selection
// must not count as an answer. These are behavioral checks, not HTML snapshots.
let selected=null;
const button={hidden:true,disabled:false,addEventListener(_,fn){this.click=fn}};
const feedback={textContent:''},details={open:false};
const input={addEventListener(_,fn){this.change=fn}};
const check={
 dataset:{correct:'1',success:'Correct',retry:'Try again'},
 querySelector(s){return {'[data-check]':button,'.check-feedback':feedback,'details':details,'input:checked':selected}[s]},
 querySelectorAll(){return[input]},
 removeAttribute(){delete this.dataset.result}
};
vm.runInNewContext(handler,{document:{querySelector(){return null},querySelectorAll(s){return s==='.guide-check'?[check]:[]}}});
assert.equal(button.hidden,false);assert.equal(button.disabled,true);
button.click();assert.equal(feedback.textContent,'');assert.equal(details.open,false);
selected={value:'0'};input.change();button.click();
assert.equal(feedback.textContent,'Try again');assert.equal(check.dataset.result,'retry');assert.equal(details.open,true);
selected={value:'1'};input.change();assert.equal(feedback.textContent,'');button.click();
assert.equal(feedback.textContent,'Correct');assert.equal(check.dataset.result,'correct');

const adCode=fs.readFileSync('dist/guide-ads.js','utf8');
function adHarness(pathname,publisher,slot){
 const listeners={},requests=[],zone={hidden:true,dataset:{publisher,slot}};
 const context={location:{pathname},window:{addEventListener(name,fn){listeners[name]=fn}},document:{
  querySelector(){return zone},createElement(){return{}},head:{appendChild(s){requests.push(s)}}
 }};
 vm.runInNewContext(adCode,context);return {listeners,requests,zone,context};
}
const testPublisher='ca-pub-'+'0'.repeat(16); // Test fixture only, never a deployed setting.
for(const route of ['/','/info/en/privacy.html','/guides/en/index.html']){
 const h=adHarness(route,testPublisher,'123');assert.equal(Object.keys(h.listeners).length,0);
}
for(const [publisher,slot] of [[null,null],['invalid','123'],[testPublisher,'bad']]){
 const h=adHarness('/guides/en/reading-a-cafe.html',publisher,slot);assert.equal(Object.keys(h.listeners).length,0);
}
const h=adHarness('/guides/en/reading-a-cafe.html',testPublisher,'123');
assert.equal(h.requests.length,0);assert.equal(h.zone.hidden,true);
h.listeners['signtoki:ads-consent']({detail:{allowed:false}});assert.equal(h.requests.length,0);
h.listeners['signtoki:ads-consent']({detail:{allowed:true}});assert.equal(h.requests.length,1);
h.listeners['signtoki:ads-consent']({detail:{allowed:true}});assert.equal(h.requests.length,1,'Do not duplicate ad requests');
h.requests[0].onload();assert.equal(h.context.window.adsbygoogle.length,1);
h.requests[0].onerror();assert.equal(h.zone.hidden,true);
assert.equal(JSON.parse(fs.readFileSync('content/site-settings.json')).ads.enabled,false);
assert.ok(!fs.readFileSync('dist/index.html','utf8').includes('guide-ads'));
const builder=fs.readFileSync('scripts/build-guides.cjs','utf8');
for(const override of [
 {publisherId:null,slotId:'123',consentIntegrationReady:true,privacyReviewComplete:true},
 {publisherId:testPublisher,slotId:'bad',consentIntegrationReady:true,privacyReviewComplete:true},
 {publisherId:testPublisher,slotId:'123',consentIntegrationReady:false,privacyReviewComplete:true},
 {publisherId:testPublisher,slotId:'123',consentIntegrationReady:true,privacyReviewComplete:false}
]){
 const fakeFs={readFileSync(file,...args){
  if(String(file).endsWith('site-settings.json'))return JSON.stringify({ads:{enabled:true,...override}});
  return fs.readFileSync(file,...args);
 }};
 assert.throws(()=>vm.runInNewContext(builder,{
  __dirname:require('node:path').resolve('scripts'),
  require(name){return name==='node:fs'?fakeFs:require(name)}
 }),/Advertising requires/,'Reject premature advertising activation before writing output');
}
console.log('PASS: self-check retry and answer behavior; ads disabled, guide-only, ID validation, consent gating and no duplicate requests.');

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve('dist');
const routes=[];
for(const group of ['guides','info'])for(const locale of fs.readdirSync(path.join(root,group))) {
 const dir=path.join(root,group,locale);
 for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.html')))routes.push('/'+group+'/'+locale+'/'+file);
}
for(const route of routes) {
 const html=fs.readFileSync(path.join(root,route.slice(1)),'utf8');
 const canonical=html.match(/<link rel="canonical" href="([^"]+)">/);
 assert.ok(canonical,`canonical missing: ${route}`);
 assert.equal(canonical[1],'https://signtoki.com'+route,`wrong canonical: ${route}`);
 const alternates=[...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
 assert.equal(alternates.length,11,`10 locales plus x-default: ${route}`);
 assert.equal(alternates.at(-1)[1],'x-default');
 assert.ok(alternates.every(([,lang,url])=>url.startsWith('https://signtoki.com/')),`absolute hreflang URLs: ${route}`);
 assert.ok(html.includes('property="og:image" content="https://signtoki.com/og-image.png"'));
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
 assert.ok(schemas.length>=2,`structured data missing: ${route}`);
 for(const [,raw] of schemas)assert.doesNotThrow(()=>JSON.parse(raw),`invalid JSON-LD: ${route}`);
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(home.includes('<link rel="canonical" href="https://signtoki.com/">'));
assert.ok(home.includes('Read the signs you’ll meet on the street'));
for(const slug of ['pharmacy-or-clinic','convenience-store-or-market','reading-a-cafe','finding-your-way'])assert.ok(home.includes(`/guides/en/${slug}.html`));
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
for(const bot of ['OAI-SearchBot','ChatGPT-User','GPTBot','Google-Extended'])assert.ok(robots.includes(`User-agent: ${bot}\nAllow: /`),`crawler access: ${bot}`);
assert.ok(robots.includes('Sitemap: https://signtoki.com/sitemap.xml'));
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<url>/g)||[]).length,101);
for(const route of routes)assert.ok(sitemap.includes(`https://signtoki.com${route}`),`not in sitemap: ${route}`);
assert.ok(fs.existsSync(path.join(root,'og-image.png')));
console.log(`PASS: canonical URLs, language alternates, social metadata, JSON-LD, AI crawler permissions, ${routes.length+1} sitemap URLs, and crawlable homepage guide.`);

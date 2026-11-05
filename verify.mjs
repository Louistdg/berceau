import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';

const html = fs.readFileSync(new URL('./app/index.html', import.meta.url), 'utf8');
let checked = 0;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
  if (/\bsrc\s*=|type\s*=\s*["'](?:application\/json|application\/ld\+json)/i.test(match[1])) continue;
  new vm.Script(match[2], {filename: `inline-script-${++checked}.js`});
}
for (const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
  if (/^https?:/.test(match[1])) throw new Error('Dépendance distante inattendue : ' + match[1]);
  const script = new URL(match[1], new URL('./app/index.html', import.meta.url));
  new vm.Script(fs.readFileSync(script, 'utf8'), {filename: match[1]});
  checked++;
}
const album = JSON.parse(fs.readFileSync(new URL('./data/album-photos.json', import.meta.url)));
if (!Array.isArray(album.photos) || !album.photos.length) throw new Error('Album fictif absent');
const config = JSON.parse(fs.readFileSync(new URL('./vercel.json', import.meta.url)));
if (config.redirects[0].destination !== '/app/') throw new Error('Entrée de publication incorrecte');
console.log(JSON.stringify({scriptsParsed: checked, albumIllustrations: album.photos.length, appSha256: crypto.createHash('sha256').update(html).digest('hex'), status: 'passed'}, null, 2));

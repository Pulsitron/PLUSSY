// Run before publishing after editing any stylesheet or browser script.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const file=new URL('../dist/index.html',import.meta.url);
let html=readFileSync(file,'utf8');
html=html.replace(/((?:href|src)=")([^"/?]+\.(?:css|js))(?:\?[^"\s]*)?("[^>]*>)/g,(_,prefix,name,end)=>{
 const bytes=readFileSync(new URL('../dist/'+name,import.meta.url));
 const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12);
 return `${prefix}${name}?v=${hash}${end}`;
});
writeFileSync(file,html);
console.log('Updated stylesheet and script URLs with content versions.');

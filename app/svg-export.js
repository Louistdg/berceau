(function(){
  'use strict';
  const properties=['display','visibility','fill','fill-opacity','fill-rule','stroke','stroke-width','stroke-opacity','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-dasharray','stroke-dashoffset','opacity','color','font-family','font-size','font-weight','font-style','font-variant','letter-spacing','word-spacing','text-anchor','dominant-baseline','paint-order','vector-effect','shape-rendering','text-rendering','filter','rx','ry'];
  function dataUrl(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Lecture d’une image impossible.'));reader.readAsDataURL(blob);});}
  async function serialize(){
    if(document.fonts?.ready)await document.fonts.ready;
    window.berceauM3RefreshPortraits?.();
    const source=document.getElementById('tree'),viewport=document.getElementById('viewport');
    if(!source||!viewport||!source.querySelector('.person'))throw Error('Ouvrez un arbre avant de l’exporter.');
    const bounds=viewport.getBBox();if(!bounds.width||!bounds.height)throw Error('L’arbre est vide.');
    const clone=source.cloneNode(true),originals=[source,...source.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
    originals.forEach((node,index)=>{const target=copies[index],computed=getComputedStyle(node);for(const name of properties){const value=computed.getPropertyValue(name);if(value)target.style.setProperty(name,value);}for(const attribute of [...target.attributes]){if(/^on/i.test(attribute.name)||attribute.name==='tabindex')target.removeAttribute(attribute.name);else if(attribute.value.includes('var(--')&&properties.includes(attribute.name))target.setAttribute(attribute.name,computed.getPropertyValue(attribute.name));}});
    clone.querySelectorAll('.branch-toggle,style,script').forEach(node=>node.remove());
    const copyViewport=clone.querySelector('#viewport');copyViewport.removeAttribute('transform');copyViewport.style.removeProperty('transform');
    const padding=32;clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('viewBox',[bounds.x-padding,bounds.y-padding,bounds.width+padding*2,bounds.height+padding*2].join(' '));clone.setAttribute('width',Math.ceil(bounds.width+padding*2));clone.setAttribute('height',Math.ceil(bounds.height+padding*2));clone.setAttribute('role','img');clone.setAttribute('aria-label','Arbre généalogique Berceau');clone.style.removeProperty('width');clone.style.removeProperty('height');clone.style.removeProperty('max-width');
    const backdrop=document.createElementNS('http://www.w3.org/2000/svg','rect');backdrop.setAttribute('x',bounds.x-padding);backdrop.setAttribute('y',bounds.y-padding);backdrop.setAttribute('width',bounds.width+padding*2);backdrop.setAttribute('height',bounds.height+padding*2);backdrop.setAttribute('fill',getComputedStyle(document.getElementById('canvas')).backgroundColor);clone.insertBefore(backdrop,clone.firstChild);
    await Promise.all([...clone.querySelectorAll('image')].map(async image=>{const href=image.getAttribute('href')||image.getAttributeNS('http://www.w3.org/1999/xlink','href');if(!href)return;if(!href.startsWith('data:image/')){const url=new URL(href,location.href);if(url.protocol!=='blob:'&&url.origin!==location.origin)throw Error('Une image externe ne peut pas être intégrée à cet export local.');const response=await fetch(url.href);if(!response.ok)throw Error('Une image de l’arbre est introuvable.');image.setAttribute('href',await dataUrl(await response.blob()));}image.removeAttributeNS('http://www.w3.org/1999/xlink','href');}));
    return '<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(clone);
  }
  async function download(){const button=document.getElementById('export');button.disabled=true;button.setAttribute('aria-busy','true');try{const svg=await serialize(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='berceau-arbre.svg';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}catch(error){alert('Export impossible : '+error.message);}finally{button.disabled=false;button.removeAttribute('aria-busy');}}
  window.BerceauSvgExport={serialize};
  function attach(){const button=document.getElementById('export');if(!button){setTimeout(attach,100);return;}button.onclick=download;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);else attach();
})();

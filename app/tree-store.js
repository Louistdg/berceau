(function(root){
  'use strict';
  const KEY='arbres.v1', TAB='berceau.active-tree.v2', raw=root.localStorage;
  let bound=root.sessionStorage.getItem(TAB), baseline=null, locked=false;
  const clone=value=>JSON.parse(JSON.stringify(value));
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const identity=()=>root.crypto?.randomUUID?.()||('tree-'+Date.now()+'-'+Math.random().toString(36).slice(2));
  function normalize(registry){
    if(!registry||!Array.isArray(registry.arbres))throw new Error('Le registre des arbres est invalide.');
    registry.arbres.forEach(tree=>{if(!tree.mediaId)tree.mediaId=identity();});
    return registry;
  }
  function load(){const text=raw.getItem(KEY);if(!text)return null;const r=normalize(JSON.parse(text));if(JSON.stringify(r)!==text)raw.setItem(KEY,JSON.stringify(r));return r;}
  function block(){
    locked=true;
    const message='Cet arbre a été modifié ou supprimé dans un autre onglet. Recharge cette page avant de continuer pour préserver les dernières modifications.';
    const show=()=>{if(root.document.getElementById('tree-conflict'))return;const dialog=root.document.createElement('dialog');dialog.id='tree-conflict';dialog.style.cssText='max-width:460px;padding:28px;border:1px solid #789497;border-radius:16px;color:#173f43;background:#fffdf7';const p=root.document.createElement('p');p.textContent=message;const button=root.document.createElement('button');button.textContent='Recharger cet arbre';button.style.cssText='padding:12px 20px;font:inherit';button.onclick=()=>root.location.reload();dialog.append(p,button);root.document.body.append(dialog);dialog.addEventListener('cancel',e=>e.preventDefault());dialog.showModal();};
    if(root.document?.body)show();else root.document?.addEventListener('DOMContentLoaded',show,{once:true});
    throw new Error(message);
  }
  function read(){
    if(locked)return block();
    const r=load();if(!r)return null;
    if(!baseline){if(!r.arbres.some(t=>t.mediaId===bound))bound=r.arbres[r.courant]?.mediaId;r.courant=r.arbres.findIndex(t=>t.mediaId===bound);baseline=clone(r);root.sessionStorage.setItem(TAB,bound||'');}
    const current=r.arbres.find(t=>t.mediaId===bound), previous=baseline.arbres.find(t=>t.mediaId===bound);
    if(!same(current,previous))return block();
    r.courant=r.arbres.findIndex(t=>t.mediaId===bound);
    baseline=clone(r);return r;
  }
  function write(value){
    if(locked)return block();
    const outgoing=normalize(clone(value)),latest=load();
    if(!latest||!baseline){raw.setItem(KEY,JSON.stringify(outgoing));bound=outgoing.arbres[outgoing.courant]?.mediaId;baseline=clone(outgoing);root.sessionStorage.setItem(TAB,bound||'');return;}
    const before=new Map(baseline.arbres.map(t=>[t.mediaId,t])),after=new Map(outgoing.arbres.map(t=>[t.mediaId,t]));
    for(const [id,tree]of before){if(!same(tree,after.get(id))&&!same(tree,latest.arbres.find(t=>t.mediaId===id)))return block();}
    const merged=latest.arbres.filter(t=>!before.has(t.mediaId)||after.has(t.mediaId)).map(t=>before.has(t.mediaId)&&!same(before.get(t.mediaId),after.get(t.mediaId))?after.get(t.mediaId):t);
    for(const tree of outgoing.arbres)if(!before.has(tree.mediaId)){if(merged.some(t=>t.mediaId===tree.mediaId))return block();merged.push(tree);}
    const requested=outgoing.arbres[outgoing.courant]?.mediaId;
    if(!merged.some(t=>t.mediaId===requested))return block();
    const result={...latest,...outgoing,arbres:merged,courant:merged.findIndex(t=>t.mediaId===requested)};
    raw.setItem(KEY,JSON.stringify(result));bound=requested;baseline=clone(result);root.sessionStorage.setItem(TAB,bound);
  }
  root.BerceauStore={getItem(key){return key===KEY?JSON.stringify(read()):raw.getItem(key);},setItem(key,value){if(key===KEY)write(JSON.parse(value));else raw.setItem(key,value);},read,write};
  root.addEventListener('storage',event=>{if(event.key!==KEY||!baseline)return;try{const r=JSON.parse(event.newValue||'null'),old=baseline.arbres.find(t=>t.mediaId===bound),next=r?.arbres?.find(t=>t.mediaId===bound);if(!same(old,next))block();}catch(error){if(!locked)throw error;}});
})(globalThis);

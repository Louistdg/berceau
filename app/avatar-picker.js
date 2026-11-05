(function(){
  'use strict';
  const data=()=>window.berceauM3Core?.data()||window.FAMILY_DATA;
  let dialog,personId,showAll=false,returnFocus;
  function close(){dialog.close();returnFocus?.focus();}
  function render(){
    const grid=dialog.querySelector('.avatar-picker-grid'),selected=window.BerceauPortraits.selection(personId,data());grid.replaceChildren();
    for(const item of window.BerceauPortraits.items().filter(item=>showAll||item.older)){
      const button=document.createElement('button'),image=new Image();button.type='button';button.dataset.avatarSlot=item.slot;button.setAttribute('aria-label','Avatar '+(item.older?'âgé ':'')+(item.slot+1)+(item.slot%2?' · femme':' · homme'));button.setAttribute('aria-pressed',String(selected?.slot===item.slot));image.src=item.url;image.alt='';button.append(image);button.onclick=()=>{if(!window.BerceauPortraits.set(personId,item.slot,data())){dialog.querySelector('[role=status]').textContent='Impossible d’enregistrer ce choix sur cet appareil.';return;}grid.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));dialog.querySelector('[role=status]').textContent='Avatar enregistré sur cet appareil.';};grid.append(button);
    }
    dialog.querySelectorAll('[data-avatar-filter]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.avatarFilter==='all')===showAll)));
  }
  function open(event){
    personId=window.familySelectedPerson?.();if(!personId)return;returnFocus=event.currentTarget;showAll=false;
    if(!dialog){dialog=document.createElement('dialog');dialog.className='avatar-picker';dialog.setAttribute('aria-labelledby','avatar-picker-title');dialog.innerHTML='<header><h2 id="avatar-picker-title">Choisir un avatar</h2><button type="button" class="avatar-picker-close" aria-label="Fermer le choix des avatars">×</button></header><p>Choisissez un personnage dessiné. Une photo ajoutée reste prioritaire.</p><div class="avatar-picker-filters" role="group" aria-label="Âges des avatars"><button type="button" data-avatar-filter="older">Personnes âgées</button><button type="button" data-avatar-filter="all">Tous les âges</button></div><div class="avatar-picker-grid" role="group" aria-label="Personnages disponibles"></div><p role="status" aria-live="polite"></p><footer><button type="button" class="avatar-picker-default">Par défaut</button><button type="button" class="avatar-picker-done">Terminer</button></footer>';document.body.append(dialog);dialog.querySelector('.avatar-picker-close').onclick=close;dialog.querySelector('.avatar-picker-done').onclick=close;dialog.querySelector('.avatar-picker-default').onclick=()=>{if(window.BerceauPortraits.set(personId,null,data())){render();dialog.querySelector('[role=status]').textContent='Avatar par défaut rétabli.';}else dialog.querySelector('[role=status]').textContent='Impossible d’enregistrer ce choix sur cet appareil.';};dialog.querySelectorAll('[data-avatar-filter]').forEach(b=>b.onclick=()=>{showAll=b.dataset.avatarFilter==='all';render();});}
    dialog.querySelector('[role=status]').textContent='';render();dialog.showModal();dialog.querySelector('.avatar-picker-close').focus();
  }
  function attach(){const head=document.querySelector('#panel .m3-profile-head');if(!head||head.querySelector('.m3-avatar-edit'))return;const button=document.createElement('button');button.type='button';button.className='m3-avatar-edit';button.textContent='Choisir un avatar';button.onclick=open;head.lastElementChild.append(button);}
  function init(){const panel=document.getElementById('panel');if(!panel){setTimeout(init,100);return;}new MutationObserver(attach).observe(panel,{childList:true,subtree:true});attach();}
  window.addEventListener('berceau-portraits-ready',()=>{if(dialog?.open)render();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

(function(){
  'use strict';
  document.addEventListener('click',event=>{
    if(!event.target.closest('#create-first-person'))return;
    if(document.getElementById('first-person-dialog'))return;
    const dialog=document.createElement('dialog');dialog.id='first-person-dialog';
    dialog.style.cssText='width:min(440px,calc(100vw - 48px));box-sizing:border-box;border:1px solid var(--line);border-radius:16px;padding:24px;background:var(--white,#fffdf7);color:var(--ink,#153f43)';
    dialog.innerHTML='<form><h2>Première personne</h2><label>Prénom<input name="given" autocomplete="off" style="display:block;width:100%;box-sizing:border-box;margin:6px 0 16px;padding:10px;font:inherit"></label><label>Nom<input name="surname" autocomplete="off" style="display:block;width:100%;box-sizing:border-box;margin:6px 0 16px;padding:10px;font:inherit"></label><label>Sexe<select name="sex" style="display:block;padding:10px;font:inherit;margin:6px 0 16px"><option value="U">Non précisé</option><option value="F">Féminin</option><option value="M">Masculin</option></select></label><p role="alert" id="first-person-error"></p><button class="btn primary" type="submit">Créer la personne</button> <button class="btn" type="button" id="first-person-cancel">Annuler</button></form>';
    document.body.append(dialog);dialog.showModal();dialog.querySelector('input').focus();
    const close=()=>{dialog.close();dialog.remove();};dialog.querySelector('#first-person-cancel').onclick=close;dialog.addEventListener('cancel',()=>dialog.remove());
    dialog.querySelector('form').onsubmit=event=>{event.preventDefault();try{
      const form=new FormData(event.target),given=String(form.get('given')).trim(),surname=String(form.get('surname')).trim();if(!given&&!surname)throw new Error('Indique au moins un prénom ou un nom.');
      const registry=window.BerceauStore.read(),tree=registry.arbres[registry.courant],data=tree.donnees;if(data.people.length)throw new Error('Cet arbre contient déjà une personne. Recharge la page.');
      const id='local-'+crypto.randomUUID(),name=[given,surname].filter(Boolean).join(' ');
      data.people.push({id,name,givenName:given,surname,gedcomName:given+' /'+surname+'/',sex:form.get('sex'),birth:{date:'',place:'',known:false},death:{date:'',place:'',known:false},parents:[],children:[],partners:[],siblings:[],spouseIds:[],childIds:[],fatherId:null,motherId:null,events:[],notes:[],citations:[],generation:0,directAncestor:false});
      data.rootId=id;data.meta.peopleCount=1;data.meta.rootName=name;data.groups.connected=[id];tree.modificationsLocales=true;window.BerceauStore.write(registry);location.reload();
    }catch(error){dialog.querySelector('#first-person-error').textContent=error.message;}};
  });
})();

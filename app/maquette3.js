(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const NS='http://www.w3.org/2000/svg';
  const icons={tree:'M12 3 6 9h3l-5 6h6v6h4v-6h6l-5-6h3L12 3Z',explore:'M6 3h9l4 4v14H6V3Zm8 0v5h5M9 12h7M9 16h7',save:'M4 3h14l3 3v15H3V3h1Zm3 0v7h10V3M7 21v-7h10v7',fit:'M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6',folder:'M3 6h7l2 3h9v11H3V6Z',chevron:'m7 10 5 5 5-5',home:'m3 11 9-8 9 8M6 9v12h12V9'};
  const icon=name=>'<svg class="m3-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="'+icons[name]+'"/></svg>';
  function formatDate(value){const match=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!match)return value||'';return new Intl.DateTimeFormat('fr-BE',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(+match[1],+match[2]-1,+match[3])));}
  let layout,aside,panel,main,explorer=false,panelOpen=false,fitTimer;
  function scheduleFit(){clearTimeout(fitTimer);fitTimer=setTimeout(()=>window.berceauM3Core?.fit(),100);}
  function setExplorer(value){explorer=!!value;document.body.classList.toggle('m3-explorer-open',explorer);$('m3-explore')?.setAttribute('aria-expanded',String(explorer));$('m3-explore')?.classList.toggle('active',explorer);$('m3-tree')?.classList.toggle('active',!explorer);if(explorer)aside?.querySelector('button')?.focus({preventScroll:true});scheduleFit();}
  function element(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
  function mount(){
    layout=$('layout');panel=$('panel');main=layout?.querySelector('.main');aside=layout?.querySelector(':scope>aside');
    if(!layout||!panel||!main||!aside){setTimeout(mount,80);return;}
    if($('m3-rail'))return;
    document.body.classList.add('berceau-m3');
    const rail=element('nav','m3-rail');rail.id='m3-rail';rail.setAttribute('aria-label','Navigation principale');
    rail.innerHTML='<button id="m3-tree" class="active" type="button">'+icon('tree')+'<span>Arbre</span></button><button id="m3-explore" type="button" aria-expanded="false" aria-controls="m3-explorer">'+icon('explore')+'<span>Explorer</span></button><div class="m3-rail-bottom"><button type="button" data-berceau-page="trees">'+icon('folder')+'<span>Mes arbres</span></button><button type="button" data-berceau-page="home">'+icon('home')+'<span>Accueil</span></button></div>';
    layout.prepend(rail);aside.id='m3-explorer';
    const eh=element('div','m3-explorer-heading');eh.innerHTML='<span>Explorer</span><button type="button" aria-label="Fermer Explorer">×</button>';aside.prepend(eh);eh.querySelector('button').onclick=()=>{setExplorer(false);$('m3-explore').focus();};
    $('m3-explore').onclick=()=>setExplorer(!explorer);$('m3-tree').onclick=()=>setExplorer(false);
    const top=document.querySelector('.top'),sw=element('button','m3-tree-switch');sw.type='button';sw.setAttribute('data-berceau-page','trees');sw.setAttribute('aria-label','Choisir ou gérer un arbre');sw.innerHTML=icon('tree')+'<span></span>'+icon('chevron');
    let treeName='Arbre de démonstration';try{const r=JSON.parse(localStorage.getItem('arbres.v1')||'null');treeName=r?.arbres?.[r.courant||0]?.nom||treeName;}catch(e){}
    sw.querySelector('span').textContent=treeName;top.querySelector('.search').before(sw);top.querySelector('.brand small').textContent='ARBRES FAMILIAUX';$('search').placeholder='Rechercher un nom, un lieu, une date…';
    const save=$('share');save.innerHTML=icon('save')+'<span>Sauvegarder</span>';
    const utilities=element('div','m3-display-options');utilities.setAttribute('aria-label','Affichage et outils');
    for(const node of [document.querySelector('.theme-btn'),$('mermaid'),$('fan'),$('calendar'),$('hideLiving'),$('up'),$('down'),$('both'),$('center'),$('pathback')])if(node)utilities.append(node);
    const utilitiesTitle=element('p','section-label','Affichage et outils');aside.append(utilitiesTitle,utilities);
    const siblings=$('sib')?.closest('label');
    if(siblings){siblings.style.marginLeft='0';siblings.classList.add('m3-siblings');utilities.append(siblings);}
    const dock=element('div','m3-dock');dock.setAttribute('role','toolbar');dock.setAttribute('aria-label','Commandes de l’arbre');
    const mode=element('select','m3-direction');mode.setAttribute('aria-label','Direction de l’arbre');mode.innerHTML='<option value="up">Ancêtres</option><option value="down">Descendance</option><option value="both">Vue familiale</option>';mode.onchange=()=>$(mode.value)?.click();const modes=element('div','m3-dock-group');modes.append(mode);dock.append(modes);
    const generations=element('div','m3-dock-group');for(const node of [$('depthminus'),document.querySelector('.generation-control'),$('depthplus')])if(node)generations.append(node);dock.append(generations);
    const zoom=element('div','m3-dock-group');for(const id of ['zoomout','zoomin'])if($(id))zoom.append($(id));dock.append(zoom);const fit=$('fit');fit.innerHTML=icon('fit');fit.setAttribute('aria-label','Tout voir');fit.title='Tout voir';dock.append(fit);main.append(dock);
    for(const id of ['up','down','both'])$(id)?.addEventListener('click',()=>{mode.value=id;});
    const syncPanel=()=>{const open=panel.classList.contains('open');if(open!==panelOpen){panelOpen=open;document.body.classList.toggle('m3-profile-open',open);scheduleFit();}if(open)queueProfile();};
    new MutationObserver(syncPanel).observe(panel,{attributes:true,attributeFilter:['class'],childList:true});
    new MutationObserver(()=>{decorateCards();}).observe($('canvas'),{childList:true});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&explorer){setExplorer(false);$('m3-explore').focus();}});
    document.addEventListener('click',e=>{if(e.target.closest('#m3-explorer [data-scope]'))setExplorer(false);});
    syncPanel();decorateCards();scheduleFit();
  }
  function decorateCards(){
    const data=window.berceauM3Core?.data()||window.FAMILY_DATA;const people=new Map((data?.people||[]).map(p=>[p.id,p]));
    document.querySelectorAll('#tree .person').forEach(g=>{
      if(g.dataset.m3Card)return;g.dataset.m3Card='1';const p=people.get(g.dataset.person),face=g.querySelector('.card-face');if(!p||!face)return;
      const x=+face.getAttribute('x'),y=+face.getAttribute('y'),w=+face.getAttribute('width');
      if(w<200)return;
      g.querySelectorAll('.tname,.tdates').forEach(n=>n.remove());
      function text(value,dx,dy,cls,size){const t=document.createElementNS(NS,'text');t.setAttribute('class',cls);t.setAttribute('x',x+dx);t.setAttribute('y',y+dy);t.setAttribute('font-size',size);t.textContent=value;g.append(t);let short=value;while(t.getComputedTextLength()>w-dx-12&&short.length>2){short=short.slice(0,-1);t.textContent=short+'…';}}
      const given=String(p.givenName||p.name||'').split(/\s+/)[0],surname=String(p.surname||'');
      text(given.length>19?given.slice(0,18)+'…':given,84,32,'tname',18);if(surname)text(surname.length>19?surname.slice(0,18)+'…':surname,84,54,'tname',18);
      const year=v=>(String(v||'').match(/\d{4}/)||[])[0]||'—';const place=v=>String(v||'').split(',')[0].trim();const compact=s=>s.length>23?s.slice(0,22)+'…':s;
      text(compact('° '+year(p.birth?.date)+(place(p.birth?.place)?' · '+place(p.birth.place):'')),84,79,'tdates',16);
      if(p.death?.known)text(compact('† '+year(p.death.date)+(place(p.death.place)?' · '+place(p.death.place):'')),84,100,'tdates',16);
      const avatar=g.querySelector('.gender-avatar');if(avatar)avatar.setAttribute('transform','translate('+(x+43)+' '+(y+46)+') scale(1.85) translate('+(-x-29)+' '+(-y-24)+')');
    });
  }
  let profileTimer;
  function queueProfile(){clearTimeout(profileTimer);profileTimer=setTimeout(structureProfile,80);}
  function structureProfile(){
    if(!panel?.classList.contains('open'))return;
    if(panel.querySelector('.m3-profile-head')){routeLateContent();return;}
    const id=window.familySelectedPerson?.(),data=window.berceauM3Core?.data()||window.FAMILY_DATA,p=data?.people?.find(p=>p.id===id);
    if(!p)return;
    const title=panel.querySelector('h2'),avatar=panel.querySelector('.avatar'),dates=panel.querySelector('.dates'),originalContext=panel.querySelector('.context-note');
    if(!title||!avatar)return;
    const head=element('div','m3-profile-head'),identity=element('div');identity.append(title);if(dates){dates.replaceChildren();dates.append(element('div','','° '+[formatDate(p.birth?.date),p.birth?.place].filter(Boolean).join(' · ')));if(p.death?.known)dates.append(element('div','','† '+[formatDate(p.death.date),p.death.place].filter(Boolean).join(' · ')));identity.append(dates);}head.append(avatar,identity);
    panel.querySelector('.panel-head').after(head);
    const photo=window.berceauMedia?.photoUrl(id);avatar.replaceChildren();
    if(photo){const img=element('img');img.src=photo;img.alt='Photo de '+p.name;avatar.append(img);}else{
      const card=[...document.querySelectorAll('#tree .person')].find(g=>g.dataset.person===id),source=card?.querySelector('.gender-avatar'),face=card?.querySelector('.card-face');
      if(source&&face){const svg=document.createElementNS(NS,'svg'),copy=source.cloneNode(true);copy.removeAttribute('transform');const originals=[...source.querySelectorAll('*')],copies=[...copy.querySelectorAll('*')];copies.forEach((c,i)=>{const s=getComputedStyle(originals[i]);c.style.fill=s.fill;c.style.stroke=s.stroke;c.style.strokeWidth=s.strokeWidth;});svg.setAttribute('viewBox',(+face.getAttribute('x')+12)+' '+(+face.getAttribute('y')+7)+' 34 34');svg.setAttribute('aria-hidden','true');svg.append(copy);avatar.append(svg);}else avatar.textContent=String(p.givenName||p.name||'?')[0];
    }
    if(originalContext)originalContext.textContent='Liens déclarés dans l’arbre. Les sources permettent de les vérifier.';
    const tabs=element('div','m3-profile-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Rubriques de la fiche');
    const content=element('div','m3-sections');content.id='m3-profile-content';content.setAttribute('role','tabpanel');
    const remaining=[...panel.children].filter(n=>!n.classList.contains('panel-head')&&n!==head);
    remaining.forEach(node=>{node.dataset.m3Sections=classify(node);content.append(node);});
    head.after(tabs,content);
    const sourceCard=[...content.querySelectorAll('.card')].find(c=>/Références/.test(c.querySelector('h3')?.textContent||'')),sourceCount=sourceCard?.querySelectorAll('.evidence').length||0;
    if(sourceCard){sourceCard.querySelector('h3').textContent='Sources ('+sourceCount+')';sourceCard.dataset.m3Sections='overview sources';}
    const sections=[['overview','Aperçu'],['details','Détails'],['sources','Sources ('+sourceCount+')'],['notes','Notes']];
    for(const [key,label] of sections){const button=element('button','',label);button.type='button';button.setAttribute('role','tab');button.id='m3-tab-'+key;button.setAttribute('aria-controls','m3-profile-content');button.dataset.tab=key;button.onclick=()=>selectTab(key);button.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const list=[...tabs.children],at=list.indexOf(button),next=e.key==='Home'?0:e.key==='End'?list.length-1:(at+(e.key==='ArrowRight'?1:-1)+list.length)%list.length;list[next].click();list[next].focus();};tabs.append(button);}
    const relation=element('section','card');relation.dataset.m3Sections='overview';const relationTitle=element('h3','','Lien de parenté');relation.append(relationTitle);
    const list=element('ol','m3-path'),persons=new Map(data.people.map(person=>[person.id,person]));
    function step(names,label){const li=element('li');li.append(element('span','',names),element('small','',label));list.append(li);}
    const root=persons.get(data.rootId),queue=[data.rootId],seen=new Map([[data.rootId,null]]);
    for(let i=0;i<queue.length&&!seen.has(id);i++){const at=queue[i],person=persons.get(at);if(!person)continue;for(const key of ['parents','children','partners'])for(const next of person[key]||[]){if(!persons.has(next)||seen.has(next))continue;seen.set(next,{from:at,key});queue.push(next);}}
    if(seen.has(id)){
      const route=[];let at=id;while(at){route.unshift({person:persons.get(at),link:seen.get(at)});at=seen.get(at)?.from;}
      route.forEach(({person,link})=>{if(!person)return;let label='Personne de départ';if(link){const from=persons.get(link.from),role=link.key==='parents'?(person.sex==='M'?'Père':person.sex==='F'?'Mère':'Parent'):link.key==='children'?(person.sex==='M'?'Fils':person.sex==='F'?'Fille':'Enfant'):'Partenaire';label=role+' de '+(from?.name||'la personne précédente');}step(person.name,label);});
      if(id===data.rootId){const parents=(p.parents||[]).map(pid=>persons.get(pid)).filter(Boolean);if(parents.length)step(parents.map(q=>q.name).join(' et '),'Parents enregistrés');}
    }else{step(p.name,'Personne sélectionnée');step('Lien non renseigné','Aucun chemin familial enregistré vers '+(root?.name||'la personne de départ'));}
    relation.append(list);
    const facts=element('section','card');facts.dataset.m3Sections='overview';const factsTitle=element('div','m3-card-title');factsTitle.append(element('h3','','Faits d’identité'));const edit=element('button','','Modifier');edit.type='button';edit.onclick=()=>{$('editrel')?.click();};factsTitle.append(edit);facts.append(factsTitle);
    const dl=element('dl','m3-facts');
    function fact(label,value,place){const row=element('div'),dd=element('dd','',value||'Non renseigné');row.append(element('dt','',label),dd);if(place)dd.append(element('small','',place));dl.append(row);}
    fact('Naissance',formatDate(p.birth?.date),p.birth?.place);if(p.death?.known)fact('Décès',formatDate(p.death.date),p.death.place);fact('Sexe',p.sex==='M'?'Homme':p.sex==='F'?'Femme':'Non renseigné');facts.append(dl);content.prepend(relation,facts);
    if(![...content.children].some(c=>c.dataset.m3Sections==='notes')){const empty=element('section','card');empty.dataset.m3Sections='notes';empty.append(element('h3','','Notes'),element('p','m3-empty','Aucune note enregistrée pour cette personne.'));content.append(empty);}
    selectTab('overview');
  }
  function classify(node){
    const heading=node.querySelector('h3')?.textContent||'';
    if(/Références|Sources/.test(heading)||node.id==='chercheacte')return 'sources';
    if(/Notes/.test(heading)||node.classList.contains('warn'))return 'notes';
    return 'details';
  }
  function routeLateContent(){
    const content=panel.querySelector('.m3-sections');if(!content)return;
    for(const node of [...panel.children]){if(node===content||node.classList.contains('panel-head')||node.classList.contains('m3-profile-head')||node.classList.contains('m3-profile-tabs'))continue;node.dataset.m3Sections=classify(node);content.append(node);}
    const photoManager=panel.querySelector('.m3-profile-head .berceau-photo-panel');if(photoManager){photoManager.dataset.m3Sections='details';content.append(photoManager);}
    selectTab(panel.dataset.m3Tab||'overview');
  }
  function selectTab(key){
    panel.dataset.m3Tab=key;
    panel.querySelector('.m3-sections')?.setAttribute('aria-labelledby','m3-tab-'+key);
    panel.querySelectorAll('.m3-profile-tabs button').forEach(b=>{const active=b.dataset.tab===key;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    panel.querySelectorAll('.m3-sections> *').forEach(n=>{n.hidden=!String(n.dataset.m3Sections||'details').split(' ').includes(key);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,100));else setTimeout(mount,100);
})();

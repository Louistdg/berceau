(function(root){
  'use strict';
  const portraits=[],cache=new WeakMap(),scopes=new WeakMap();
  const scriptBase=typeof document!=='undefined'?document.currentScript.src:'';
  function scope(data){if(scopes.has(data))return scopes.get(data);let identity='';try{const registry=JSON.parse((root.BerceauStore||root.localStorage).getItem('arbres.v1')||'null'),active=registry?.arbres?.[registry.courant];identity=active?.mediaId||'';}catch{}const key='berceau.avatars.v1.'+hash(identity+'|'+data.rootId+'|'+data.meta?.sourceFile+'|'+data.meta?.syntheticNamesVersion);scopes.set(data,key);return key;}
  function choices(data){if(data.avatarPreferences)return data.avatarPreferences;try{return JSON.parse(root.localStorage.getItem(scope(data))||'{}');}catch{return {};}}
  function save(id,slot,data){if(slot!==null&&(!Number.isInteger(slot)||slot<0||slot>=88))return false;try{const selected=choices(data);if(slot===null)delete selected[id];else selected[id]=slot;const registry=root.BerceauStore.read(),tree=registry.arbres[registry.courant];tree.donnees.avatarPreferences=selected;root.BerceauStore.write(registry);data.avatarPreferences=selected;root.dispatchEvent?.(new Event('berceau-portraits-ready'));return true;}catch{return false;}}
  function hash(text){let n=2166136261;for(const c of text)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
  function ageOf(person,today){
    const birth=String(person.birth?.date||''),end=person.death?.known?String(person.death.date||''):today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
    const by=birth.match(/\b(\d{4})\b/),ey=end.match(/\b(\d{4})\b/);if(!by||!ey)return null;
    let age=+ey[1]-+by[1];const b=birth.match(/^\d{4}-(\d{2})-(\d{2})$/),e=end.match(/^\d{4}-(\d{2})-(\d{2})$/);
    if(b&&e&&(e[1]<b[1]||(e[1]===b[1]&&e[2]<b[2])))age--;
    return age>=0&&age<130?age:null;
  }
  function bandOf(person,today){const age=ageOf(person,today);if(age===null)return 3;return age<3?0:age<12?1:age<18?2:age<45?3:age<60?4:age<75?5:6;}
  function selections(data,today){
    if(!data?.meta?.syntheticNamesVersion)return new Map();
    const people=data.people||[],key=today.toDateString()+'|'+people.map(p=>[p.id,p.sex,p.birth?.date,p.death?.known,p.death?.date].join(':')).sort().join('|');
    const previous=cache.get(data);if(previous?.key===key)return previous.map;
    const groups=new Map(),map=new Map();
    for(const person of people){const band=bandOf(person,today),sex=['M','F'].includes(person.sex)?person.sex:'U',group=band+sex;if(!groups.has(group))groups.set(group,[]);groups.get(group).push(person);}
    for(const [group,members]of groups){
      const band=+group[0],sex=group[1],pool=Array.from({length:sex==='U'?48:24},(_,i)=>40+(sex==='U'?i:2*i+(sex==='F'?1:0)));
      pool.sort((a,b)=>hash(group+':'+a)-hash(group+':'+b));
      members.sort((a,b)=>hash(a.id)-hash(b.id)||String(a.id).localeCompare(String(b.id)));
      members.forEach((p,i)=>map.set(p.id,{slot:pool[i%pool.length],band,age:ageOf(p,today)}));
    }
    cache.set(data,{key,map});return map;
  }
  root.BerceauPortraits={preferences:choices,selection(id,data,today=new Date()){const selected=choices(data)[id];if(Number.isInteger(selected)&&selected>=0&&selected<88)return {slot:selected,manual:true};return selections(data,today).get(id)||null;},set:save,items(){return portraits.map((url,slot)=>({url,slot,older:slot>=40})).filter(item=>item.url);},url(id,data){const selection=this.selection(id,data);return selection?portraits[selection.slot]||'':'';}};
  if(typeof Image==='undefined')return;
  const source=new Image();
  source.onload=()=>{
    const rows=[0,160,320,488,666,844,1030,1254].map(y=>y/1254*source.height);
    for(let i=0;i<56;i++){
      const canvas=document.createElement('canvas');canvas.width=192;canvas.height=192;
      const row=Math.floor(i/8),w=source.width/8,h=rows[row+1]-rows[row],scale=192/Math.max(w,h),ctx=canvas.getContext('2d');
      ctx.fillStyle='#fcf9f2';ctx.fillRect(0,0,192,192);
      ctx.drawImage(source,(i%8)*w,rows[row],w,h,(192-w*scale)/2,(192-h*scale)/2,w*scale,h*scale);
      portraits[i]=canvas.toDataURL('image/png');
    }
    window.dispatchEvent(new Event('berceau-portraits-ready'));
  };
  source.src=new URL('assets/portraits-dessines-56.png',scriptBase).href;
  const elderly=new Image();elderly.onload=()=>{for(let i=0;i<32;i++){const canvas=document.createElement('canvas');canvas.width=192;canvas.height=192;canvas.getContext('2d').drawImage(elderly,(i%8)*elderly.width/8,Math.floor(i/8)*elderly.height/4,elderly.width/8,elderly.height/4,0,0,192,192);portraits[56+i]=canvas.toDataURL('image/png');}root.dispatchEvent(new Event('berceau-portraits-ready'));};elderly.src=new URL('assets/portraits-aines-32.png',scriptBase).href;
})(globalThis);

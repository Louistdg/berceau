(function(root){
  'use strict';
  function isDivorced(f){
    if(!f)return false;
    return f.divorced===true||f.marriage?.divorced===true||f.divorce?.exists===true||/^(divorced|divorcé|divorce)$/i.test(String(f.status||f.marriage?.status||''))||(f.events||[]).some(e=>/^DIV(?:ORCE)?$/i.test(String(e?.type||'')));
  }
  function year(value){const m=String(value||'').match(/\b(\d{4})\b/);return m?+m[1]:null;}
  function dateParts(value){
    const y=year(value);if(!y)return null;
    const match=String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(match){const month=+match[2],day=+match[3],date=new Date(0);date.setUTCFullYear(y,month-1,day);if(date.getUTCFullYear()===y&&date.getUTCMonth()===month-1&&date.getUTCDate()===day)return {year:y,month,day};}
    return {year:y,month:null,day:null};
  }
  const dateOrder=d=>d.year*10000+(d.month||0)*100+(d.day||0);
  function summary(f,people=[],today=new Date()){
    if(!f?.marriage?.exists||isDivorced(f))return null;
    const start=dateParts(f.marriage.date);if(!start)return {label:'Mariage',title:'Date du mariage non renseignée'};
    let end={year:today.getFullYear(),month:today.getMonth()+1,day:today.getDate()};
    const records=new Map(people.map(p=>[p.id,p]));
    for(const id of f.partnerIds||[]){const p=records.get(id),death=p?.death?.known?dateParts(p.death.date):null;if(death&&dateOrder(death)<dateOrder(end))end=death;}
    let years=end.year-start.year;
    const exact=start.month!==null&&end.month!==null;
    if(exact&&(end.month<start.month||(end.month===start.month&&end.day<start.day)))years--;
    if(years<0)return null;
    return {label:years===0?'Moins d’un an':years+' '+(years===1?'an':'ans'),title:'Mariage : '+f.marriage.date+(exact?'':' · durée calculée à partir des années renseignées')};
  }
  function render(tree,data){
    if(!tree||!data)return;
    const families=new Map((data.families||[]).map(f=>[f.id,f]));
    for(const badge of tree.querySelectorAll('.union-badge[data-fam]')){
      badge.querySelectorAll('.union-year,.union-years,.union-status').forEach(n=>n.remove());
      const f=families.get(badge.dataset.fam),info=summary(f,data.people);
      if(!info)continue;
      const junction=badge.querySelector('rect');if(!junction)continue;
      const x=+junction.getAttribute('x')+7,y=+junction.getAttribute('y')+7;
      const ns='http://www.w3.org/2000/svg';
      const make=(tag,attrs)=>{const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
      const group=make('g',{'class':'union-status','aria-label':info.title});
      const width=44+info.label.length*7;
      group.append(make('rect',{x:x+12,y:y-16,width,height:32,rx:7,fill:'var(--white)',stroke:'#bdcdca','stroke-width':1}));
      group.append(make('circle',{cx:x+26,cy:y,r:5.5,fill:'none',stroke:'#a96c43','stroke-width':1.5}),make('circle',{cx:x+33,cy:y,r:5.5,fill:'none',stroke:'#a96c43','stroke-width':1.5}));
      const text=make('text',{x:x+46,y:y+4,'font-size':13,fill:'#304e50','font-family':'Georgia,serif'});text.textContent=info.label;group.append(text);
      const title=make('title',{});title.textContent=info.title;group.append(title);badge.append(group);
    }
  }
  root.BerceauUnionStatus={isDivorced,summary,render};
})(globalThis);

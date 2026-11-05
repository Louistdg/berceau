(function(root){
  'use strict';
  function range(value){
    const m=String(value||'').match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);if(!m)return null;
    const y=+m[1],month=m[2]?+m[2]:null,day=m[3]?+m[3]:null;
    return {min:y*10000+(month||1)*100+(day||1),max:y*10000+(month||12)*100+(day||31)};
  }
  root.BerceauDates={validateOrder(birth,death){const b=range(birth),d=range(death);if(b&&d&&d.max<b.min)throw new Error('Le décès ne peut pas précéder la naissance.');return true;}};
})(globalThis);

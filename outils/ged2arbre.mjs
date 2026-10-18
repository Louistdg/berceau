// ged2arbre — petit programme qui transforme un fichier GEDCOM en donnees
// lisibles par l'application (le format de window.FAMILY_DATA).
//
// Usage : node ged2arbre.mjs <fichier.ged> <sortie.json>
import fs from 'node:fs';

const MOIS = { JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06', JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12' };

// « 23 FEB 1937 » -> 1937-02-23 ; « 1937 » -> 1937 ; le reste -> ''
function normaliserDate(brut) {
  if (!brut) return '';
  const t = String(brut).trim().toUpperCase().replace(/\s+/g, ' ');
  let m = t.match(/^(\d{1,2}) ([A-Z]{3}) (\d{4})$/);
  if (m && MOIS[m[2]]) return `${m[3]}-${MOIS[m[2]]}-${String(m[1]).padStart(2, '0')}`;
  m = t.match(/^([A-Z]{3}) (\d{4})$/);
  if (m && MOIS[m[1]]) return `${m[2]}-${MOIS[m[1]]}`;
  m = t.match(/^(\d{4})$/);
  if (m) return m[1];
  m = t.match(/^(?:ABT|ABOUT|EST|CIRCA|CA) ?(\d{4})$/);
  if (m) return m[1];
  return '';   // date floue : on ne devine pas
}

function lireGedcom(texte) {
  const lignes = texte.split(/\r?\n/);
  const personnes = new Map();   // @I1@ -> objet
  const familles = new Map();    // @F1@ -> objet
  let courant = null, dernierTag = null, niveauTag = null;

  for (const brute of lignes) {
    if (!brute.trim()) continue;
    const m = brute.match(/^(\d+)\s+(?:(@[^@]+@)\s+)?(\S+)(?:\s(.*))?$/);
    if (!m) continue;
    const niveau = Number(m[1]);
    const xref = m[2] || null;
    const tag = m[3];
    const valeur = (m[4] || '').trim();

    if (niveau === 0) {
      if (tag === 'INDI') { courant = { id: xref, name: '', givenName: '', surname: '', sex: '', birth: {}, death: {}, famc: [], fams: [], notes: [] }; personnes.set(xref, courant); }
      else if (tag === 'FAM') { courant = { id: xref, husb: null, wife: null, chil: [] }; familles.set(xref, courant); }
      else { courant = null; }
      dernierTag = null; niveauTag = tag;
      continue;
    }
    if (!courant) continue;

    // Les sous-blocs (BIRT, DEAT) portent les DATE / PLAC.
    if (['BIRT', 'DEAT', 'BURI', 'CHR'].includes(tag) && niveau === 1) {
      dernierTag = tag === 'BIRT' ? 'birth' : tag === 'DEAT' ? 'death' : null;
      continue;
    }
    if (niveau === 1 && tag !== 'DATE' && tag !== 'PLAC') dernierTag = null;

    if (tag === 'NAME' && 'givenName' in courant) {
      const mm = valeur.match(/^([^/]*)\/([^/]*)\//);
      courant.gedcomName = valeur;
      courant.givenName = mm ? mm[1].trim() : valeur.replace(/\//g, '').trim();
      courant.surname = mm ? mm[2].trim() : '';
      courant.name = [courant.givenName, courant.surname].filter(Boolean).join(' ');
    } else if (tag === 'SEX' && 'sex' in courant) {
      courant.sex = valeur === 'M' ? 'M' : valeur === 'F' ? 'F' : '';
    } else if (tag === 'DATE' && 'famc' in courant && (dernierTag === 'birth' || dernierTag === 'death')) {
      courant[dernierTag].date = normaliserDate(valeur);
      courant[dernierTag].dateBrute = valeur;
    } else if (tag === 'PLAC' && 'famc' in courant && (dernierTag === 'birth' || dernierTag === 'death')) {
      courant[dernierTag].place = valeur;
    } else if (tag === 'FAMC' && 'famc' in courant) {
      courant.famc.push(valeur);
    } else if (tag === 'FAMS' && 'fams' in courant) {
      courant.fams.push(valeur);
    } else if (tag === 'HUSB' && 'husb' in courant) {
      courant.husb = valeur;
    } else if (tag === 'WIFE' && 'wife' in courant) {
      courant.wife = valeur;
    } else if (tag === 'CHIL' && 'chil' in courant) {
      courant.chil.push(valeur);
    }
  }
  return { personnes, familles };
}

function convertir(texte, nomFichier) {
  const { personnes, familles } = lireGedcom(texte);

  // On construit les personnes au format de l'application.
  const people = [];
  const parId = new Map();
  for (const [id, p] of personnes) {
    const personne = {
      id, name: p.name || 'Unknown', givenName: p.givenName, surname: p.surname,
      gedcomName: p.gedcomName || '', marriedName: '', sex: p.sex,
      birth: { date: p.birth.date || '', place: p.birth.place || '', known: Boolean(p.birth.date) },
      death: { date: p.death.date || '', place: p.death.place || '', known: Boolean(p.death.date) },
      note: p.birth.dateBrute ? '' : ''
    };
    people.push(personne);
    parId.set(id, personne);
  }

  // Les familles, et les liens qui en decoulent.
  const families = [];
  const conjoints = new Map();   // id -> Set(ids)
  const enfants = new Map();     // id -> [ids]
  const parentsDe = new Map();   // id -> {pere, mere}
  for (const [id, f] of familles) {
    families.push({
      id,
      partnerIds: [f.husb, f.wife].filter(Boolean),
      childIds: f.chil.slice(),
      marriage: { date: '', place: '', exists: true }
    });
    if (f.husb && f.wife) {
      if (!conjoints.has(f.husb)) conjoints.set(f.husb, new Set());
      if (!conjoints.has(f.wife)) conjoints.set(f.wife, new Set());
      conjoints.get(f.husb).add(f.wife);
      conjoints.get(f.wife).add(f.husb);
    }
    for (const enfantId of f.chil) {
      if (!parentsDe.has(enfantId)) parentsDe.set(enfantId, {});
      const p = parentsDe.get(enfantId);
      if (f.husb) p.pere = f.husb;
      if (f.wife) p.mere = f.wife;
      const listeP = f.husb ? (enfants.get(f.husb) || []) : null;
      if (listeP) { listeP.push(enfantId); enfants.set(f.husb, listeP); }
      const listeM = f.wife ? (enfants.get(f.wife) || []) : null;
      if (listeM) { listeM.push(enfantId); enfants.set(f.wife, listeM); }
    }
  }
  for (const personne of people) {
    const p = parentsDe.get(personne.id) || {};
    personne.fatherId = p.pere || null;
    personne.motherId = p.mere || null;
    personne.spouseIds = [...(conjoints.get(personne.id) || [])];
    personne.childIds = (enfants.get(personne.id) || []).filter((v, i, a) => a.indexOf(v) === i);
  }

  // La personne de depart : celle qui a le plus de descendants connus.
  let racine = null, meilleur = -1;
  for (const personne of people) {
    let n = 0;
    const vus = new Set([personne.id]);
    const file = [personne.id];
    while (file.length) {
      const id = file.shift();
      for (const enfant of enfants.get(id) || []) {
        if (!vus.has(enfant)) { vus.add(enfant); n += 1; file.push(enfant); }
      }
    }
    if (n > meilleur) { meilleur = n; racine = personne; }
  }
  const rootId = racine ? racine.id : (people[0] ? people[0].id : null);

  // Les groupes de la colonne de gauche.
  const pere = racine ? racine.fatherId : null;
  const mere = racine ? racine.motherId : null;
  const famillePaternelle = pere ? descendantsEtAncetres(pere, enfants, personnes, parentsDe) : new Set();
  const familleMaternelle = mere ? descendantsEtAncetres(mere, enfants, personnes, parentsDe) : new Set();
  const tous = new Set(people.map((p) => p.id));
  const relies = new Set(famillesReliees(rootId, conjoints, enfants, parentsDe));
  const paternel = [...famillePaternelle].filter((id) => !familleMaternelle.has(id));
  const maternel = [...familleMaternelle].filter((id) => !famillePaternelle.has(id));

  return {
    meta: {
      schemaVersion: 1, sourceFile: nomFichier, exportDate: new Date().toISOString().slice(0, 10),
      peopleCount: people.length, familyCount: families.length, sourceCount: 0,
      rootName: racine ? racine.name : 'Unknown'
    },
    rootId, fatherId: pere, motherId: mere,
    people, families,
    sources: [], discrepancies: [],
    directAncestors: ancetresDe(rootId, parentsDe),
    groups: { paternel, maternel, unlinked: [...tous].filter((id) => !relies.has(id)), connected: [...relies], outsideBranches: [] },
    originalGroups: { paternel, maternel, unlinked: [...tous].filter((id) => !relies.has(id)) },
    diagrams: []
  };
}

function ancetresDe(id, parentsDe) {
  const vus = new Set(), sortie = [], file = [id];
  while (file.length) {
    const courant = file.shift();
    const p = parentsDe.get(courant) || {};
    for (const parent of [p.pere, p.mere]) {
      if (parent && !vus.has(parent)) { vus.add(parent); sortie.push(parent); file.push(parent); }
    }
  }
  return sortie;
}
function descendantsEtAncetres(id, enfants, personnes, parentsDe) {
  const vus = new Set();
  const file = [id];
  while (file.length) {
    const courant = file.shift();
    if (vus.has(courant)) continue;
    vus.add(courant);
    for (const enfant of enfants.get(courant) || []) file.push(enfant);
    const p = parentsDe.get(courant) || {};
    for (const parent of [p.pere, p.mere]) if (parent) file.push(parent);
  }
  return vus;
}
function famillesReliees(rootId, conjoints, enfants, parentsDe) {
  const vus = new Set();
  if (!rootId) return vus;
  const file = [rootId];
  while (file.length) {
    const id = file.shift();
    if (vus.has(id)) continue;
    vus.add(id);
    for (const c of conjoints.get(id) || []) file.push(c);
    for (const e of enfants.get(id) || []) file.push(e);
    const p = parentsDe.get(id) || {};
    for (const parent of [p.pere, p.mere]) if (parent) file.push(parent);
  }
  return vus;
}

/* ---------- execution ---------- */
const [entree, sortie] = process.argv.slice(2);
if (!entree || !sortie) { console.error('usage : node ged2arbre.mjs <fichier.ged> <sortie.json>'); process.exit(1); }
const texte = fs.readFileSync(entree, 'utf8');
const donnees = convertir(texte, entree.split(/[\\/]/).pop());
fs.writeFileSync(sortie, JSON.stringify(donnees), 'utf8');
console.log('  personnes : ' + donnees.people.length);
console.log('  familles  : ' + donnees.families.length);
console.log('  racine    : ' + donnees.meta.rootName + ' (' + donnees.rootId + ')');
console.log('  groupes   : paternel ' + donnees.groups.paternel.length + ', maternel ' + donnees.groups.maternel.length + ', sans lien ' + donnees.groups.unlinked.length);
console.log('  sortie    : ' + sortie + ' (' + Math.round(fs.statSync(sortie).size / 1024) + ' Ko)');

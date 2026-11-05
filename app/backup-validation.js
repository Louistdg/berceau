(function (root) {
  'use strict';

  const MAX_PHOTO_BYTES = 30 * 1024;
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  function fail(field, reason) {
    throw new Error('Sauvegarde invalide : ' + field + ' ' + reason + '.');
  }
  function record(value, field) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(field, 'doit être un objet');
    return value;
  }
  function array(value, field) {
    if (!Array.isArray(value)) fail(field, 'doit être une liste');
    return value;
  }
  function identifier(value, field) {
    if (typeof value !== 'string' || !value.trim()) fail(field, 'doit être un identifiant non vide');
    return value;
  }
  function collection(value, field) {
    const ids = new Set();
    array(value, field).forEach((item, index) => {
      record(item, field + '[' + index + ']');
      const id = identifier(item.id, field + '[' + index + '].id');
      if (ids.has(id)) fail(field, 'contient un identifiant en double : ' + id);
      ids.add(id);
    });
    return ids;
  }
  function reference(value, ids, field, nullable = false) {
    if (nullable && (value === null || value === undefined || value === '')) return;
    identifier(value, field);
    if (!ids.has(value)) fail(field, 'référence un identifiant absent : ' + value);
  }
  function references(value, ids, field) {
    array(value, field).forEach((id, index) => reference(id, ids, field + '[' + index + ']'));
  }
  function optionalReferences(object, key, ids, field) {
    if (own(object, key)) references(object[key], ids, field + '.' + key);
  }
  function eventDate(value, field) {
    record(value, field);
    for (const key of ['date', 'place']) {
      if (own(value, key) && typeof value[key] !== 'string') fail(field + '.' + key, 'doit être un texte');
    }
    if (own(value, 'known') && typeof value.known !== 'boolean') fail(field + '.known', 'doit être un booléen');
  }
  function citations(value, sources, field) {
    array(value, field).forEach((citation, index) => {
      const at = field + '[' + index + ']';
      record(citation, at);
      // Earlier cross-tree links retained citations without copying their source.
      // The UI renders these as unresolved references; retain their evidence.
      if (citation.sourceId !== undefined && citation.sourceId !== null && typeof citation.sourceId !== 'string') {
        fail(at + '.sourceId', 'doit être un identifiant textuel');
      }
    });
  }
  function events(object, sources, field) {
    if (own(object, 'citations')) citations(object.citations, sources, field + '.citations');
    if (!own(object, 'events')) return;
    array(object.events, field + '.events').forEach((event, index) => {
      const at = field + '.events[' + index + ']';
      record(event, at);
      if (typeof event.type !== 'string') fail(at + '.type', 'doit être un texte');
      if (own(event, 'citations')) citations(event.citations, sources, at + '.citations');
      if (own(event, 'notes')) array(event.notes, at + '.notes');
    });
  }
  function avatarPreferences(value, people, field) {
    record(value, field);
    for (const [id, slot] of Object.entries(value)) {
      reference(id, people, field);
      if (!Number.isInteger(slot) || slot < 0 || slot > 87) fail(field + '[' + id + ']', 'doit être un entier entre 0 et 87');
    }
  }
  function photos(value, people) {
    const seen = new Set();
    array(value, 'photos').forEach((photo, index) => {
      const at = 'photos[' + index + ']';
      record(photo, at);
      reference(photo.personId, people, at + '.personId');
      if (seen.has(photo.personId)) fail(at, 'contient une seconde photo pour la même personne');
      seen.add(photo.personId);
      if (own(photo, 'name') && typeof photo.name !== 'string') fail(at + '.name', 'doit être un texte');
      if (typeof photo.data !== 'string') fail(at + '.data', 'doit être une image JPEG intégrée');
      const match = photo.data.match(/^data:image\/jpeg;base64,((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/);
      if (!match || !match[1]) fail(at + '.data', 'doit être une image JPEG en base64 valide');
      const encoded = match[1], padding = encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0;
      const length = encoded.length / 4 * 3 - padding;
      if (length > MAX_PHOTO_BYTES) fail(at + '.data', 'dépasse 30 Ko');
      let decoded;
      try { decoded = root.atob(encoded); } catch (_) { fail(at + '.data', 'contient un encodage invalide'); }
      if (decoded.length < 4 || decoded.charCodeAt(0) !== 255 || decoded.charCodeAt(1) !== 216 || decoded.charCodeAt(2) !== 255) {
        fail(at + '.data', 'ne présente pas une signature JPEG');
      }
    });
  }

  function validate(pkg) {
    record(pkg, 'paquet');
    if (pkg.format !== 'berceau-backup' || pkg.version !== 1) fail('format', 'ne correspond pas à une sauvegarde Berceau v1');
    const tree = record(pkg.tree, 'tree');
    if (typeof tree.name !== 'string') fail('tree.name', 'doit être un texte');
    if (own(tree, 'modificationsLocales') && typeof tree.modificationsLocales !== 'boolean') fail('tree.modificationsLocales', 'doit être un booléen');
    const data = record(tree.data, 'tree.data');
    record(data.meta, 'tree.data.meta');
    const people = collection(data.people, 'people');
    const families = collection(data.families, 'families');
    const sources = collection(data.sources, 'sources');
    if (!own(data, 'rootId')) fail('rootId', 'est absent');
    if (people.size) reference(data.rootId, people, 'rootId');
    else if (data.rootId !== null) fail('rootId', 'doit être nul pour un arbre vide');
    for (const key of ['fatherId', 'motherId']) reference(data[key], people, key, true);

    data.people.forEach((person, index) => {
      const at = 'people[' + index + ']';
      if (typeof person.name !== 'string') fail(at + '.name', 'doit être un texte');
      eventDate(person.birth, at + '.birth');
      eventDate(person.death, at + '.death');
      for (const key of ['parents', 'children', 'partners', 'siblings']) references(person[key], people, at + '.' + key);
      for (const key of ['spouseIds', 'childIds']) optionalReferences(person, key, people, at);
      for (const key of ['fatherId', 'motherId']) reference(person[key], people, at + '.' + key, true);
      for (const key of ['parentFamilyIds', 'spouseFamilyIds']) optionalReferences(person, key, families, at);
      if (own(person, 'siblingDetails')) array(person.siblingDetails, at + '.siblingDetails').forEach((sibling, i) => {
        const field = at + '.siblingDetails[' + i + ']';
        record(sibling, field);
        reference(sibling.id, people, field + '.id');
        optionalReferences(sibling, 'sharedParentIds', people, field);
      });
      if (own(person, 'notes')) array(person.notes, at + '.notes');
      if (own(person, 'photos')) array(person.photos, at + '.photos');
      events(person, sources, at);
    });
    data.families.forEach((family, index) => {
      const at = 'families[' + index + ']';
      references(family.partnerIds, people, at + '.partnerIds');
      references(family.childIds, people, at + '.childIds');
      record(family.marriage, at + '.marriage');
      if (own(family, 'photos')) array(family.photos, at + '.photos');
      events(family, sources, at);
    });
    array(data.discrepancies, 'discrepancies').forEach((item, index) => {
      const at = 'discrepancies[' + index + ']';
      record(item, at);
      references(item.personIds, people, at + '.personIds');
      references(item.familyIds, families, at + '.familyIds');
    });
    references(data.directAncestors, people, 'directAncestors');
    const groups = record(data.groups, 'groups');
    for (const key of ['paternel', 'maternel', 'unlinked', 'connected', 'outsideBranches']) references(groups[key], people, 'groups.' + key);
    if (own(data, 'originalGroups')) {
      record(data.originalGroups, 'originalGroups');
      for (const [key, value] of Object.entries(data.originalGroups)) references(value, people, 'originalGroups.' + key);
    }
    if (own(data, 'diagrams')) array(data.diagrams, 'diagrams');
    if (own(tree, 'avatarPreferences')) avatarPreferences(tree.avatarPreferences, people, 'tree.avatarPreferences');
    if (own(data, 'avatarPreferences')) avatarPreferences(data.avatarPreferences, people, 'tree.data.avatarPreferences');
    photos(pkg.photos, people);
    // Stored meta counters are descriptive and can be stale in old v1 files.
    // Do not rewrite them, enforce partner cardinality, or mutate any data here.
    return pkg;
  }

  root.BerceauBackupValidation = { validate };
})(typeof window !== 'undefined' ? window : globalThis);

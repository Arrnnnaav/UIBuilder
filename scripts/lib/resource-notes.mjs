function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

export function serializeResourceNotes(resources) {
  const rows = [['id', 'name', 'my_take'], ...resources.map(({ id, name, my_take = '' }) => [id, name, my_take])];
  return `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
}

export function parseResourceNotes(csv) {
  const input = String(csv).replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"' && cell.length === 0) quoted = true;
    else if (char === ',') { row.push(cell); cell = ''; }
    else if (char === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += char;
  }
  if (quoted) throw new Error('CSV has an unclosed quoted field');
  if (cell.length || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); }
  if (!rows.length || rows[0].join(',') !== 'id,name,my_take') throw new Error('CSV header must be id,name,my_take');
  const result = new Map();
  for (const [line, values] of rows.slice(1).entries()) {
    if (values.length !== 3) throw new Error(`CSV row ${line + 2} must have exactly 3 columns`);
    const [id, , myTake] = values;
    if (!id) continue;
    if (result.has(id)) throw new Error(`Duplicate resource id in CSV: ${id}`);
    result.set(id, myTake);
  }
  return result;
}

export function applyResourceNotes(resources, notes) {
  const known = new Set(resources.map((resource) => resource.id));
  for (const id of notes.keys()) if (!known.has(id)) throw new Error(`Unknown resource id in CSV: ${id}`);
  return resources.map((resource) => notes.has(resource.id)
    ? { ...resource, my_take: notes.get(resource.id) }
    : resource);
}

export function patchResourceNotesJson(source, notes) {
  const lines = source.split(/\r?\n/);
  for (const [id, value] of notes) {
    const idIndex = lines.findIndex((line) => line.includes(`"id": ${JSON.stringify(id)}`));
    if (idIndex < 0) throw new Error(`Unknown resource id in JSON: ${id}`);
    let updated = false;
    for (let i = idIndex + 1; i < lines.length && !/"id"\s*:/.test(lines[i]); i++) {
      const match = lines[i].match(/^(\s*"my_take"\s*:\s*)(".*")(,?\s*)$/);
      if (match) {
        lines[i] = `${match[1]}${JSON.stringify(value)}${match[3]}`;
        updated = true;
        break;
      }
    }
    if (!updated) throw new Error(`Resource ${id} is missing its my_take field`);
  }
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  return lines.join(newline);
}

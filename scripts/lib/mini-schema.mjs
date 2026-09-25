// Minimal JSON Schema subset validator (type, required, enum, pattern, properties, items).
// Zero dependencies on purpose: brain files must be checkable anywhere.

const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v);

export function validate(schema, value, path = "$") {
  const errors = [];
  if (schema.type) {
    const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = typeOf(value);
    const ok = allowed.some((t) => t === actual || (t === "integer" && Number.isInteger(value)));
    if (!ok) return [`${path}: expected ${allowed.join("|")}, got ${actual}`];
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path}: ${JSON.stringify(value)} not in [${schema.enum.join(", ")}]`);
  }
  if (schema.pattern && typeof value === "string" && !new RegExp(schema.pattern).test(value)) {
    errors.push(`${path}: "${value}" does not match ${schema.pattern}`);
  }
  if (typeOf(value) === "object") {
    for (const key of schema.required ?? []) {
      if (!(key in value)) errors.push(`${path}: missing "${key}"`);
    }
    for (const [key, sub] of Object.entries(schema.properties ?? {})) {
      if (key in value) errors.push(...validate(sub, value[key], `${path}.${key}`));
    }
  }
  if (typeOf(value) === "array" && schema.items) {
    value.forEach((item, i) => errors.push(...validate(schema.items, item, `${path}[${i}]`)));
  }
  return errors;
}

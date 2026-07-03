export function normalizeGroupNameInput(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function buildGroupCodeFromName(name: string) {
  const base = normalizeGroupNameInput(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " Y ")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const code = base || "GRUPO";
  if (code.length <= 40) return code;

  const suffix = stableHash(code);
  const prefix = code.slice(0, 40 - suffix.length - 1).replace(/-+$/g, "");
  return `${prefix}-${suffix}`;
}

function stableHash(value: string) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
}

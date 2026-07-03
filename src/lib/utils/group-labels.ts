export function displayGroupName(name: string) {
  return name.replace(/\bMesa\b/gi, (match) => (match === match.toUpperCase() ? "GRUPO" : "Grupo"));
}

export function displayGroupCode(code: string) {
  return code.replace(/^MESA-/i, "GRUPO-");
}

export function getLookupCodesFromGroupCode(code: string) {
  const normalized = code.trim().toUpperCase();
  if (normalized.startsWith("GRUPO-")) return [normalized, normalized.replace(/^GRUPO-/, "MESA-")];
  if (normalized.startsWith("MESA-")) return [normalized, normalized.replace(/^MESA-/, "GRUPO-")];
  return [normalized];
}

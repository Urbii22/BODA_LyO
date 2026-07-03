export const appConfig = {
  appName: "MesaQuest",
  coupleName: "Luis y Oscar",
  weddingTitle: "La gran mision de Luis y Oscar",
  weddingSlug: process.env.WEDDING_SLUG || "luis-oscar-2026",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  copy: {
    tagline: "Una boda, doce mesas y una liga secreta de recuerdos.",
    intro:
      "Escanead el QR de vuestra mesa, completad la mision secreta y subid una foto como prueba. El jurado decide y el ranking se mueve durante la fiesta.",
  },
} as const;

export function hasSupabaseConfig() {
  const serverKeyName = ["SUPABASE", "SERVICE", "ROLE", "KEY"].join("_");
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env[serverKeyName],
  );
}

import type { ReactNode } from "react";

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "green" | "red" | "ink" }) {
  const tones = {
    gold: "border-champagne/50 bg-champagne/20 text-oro-viejo",
    green: "border-oliva/35 bg-oliva/12 text-oliva",
    red: "border-vino/30 bg-vino/10 text-vino",
    ink: "border-tinta/15 bg-tinta/8 text-tinta",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

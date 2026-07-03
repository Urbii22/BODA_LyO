import type { ReactNode } from "react";

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "green" | "red" | "ink" }) {
  const tones = {
    gold: "border-champagne/60 bg-champagne/18 text-oro-viejo",
    green: "border-oliva/45 bg-oliva/12 text-oliva",
    red: "border-vino/35 bg-vino/9 text-vino",
    ink: "border-tinta/20 bg-tinta/7 text-tinta",
  };

  return (
    <span className={`inline-flex items-center rounded-[0.25rem] border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

import type { Mission } from "../../lib/types/mission";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

const difficultyCopy: Record<Mission["difficulty"], string> = {
  easy: "facil",
  medium: "media",
  hard: "dificil",
  epic: "epica",
};

const categoryCopy: Record<Mission["category"], string> = {
  social: "social",
  photo: "foto",
  dance: "baile",
  emotional: "emocion",
  funny: "humor",
};

export function MissionCard({ mission }: { mission: Mission | null }) {
  if (!mission) {
    return (
      <Card>
        <Badge tone="ink">Mision en preparacion</Badge>
        <h2 className="mt-4 font-serif text-3xl font-bold">Los novios estan afinando el reto.</h2>
        <p className="mt-3 text-tinta/70">Guardad este QR y volved en unos minutos.</p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-vino/15 bg-white/90">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-oro-viejo">Mision rapida</p>
          <h2 className="mt-2 font-serif text-[34px] font-bold leading-[1.05] text-tinta">{mission.title}</h2>
        </div>
        <div className="grid min-h-16 min-w-16 shrink-0 place-items-center rounded-md bg-vino px-3 text-center text-white">
          <span className="block font-serif text-2xl font-bold leading-none">+{mission.points}</span>
          <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">pts</span>
        </div>
      </div>

      <p className="mt-5 rounded-md bg-marfil p-4 text-lg font-semibold leading-7 text-tinta">
        {mission.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{categoryCopy[mission.category]}</Badge>
        <Badge tone="ink">{difficultyCopy[mission.difficulty]}</Badge>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-vino">
        Haced una foto clara, subidla abajo y seguid la fiesta.
      </p>
    </Card>
  );
}

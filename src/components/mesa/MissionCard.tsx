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
        <h2 className="mt-4 font-serif text-3xl font-bold">Los novios estan afinando el encargo.</h2>
        <p className="mt-3 text-tinta/70">Guardad este QR y volved en unos minutos.</p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-4 top-4 rounded-full border border-champagne/40 bg-marfil px-4 py-2 font-serif text-2xl font-bold text-vino">
        {mission.points}
      </div>
      <div className="flex flex-wrap gap-2 pr-20">
        <Badge>{categoryCopy[mission.category]}</Badge>
        <Badge tone="ink">{difficultyCopy[mission.difficulty]}</Badge>
      </div>
      <h1 className="mt-5 max-w-xl font-serif text-4xl font-bold leading-tight text-tinta">{mission.title}</h1>
      <p className="mt-4 text-base leading-7 text-tinta/74">{mission.description}</p>
    </Card>
  );
}

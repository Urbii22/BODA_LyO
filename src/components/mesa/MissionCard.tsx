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
        <h2 className="mt-4 text-balance font-serif text-4xl font-bold leading-tight">Los novios estan afinando el encargo.</h2>
        <p className="mt-3 text-graphite">Guardad este QR y volved en unos minutos.</p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-1 top-5 rotate-2 border-y border-l border-tinta/20 bg-champagne/25 px-5 py-2 font-hand text-3xl font-bold text-vino">
        {mission.points} pts
      </div>
      <div className="flex flex-wrap gap-2 pr-20">
        <Badge>{categoryCopy[mission.category]}</Badge>
        <Badge tone="ink">{difficultyCopy[mission.difficulty]}</Badge>
      </div>
      <h1 className="mt-5 max-w-xl text-balance font-serif text-5xl font-bold leading-[0.95] text-tinta">{mission.title}</h1>
      <div className="sketch-rule mt-5" />
      <p className="mt-5 max-w-[58ch] text-lg leading-8 text-graphite">{mission.description}</p>
    </Card>
  );
}

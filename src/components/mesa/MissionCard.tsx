"use client";

import type { Mission } from "../../lib/types/mission";
import { getMissionModeCopy } from "../../lib/utils/mission-mode-copy";
import {
  calculateSubmissionPoints,
  getSubmissionModeLabel,
  getSubmissionModeShortLabel,
  type SubmissionMode,
} from "../../lib/utils/submission-mode";
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

type MissionCardProps = {
  mission: Mission | null;
  mode: SubmissionMode;
  onModeChange: (mode: SubmissionMode) => void;
};

export function MissionCard({ mission, mode, onModeChange }: MissionCardProps) {
  if (!mission) {
    return (
      <Card>
        <Badge tone="ink">Mision en preparacion</Badge>
        <h2 className="mt-4 font-serif text-3xl font-bold">Los novios estan afinando el reto.</h2>
        <p className="mt-3 text-tinta/70">Guardad este QR y volved en unos minutos.</p>
      </Card>
    );
  }

  const missionCopy = getMissionModeCopy(mission, mode);
  const points = calculateSubmissionPoints(mission.points, mode);

  return (
    <Card className="relative overflow-hidden border-vino/15 bg-white/90">
      <div className="grid grid-cols-2 gap-2 rounded-md bg-marfil p-1">
        {(["normal", "bold"] as const).map((item) => {
          const isActive = mode === item;

          return (
            <button
              key={item}
              type="button"
              className={`rounded-md px-3 py-3 text-sm font-bold transition ${
                isActive ? "bg-vino text-white shadow-sm" : "text-tinta/70 hover:bg-white"
              }`}
              onClick={() => onModeChange(item)}
            >
              <span className="block">{getSubmissionModeLabel(item)}</span>
              <span className={`mt-1 block text-xs ${isActive ? "text-white/70" : "text-tinta/45"}`}>
                {item === "bold" ? "+25% puntos" : "mision base"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-oro-viejo">Mision rapida</p>
          <h2 className="mt-2 font-serif text-[34px] font-bold leading-[1.05] text-tinta">{missionCopy.title}</h2>
        </div>
        <div className="grid min-h-16 min-w-16 shrink-0 place-items-center rounded-md bg-vino px-3 text-center text-white">
          <span className="block font-serif text-2xl font-bold leading-none">+{points}</span>
          <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">pts</span>
        </div>
      </div>

      <p className="mt-5 rounded-md bg-marfil p-4 text-lg font-semibold leading-7 text-tinta">
        {missionCopy.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{categoryCopy[mission.category]}</Badge>
        <Badge tone="ink">{difficultyCopy[mission.difficulty]}</Badge>
        <Badge tone={mode === "bold" ? "red" : "green"}>
          {getSubmissionModeShortLabel(mode)}
        </Badge>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-vino">
        Haced una foto clara, subidla abajo y seguid la fiesta.
      </p>
    </Card>
  );
}

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
        <h2 className="mt-4 text-balance font-serif text-4xl font-bold leading-tight">
          Los novios estan afinando el encargo.
        </h2>
        <p className="mt-3 text-graphite">Guardad este QR y volved en unos minutos.</p>
      </Card>
    );
  }

  const missionCopy = getMissionModeCopy(mission, mode);
  const points = calculateSubmissionPoints(mission.points, mode);

  return (
    <Card className="relative overflow-hidden">
      <p className="hand-label text-lavanda">Elegid modo</p>
      <div className="mt-2 grid grid-cols-2 gap-2 rounded-[0.3rem] border border-tinta/15 bg-marfil/72 p-1">
        {(["normal", "bold"] as const).map((item) => {
          const isActive = mode === item;

          return (
            <button
              key={item}
              type="button"
              aria-pressed={isActive}
              className={`rounded-[0.25rem] px-3 py-3 text-left text-sm font-bold transition ${
                isActive
                  ? "bg-tinta text-marfil shadow-[0_6px_0_rgba(45,42,40,0.12)]"
                  : "text-graphite hover:bg-white/78"
              }`}
              onClick={() => onModeChange(item)}
            >
              <span className="block leading-tight">{getSubmissionModeLabel(item)}</span>
              <span className={`mt-1 block text-xs ${isActive ? "text-marfil/72" : "text-graphite/64"}`}>
                ({item === "bold" ? "x1,25 puntos" : "x1 puntos"})
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-oro-viejo">Mision rapida</p>
          <h2 className="mt-2 text-balance font-serif text-5xl font-bold leading-[0.95] text-tinta">
            {missionCopy.title}
          </h2>
        </div>
        <div className="grid min-h-16 min-w-16 shrink-0 place-items-center rounded-[0.3rem] bg-vino px-3 text-center text-marfil">
          <span className="block font-serif text-2xl font-bold leading-none">+{points}</span>
          <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-marfil/72">pts</span>
        </div>
      </div>

      <div className="sketch-rule mt-5" />
      <p className="mt-5 max-w-[58ch] text-lg font-semibold leading-8 text-graphite">{missionCopy.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{categoryCopy[mission.category]}</Badge>
        <Badge tone="ink">{difficultyCopy[mission.difficulty]}</Badge>
        <Badge tone={mode === "bold" ? "red" : "green"}>
          {getSubmissionModeLabel(mode)} {getSubmissionModeShortLabel(mode)}
        </Badge>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-graphite">
        Haced una foto clara, subidla abajo y seguid la fiesta.
      </p>
    </Card>
  );
}

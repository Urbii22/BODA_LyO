"use client";

import { useState } from "react";
import { deleteMission, toggleMissionActive, updateMission } from "../../actions/missions.actions";
import type { Mission } from "../../lib/types/mission";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MissionForm } from "./MissionForm";

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

type Props = {
  mission: Mission;
  usage: { tables: number; submissions: number };
};

export function MissionEditRow({ mission, usage }: Props) {
  const [editing, setEditing] = useState(false);
  const inUse = usage.tables > 0 || usage.submissions > 0;

  return (
    <Card className={mission.isActive ? "" : "opacity-70"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-3xl font-bold leading-none">{mission.title}</h3>
            {!mission.isActive ? <Badge tone="ink">oculta</Badge> : null}
          </div>
          <p className="mt-2 max-w-[60ch] text-sm text-graphite">{mission.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <Badge>{categoryCopy[mission.category]}</Badge>
            <Badge tone="ink">{difficultyCopy[mission.difficulty]}</Badge>
            <span className="font-bold text-vino">{mission.points} pts</span>
            <span className="text-graphite">
              {usage.tables > 0 ? `En ${usage.tables} grupo${usage.tables > 1 ? "s" : ""}` : "Sin grupo"}
              {usage.submissions > 0 ? ` · ${usage.submissions} prueba${usage.submissions > 1 ? "s" : ""}` : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" onClick={() => setEditing((v) => !v)}>
            {editing ? "Cerrar" : "Editar"}
          </Button>
          <form action={toggleMissionActive}>
            <input type="hidden" name="missionId" value={mission.id} />
            <input type="hidden" name="active" value={(!mission.isActive).toString()} />
            <Button type="submit" variant="ghost">{mission.isActive ? "Ocultar" : "Mostrar"}</Button>
          </form>
          {inUse ? (
            <span className="self-center text-xs text-graphite" title="Reasigna el grupo o borra sus pruebas antes.">
              en uso
            </span>
          ) : (
            <form action={deleteMission}>
              <input type="hidden" name="missionId" value={mission.id} />
              <Button type="submit" variant="danger">Borrar</Button>
            </form>
          )}
        </div>
      </div>
      {editing ? (
        <div className="mt-4 border-t border-tinta/10 pt-4">
          <MissionForm
            action={updateMission}
            mission={mission}
            submitLabel="Guardar cambios"
            onSuccess={() => setEditing(false)}
          />
        </div>
      ) : null}
    </Card>
  );
}

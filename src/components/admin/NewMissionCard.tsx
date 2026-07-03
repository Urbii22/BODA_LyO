"use client";

import { useState } from "react";
import { createMission } from "../../actions/missions.actions";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MissionForm } from "./MissionForm";

export function NewMissionCard() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-dashed">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-bold leading-none">Nueva mision</h2>
          <p className="mt-1 text-sm text-graphite">Anade un reto al vuelo. Luego asignalo a una mesa abajo.</p>
        </div>
        <Button type="button" variant={open ? "ghost" : "primary"} onClick={() => setOpen((v) => !v)}>
          {open ? "Cerrar" : "Crear mision"}
        </Button>
      </div>
      {open ? (
        <div className="mt-4 border-t border-tinta/10 pt-4">
          <MissionForm action={createMission} submitLabel="Crear mision" resetOnSuccess />
        </div>
      ) : null}
    </Card>
  );
}

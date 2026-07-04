"use client";

import { useActionState, useState } from "react";
import { launchMission } from "../../actions/missions.actions";
import { missionInitialState } from "../../actions/mission-action-state";
import type { Mission } from "../../lib/types/mission";
import type { WeddingTable } from "../../lib/types/table";
import { displayGroupCode, displayGroupName } from "../../lib/utils/group-labels";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Textarea } from "../ui/Textarea";

const selectClass =
  "min-h-12 w-full rounded-[0.3rem] border border-tinta/25 bg-[#fffaf0] px-3 py-2 text-base text-tinta outline-none transition disabled:opacity-55 focus:border-lavanda focus:ring-4 focus:ring-lavanda/15";

type Props = {
  missions: Mission[];
  tables: WeddingTable[];
};

export function MissionLaunchCard({ missions, tables }: Props) {
  const [state, formAction, isPending] = useActionState(launchMission, missionInitialState);
  const [targetMode, setTargetMode] = useState<"all" | "group">("all");
  const activeMissions = missions.filter((mission) => mission.isActive);
  const canLaunch = activeMissions.length > 0 && tables.length > 0;

  return (
    <Card className="border-tinta bg-tinta text-marfil shadow-[0_18px_50px_rgba(45,42,40,0.18)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="hand-label text-lavanda-suave">Directo del jurado</p>
          <h2 className="mt-1 font-serif text-4xl font-bold leading-none">Lanzar mision</h2>
        </div>
        <span className="rounded-[0.25rem] border border-marfil/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-champagne">
          Push
        </span>
      </div>

      <form action={formAction} className="mt-5 grid gap-4">
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-champagne">Mision</span>
          <select name="missionId" className={selectClass} disabled={!canLaunch} required>
            {activeMissions.length === 0 ? (
              <option value="">No hay misiones activas</option>
            ) : (
              activeMissions.map((mission) => (
                <option key={mission.id} value={mission.id}>
                  {mission.title} · {mission.points} pts
                </option>
              ))
            )}
          </select>
        </label>

        <fieldset className="grid gap-2">
          <legend className="text-xs font-bold uppercase tracking-[0.1em] text-champagne">Destino</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex min-h-12 items-center gap-3 rounded-[0.3rem] border border-marfil/20 bg-marfil/8 px-3 py-2 text-sm font-bold">
              <input
                type="radio"
                name="targetMode"
                value="all"
                checked={targetMode === "all"}
                onChange={() => setTargetMode("all")}
              />
              Todos los grupos
            </label>
            <label className="flex min-h-12 items-center gap-3 rounded-[0.3rem] border border-marfil/20 bg-marfil/8 px-3 py-2 text-sm font-bold">
              <input
                type="radio"
                name="targetMode"
                value="group"
                checked={targetMode === "group"}
                onChange={() => setTargetMode("group")}
              />
              Un grupo
            </label>
          </div>
        </fieldset>

        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-champagne">Grupo</span>
          <select name="tableId" className={selectClass} disabled={targetMode === "all" || tables.length === 0}>
            {tables.length === 0 ? (
              <option value="">No hay grupos registrados</option>
            ) : (
              tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {displayGroupName(table.name)} · {displayGroupCode(table.code)}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-champagne">Aviso</span>
          <Textarea
            name="message"
            maxLength={180}
            className="min-h-20 bg-marfil text-tinta"
            placeholder="Entrad ahora y participad."
          />
        </label>

        {state.message ? (
          <p className={`rounded-[0.3rem] border p-3 text-sm font-bold ${state.ok ? "border-oliva/40 bg-oliva/18 text-marfil" : "border-vino/35 bg-vino/20 text-champagne"}`}>
            {state.message}
          </p>
        ) : null}

        <div>
          <Button type="submit" variant="secondary" disabled={!canLaunch || isPending}>
            {isPending ? "Lanzando..." : "Lanzar ahora"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

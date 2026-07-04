"use client";

import { useActionState, useEffect, useRef } from "react";
import { type MissionActionState, missionInitialState } from "../../actions/mission-action-state";
import type { Mission } from "../../lib/types/mission";
import type { WeddingTable } from "../../lib/types/table";
import { displayGroupCode, displayGroupName } from "../../lib/utils/group-labels";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const selectClass =
  "min-h-12 w-full rounded-[0.3rem] border border-tinta/25 bg-[#fffaf0] px-3 py-2 text-base text-tinta outline-none transition focus:border-lavanda focus:ring-4 focus:ring-lavanda/15";

type Props = {
  action: (state: MissionActionState, formData: FormData) => Promise<MissionActionState>;
  table?: WeddingTable;
  missions: Mission[];
  submitLabel: string;
  defaultDisplayOrder?: number;
  resetOnSuccess?: boolean;
  onSuccess?: () => void;
};

export function TableForm({ action, table, missions, submitLabel, defaultDisplayOrder = 0, resetOnSuccess, onSuccess }: Props) {
  const [state, formAction, isPending] = useActionState(action, missionInitialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    if (resetOnSuccess) formRef.current?.reset();
    onSuccess?.();
  }, [state, resetOnSuccess, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3">
      {table ? <input type="hidden" name="tableId" value={table.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-[1.3fr_0.8fr_0.5fr]">
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Nombre</span>
          <Input name="name" defaultValue={table ? displayGroupName(table.name) : undefined} placeholder="Grupo 12" required maxLength={80} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Codigo QR</span>
          <Input name="code" defaultValue={table ? displayGroupCode(table.code) : undefined} placeholder="GRUPO-12" required maxLength={40} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Orden</span>
          <Input name="displayOrder" type="number" min={0} max={999} defaultValue={table?.displayOrder ?? defaultDisplayOrder} required />
        </label>
      </div>
      <label className="grid gap-1">
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Mision asignada</span>
        <select name="missionId" defaultValue={table?.missionId ?? ""} className={selectClass}>
          <option value="">Sin mision asignada</option>
          {missions.map((mission) => (
            <option key={mission.id} value={mission.id}>
              {mission.title}
              {mission.isActive ? "" : " (oculta)"}
            </option>
          ))}
        </select>
      </label>
      {state.message ? (
        <p className={`text-sm font-semibold ${state.ok ? "text-oliva" : "text-vino"}`}>{state.message}</p>
      ) : null}
      <div>
        <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : submitLabel}</Button>
      </div>
    </form>
  );
}

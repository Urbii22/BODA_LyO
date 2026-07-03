"use client";

import { useActionState, useEffect, useRef } from "react";
import { type MissionActionState, missionInitialState } from "../../actions/mission-action-state";
import type { Mission } from "../../lib/types/mission";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

const difficulties: Array<[Mission["difficulty"], string]> = [
  ["easy", "Facil"],
  ["medium", "Media"],
  ["hard", "Dificil"],
  ["epic", "Epica"],
];

const categories: Array<[Mission["category"], string]> = [
  ["social", "Social"],
  ["photo", "Foto"],
  ["dance", "Baile"],
  ["emotional", "Emocion"],
  ["funny", "Humor"],
];

const selectClass =
  "min-h-12 w-full rounded-[0.3rem] border border-tinta/25 bg-[#fffaf0] px-3 py-2 text-base text-tinta outline-none transition focus:border-lavanda focus:ring-4 focus:ring-lavanda/15";

type Props = {
  action: (state: MissionActionState, formData: FormData) => Promise<MissionActionState>;
  mission?: Mission;
  submitLabel: string;
  resetOnSuccess?: boolean;
  onSuccess?: () => void;
};

export function MissionForm({ action, mission, submitLabel, resetOnSuccess, onSuccess }: Props) {
  const [state, formAction, isPending] = useActionState(action, missionInitialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    if (resetOnSuccess) formRef.current?.reset();
    onSuccess?.();
  }, [state, resetOnSuccess, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3">
      {mission ? <input type="hidden" name="missionId" value={mission.id} /> : null}
      <label className="grid gap-1">
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Titulo</span>
        <Input name="title" defaultValue={mission?.title} required maxLength={120} />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Descripcion</span>
        <Textarea name="description" defaultValue={mission?.description} required maxLength={600} />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Puntos</span>
          <Input name="points" type="number" min={1} max={1000} defaultValue={mission?.points ?? 50} required />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Dificultad</span>
          <select name="difficulty" defaultValue={mission?.difficulty ?? "medium"} className={selectClass}>
            {difficulties.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Categoria</span>
          <select name="category" defaultValue={mission?.category ?? "social"} className={selectClass}>
            {categories.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>
      {state.message ? (
        <p className={`text-sm font-semibold ${state.ok ? "text-oliva" : "text-vino"}`}>{state.message}</p>
      ) : null}
      <div>
        <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : submitLabel}</Button>
      </div>
    </form>
  );
}

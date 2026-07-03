"use client";

import { useActionState } from "react";
import { updateWedding } from "../../actions/settings.actions";
import { missionInitialState } from "../../actions/mission-action-state";
import type { Wedding } from "../../lib/types/wedding";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

export function WeddingSettingsForm({ wedding }: { wedding: Wedding }) {
  const [state, formAction, isPending] = useActionState(updateWedding, missionInitialState);

  return (
    <Card>
      <p className="hand-label text-lavanda">Datos base</p>
      <h2 className="font-serif text-4xl font-bold leading-none">Boda</h2>
      <form action={formAction} className="mt-4 grid gap-3">
        <input type="hidden" name="weddingId" value={wedding.id} />
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Pareja</span>
          <Input name="coupleName" defaultValue={wedding.coupleName} required maxLength={120} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Titulo interno</span>
          <Input name="title" defaultValue={wedding.title} required maxLength={160} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-graphite">Fecha</span>
          <Input name="weddingDate" type="date" defaultValue={wedding.weddingDate ?? ""} />
        </label>
        {state.message ? (
          <p className={`text-sm font-semibold ${state.ok ? "text-oliva" : "text-vino"}`}>{state.message}</p>
        ) : null}
        <div>
          <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar datos"}</Button>
        </div>
      </form>
    </Card>
  );
}

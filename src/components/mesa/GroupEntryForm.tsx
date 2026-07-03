"use client";

import { useActionState } from "react";
import { enterGroup, type GroupEntryActionState } from "../../actions/group-entry.actions";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

const initialState: GroupEntryActionState = {
  ok: false,
  message: "",
  groupName: "",
};

export function GroupEntryForm() {
  const [state, formAction, isPending] = useActionState(enterGroup, initialState);

  return (
    <Card>
      <p className="hand-label text-lavanda">Acceso al juego</p>
      <h2 className="mt-1 font-serif text-4xl font-bold leading-none">Vuestro grupo</h2>
      <form action={formAction} className="mt-4 space-y-4">
        <label className="block">
          <span className="text-sm font-bold uppercase tracking-[0.08em] text-graphite">Nombre</span>
          <Input
            name="groupName"
            minLength={2}
            maxLength={80}
            required
            autoComplete="organization"
            defaultValue={state.groupName}
            placeholder="Ej. Los primos"
          />
        </label>
        {state.message ? (
          <p className="rounded-[0.3rem] border border-vino/25 bg-vino/10 p-3 text-sm font-bold text-vino">
            {state.message}
          </p>
        ) : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Card>
  );
}

"use client";

import { useActionState } from "react";
import { adminLogin, type AdminLoginState } from "../../actions/admin.actions";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

const initialState: AdminLoginState = { ok: false, message: "" };

export function AdminLogin() {
  const [state, formAction, isPending] = useActionState(adminLogin, initialState);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-vino">Jurado</p>
        <h1 className="mt-3 font-serif text-3xl font-bold">Acceso admin</h1>
        <form action={formAction} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">PIN</span>
            <Input name="pin" type="password" inputMode="numeric" minLength={6} required autoFocus />
          </label>
          {state.message ? <p className="text-sm font-semibold text-vino">{state.message}</p> : null}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Comprobando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </main>
  );
}

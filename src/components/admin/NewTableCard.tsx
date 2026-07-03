"use client";

import { createTable } from "../../actions/tables.actions";
import type { Mission } from "../../lib/types/mission";
import { Card } from "../ui/Card";
import { TableForm } from "./TableForm";

export function NewTableCard({ missions, nextOrder }: { missions: Mission[]; nextOrder: number }) {
  return (
    <Card>
      <div className="mb-4">
        <p className="hand-label text-lavanda">Nuevo grupo</p>
        <h2 className="font-serif text-4xl font-bold leading-none">Anadir grupo</h2>
      </div>
      <TableForm
        action={createTable}
        missions={missions}
        submitLabel="Crear grupo"
        defaultDisplayOrder={nextOrder}
        resetOnSuccess
      />
      <p className="mt-3 text-xs text-graphite">
        Sugerencia de orden para la siguiente: {nextOrder}. El codigo es el que vive en el QR.
      </p>
    </Card>
  );
}

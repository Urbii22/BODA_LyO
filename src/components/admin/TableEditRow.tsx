"use client";

import { useState } from "react";
import { deleteTable, updateTable } from "../../actions/tables.actions";
import type { Mission } from "../../lib/types/mission";
import type { WeddingTable } from "../../lib/types/table";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { TableForm } from "./TableForm";

type Props = {
  table: WeddingTable;
  mission: Mission | null;
  missions: Mission[];
  usage: { submissions: number; approved: number; points: number };
};

export function TableEditRow({ table, mission, missions, usage }: Props) {
  const [editing, setEditing] = useState(false);
  const hasSubmissions = usage.submissions > 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-3xl font-bold leading-none">{table.name}</h3>
            <Badge tone="ink">{table.code}</Badge>
          </div>
          <p className="mt-2 text-sm text-graphite">
            Orden {table.displayOrder}
            {mission ? ` · ${mission.title}` : " · sin mision"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Badge>{usage.submissions} envios</Badge>
            <Badge tone="green">{usage.approved} aprobadas</Badge>
            <span className="font-bold text-vino">{usage.points} pts</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" onClick={() => setEditing((value) => !value)}>
            {editing ? "Cerrar" : "Editar"}
          </Button>
          {hasSubmissions ? (
            <span className="self-center text-xs text-graphite" title="Tiene pruebas enviadas. Borrarla perderia historial.">
              protegida
            </span>
          ) : (
            <form action={deleteTable}>
              <input type="hidden" name="tableId" value={table.id} />
              <Button type="submit" variant="danger">Borrar</Button>
            </form>
          )}
        </div>
      </div>
      {editing ? (
        <div className="mt-4 border-t border-tinta/10 pt-4">
          <p className="mb-3 text-xs font-semibold text-vino">
            Si cambias el codigo, los QR ya impresos de esta mesa dejaran de apuntar al enlace antiguo.
          </p>
          <TableForm
            action={updateTable}
            table={table}
            missions={missions}
            submitLabel="Guardar mesa"
            onSuccess={() => setEditing(false)}
          />
        </div>
      ) : null}
    </Card>
  );
}

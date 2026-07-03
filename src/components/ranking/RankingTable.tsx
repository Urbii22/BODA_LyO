import type { RankingRow } from "../../lib/types/ranking";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export function RankingTable({ rows, highlightTop = false }: { rows: RankingRow[]; highlightTop?: boolean }) {
  if (rows.length === 0) {
    return (
      <Card>
        <p className="text-tinta/70">El marcador esta esperando su primer golpe de efecto.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <Card
          key={row.tableId}
          className={`flex items-center justify-between gap-4 ${highlightTop && index < 3 ? "border-champagne/70 bg-white" : ""}`}
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-md bg-tinta font-serif text-xl font-bold text-marfil">
              {index + 1}
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-2xl font-bold">{row.tableName}</p>
              <p className="text-sm text-tinta/55">
                {row.tableCode} · {row.approvedCount} aprobada{row.approvedCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <Badge tone={index === 0 ? "gold" : "ink"}>{row.totalPoints} pts</Badge>
        </Card>
      ))}
    </div>
  );
}

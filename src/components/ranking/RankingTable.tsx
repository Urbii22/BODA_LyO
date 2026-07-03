import type { RankingRow } from "../../lib/types/ranking";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export function RankingTable({ rows, highlightTop = false }: { rows: RankingRow[]; highlightTop?: boolean }) {
  if (rows.length === 0) {
    return (
      <Card>
        <p className="text-graphite">El marcador esta esperando su primer golpe de efecto.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <Card
          key={row.tableId}
          className={`flex items-center justify-between gap-4 ${
            highlightTop && index === 0
              ? "bg-champagne/24"
              : highlightTop && index < 3
                ? "bg-white/82"
                : ""
          }`}
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[0.3rem] border border-tinta/30 bg-tinta font-serif text-2xl font-bold leading-none text-marfil lining-nums tabular-nums">
              <span className="translate-y-[0.08em]">{index + 1}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-3xl font-bold leading-none">{row.tableName}</p>
              <p className="mt-1 text-sm font-semibold text-graphite">
                {row.tableCode} · {row.approvedCount} aprobadas
              </p>
            </div>
          </div>
          <Badge tone={index === 0 ? "gold" : "ink"}>{row.totalPoints} pts</Badge>
        </Card>
      ))}
    </div>
  );
}

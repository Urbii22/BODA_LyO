import type { WeddingTable } from "../../lib/types/table";
import { QRCard } from "./QRCard";

export function QRGrid({ tables }: { tables: WeddingTable[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-2">
      {tables.map((table) => (
        <QRCard key={table.id} table={table} />
      ))}
    </div>
  );
}

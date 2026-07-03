"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { WeddingTable } from "../../lib/types/table";
import { generateQrUrl } from "../../lib/utils/generate-qr-url";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function QRCard({ table }: { table: WeddingTable }) {
  const [qr, setQr] = useState("");
  const url = generateQrUrl(table.code);

  useEffect(() => {
    QRCode.toDataURL(url, { width: 512, margin: 1 }).then(setQr).catch(() => setQr(""));
  }, [url]);

  return (
    <Card className="break-inside-avoid text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/escudos.png" alt="" className="mx-auto mb-2 h-11" />
      <h2 className="font-serif text-2xl font-bold">{table.name}</h2>
      <p className="text-sm font-semibold text-vino">{table.code}</p>
      {qr ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt={`QR de ${table.name}`} className="mx-auto my-4 size-56" />
      ) : (
        <div className="mx-auto my-4 grid size-56 place-items-center rounded-md bg-marfil text-sm text-tinta/55">Generando QR</div>
      )}
      <p className="break-all text-xs text-tinta/55">{url}</p>
      <Button type="button" variant="ghost" className="no-print mt-3" onClick={() => navigator.clipboard.writeText(url)}>
        Copiar enlace
      </Button>
    </Card>
  );
}

"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { WeddingTable } from "../../lib/types/table";
import { generateQrUrl } from "../../lib/utils/generate-qr-url";
import { displayGroupCode, displayGroupName } from "../../lib/utils/group-labels";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { LavenderDivider } from "../wedding/InvitationArt";

export function QRCard({ table }: { table: WeddingTable }) {
  const [qr, setQr] = useState("");
  const url = generateQrUrl(table.code);
  const groupName = displayGroupName(table.name);
  const groupCode = displayGroupCode(table.code);

  useEffect(() => {
    QRCode.toDataURL(url, { width: 512, margin: 1, color: { dark: "#2d2a28", light: "#fbf3df" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [url]);

  return (
    <Card className="break-inside-avoid text-center">
      <p className="hand-label text-lavanda">{groupCode}</p>
      <h2 className="font-serif text-4xl font-bold leading-none">{groupName}</h2>
      <div className="mx-auto mt-3 max-w-xs">
        <LavenderDivider />
      </div>
      {qr ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt={`QR de ${groupName}`} className="mx-auto my-4 size-56 rounded-[0.25rem] border border-tinta/18" />
      ) : (
        <div className="mx-auto my-4 grid size-56 place-items-center rounded-[0.3rem] bg-marfil text-sm text-graphite">Generando QR</div>
      )}
      <p className="break-all text-xs font-semibold text-graphite">{url}</p>
      <Button type="button" variant="ghost" className="no-print mt-3" onClick={() => navigator.clipboard.writeText(url)}>
        Copiar enlace
      </Button>
    </Card>
  );
}

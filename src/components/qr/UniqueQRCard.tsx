"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { generateGroupEntryUrl } from "../../lib/utils/generate-qr-url";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { LavenderDivider } from "../wedding/InvitationArt";

export function UniqueQRCard() {
  const [qr, setQr] = useState("");
  const url = generateGroupEntryUrl();

  useEffect(() => {
    QRCode.toDataURL(url, { width: 512, margin: 1, color: { dark: "#2d2a28", light: "#fbf3df" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [url]);

  return (
    <Card className="mx-auto max-w-md text-center">
      <p className="hand-label text-lavanda">QR unico</p>
      <h2 className="font-serif text-4xl font-bold leading-none">Entrada de grupos</h2>
      <div className="mx-auto mt-3 max-w-xs">
        <LavenderDivider />
      </div>
      {qr ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt="QR unico de entrada al juego" className="mx-auto my-4 size-64 rounded-[0.25rem] border border-tinta/18" />
      ) : (
        <div className="mx-auto my-4 grid size-64 place-items-center rounded-[0.3rem] bg-marfil text-sm text-graphite">Generando QR</div>
      )}
      <p className="break-all text-xs font-semibold text-graphite">{url}</p>
      <Button type="button" variant="ghost" className="no-print mt-3" onClick={() => navigator.clipboard.writeText(url)}>
        Copiar enlace
      </Button>
    </Card>
  );
}

"use client";

import { useActionState, useRef, useState } from "react";
import { createSubmission, type SubmissionActionState } from "../../actions/submissions.actions";
import { compressImage } from "../../lib/utils/compress-image";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Textarea } from "../ui/Textarea";

const initialState: SubmissionActionState = { ok: false, message: "" };

export function SubmissionForm({ tableCode }: { tableCode: string }) {
  const [state, formAction, isPending] = useActionState(createSubmission, initialState);
  const [preview, setPreview] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError("");
    setPreview("");
    setFileName("");

    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImage(file);
      const normalizedFile = new File([compressed], `${crypto.randomUUID()}.jpg`, {
        type: "image/jpeg",
      });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(normalizedFile);
      if (fileInputRef.current) fileInputRef.current.files = dataTransfer.files;
      setFileName("Foto lista para enviar");
      setPreview(URL.createObjectURL(normalizedFile));
    } catch {
      setFileError("No se pudo preparar la foto. Prueba con otra imagen.");
    } finally {
      setIsCompressing(false);
    }
  }

  return (
    <Card>
      <p className="hand-label text-lavanda">La prueba</p>
      <h2 className="mt-1 font-serif text-4xl font-bold leading-none">Subid vuestra foto</h2>
      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="tableCode" value={tableCode} />
        <label className="block">
          <span className="text-sm font-bold uppercase tracking-[0.08em] text-graphite">Comentario</span>
          <Textarea name="comment" maxLength={500} placeholder="Opcional: explicad la jugada maestra de vuestro grupo." />
        </label>
        <div className="block">
          <span className="text-sm font-bold uppercase tracking-[0.08em] text-graphite">Foto de la prueba</span>
          <input
            ref={fileInputRef}
            id="photo-upload"
            className="sr-only"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={handleFileChange}
          />
          <label
            htmlFor="photo-upload"
            className="mt-2 flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-[0.3rem] border border-tinta/25 bg-[#fffaf0] px-3 py-2 text-base text-tinta transition hover:border-lavanda hover:bg-white"
          >
            <span className="truncate">{fileName || "Elegir foto"}</span>
            <span className="shrink-0 rounded-[0.25rem] bg-tinta px-3 py-1.5 text-sm font-bold text-marfil">
              Abrir
            </span>
          </label>
        </div>
        {isCompressing ? <p className="text-sm font-semibold text-graphite">Preparando la foto...</p> : null}
        {fileError ? <p className="text-sm font-semibold text-vino">{fileError}</p> : null}
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Vista previa de la prueba" className="max-h-72 w-full rounded-[0.3rem] border border-tinta/15 object-cover" />
        ) : null}
        {state.message ? (
          <p className={`rounded-[0.3rem] border p-3 text-sm font-bold ${state.ok ? "border-oliva/25 bg-oliva/12 text-oliva" : "border-vino/25 bg-vino/10 text-vino"}`}>
            {state.message}
          </p>
        ) : null}
        <Button type="submit" disabled={isPending || isCompressing}>
          {isPending ? "Enviando..." : state.ok ? "Enviar otra foto" : "Enviar prueba"}
        </Button>
      </form>
    </Card>
  );
}

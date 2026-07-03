"use client";

import { useActionState, useRef, useState } from "react";
import { createSubmission, type SubmissionActionState } from "../../actions/submissions.actions";
import { compressImage } from "../../lib/utils/compress-image";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

const initialState: SubmissionActionState = { ok: false, message: "" };

export function SubmissionForm({ tableCode }: { tableCode: string }) {
  const [state, formAction, isPending] = useActionState(createSubmission, initialState);
  const [preview, setPreview] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError("");
    setPreview("");

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
      setPreview(URL.createObjectURL(normalizedFile));
    } catch {
      setFileError("No se pudo preparar la foto. Prueba con otra imagen.");
    } finally {
      setIsCompressing(false);
    }
  }

  return (
    <Card>
      <h2 className="font-serif text-2xl font-bold">Enviar prueba</h2>
      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="tableCode" value={tableCode} />
        <label className="block">
          <span className="text-sm font-semibold">Nombre</span>
          <Input name="participantName" maxLength={80} placeholder="Ej. Ana, primo del novio" required />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Comentario</span>
          <Textarea name="comment" maxLength={500} placeholder="Opcional, pero los detalles dan puntos de estilo." />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Foto de la prueba</span>
          <Input
            ref={fileInputRef}
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={handleFileChange}
          />
        </label>
        {isCompressing ? <p className="text-sm text-tinta/65">Preparando la foto...</p> : null}
        {fileError ? <p className="text-sm font-semibold text-vino">{fileError}</p> : null}
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Vista previa de la prueba" className="max-h-72 w-full rounded-md object-cover" />
        ) : null}
        {state.message ? (
          <p className={`rounded-md p-3 text-sm font-semibold ${state.ok ? "bg-oliva/12 text-oliva" : "bg-vino/10 text-vino"}`}>
            {state.message}
          </p>
        ) : null}
        <Button type="submit" disabled={isPending || isCompressing}>
          {isPending ? "Enviando..." : state.ok ? "Enviar otra" : "Enviar prueba"}
        </Button>
      </form>
    </Card>
  );
}

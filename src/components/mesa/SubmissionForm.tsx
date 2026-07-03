"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent } from "react";
import { createSubmission, type SubmissionActionState } from "../../actions/submissions.actions";
import type { Mission } from "../../lib/types/mission";
import { compressImage } from "../../lib/utils/compress-image";
import {
  calculateSubmissionPoints,
  getSubmissionModeLabel,
  getSubmissionModeShortLabel,
  type SubmissionMode,
} from "../../lib/utils/submission-mode";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

const initialState: SubmissionActionState = { ok: false, message: "" };

export function SubmissionForm({
  tableCode,
  mode,
  mission,
}: {
  tableCode: string;
  mode: SubmissionMode;
  mission: Mission | null;
}) {
  const [state, formAction, isPending] = useActionState(createSubmission, initialState);
  const [preview, setPreview] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const points = mission ? calculateSubmissionPoints(mission.points, mode) : 0;

  useEffect(() => {
    if (!state.ok) return;
    setPreview("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [state]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
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
      <p className="mt-3 text-sm font-semibold text-graphite">
        {getSubmissionModeLabel(mode)} ({getSubmissionModeShortLabel(mode)} puntos)
        {points > 0 ? ` · ${points} pts si la aprueban` : ""}
      </p>

      {state.message ? (
        <p
          className={`mt-4 rounded-[0.3rem] border p-3 text-sm font-bold ${
            state.ok ? "border-oliva/25 bg-oliva/12 text-oliva" : "border-vino/25 bg-vino/10 text-vino"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="tableCode" value={tableCode} />
        <input type="hidden" name="submissionMode" value={mode} />

        <div>
          <span className="text-sm font-bold uppercase tracking-[0.08em] text-graphite">Foto de la prueba</span>
          <input
            ref={fileInputRef}
            id="photo-upload"
            className="sr-only"
            name="photo"
            type="file"
            accept="image/*"
            capture="environment"
            required
            onChange={handleFileChange}
          />
          <label
            htmlFor="photo-upload"
            className="mt-2 flex min-h-16 cursor-pointer items-center justify-between gap-3 rounded-[0.3rem] border-2 border-dashed border-vino/35 bg-[#fffaf0] px-4 py-3 text-base text-tinta transition hover:border-lavanda hover:bg-white"
          >
            <span className="min-w-0">
              <span className="block truncate font-serif text-2xl font-bold text-vino">
                {fileName || (state.ok ? "Enviar otra foto" : "Hacer foto")}
              </span>
              <span className="mt-1 block text-xs font-bold uppercase tracking-[0.1em] text-graphite/70">
                Nada de videos, solo foto
              </span>
            </span>
            <span className="shrink-0 rounded-[0.25rem] bg-tinta px-3 py-1.5 text-sm font-bold text-marfil">
              Abrir
            </span>
          </label>
        </div>

        {isCompressing ? <p className="text-sm font-semibold text-graphite">Preparando la foto...</p> : null}
        {fileError ? <p className="text-sm font-semibold text-vino">{fileError}</p> : null}
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Vista previa de la prueba"
            className="max-h-72 w-full rounded-[0.3rem] border border-tinta/15 object-cover"
          />
        ) : null}

        <Button type="submit" disabled={isPending || isCompressing || !preview} className="w-full min-h-14 text-base">
          {isPending ? "Enviando..." : "Enviar foto al jurado"}
        </Button>

        <button
          type="button"
          className="w-full rounded-[0.3rem] px-3 py-3 text-sm font-bold text-graphite underline-offset-4 hover:text-vino hover:underline"
          onClick={() => setShowDetails((value) => !value)}
        >
          {showDetails ? "Ocultar nombre y comentario" : "Anadir nombre o comentario"}
        </button>

        {showDetails ? (
          <div className="grid gap-4 rounded-[0.3rem] border border-tinta/10 bg-marfil/74 p-4">
            <label className="block">
              <span className="text-sm font-bold uppercase tracking-[0.08em] text-graphite">Quien la envia</span>
              <Input name="participantName" maxLength={80} placeholder="Opcional: Ana, primos, mesa entera..." />
            </label>
            <label className="block">
              <span className="text-sm font-bold uppercase tracking-[0.08em] text-graphite">Comentario</span>
              <Textarea name="comment" maxLength={450} placeholder="Opcional. Una frase y a seguir bailando." />
            </label>
          </div>
        ) : null}
      </form>
    </Card>
  );
}

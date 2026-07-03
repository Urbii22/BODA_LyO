"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [state]);

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
    <Card className="border-vino/20 bg-white/90 p-4">
      <div className="rounded-md bg-vino px-4 py-4 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Paso final</p>
        <h2 className="mt-1 font-serif text-3xl font-bold leading-tight">Subid la foto</h2>
        <p className="mt-2 text-sm leading-6 text-white/82">
          Una prueba clara, una foto y listo. Nada de videos.
        </p>
      </div>

      {state.message ? (
        <p
          className={`mt-4 rounded-md p-4 text-base font-semibold leading-6 ${
            state.ok ? "bg-oliva/12 text-oliva" : "bg-vino/10 text-vino"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="tableCode" value={tableCode} />
        <label className="block cursor-pointer rounded-md border-2 border-dashed border-vino/35 bg-marfil px-4 py-5 text-center transition hover:bg-white">
          <input
            ref={fileInputRef}
            name="photo"
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            required
            onChange={handleFileChange}
          />
          <span className="block font-serif text-3xl font-bold text-vino">
            {preview ? "Cambiar foto" : state.ok ? "Enviar otra foto" : "Hacer foto"}
          </span>
          <span className="mt-2 block text-sm font-semibold text-tinta/65">
            La prepararemos para subir rapido.
          </span>
        </label>

        {isCompressing ? <p className="text-sm font-semibold text-tinta/65">Preparando la foto...</p> : null}
        {fileError ? <p className="text-sm font-semibold text-vino">{fileError}</p> : null}
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Vista previa de la prueba" className="max-h-72 w-full rounded-md object-cover" />
        ) : null}

        <Button type="submit" disabled={isPending || isCompressing || !preview} className="w-full min-h-14 text-base">
          {isPending ? "Enviando..." : "Enviar foto al jurado"}
        </Button>

        <button
          type="button"
          className="w-full rounded-md px-3 py-3 text-sm font-semibold text-tinta/65 underline-offset-4 hover:text-vino hover:underline"
          onClick={() => setShowDetails((value) => !value)}
        >
          {showDetails ? "Ocultar nombre y comentario" : "Anadir nombre o comentario"}
        </button>

        {showDetails ? (
          <div className="grid gap-4 rounded-md bg-marfil/80 p-4">
            <label className="block">
              <span className="text-sm font-semibold">Quien la envia</span>
              <Input name="participantName" maxLength={80} placeholder="Opcional: Ana, primos, mesa entera..." />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Comentario</span>
              <Textarea name="comment" maxLength={500} placeholder="Opcional. Una frase y a seguir bailando." />
            </label>
          </div>
        ) : null}
      </form>
    </Card>
  );
}

import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-28 w-full rounded-md border border-tinta/15 bg-white px-3 py-2 text-sm text-tinta outline-none transition placeholder:text-tinta/40 focus:border-vino focus:ring-4 focus:ring-vino/10 ${className}`}
      {...props}
    />
  );
}

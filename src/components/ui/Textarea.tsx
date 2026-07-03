import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-28 w-full rounded-[0.3rem] border border-tinta/25 bg-[#fffaf0] px-3 py-2 text-base text-tinta outline-none transition placeholder:text-tinta/42 focus:border-lavanda focus:ring-4 focus:ring-lavanda/15 ${className}`}
      {...props}
    />
  );
}

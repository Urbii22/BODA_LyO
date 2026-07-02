import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`min-h-11 w-full rounded-md border border-tinta/15 bg-white px-3 py-2 text-sm text-tinta outline-none transition placeholder:text-tinta/40 focus:border-vino focus:ring-4 focus:ring-vino/10 ${className}`}
      {...props}
    />
  );
});

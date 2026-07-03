import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`min-h-12 w-full rounded-[0.3rem] border border-tinta/25 bg-[#fffaf0] px-3 py-2 text-base text-tinta outline-none transition placeholder:text-tinta/42 focus:border-lavanda focus:ring-4 focus:ring-lavanda/15 ${className}`}
      {...props}
    />
  );
});

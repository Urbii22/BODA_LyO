import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary: "bg-vino text-white hover:bg-[#641f37] border-vino",
  secondary: "bg-tinta text-marfil hover:bg-noche border-tinta",
  danger: "bg-white text-vino hover:bg-[#fff2f5] border-vino/30",
  ghost: "bg-transparent text-tinta hover:bg-white/60 border-tinta/15",
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

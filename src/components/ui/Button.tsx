import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary: "bg-tinta text-marfil hover:bg-vino border-tinta shadow-[0_8px_0_rgba(45,42,40,0.14)]",
  secondary: "bg-oliva text-marfil hover:bg-[#5f6d50] border-oliva shadow-[0_8px_0_rgba(116,130,96,0.18)]",
  danger: "bg-white/78 text-vino hover:bg-[#fff2f5] border-vino/35",
  ghost: "bg-transparent text-tinta hover:bg-white/62 border-tinta/25",
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-[0.35rem] border px-5 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lavanda ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

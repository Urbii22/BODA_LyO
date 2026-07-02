import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-tinta/10 bg-white/78 p-5 shadow-[0_18px_50px_rgba(38,33,29,0.08)] backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

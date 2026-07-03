import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`sketch-card rounded-[0.35rem] p-5 backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

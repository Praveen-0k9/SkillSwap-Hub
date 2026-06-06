import { ReactNode } from "react";
import { cn } from "./ui/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]",
        "backdrop-blur-xl shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]",
        hover && "transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.2)] hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

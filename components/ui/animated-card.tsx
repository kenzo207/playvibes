import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: "lift" | "glow" | "scale" | "none";
  gradient?: boolean;
  glass?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  role?: string;
  "aria-label"?: string;
}

const hoverEffects = {
  lift: "hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/10",
  glow: "hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30",
  scale: "hover:scale-[1.02]",
  none: "",
};

export function AnimatedCard({
  children,
  className,
  hover = "lift",
  gradient = false,
  glass = false,
  style,
  onClick,
  role,
  "aria-label": ariaLabel,
}: AnimatedCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border transition-all duration-500 ease-out",
        hoverEffects[hover],
        gradient &&
          "bg-gradient-to-br from-card/80 via-card/50 to-card/30 border-white/10 shadow-lg",
        glass && "backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-xl",
        !gradient && !glass && "bg-card shadow-sm",
        "border-border/50",
        className
      )}
      style={style}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

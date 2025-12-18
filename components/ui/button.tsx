import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold tracking-wide ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 hover:scale-105 hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-destructive/25",
        outline:
          "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/10",
        link: "text-primary underline-offset-4 hover:underline",
        spotify:
          "bg-[#1DB954] text-white hover:bg-[#1ed760] shadow-lg hover:shadow-[#1DB954]/25 hover:scale-105",
      },
      size: {
        default: "h-11 px-6 py-2 min-h-[44px]",
        sm: "h-9 rounded-full px-4 min-h-[36px] text-xs",
        lg: "h-14 rounded-full px-8 min-h-[56px] text-base",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

import React from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-deep hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(21,128,61,0.32)] hover:shadow-[0_8px_24px_rgba(34,197,94,0.28)]",
  secondary:
    "bg-white text-primary border border-border hover:border-accent/40 hover:bg-background hover:-translate-y-0.5",
  accent:
    "bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(15,23,42,0.2)]",
  ghost: "bg-transparent text-primary hover:bg-background",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm rounded-[10px]",
  md: "h-11 px-5 text-sm rounded-[12px]",
  lg: "h-12 px-6 text-[15px] rounded-[12px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-body font-bold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

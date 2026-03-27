import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { SkapaIcon, type SkapaIconName } from "@/components/SkapaIcon";

type Variant = "primary" | "secondary" | "tertiary" | "danger" | "ghost";
type Size = "xsmall" | "small" | "medium";

interface SkapaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconName?: SkapaIconName;
  iconPosition?: "leading" | "trailing";
  iconOnly?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--sk-color-primary)] text-[var(--sk-color-on-primary)] hover:bg-[var(--sk-color-primary-strong)]",
  secondary:
    "border border-[var(--sk-color-border-strong)] bg-white text-[var(--sk-color-primary)] hover:border-[var(--sk-color-primary)]",
  tertiary:
    "bg-transparent text-[var(--sk-color-primary)] hover:bg-[var(--sk-color-surface-muted)]",
  danger:
    "border border-[var(--sk-color-danger)] bg-white text-[var(--sk-color-danger)] hover:bg-[#fff4f4]",
  ghost:
    "bg-transparent text-[var(--sk-color-text-muted)] hover:bg-[var(--sk-color-surface-muted)] hover:text-[var(--sk-color-primary)]",
};

const sizeClasses: Record<Size, string> = {
  xsmall: "min-h-8 px-2.5 text-skapa-overline",
  small: "min-h-10 px-3.5 text-skapa-body-sm",
  medium: "min-h-11 px-4 text-skapa-body-md",
};

export const SkapaButton = forwardRef<HTMLButtonElement, SkapaButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "medium",
      type = "button",
      iconName,
      iconPosition = "leading",
      iconOnly = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const iconSize = size === "xsmall" ? 14 : size === "small" ? 16 : 18;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sk-color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          iconOnly && "aspect-square px-0",
          className
        )}
        {...props}
      >
        {iconName && iconPosition === "leading" ? <SkapaIcon name={iconName} size={iconSize} /> : null}
        {!iconOnly ? (loading ? "Loading..." : children) : null}
        {iconName && iconPosition === "trailing" ? <SkapaIcon name={iconName} size={iconSize} /> : null}
      </button>
    );
  }
);

SkapaButton.displayName = "SkapaButton";

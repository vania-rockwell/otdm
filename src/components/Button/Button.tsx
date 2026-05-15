import React from "react";
import type { LucideIcon } from "lucide-react";
import "./Button.scss";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "ghost"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "orange"
  | "yellow"
  | "teal"
  | "cyan"
  | "gray"
  | "dark";
type ButtonSize = "sm" | "md" | "lg";
type ButtonIconPosition = "start" | "end";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant: 'primary', 'secondary', 'danger', 'success', 'warning', 'info', 'ghost'
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size: 'sm', 'md', 'lg'
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Make button full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Lucide icon component to render alongside the label.
   */
  icon?: LucideIcon;

  /**
   * Position of the icon relative to the label.
   * @default 'start'
   */
  iconPosition?: ButtonIconPosition;

  /**
   * Button content
   */
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  danger: "btn--danger",
  success: "btn--success",
  warning: "btn--warning",
  info: "btn--info",
  ghost: "btn--ghost",
  blue: "btn--blue",
  indigo: "btn--indigo",
  purple: "btn--purple",
  pink: "btn--pink",
  orange: "btn--orange",
  yellow: "btn--yellow",
  teal: "btn--teal",
  cyan: "btn--cyan",
  gray: "btn--gray",
  dark: "btn--dark",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "btn--sm",
  md: "btn--md",
  lg: "btn--lg",
};

/**
 * Reusable Button component with support for multiple variants and sizes
 *
 * @example
 * // Basic usage
 * <Button>Click me</Button>
 *
 * @example
 * // With variant and size
 * <Button variant="danger" size="lg">Delete</Button>
 *
 * @example
 * // With click handler
 * <Button onClick={() => console.log('clicked')}>Submit</Button>
 */
const iconSizeMap: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      disabled = false,
      fullWidth = false,
      icon: Icon,
      iconPosition = "start",
      children,
      className = "",
      type = "button",
      ...rest
    },
    ref
  ) => {
    const baseClasses = "btn";
    const variantClass = variantStyles[variant];
    const sizeClass = sizeStyles[size];
    const fullWidthClass = fullWidth ? "btn--full-width" : "";

    const classes = [baseClasses, variantClass, sizeClass, fullWidthClass, className]
      .filter(Boolean)
      .join(" ");

    const iconNode = Icon ? (
      <Icon size={iconSizeMap[size]} aria-hidden="true" />
    ) : null;

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        {...rest}
      >
        {iconPosition === "start" && iconNode}
        {children}
        {iconPosition === "end" && iconNode}
      </button>
    );
  }
);

Button.displayName = "Button";

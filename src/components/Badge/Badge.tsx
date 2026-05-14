import React from "react";
import "./Badge.scss";

type BadgeColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "neutral";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Color variant applied to the badge.
   * @default "primary"
   */
  color?: BadgeColor;

  /**
   * Badge content.
   */
  children: React.ReactNode;
}

const colorStyles: Record<BadgeColor, string> = {
  primary: "badge--primary",
  secondary: "badge--secondary",
  danger: "badge--danger",
  success: "badge--success",
  warning: "badge--warning",
  info: "badge--info",
  neutral: "badge--neutral",
};

/**
 * Renders a compact status label with theme-aware color variants.
 * @param props Badge visual options and native span props.
 * @returns A reusable badge element.
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ color = "primary", children, className = "", ...rest }, ref) => {
    const classes = ["badge", colorStyles[color], className].filter(Boolean).join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export type { BadgeColor, BadgeProps };
export default Badge;

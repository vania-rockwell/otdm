import React from "react";
import { Button } from "@/components/Button/Button";
import Badge from "@/components/Badge/Badge";
import "./showcase.scss";

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
type BadgeColor =
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

const buttonVariants: ButtonVariant[] = [
  "primary",
  "secondary",
  "danger",
  "success",
  "warning",
  "info",
  "ghost",
  "blue",
  "indigo",
  "purple",
  "pink",
  "orange",
  "yellow",
  "teal",
  "cyan",
  "gray",
  "dark",
];
const buttonSizes: ButtonSize[] = ["sm", "md", "lg"];
const badgeColors: BadgeColor[] = [
  "primary",
  "secondary",
  "danger",
  "success",
  "warning",
  "info",
  "ghost",
  "blue",
  "indigo",
  "purple",
  "pink",
  "orange",
  "yellow",
  "teal",
  "cyan",
  "gray",
  "dark",
];

/**
 * Component showcase page displaying all available button variants/sizes and badge colors.
 * Useful for design system review and component documentation.
 */
export const ComponentShowcasePage: React.FC = () => {
  return (
    <div className="showcase-container">
      <div className="showcase-header">
        <h1>Component Showcase</h1>
        <p className="showcase-subtitle">
          Preview of all available button variants, sizes, and badge colors
        </p>
      </div>

      {/* Buttons Section */}
      <section className="showcase-section">
        <h2>Buttons</h2>

        {/* Button Variants */}
        <div className="showcase-subsection">
          <h3>Variants</h3>
          <div className="showcase-grid">
            {buttonVariants.map((variant) => (
              <div key={variant} className="showcase-item">
                <div className="item-label">{variant}</div>
                <Button variant={variant}>Button</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Button Sizes */}
        <div className="showcase-subsection">
          <h3>Sizes</h3>
          <div className="showcase-grid">
            {buttonSizes.map((size) => (
              <div key={size} className="showcase-item">
                <div className="item-label">{size}</div>
                <Button size={size}>Button</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Button Variant + Size Matrix */}
        <div className="showcase-subsection">
          <h3>Variants × Sizes</h3>
          <div className="showcase-table">
            <div className="table-header">
              <div className="table-cell"></div>
              {buttonSizes.map((size) => (
                <div key={size} className="table-cell">
                  {size}
                </div>
              ))}
            </div>
            {buttonVariants.map((variant) => (
              <div key={variant} className="table-row">
                <div className="table-cell variant-label">{variant}</div>
                {buttonSizes.map((size) => (
                  <div key={`${variant}-${size}`} className="table-cell">
                    <Button variant={variant} size={size}>
                      Button
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Button States */}
        <div className="showcase-subsection">
          <h3>States</h3>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="item-label">Enabled (primary)</div>
              <Button variant="primary">Click me</Button>
            </div>
            <div className="showcase-item">
              <div className="item-label">Disabled (primary)</div>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <div className="showcase-item">
              <div className="item-label">Full Width (primary)</div>
              <Button variant="primary" fullWidth>
                Full Width
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="showcase-section">
        <h2>Badges</h2>

        {/* Badge Colors */}
        <div className="showcase-subsection">
          <h3>Colors</h3>
          <div className="showcase-grid">
            {badgeColors.map((color) => (
              <div key={color} className="showcase-item">
                <div className="item-label">{color}</div>
                <Badge color={color}>Badge</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Badge Variations */}
        <div className="showcase-subsection">
          <h3>Examples</h3>
          <div className="showcase-grid">
            <div className="showcase-item">
              <Badge color="primary">New</Badge>
            </div>
            <div className="showcase-item">
              <Badge color="success">Active</Badge>
            </div>
            <div className="showcase-item">
              <Badge color="warning">Pending</Badge>
            </div>
            <div className="showcase-item">
              <Badge color="danger">Error</Badge>
            </div>
            <div className="showcase-item">
              <Badge color="info">Info</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComponentShowcasePage;

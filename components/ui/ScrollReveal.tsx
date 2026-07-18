"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

type ScrollRevealProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  id?: string;
  style?: CSSProperties;
};

export default function ScrollReveal({
  as: Component = "div",
  className = "",
  children,
  delay = 0,
  direction = "up",
  id,
  style,
}: ScrollRevealProps) {
  return (
    <Component
      className={`motion-reveal reveal-${direction} ${className}`.trim()}
      data-reveal
      id={id}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Component>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUpNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        const duration = 1100;
        const startedAt = performance.now();
        let frame = 0;

        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          setCount(Math.round(value * progress));
          if (progress < 1) {
            frame = requestAnimationFrame(tick);
          }
        };

        frame = requestAnimationFrame(tick);
        observer.disconnect();

        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={countRef} data-count-target={value}>
      {count}
      {suffix}
    </span>
  );
}

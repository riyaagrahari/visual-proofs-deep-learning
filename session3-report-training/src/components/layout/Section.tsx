import type { ReactNode } from "react";
import { cx } from "../ui/Card";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cx(
        "relative mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-8 sm:py-28 lg:px-12",
        className,
      )}
    >
      {children}
    </section>
  );
}

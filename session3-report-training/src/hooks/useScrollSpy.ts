import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently most prominent in the viewport,
 * using IntersectionObserver. Returns the active id.
 */
export function useScrollSpy(ids: string[], offset = 0.5): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        let best = "";
        let bestRatio = -1;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      { threshold: [0.15, 0.35, 0.55, 0.75], rootMargin: `-${offset * 100}px 0px -35% 0px` },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids, offset]);

  return active;
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SECTIONS } from "../../data/sections";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { cx } from "../ui/Card";

export function SectionNav() {
  const active = useScrollSpy(SECTIONS.map((s) => s.id));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      {/* Desktop vertical rail */}
      <nav className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block" aria-label="Section navigation">
        <ul className="flex flex-col gap-1">
          {SECTIONS.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <button
                  onClick={() => go(s.id)}
                  className="group flex items-center gap-3"
                  aria-current={on ? "true" : undefined}
                >
                  <span
                    className={cx(
                      "h-px transition-all duration-300",
                      on ? "w-8 bg-accent-cyan" : "w-4 bg-white/20 group-hover:w-6 group-hover:bg-white/40",
                    )}
                  />
                  <span
                    className={cx(
                      "text-xs font-medium transition-all duration-300",
                      on ? "text-white" : "text-white/35 group-hover:text-white/70",
                    )}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Top bar */}
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500",
          scrolled ? "glass border-b border-white/10" : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <button onClick={() => go("hero")} className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan to-accent-indigo text-[10px] font-bold text-ink">
              40B
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">India-First FM</span>
          </button>

          <div className="hidden items-center gap-6 md:flex">
            <span className="font-mono text-xs text-white/40">
              {SECTIONS.find((s) => s.id === active)?.index ?? "00"} / 09
            </span>
            <button
              onClick={() => go("architecture")}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white transition hover:border-accent-indigo/50 hover:bg-white/10"
            >
              Jump to design
            </button>
          </div>

          <button
            className="md:hidden text-white/80"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass overflow-hidden border-t border-white/10 md:hidden"
            >
              <ul className="grid grid-cols-2 gap-1 px-6 py-4">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => go(s.id)}
                      className={cx(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm",
                        active === s.id ? "bg-white/10 text-white" : "text-white/50",
                      )}
                    >
                      <span className="font-mono text-[10px] text-accent-cyan/70">{s.index}</span>
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

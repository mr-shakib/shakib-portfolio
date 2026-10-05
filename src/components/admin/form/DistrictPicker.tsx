"use client";

import { useState } from "react";
import { BD_GEO } from "@/lib/maps/bangladesh";
import { DISTRICTS, DIVISIONS, type District, type DistrictId } from "@/lib/maps/districts";
import { cn } from "@/lib/utils/cn";

/**
 * Pick districts by clicking the map or the chips under each division. The
 * value is kept in the list's canonical order, so toggling a district off and
 * on again leaves the form clean.
 */
export function DistrictPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: DistrictId[]) => void;
}) {
  const selected = new Set(value);
  const [hover, setHover] = useState<District | null>(null);

  const commit = (next: Set<string>) =>
    onChange(DISTRICTS.filter((d) => next.has(d.id)).map((d) => d.id));
  const toggle = (id: DistrictId) => {
    const next = new Set(selected);
    if (!next.delete(id)) next.add(id);
    commit(next);
  };
  const setMany = (ids: DistrictId[], on: boolean) => {
    const next = new Set(selected);
    for (const id of ids) {
      if (on) next.add(id);
      else next.delete(id);
    }
    commit(next);
  };

  return (
    <div className="grid gap-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div>
        <svg
          viewBox={`0 0 ${BD_GEO.width} ${BD_GEO.height}`}
          className="mx-auto w-full max-w-[380px]"
          onPointerLeave={() => setHover(null)}
        >
          {DISTRICTS.map((d) => {
            const on = selected.has(d.id);
            return (
              <path
                key={d.id}
                d={BD_GEO.districts[d.id].d}
                onClick={() => toggle(d.id)}
                onPointerEnter={() => setHover(d)}
                strokeWidth={1.2}
                strokeLinejoin="round"
                className={cn(
                  "cursor-pointer stroke-background transition-colors",
                  on ? "fill-accent hover:fill-accent/75" : "fill-white/10 hover:fill-white/25",
                )}
              >
                <title>{d.name}</title>
              </path>
            );
          })}
        </svg>
        <p className="mt-2 h-4 text-center text-xs text-muted">
          {hover
            ? `${hover.name} · ${hover.division} division${selected.has(hover.id) ? " · visited" : ""}`
            : "Click a district to toggle it"}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-auto text-sm text-foreground">
            <span className="tabular-nums text-accent">{selected.size}</span> / {DISTRICTS.length}{" "}
            selected
          </span>
          <SmallButton
            onClick={() =>
              setMany(
                DISTRICTS.map((d) => d.id),
                true,
              )
            }
          >
            Select all
          </SmallButton>
          <SmallButton
            onClick={() =>
              setMany(
                DISTRICTS.map((d) => d.id),
                false,
              )
            }
          >
            Clear
          </SmallButton>
        </div>

        {DIVISIONS.map((division) => {
          const list = DISTRICTS.filter((d) => d.division === division);
          const count = list.filter((d) => selected.has(d.id)).length;
          const all = count === list.length;
          return (
            <div key={division}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="font-grotesk text-[11px] uppercase tracking-[0.16em] text-white/80">
                  {division}{" "}
                  <span className="tabular-nums text-muted">
                    {count}/{list.length}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setMany(
                      list.map((d) => d.id),
                      !all,
                    )
                  }
                  className="text-xs text-muted hover:text-accent"
                >
                  {all ? "None" : "All"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {list.map((d) => {
                  const on = selected.has(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(d.id)}
                      onPointerEnter={() => setHover(d)}
                      onPointerLeave={() => setHover(null)}
                      className={cn(
                        "rounded-md px-2 py-1 text-xs transition-colors",
                        on
                          ? "bg-accent text-background hover:bg-accent/85"
                          : "bg-white/[0.06] text-foreground hover:bg-white/10",
                      )}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SmallButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </button>
  );
}

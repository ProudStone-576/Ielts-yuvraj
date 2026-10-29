import { bandToClb, formatBand } from "@/lib/scoring";
import type { Attempt, Module } from "@/lib/types";

export interface ModuleStats {
  latest?: number;
  best?: number;
  average?: number;
  count: number;
}

export function statsFor(attempts: Attempt[], module: Module): ModuleStats {
  const list = attempts.filter((a) => a.module === module);
  if (list.length === 0) return { count: 0 };
  const bands = list.map((a) => a.band);
  const recent = bands.slice(-3);
  return {
    latest: bands[bands.length - 1],
    best: Math.max(...bands),
    average: Math.round((recent.reduce((a, b) => a + b, 0) / recent.length) * 2) / 2,
    count: list.length,
  };
}

export function BandBadge({ module, band, target }: { module: Module; band?: number; target: number }) {
  if (band === undefined) return <span className="badge">No attempts yet</span>;
  const cls = band >= target ? "good" : band >= target - 0.5 ? "warn" : "bad";
  return (
    <span className={`badge ${cls}`}>
      Band {formatBand(band)} · CLB {bandToClb(module, band) || "<4"}
    </span>
  );
}

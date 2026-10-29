"use client";

interface Criterion {
  key: string;
  name: string;
  levels: Record<5 | 6 | 7 | 8 | 9, string>;
}

const LEVELS = [5, 6, 7, 8, 9] as const;

/** Clickable band-descriptor table. Returns the chosen band for each criterion. */
export function Rubric({
  criteria,
  value,
  onChange,
}: {
  criteria: readonly Criterion[];
  value: Record<string, number>;
  onChange: (key: string, band: number) => void;
}) {
  return (
    <div className="table-scroll">
      <table className="rubric">
        <thead>
          <tr>
            <th style={{ minWidth: 130 }}>Criterion</th>
            {LEVELS.map((l) => (
              <th key={l} style={{ minWidth: 150 }}>
                Band {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => (
            <tr key={c.key}>
              <th>{c.name}</th>
              {LEVELS.map((l) => (
                <td
                  key={l}
                  className={`pick ${value[c.key] === l ? "picked" : ""}`}
                  onClick={() => onChange(c.key, l)}
                >
                  {c.levels[l]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Task band = mean of the four criteria, rounded down to the nearest half band. */
export function rubricBand(value: Record<string, number>, count: number): number | null {
  const bands = Object.values(value);
  if (bands.length < count) return null;
  return Math.floor((bands.reduce((a, b) => a + b, 0) / bands.length) * 2) / 2;
}

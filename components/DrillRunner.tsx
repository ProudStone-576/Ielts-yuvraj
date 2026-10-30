"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { YuvrajSays } from "@/components/Yuvraj";
import { DRILLS_AUDIO } from "@/content/drills-audio";
import type { DrillSet } from "@/content/drills";
import { playClip, unlockAudio } from "@/lib/audio";
import { speak, type Playback } from "@/lib/speech";
import { useStore } from "@/lib/storage";

/** Letters and digits only, so "SW1A 2AA", "sw1a2aa" and "7:45" / "7.45" all compare equal. */
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** One replay is allowed: in the exam you hear everything once, but drills are for learning. */
const REPLAYS = 1;

export function DrillRunner({ set }: { set: DrillSet }) {
  const { update } = useStore();
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const voice = useRef<Playback | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const item = set.items[index];
  const done = results.length === set.items.length;
  const correct = checked && item.answer.some((a) => squash(a) === squash(value));

  useEffect(() => () => voice.current?.stop(), []);

  const play = async () => {
    unlockAudio();
    voice.current?.stop();
    setPlays((n) => n + 1);
    setPlaying(true);
    const file = DRILLS_AUDIO[set.id]?.[item.say];
    let ok = false;
    if (file) {
      const pb = playClip(`/audio/drills/${set.id}/${file}`);
      voice.current = pb;
      ok = await pb.ok;
    }
    if (!ok) await speak(item.say, set.voice.slice(0, 5));
    setPlaying(false);
    input.current?.focus();
  };

  const check = () => {
    if (!value.trim()) return;
    setChecked(true);
    const ok = item.answer.some((a) => squash(a) === squash(value));
    const next = [...results, ok];
    setResults(next);
    if (next.length === set.items.length) {
      const score = next.filter(Boolean).length;
      update((s) => {
        const old = s.drills[set.id];
        return {
          ...s,
          drills: { ...s.drills, [set.id]: { best: Math.max(old?.best ?? 0, score), last: score, total: set.items.length, date: new Date().toISOString() } },
        };
      });
    }
  };

  const next = () => {
    setIndex(index + 1);
    setValue("");
    setChecked(false);
    setPlays(0);
  };

  return (
    <div className="stack drill">
      <div className="page-head module-hero tint-listening">
        <div className="eyebrow">Dictation drill · {Math.min(index + 1, set.items.length)} of {set.items.length}</div>
        <h1>{set.title}</h1>
        <p>{set.intro}</p>
      </div>

      <div className="drill-progress">
        {set.items.map((_, i) => (
          <span key={i} className={i < results.length ? (results[i] ? "ok" : "bad") : i === index ? "cur" : ""} />
        ))}
      </div>

      {!done || checked ? (
        <div className="card stack drill-card">
          <div className="row">
            <button className="btn primary lg" onClick={play} disabled={playing || plays > REPLAYS || checked}>
              {playing ? "Playing…" : plays === 0 ? "▶ Play" : plays <= REPLAYS ? "↺ Play again" : "No more replays"}
            </button>
            <span className="small muted">{plays === 0 ? "Listen, then type what you hear." : plays <= REPLAYS ? "You can hear it one more time." : "Like the real test — no more replays."}</span>
          </div>
          <label className="field">
            <span>{item.ask}</span>
            <input
              ref={input}
              className="drill-input"
              value={value}
              disabled={checked}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (checked ? index < set.items.length - 1 && next() : check())}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </label>
          {!checked ? (
            <div>
              <button className="btn" onClick={check} disabled={!value.trim()}>
                Check
              </button>
            </div>
          ) : (
            <div className={`drill-feedback ${correct ? "ok" : "bad"}`}>
              <b>{correct ? "Correct ✓" : `Not quite — the answer is ${item.answer[0]}`}</b>
              <div className="small">“{item.say}”</div>
              {item.why && <div className="small">{item.why}</div>}
              {index < set.items.length - 1 && (
                <div style={{ marginTop: "0.6rem" }}>
                  <button className="btn primary" onClick={next}>
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {done && (
        <YuvrajSays title="drill finished">
          <p style={{ margin: 0, fontSize: "1.1rem" }}>
            <b>
              {results.filter(Boolean).length} / {set.items.length}
            </b>
          </p>
          <p style={{ margin: 0 }}>
            {results.filter(Boolean).length === set.items.length
              ? "Perfect. That's band 8 accuracy — keep it sharp with another set tomorrow."
              : results.filter(Boolean).length >= 8
                ? "Very good. Look at the ones you missed: in the exam, each of those is a lost mark."
                : "These small details decide band 8. Do this set again in a day or two — you'll be surprised how fast it improves."}
          </p>
          <div className="row">
            <Link className="btn primary" href="/drills">
              More drills
            </Link>
            <button className="btn ghost" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        </YuvrajSays>
      )}
    </div>
  );
}

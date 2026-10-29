import Link from "next/link";
import { SPEAKING_SETS } from "@/content/speaking";

export default function SpeakingHome() {
  return (
    <div className="stack">
      <div className="page-head">
        <h1>Speaking</h1>
        <p>
          The Speaking test is a face-to-face interview in three parts, lasting 11–14 minutes. It&apos;s the same
          for General Training and Academic. CLB 9 needs band 7.0.
        </p>
      </div>
      <div className="grid grid-2">
        {SPEAKING_SETS.map((s) => (
          <Link key={s.id} href={`/speaking/${s.id}`} className="card">
            <h3>{s.title}</h3>
            <p className="small muted" style={{ margin: 0 }}>
              Part 2: {s.part2.cue}
            </p>
          </Link>
        ))}
      </div>
      <div className="card">
        <h3>What band 7 sounds like</h3>
        <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>You extend every answer without being asked — a reason, an example, a comparison.</li>
          <li>You use some less common words and natural phrases (&quot;it depends on&quot;, &quot;to be honest&quot;, &quot;on the whole&quot;).</li>
          <li>You mix tenses and complex sentences: &quot;If I had more time, I would…&quot;, &quot;What I like most is…&quot;.</li>
          <li>Hesitation is about finding ideas, not finding words. A short pause is fine; long silences are not.</li>
          <li>If you don&apos;t understand a question, ask: &quot;Sorry, could you repeat the question?&quot; — it costs nothing.</li>
        </ul>
      </div>
    </div>
  );
}

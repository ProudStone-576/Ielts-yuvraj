import { catalog } from "@/lib/catalog";
import { TestList } from "@/components/TestList";

export default function SpeakingHome() {
  return (
    <div className="stack">
      <div className="page-head module-hero tint-speaking">
        <div className="eyebrow">Practice library</div>
        <h1>Speaking</h1>
        <p>
          A face-to-face interview in three parts, 11–14 minutes, the same for General Training and Academic. The mock
          examiner asks the questions aloud and records your answers. CLB 9 needs band 7.0.
        </p>
      </div>
      <TestList module="speaking" tests={catalog().speaking} />
      <div className="card">
        <h3>What band 7 sounds like</h3>
        <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>You extend every answer without being asked — a reason, an example, a comparison.</li>
          <li>You use some less common words and natural phrases (&quot;it depends on&quot;, &quot;to be honest&quot;, &quot;on the whole&quot;).</li>
          <li>You mix tenses and complex sentences: &quot;If I had more time, I would…&quot;, &quot;What I like most is…&quot;.</li>
          <li>Hesitation is about finding ideas, not finding words. A short pause is fine; long silences are not.</li>
          <li>If you don&apos;t understand, ask: &quot;Sorry, could you repeat the question?&quot; — it costs nothing.</li>
        </ul>
      </div>
    </div>
  );
}

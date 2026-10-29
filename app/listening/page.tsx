import { catalog } from "@/lib/catalog";
import { TestList } from "@/components/TestList";

export default function ListeningHome() {
  return (
    <div className="stack">
      <div className="page-head module-hero tint-listening">
        <div className="eyebrow">Practice library</div>
        <h1>Listening</h1>
        <p>
          Four recordings, 40 questions, about 30 minutes — the same for General Training and Academic. Each recording
          plays once only, exactly like the real test. CLB 9 needs band 8.0, which is about 35 correct.
        </p>
      </div>
      <TestList module="listening" tests={catalog().listening} />
      <div className="card">
        <h3>Yuvraj&apos;s tips for band 8</h3>
        <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>Use the reading time before each part to underline key words and predict the answer type (number, name, noun…).</li>
          <li>Speakers often correct themselves — &quot;the 12th… no, the 14th&quot;. The final answer is the one that counts.</li>
          <li>Check word limits. If the instructions say ONE WORD ONLY, &quot;the tyres&quot; is wrong.</li>
          <li>Spelling counts, including plurals. Practise writing names and postcodes letter by letter.</li>
          <li>Use the 2 minutes at the end to check spelling and fill every gap — there&apos;s no penalty for guessing.</li>
        </ul>
      </div>
    </div>
  );
}

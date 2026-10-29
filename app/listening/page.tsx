import Link from "next/link";
import { LISTENING_TESTS } from "@/content/listening";

export default function ListeningHome() {
  return (
    <div>
      <div className="page-head">
        <h1>Listening</h1>
        <p>
          The Listening test is the same for General Training and Academic: four recordings, 40 questions,
          each played only once. Listening has the highest bar for CLB 9 — band 8.0, which is about 35 correct.
        </p>
      </div>
      <div className="grid grid-2">
        {LISTENING_TESTS.map((t) => (
          <Link key={t.id} href={`/listening/${t.id}`} className="card">
            <h3>{t.title}</h3>
            <p className="muted small" style={{ margin: 0 }}>
              {t.description}
            </p>
          </Link>
        ))}
      </div>
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Tips for band 8</h3>
        <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>Use the time before each part to underline key words and predict the type of answer (a number, a name, a noun…).</li>
          <li>Speakers often correct themselves — &quot;the 12th… no, sorry, the 14th&quot;. The final answer is the one that counts.</li>
          <li>Check word limits. If the instructions say ONE WORD ONLY, &quot;the tyres&quot; is wrong.</li>
          <li>Spelling matters, including plurals. Practise spelling names and postcodes letter by letter.</li>
        </ul>
      </div>
    </div>
  );
}

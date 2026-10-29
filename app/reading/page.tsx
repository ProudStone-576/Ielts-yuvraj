import Link from "next/link";
import { READING_TESTS } from "@/content/reading";

export default function ReadingHome() {
  return (
    <div>
      <div className="page-head">
        <h1>Reading</h1>
        <p>
          General Training Reading has three sections of increasing difficulty: everyday notices and adverts,
          workplace documents, and one long general-interest article. You have 60 minutes for 40 questions.
          CLB 9 needs band 7.0, which is about 34 correct.
        </p>
      </div>
      <div className="grid grid-2">
        {READING_TESTS.map((t) => (
          <div key={t.id} className="card stack">
            <div>
              <h3>{t.title}</h3>
              <p className="muted small">{t.description}</p>
            </div>
            <div className="row">
              <Link href={`/reading/${t.id}`} className="btn primary">
                Full test (60 min)
              </Link>
            </div>
            <div className="row small">
              <span className="muted">Single section (20 min):</span>
              {t.sections.map((s, i) => (
                <Link key={s.title} href={`/reading/${t.id}?section=${i + 1}`} className="btn">
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

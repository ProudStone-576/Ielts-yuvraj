import Link from "next/link";
import { WRITING_TASKS } from "@/content/writing";

export default function WritingHome() {
  const task1 = WRITING_TASKS.filter((t) => t.task === 1);
  const task2 = WRITING_TASKS.filter((t) => t.task === 2);
  return (
    <div className="stack">
      <div className="page-head">
        <h1>Writing</h1>
        <p>
          General Training Writing has two tasks in 60 minutes. Task 1 is a letter (150+ words, 20 minutes) and
          Task 2 is an essay (250+ words, 40 minutes). Task 2 counts twice as much as Task 1. CLB 9 needs band 7.0.
        </p>
      </div>

      <h2>Task 1 — Letters</h2>
      <div className="grid grid-2">
        {task1.map((t) => (
          <Link key={t.id} href={`/writing/${t.id}`} className="card">
            <span className="badge">{t.kind}</span>
            <h3 style={{ marginTop: "0.5rem" }}>{t.title}</h3>
            <p className="small muted" style={{ margin: 0 }}>
              {t.prompt}
            </p>
          </Link>
        ))}
      </div>

      <h2 style={{ marginTop: "1rem" }}>Task 2 — Essays</h2>
      <div className="grid grid-2">
        {task2.map((t) => (
          <Link key={t.id} href={`/writing/${t.id}`} className="card">
            <span className="badge">{t.kind}</span>
            <h3 style={{ marginTop: "0.5rem" }}>{t.title}</h3>
            <p className="small muted" style={{ margin: 0 }}>
              {t.prompt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { catalog } from "@/lib/catalog";
import { TestList } from "@/components/TestList";

export default function WritingHome() {
  return (
    <div className="stack">
      <div className="page-head module-hero tint-writing">
        <div className="eyebrow">Practice library</div>
        <h1>Writing</h1>
        <p>
          Two parts in 60 minutes, just like the real test: a letter (150+ words, about 20 minutes) and an essay (250+
          words, about 40 minutes). Part 2 counts twice as much as Part 1. CLB 9 needs band 7.0.
        </p>
      </div>
      <TestList module="writing" tests={catalog().writing} />
      <div className="card">
        <h3>Yuvraj&apos;s tips for band 7</h3>
        <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>Letters: cover every bullet point fully and keep the tone consistent with the reader (formal, semi-formal or informal).</li>
          <li>Essays: state your position in the introduction and keep it the same to the end. One clear main idea per body paragraph.</li>
          <li>Plan for 3–5 minutes before writing. It always saves time later.</li>
          <li>Leave 3 minutes to check: articles (a/the), plurals, subject–verb agreement and spelling.</li>
        </ul>
      </div>
    </div>
  );
}

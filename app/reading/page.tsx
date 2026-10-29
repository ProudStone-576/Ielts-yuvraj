import { catalog } from "@/lib/catalog";
import { TestList } from "@/components/TestList";

export default function ReadingHome() {
  return (
    <div className="stack">
      <div className="page-head module-hero tint-reading">
        <div className="eyebrow">Practice library</div>
        <h1>Reading</h1>
        <p>
          General Training Reading: three parts of increasing difficulty — everyday notices and adverts, workplace
          documents, and one long general-interest article. 60 minutes for 40 questions, with no extra time. CLB 9 needs
          band 7.0, which is about 34 correct.
        </p>
      </div>
      <TestList module="reading" tests={catalog().reading} />
      <div className="card">
        <h3>Yuvraj&apos;s tips for band 7</h3>
        <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>Budget your time: about 15 minutes for Part 1, 15 for Part 2 and 30 for the hard Part 3 text.</li>
          <li>Read the questions first, then scan for key words and their synonyms — don&apos;t read every word.</li>
          <li>Most answers come in text order (except matching tasks). If you&apos;re stuck, skip it, flag it for Review, and come back.</li>
          <li>Never leave a blank — a guess might score, an empty answer never will.</li>
        </ul>
      </div>
    </div>
  );
}

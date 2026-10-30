import { DrillList } from "@/components/DrillList";

export default function DrillsHome() {
  return (
    <div className="stack">
      <div className="page-head module-hero tint-listening">
        <div className="eyebrow">Listening · 5-minute drills</div>
        <h1>Dictation drills</h1>
        <p>
          At band 8, most Listening marks are lost on small details: a misspelled name, a wrong digit, a missing S. Each
          drill is ten short recordings — type exactly what you hear. Do one a day.
        </p>
      </div>
      <DrillList />
    </div>
  );
}

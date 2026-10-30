import { notFound } from "next/navigation";
import { DrillRunner } from "@/components/DrillRunner";
import { DRILL_SETS, getDrillSet } from "@/content/drills";

export function generateStaticParams() {
  return DRILL_SETS.map((d) => ({ id: d.id }));
}

export default async function DrillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const set = getDrillSet(id);
  if (!set) notFound();
  return <DrillRunner set={set} />;
}

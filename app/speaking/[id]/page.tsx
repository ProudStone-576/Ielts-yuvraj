import { notFound } from "next/navigation";
import { SpeakingRunner } from "@/components/SpeakingRunner";
import { getSpeakingSet, SPEAKING_SETS } from "@/content/speaking";

export function generateStaticParams() {
  return SPEAKING_SETS.map((s) => ({ id: s.id }));
}

export default async function SpeakingSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const set = getSpeakingSet(id);
  if (!set) notFound();
  return <SpeakingRunner set={set} />;
}

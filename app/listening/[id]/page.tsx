import { notFound } from "next/navigation";
import { ListeningRunner } from "@/components/ListeningRunner";
import { getListeningTest, LISTENING_TESTS } from "@/content/listening";

export function generateStaticParams() {
  return LISTENING_TESTS.map((t) => ({ id: t.id }));
}

export default async function ListeningTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = getListeningTest(id);
  if (!test) notFound();
  return <ListeningRunner test={test} />;
}

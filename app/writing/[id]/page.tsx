import { notFound } from "next/navigation";
import { WritingRunner } from "@/components/WritingRunner";
import { getWritingTest, WRITING_TESTS } from "@/content/writing";

export function generateStaticParams() {
  return WRITING_TESTS.map((t) => ({ id: t.id }));
}

export default async function WritingTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = getWritingTest(id);
  if (!found) notFound();
  return <WritingRunner test={found.test} tasks={found.tasks} />;
}

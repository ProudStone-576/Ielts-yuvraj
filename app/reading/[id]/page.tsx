import { notFound } from "next/navigation";
import { ReadingRunner } from "@/components/ReadingRunner";
import { getReadingTest, READING_TESTS } from "@/content/reading";

export function generateStaticParams() {
  return READING_TESTS.map((t) => ({ id: t.id }));
}

export default async function ReadingTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = getReadingTest(id);
  if (!test) notFound();
  return <ReadingRunner test={test} />;
}

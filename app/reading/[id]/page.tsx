import { notFound } from "next/navigation";
import { ReadingRunner } from "@/components/ReadingRunner";
import { getReadingTest, READING_TESTS } from "@/content/reading";

export function generateStaticParams() {
  return READING_TESTS.map((t) => ({ id: t.id }));
}

export default async function ReadingTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { id } = await params;
  const { section } = await searchParams;
  const test = getReadingTest(id);
  if (!test) notFound();

  const n = Number(section);
  const only = Number.isInteger(n) && n >= 1 && n <= test.sections.length ? n - 1 : undefined;

  // Remount the runner when switching between full test and single sections.
  return <ReadingRunner key={only ?? "full"} test={test} only={only} />;
}

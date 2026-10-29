import { notFound } from "next/navigation";
import { WritingRunner } from "@/components/WritingRunner";
import { getWritingTask, WRITING_TASKS } from "@/content/writing";

export function generateStaticParams() {
  return WRITING_TASKS.map((t) => ({ id: t.id }));
}

export default async function WritingTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = getWritingTask(id);
  if (!task) notFound();
  return <WritingRunner task={task} />;
}

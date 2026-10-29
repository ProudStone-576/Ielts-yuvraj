import { LISTENING_TESTS } from "@/content/listening";
import { READING_TESTS } from "@/content/reading";
import { SPEAKING_SETS } from "@/content/speaking";
import { getWritingTest, WRITING_TESTS } from "@/content/writing";
import type { Module } from "./types";

export interface CatalogItem {
  id: string;
  title: string;
  /** One line about what's inside, shown on the test's poster. */
  subtitle?: string;
}

/** Lightweight list of every test (ids and titles only), passed to client pages. */
export function catalog(): Record<Module, CatalogItem[]> {
  return {
    listening: LISTENING_TESTS.map((t) => ({ id: t.id, title: t.title, subtitle: t.parts[0]?.context })),
    reading: READING_TESTS.map((t) => ({ id: t.id, title: t.title, subtitle: t.sections.at(-1)?.passages[0]?.title })),
    writing: WRITING_TESTS.map((t) => ({ id: t.id, title: t.title, subtitle: getWritingTest(t.id)?.tasks[1].title })),
    speaking: SPEAKING_SETS.map((t) => ({ id: t.id, title: t.title, subtitle: t.part3.topic })),
  };
}

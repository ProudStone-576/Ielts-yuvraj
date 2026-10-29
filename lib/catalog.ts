import { LISTENING_TESTS } from "@/content/listening";
import { READING_TESTS } from "@/content/reading";
import { SPEAKING_SETS } from "@/content/speaking";
import { WRITING_TESTS } from "@/content/writing";
import type { Module } from "./types";

export interface CatalogItem {
  id: string;
  title: string;
}

/** Lightweight list of every test (ids and titles only), passed to client pages. */
export function catalog(): Record<Module, CatalogItem[]> {
  return {
    listening: LISTENING_TESTS.map((t) => ({ id: t.id, title: t.title })),
    reading: READING_TESTS.map((t) => ({ id: t.id, title: t.title })),
    writing: WRITING_TESTS.map((t) => ({ id: t.id, title: t.title })),
    speaking: SPEAKING_SETS.map((t) => ({ id: t.id, title: t.title })),
  };
}

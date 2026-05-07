import { describe, expect, it } from "vitest";
import { searchPapers, tokenize } from "./search";
import type { PaperRecord } from "./schema";

const papers: PaperRecord[] = [
  {
    id: "a",
    title: "Local-first writing",
    abstract: "A static academic writing system",
    authors: [{ name: "Ada" }],
    year: 2026,
    venue: "arXiv",
    keywords: ["local-first", "writing"],
    ontologyTags: [],
    references: [],
    citations: [],
    embedding: [0.1],
  },
  {
    id: "b",
    title: "Unrelated plotting",
    abstract: "A chart system",
    authors: [{ name: "Grace" }],
    year: 2020,
    venue: "Journal",
    keywords: ["plot"],
    ontologyTags: [],
    references: [],
    citations: [],
    embedding: [0.2],
  },
];

describe("search", () => {
  it("normalizes diacritics and drops stopwords", () => {
    expect(tokenize("The Étude of Writing")).toEqual(["etude", "writing"]);
  });

  it("ranks matching papers first", () => {
    const results = searchPapers("academic writing", papers);
    expect(results[0].id).toBe("a");
  });
});

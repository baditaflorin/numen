import type { PaperRecord } from "./schema";

export type ScoredPaper = PaperRecord & { score: number };

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

export function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

export function scorePaper(query: string, paper: PaperRecord): number {
  const terms = tokenize(query);
  if (terms.length === 0) return paper.year / 10_000;
  const haystack = tokenize(
    [
      paper.title,
      paper.abstract,
      paper.venue,
      paper.keywords.join(" "),
      paper.ontologyTags.join(" "),
    ].join(" "),
  );
  const counts = new Map<string, number>();
  haystack.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));
  return (
    terms.reduce((sum, term) => sum + (counts.get(term) ?? 0), 0) +
    paper.embedding.reduce((a, b) => a + b, 0) / 100
  );
}

export function searchPapers(
  query: string,
  papers: PaperRecord[],
): ScoredPaper[] {
  return papers
    .map((paper) => ({ ...paper, score: scorePaper(query, paper) }))
    .filter((paper) => query.trim() === "" || paper.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.year - a.year || a.title.localeCompare(b.title),
    );
}

export function extractCitationHints(
  text: string,
  papers: PaperRecord[],
): PaperRecord[] {
  const tokens = new Set(tokenize(text));
  return papers
    .map((paper) => ({
      paper,
      hits: paper.keywords.filter((keyword) =>
        tokens.has(normalizeText(keyword)),
      ).length,
    }))
    .filter((entry) => entry.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.paper.year - a.paper.year)
    .slice(0, 4)
    .map((entry) => entry.paper);
}

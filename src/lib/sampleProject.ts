import type { PaperRecord } from "./schema";
import type { PaperProject } from "./storage";

export function createDefaultProject(): PaperProject {
  return {
    title: "Local-first literature review with static research caches",
    subtitle: "A Numen draft",
    authors: "Florin Badita",
    orcid: "0000-0002-1825-0097",
    targetVenue: "Demo Journal of Open Research Tools",
    keywords: "academic writing, local-first, literature review",
    sections: {
      abstract:
        "We present a static-first academic writing workflow that combines local drafting, citation management, paper search, and reproducible export.",
      introduction:
        "Academic writing often moves between disconnected editors, citation managers, notebooks, and submission portals. A browser-native workspace can reduce that switching cost while preserving local control.",
      methods:
        "The prototype uses a GitHub Pages frontend, IndexedDB persistence, static paper artifacts, lazy visualization engines, and deterministic data-generation tooling.",
      results:
        "A single project can be drafted, linked to literature, visualized as a citation graph, and exported as Markdown, LaTeX, ZIP, or PDF draft artifacts.",
      discussion:
        "Static deployment removes runtime hosting burden, but heavyweight TeX and statistical runtimes require careful lazy-loading and graceful fallbacks.",
      conclusion:
        "Numen demonstrates that a useful academic writing platform can begin as a static, public, offline-friendly application.",
    },
    bibtex: `@article{numen2026,
  title = {Local-first literature review with static research caches},
  author = {Badita, Florin},
  year = {2026},
  journal = {Demo Journal of Open Research Tools}
}`,
    figureMermaid: `flowchart LR
  draft["Draft"]
  cite["Citations"]
  cache["Static paper cache"]
  graph["Citation graph"]
  export["Submission bundle"]
  draft --> cite --> export
  cache --> cite
  cache --> graph --> export`,
    updatedAt: new Date().toISOString(),
  };
}

export function createBibtexForPaper(paper: PaperRecord): string {
  const key = paper.id.replace(/[^a-zA-Z0-9]+/g, "").slice(0, 24) || "paper";
  const author = paper.authors.map((entry) => entry.name).join(" and ");
  const doi = paper.doi ? `\n  doi = {${paper.doi}},` : "";
  const arxiv = paper.arxivId ? `\n  eprint = {${paper.arxivId}},` : "";
  return `@article{${key},
  title = {${paper.title}},
  author = {${author}},
  year = {${paper.year}},
  journal = {${paper.venue}},${doi}${arxiv}
}`;
}

import { BookMarked, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { PaperRecord } from "../../lib/schema";
import { searchPapers } from "../../lib/search";

type LibraryPanelProps = {
  papers: PaperRecord[];
  loading: boolean;
  onCite: (paper: PaperRecord) => void;
};

export function LibraryPanel({ papers, loading, onCite }: LibraryPanelProps) {
  const [query, setQuery] = useState("local-first writing citations");
  const [year, setYear] = useState("all");
  const results = useMemo(() => {
    const filtered =
      year === "all"
        ? papers
        : papers.filter((paper) => paper.year >= Number(year));
    return searchPapers(query, filtered).slice(0, 12);
  }, [papers, query, year]);

  return (
    <section className="panel-grid">
      <div className="surface">
        <div className="section-heading">
          <h2>Paper Cache</h2>
          <span>{loading ? "loading" : `${papers.length} records`}</span>
        </div>
        <div className="library-tools">
          <label className="search-box">
            <Search size={17} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            aria-label="Minimum year"
          >
            <option value="all">All years</option>
            <option value="2026">2026+</option>
            <option value="2024">2024+</option>
            <option value="2020">2020+</option>
          </select>
        </div>
        <div className="paper-table">
          {results.map((paper) => (
            <article className="paper-row" key={paper.id}>
              <div>
                <strong>{paper.title}</strong>
                <p>{paper.abstract}</p>
                <span>
                  {paper.authors.map((author) => author.name).join(", ")} ·{" "}
                  {paper.year} · {paper.venue}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onCite(paper)}
                title="Add citation"
              >
                <BookMarked size={17} aria-hidden="true" />
                Cite
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

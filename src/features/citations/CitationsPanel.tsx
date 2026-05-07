import { CheckCircle2, FileText } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { parseBibtex, type CitationEntry } from "../../lib/bibtex";
import type { PaperProject } from "../../lib/storage";

type CitationsPanelProps = {
  project: PaperProject;
  setProject: Dispatch<SetStateAction<PaperProject>>;
};

export function CitationsPanel({ project, setProject }: CitationsPanelProps) {
  const [entries, setEntries] = useState<CitationEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    parseBibtex(project.bibtex).then((parsed) => {
      if (mounted) setEntries(parsed);
    });
    return () => {
      mounted = false;
    };
  }, [project.bibtex]);

  const checks = [
    { label: "BibTeX entries", pass: entries.length > 0 },
    {
      label: "ORCID format",
      pass: /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(project.orcid),
    },
    {
      label: "Unicode NFC",
      pass: project.bibtex.normalize("NFC") === project.bibtex,
    },
    { label: "Target venue", pass: project.targetVenue.trim().length > 0 },
  ];

  return (
    <section className="panel-grid two-columns">
      <div className="surface">
        <div className="section-heading">
          <h2>BibTeX</h2>
          <FileText size={18} aria-hidden="true" />
        </div>
        <textarea
          className="bib-editor"
          value={project.bibtex}
          onChange={(event) =>
            setProject((current) => ({
              ...current,
              bibtex: event.target.value,
            }))
          }
        />
      </div>

      <div className="surface">
        <div className="section-heading">
          <h2>Parsed References</h2>
          <span>{entries.length}</span>
        </div>
        <div className="check-list">
          {checks.map((check) => (
            <div
              className={check.pass ? "check pass" : "check"}
              key={check.label}
            >
              <CheckCircle2 size={17} aria-hidden="true" />
              <span>{check.label}</span>
            </div>
          ))}
        </div>
        <div className="reference-list">
          {entries.map((entry) => (
            <article className="mini-paper" key={entry.id}>
              <strong>{entry.title}</strong>
              <span>
                {entry.author} {entry.year ? `· ${entry.year}` : ""}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Sparkles } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { PaperRecord } from "../../lib/schema";
import { extractCitationHints } from "../../lib/search";
import type { PaperProject, PaperSectionKey } from "../../lib/storage";

type WorkspacePanelProps = {
  project: PaperProject;
  setProject: Dispatch<SetStateAction<PaperProject>>;
  papers: PaperRecord[];
};

const sections: PaperSectionKey[] = [
  "abstract",
  "introduction",
  "methods",
  "results",
  "discussion",
  "conclusion",
];

export function WorkspacePanel({
  project,
  setProject,
  papers,
}: WorkspacePanelProps) {
  const draftText = Object.values(project.sections).join(" ");
  const words = draftText.trim().split(/\s+/g).filter(Boolean).length;
  const hints = extractCitationHints(draftText, papers);

  function updateField<K extends keyof PaperProject>(
    key: K,
    value: PaperProject[K],
  ) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  function updateSection(key: PaperSectionKey, value: string) {
    setProject((current) => ({
      ...current,
      sections: { ...current.sections, [key]: value },
    }));
  }

  return (
    <section className="panel-grid two-columns">
      <div className="surface">
        <div className="section-heading">
          <h2>Manuscript</h2>
          <span>{words} words</span>
        </div>
        <div className="form-grid">
          <label>
            Title
            <input
              value={project.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
          </label>
          <label>
            Subtitle
            <input
              value={project.subtitle}
              onChange={(event) => updateField("subtitle", event.target.value)}
            />
          </label>
          <label>
            Authors
            <input
              value={project.authors}
              onChange={(event) => updateField("authors", event.target.value)}
            />
          </label>
          <label>
            ORCID
            <input
              value={project.orcid}
              onChange={(event) => updateField("orcid", event.target.value)}
            />
          </label>
          <label>
            Target venue
            <input
              value={project.targetVenue}
              onChange={(event) =>
                updateField("targetVenue", event.target.value)
              }
            />
          </label>
          <label>
            Keywords
            <input
              value={project.keywords}
              onChange={(event) => updateField("keywords", event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="surface">
        <div className="section-heading">
          <h2>Citation Radar</h2>
          <Sparkles size={18} aria-hidden="true" />
        </div>
        <div className="hint-list">
          {hints.length === 0 ? (
            <p className="muted">No matching papers loaded yet.</p>
          ) : null}
          {hints.map((paper) => (
            <article className="mini-paper" key={paper.id}>
              <strong>{paper.title}</strong>
              <span>
                {paper.year} · {paper.venue}
              </span>
            </article>
          ))}
        </div>
      </div>

      <div className="surface editor-span">
        <div className="section-heading">
          <h2>Draft Sections</h2>
          <span>autosaved locally</span>
        </div>
        <div className="section-editor-grid">
          {sections.map((section) => (
            <label key={section}>
              <span>{section}</span>
              <textarea
                value={project.sections[section]}
                onChange={(event) => updateSection(section, event.target.value)}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Download, FileText, PackageCheck, Printer } from "lucide-react";
import type { PaperRecord } from "../../lib/schema";
import {
  buildLatex,
  buildMarkdown,
  buildPdfDraft,
  buildSubmissionZip,
  downloadBlob,
} from "../../lib/exporters";
import type { PaperProject } from "../../lib/storage";

type ExportPanelProps = {
  project: PaperProject;
  papers: PaperRecord[];
  notify: (message: string) => void;
};

export function ExportPanel({ project, papers, notify }: ExportPanelProps) {
  function downloadText(content: string, filename: string, type: string) {
    downloadBlob(new Blob([content], { type }), filename);
    notify(`${filename} downloaded`);
  }

  async function downloadZip() {
    downloadBlob(
      await buildSubmissionZip(project, papers),
      "numen-submission.zip",
    );
    notify("Submission bundle downloaded");
  }

  async function downloadPdf() {
    downloadBlob(await buildPdfDraft(project), "numen-draft.pdf");
    notify("PDF draft downloaded");
  }

  const checklist = [
    { label: "Title", pass: project.title.trim().length > 0 },
    { label: "Abstract", pass: project.sections.abstract.trim().length > 80 },
    { label: "References", pass: project.bibtex.includes("@") },
    { label: "ORCID", pass: project.orcid.trim().length > 0 },
    { label: "Figure", pass: project.figureMermaid.trim().length > 0 },
  ];

  return (
    <section className="panel-grid two-columns">
      <div className="surface">
        <div className="section-heading">
          <h2>Artifacts</h2>
          <PackageCheck size={18} aria-hidden="true" />
        </div>
        <div className="export-actions">
          <button
            type="button"
            onClick={() =>
              downloadText(buildMarkdown(project), "paper.md", "text/markdown")
            }
          >
            <FileText size={17} aria-hidden="true" />
            Markdown
          </button>
          <button
            type="button"
            onClick={() =>
              downloadText(buildLatex(project), "paper.tex", "text/plain")
            }
          >
            <FileText size={17} aria-hidden="true" />
            LaTeX
          </button>
          <button type="button" onClick={downloadPdf}>
            <Printer size={17} aria-hidden="true" />
            PDF Draft
          </button>
          <button type="button" onClick={downloadZip}>
            <Download size={17} aria-hidden="true" />
            Bundle
          </button>
        </div>
      </div>

      <div className="surface">
        <div className="section-heading">
          <h2>Submission Gate</h2>
          <span>
            {checklist.filter((item) => item.pass).length}/{checklist.length}
          </span>
        </div>
        <div className="check-list">
          {checklist.map((item) => (
            <div
              className={item.pass ? "check pass" : "check"}
              key={item.label}
            >
              <span>{item.pass ? "ready" : "todo"}</span>
              <strong>{item.label}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

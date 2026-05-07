import { Image, Play } from "lucide-react";
import { useRef, type Dispatch, type SetStateAction } from "react";
import type { PaperProject } from "../../lib/storage";

type FiguresPanelProps = {
  project: PaperProject;
  setProject: Dispatch<SetStateAction<PaperProject>>;
  notify: (message: string) => void;
};

export function FiguresPanel({
  project,
  setProject,
  notify,
}: FiguresPanelProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  async function renderMermaid() {
    const mermaid = (await import("mermaid")).default;
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "strict",
    });
    const id = `numen-figure-${Date.now()}`;
    const result = await mermaid.render(id, project.figureMermaid);
    if (previewRef.current) previewRef.current.innerHTML = result.svg;
    notify("Figure rendered");
  }

  return (
    <section className="panel-grid two-columns">
      <div className="surface">
        <div className="section-heading">
          <h2>Mermaid Figure</h2>
          <button type="button" onClick={renderMermaid} title="Render figure">
            <Play size={16} aria-hidden="true" />
            Render
          </button>
        </div>
        <textarea
          className="figure-editor"
          value={project.figureMermaid}
          onChange={(event) =>
            setProject((current) => ({
              ...current,
              figureMermaid: event.target.value,
            }))
          }
        />
      </div>

      <div className="surface">
        <div className="section-heading">
          <h2>Preview</h2>
          <Image size={18} aria-hidden="true" />
        </div>
        <div className="figure-preview" ref={previewRef}>
          <svg
            viewBox="0 0 420 240"
            role="img"
            aria-label="Draft figure preview"
          >
            <rect x="20" y="24" width="110" height="52" rx="8" fill="#006d77" />
            <rect
              x="155"
              y="96"
              width="110"
              height="52"
              rx="8"
              fill="#d95d39"
            />
            <rect
              x="290"
              y="164"
              width="110"
              height="52"
              rx="8"
              fill="#4d7c0f"
            />
            <path
              d="M130 50 C160 50 145 122 155 122"
              stroke="#17201b"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M265 122 C300 122 280 190 290 190"
              stroke="#17201b"
              strokeWidth="3"
              fill="none"
            />
            <text x="47" y="57" fill="#fff" fontSize="14">
              Draft
            </text>
            <text x="184" y="129" fill="#fff" fontSize="14">
              Cite
            </text>
            <text x="319" y="197" fill="#fff" fontSize="14">
              Export
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

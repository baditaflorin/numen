import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BookOpen,
  Boxes,
  FileArchive,
  GitFork,
  Heart,
  Library,
  Network,
  PenLine,
  Shapes,
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toast } from "./components/Toast";
import { CitationsPanel } from "./features/citations/CitationsPanel";
import { FiguresPanel } from "./features/figures/FiguresPanel";
import { LibraryPanel } from "./features/library/LibraryPanel";
import { NetworkPanel } from "./features/network/NetworkPanel";
import { SystemPanel } from "./features/system/SystemPanel";
import { WorkspacePanel } from "./features/workspace/WorkspacePanel";
import { APP_LINKS, BUILD_INFO } from "./lib/constants";
import {
  createBibtexForPaper,
  createDefaultProject,
} from "./lib/sampleProject";
import {
  PaperMetaSchema,
  PaperRecordSchema,
  type PaperMeta,
  type PaperRecord,
} from "./lib/schema";
import { loadProject, saveProject, type PaperProject } from "./lib/storage";

type TabId =
  | "draft"
  | "library"
  | "citations"
  | "figures"
  | "network"
  | "export"
  | "system";

const tabs: Array<{ id: TabId; label: string; icon: typeof PenLine }> = [
  { id: "draft", label: "Draft", icon: PenLine },
  { id: "library", label: "Library", icon: Library },
  { id: "citations", label: "Citations", icon: BookOpen },
  { id: "figures", label: "Figures", icon: Shapes },
  { id: "network", label: "Network", icon: Network },
  { id: "export", label: "Export", icon: FileArchive },
  { id: "system", label: "System", icon: Boxes },
];

const ExportPanel = lazy(() =>
  import("./features/export/ExportPanel").then((module) => ({
    default: module.ExportPanel,
  })),
);

async function fetchData<T>(
  path: string,
  parse: (value: unknown) => T,
): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}${path}`);
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return parse(await response.json());
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("draft");
  const [project, setProject] = useState<PaperProject>(() =>
    createDefaultProject(),
  );
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const saveTimer = useRef<number | null>(null);

  const papersQuery = useQuery({
    queryKey: ["papers", "v1"],
    queryFn: () =>
      fetchData("data/v1/papers.json", (value) =>
        PaperRecordSchema.array().parse(value),
      ),
  });
  const metaQuery = useQuery({
    queryKey: ["papers-meta", "v1"],
    queryFn: () =>
      fetchData("data/v1/papers.meta.json", (value) =>
        PaperMetaSchema.parse(value),
      ),
  });

  useEffect(() => {
    loadProject()
      .then((saved) => {
        if (saved) setProject(saved);
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveProject({ ...project, updatedAt: new Date().toISOString() }).catch(
        () => setToast("Local save failed"),
      );
    }, 500);
  }, [project, ready]);

  const papers = papersQuery.data ?? [];
  const meta = metaQuery.data;
  const dataStatus = useMemo(() => {
    if (papersQuery.isError || metaQuery.isError) return "data offline";
    if (!meta) return "loading data";
    return `${meta.recordCount} papers`;
  }, [meta, metaQuery.isError, papersQuery.isError]);

  function addCitation(paper: PaperRecord) {
    setProject((current) => ({
      ...current,
      bibtex:
        `${current.bibtex.trim()}\n\n${createBibtexForPaper(paper)}`.trim(),
    }));
    setToast(`Citation added: ${paper.title}`);
    setActiveTab("citations");
  }

  return (
    <ErrorBoundary>
      <div className="app-shell">
        <aside className="sidebar" aria-label="Numen workspace navigation">
          <div className="brand">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" />
            <div>
              <strong>Numen</strong>
              <span>v{BUILD_INFO.version}</span>
            </div>
          </div>
          <nav>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={
                    activeTab === tab.id ? "nav-item active" : "nav-item"
                  }
                  type="button"
                  title={tab.label}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="workbench">
          <header className="topbar">
            <div>
              <p className="eyebrow">Academic writing workbench</p>
              <h1>{project.title}</h1>
            </div>
            <div className="topbar-actions">
              <span className="status-chip">
                <Activity size={14} aria-hidden="true" />
                {dataStatus}
              </span>
              <span className="status-chip">commit {BUILD_INFO.commit}</span>
              <a
                className="icon-link"
                href={APP_LINKS.github}
                title="Star on GitHub"
              >
                <GitFork size={17} aria-hidden="true" />
                <span>Star</span>
              </a>
              <a
                className="icon-link support"
                href={APP_LINKS.paypal}
                title="Support on PayPal"
              >
                <Heart size={17} aria-hidden="true" />
                <span>PayPal</span>
              </a>
            </div>
          </header>

          {activeTab === "draft" && (
            <WorkspacePanel
              project={project}
              setProject={setProject}
              papers={papers}
            />
          )}
          {activeTab === "library" && (
            <LibraryPanel
              papers={papers}
              onCite={addCitation}
              loading={papersQuery.isLoading}
            />
          )}
          {activeTab === "citations" && (
            <CitationsPanel project={project} setProject={setProject} />
          )}
          {activeTab === "figures" && (
            <FiguresPanel
              project={project}
              setProject={setProject}
              notify={setToast}
            />
          )}
          {activeTab === "network" && <NetworkPanel papers={papers} />}
          {activeTab === "export" && (
            <Suspense
              fallback={<div className="surface">Loading export tools</div>}
            >
              <ExportPanel
                project={project}
                papers={papers}
                notify={setToast}
              />
            </Suspense>
          )}
          {activeTab === "system" && (
            <SystemPanel
              meta={meta as PaperMeta | undefined}
              dataError={papersQuery.error}
            />
          )}
        </main>

        <Toast message={toast} onClose={() => setToast(null)} />
      </div>
    </ErrorBoundary>
  );
}

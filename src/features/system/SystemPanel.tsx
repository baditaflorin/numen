import { Database, ExternalLink, Gauge, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { APP_LINKS, BUILD_INFO } from "../../lib/constants";
import { loadDuckDBStatus, type DuckDBStatus } from "../../lib/duckdbAdapter";
import type { PaperMeta } from "../../lib/schema";

type SystemPanelProps = {
  meta?: PaperMeta;
  dataError: unknown;
};

const engines = [
  ["DuckDB-WASM", "lazy adapter"],
  ["Mermaid", "lazy renderer"],
  ["Cytoscape.js", "lazy graph"],
  ["Citation.js", "lazy BibTeX"],
  ["PDF-lib", "lazy PDF"],
  ["TeX/WebR/Pyodide", "adapter boundary"],
  ["LanguageTool/Hunspell/Vale", "planned local checks"],
  ["PDF/A/ExifTool", "planned validators"],
] as const;

export function SystemPanel({ meta, dataError }: SystemPanelProps) {
  const [duckdb, setDuckdb] = useState<DuckDBStatus | null>(null);
  const [duckdbError, setDuckdbError] = useState<string | null>(null);

  async function testDuckDB() {
    setDuckdbError(null);
    try {
      setDuckdb(await loadDuckDBStatus());
    } catch (error) {
      setDuckdbError(
        error instanceof Error ? error.message : "DuckDB load failed",
      );
    }
  }

  return (
    <section className="panel-grid two-columns">
      <div className="surface">
        <div className="section-heading">
          <h2>Build</h2>
          <Gauge size={18} aria-hidden="true" />
        </div>
        <dl className="meta-list">
          <div>
            <dt>Version</dt>
            <dd>v{BUILD_INFO.version}</dd>
          </div>
          <div>
            <dt>Commit</dt>
            <dd>{BUILD_INFO.commit}</dd>
          </div>
          <div>
            <dt>Built</dt>
            <dd>{new Date(BUILD_INFO.builtAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt>Repository</dt>
            <dd>
              <a href={APP_LINKS.github}>
                https://github.com/baditaflorin/numen
              </a>
            </dd>
          </div>
          <div>
            <dt>Support</dt>
            <dd>
              <a href={APP_LINKS.paypal}>
                https://www.paypal.com/paypalme/florinbadita
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div className="surface">
        <div className="section-heading">
          <h2>Data</h2>
          <Database size={18} aria-hidden="true" />
        </div>
        <dl className="meta-list">
          <div>
            <dt>Schema</dt>
            <dd>{meta?.schemaVersion ?? "unavailable"}</dd>
          </div>
          <div>
            <dt>Artifact</dt>
            <dd>{meta?.artifactVersion ?? "unavailable"}</dd>
          </div>
          <div>
            <dt>Records</dt>
            <dd>{meta?.recordCount ?? 0}</dd>
          </div>
          <div>
            <dt>Generated</dt>
            <dd>
              {meta
                ? new Date(meta.generatedAt).toLocaleString()
                : "unavailable"}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{dataError ? "fetch failed" : "ready"}</dd>
          </div>
        </dl>
      </div>

      <div className="surface editor-span">
        <div className="section-heading">
          <h2>Engines</h2>
          <button
            type="button"
            onClick={testDuckDB}
            title="Load DuckDB-WASM adapter"
          >
            <ExternalLink size={16} aria-hidden="true" />
            DuckDB
          </button>
        </div>
        <div className="engine-grid">
          {engines.map(([name, status]) => (
            <div className="engine" key={name}>
              <ShieldCheck size={17} aria-hidden="true" />
              <strong>{name}</strong>
              <span>{status}</span>
            </div>
          ))}
        </div>
        {duckdb ? (
          <p className="adapter-note">DuckDB bundle: {duckdb.mainModule}</p>
        ) : null}
        {duckdbError ? <p className="error-note">{duckdbError}</p> : null}
      </div>
    </section>
  );
}

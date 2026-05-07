import { useEffect, useRef, useState } from "react";
import type { Core } from "cytoscape";
import type { PaperRecord } from "../../lib/schema";

type NetworkPanelProps = {
  papers: PaperRecord[];
};

export function NetworkPanel({ papers }: NetworkPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("loading graph engine");

  useEffect(() => {
    let graph: Core | undefined;
    let mounted = true;
    import("cytoscape").then((module) => {
      if (!mounted || !containerRef.current) return;
      const cytoscape = module.default;
      const visible = papers.slice(0, 10);
      const ids = new Set(visible.map((paper) => paper.id));
      const elements = [
        ...visible.map((paper) => ({
          data: { id: paper.id, label: paper.title.slice(0, 34) },
        })),
        ...visible.flatMap((paper) =>
          paper.references
            .filter((reference) => ids.has(reference))
            .map((reference) => ({
              data: {
                id: `${paper.id}-${reference}`,
                source: paper.id,
                target: reference,
              },
            })),
        ),
      ];
      graph = cytoscape({
        container: containerRef.current,
        elements,
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#006d77",
              label: "data(label)",
              color: "#17201b",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#d95d39",
              "target-arrow-color": "#d95d39",
            },
          },
        ],
        layout: { name: "cose", animate: false },
      });
      setStatus(`${visible.length} nodes`);
    });
    return () => {
      mounted = false;
      graph?.destroy();
    };
  }, [papers]);

  return (
    <section className="panel-grid">
      <div className="surface">
        <div className="section-heading">
          <h2>Citation Network</h2>
          <span>{status}</span>
        </div>
        <div className="network-canvas" ref={containerRef} />
      </div>
    </section>
  );
}

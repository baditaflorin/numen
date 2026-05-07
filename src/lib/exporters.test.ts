import { describe, expect, it } from "vitest";
import { buildLatex, buildMarkdown } from "./exporters";
import { createDefaultProject } from "./sampleProject";

describe("exporters", () => {
  it("builds markdown with references", () => {
    const markdown = buildMarkdown(createDefaultProject());
    expect(markdown).toContain("# Local-first literature review");
    expect(markdown).toContain("```bibtex");
  });

  it("escapes common LaTeX control characters", () => {
    const project = createDefaultProject();
    project.title = "A&B_Study";
    const latex = buildLatex(project);
    expect(latex).toContain("A\\&B\\_Study");
  });
});

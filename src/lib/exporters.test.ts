import { describe, expect, it } from "vitest";
import {
  buildLatex,
  buildMarkdown,
  buildPdfDraftBytes,
  wrapTextToWidth,
} from "./exporters";
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

  it("escapes every LaTeX-special character, not just \\, _, &, %", () => {
    // Regression test: an earlier version of escapeLatex only handled
    // \, _, &, % and left $ # { } ~ ^ unescaped, so ordinary academic
    // phrasing ("O(n^2)", "dataset #1", "cost $5", "cache~invalidation")
    // produced a .tex file that fails to compile.
    const project = createDefaultProject();
    project.title = "O(n^2) costs $5 for dataset #1 {v2} cache~ok";
    const latex = buildLatex(project);
    expect(latex).toContain(
      "O(n\\textasciicircum{}2) costs \\$5 for dataset \\#1 \\{v2\\} cache\\textasciitilde{}ok",
    );
  });

  it("does not double-escape the braces introduced by the backslash substitution", () => {
    // Regression test: a naive chain of .replaceAll calls that escapes "\"
    // to "\textbackslash{}" and THEN escapes "{" / "}" will re-match the
    // braces it just inserted, corrupting the command into
    // "\textbackslash\{\}". A single-pass replace must avoid this.
    const project = createDefaultProject();
    project.title = "back\\slash";
    const latex = buildLatex(project);
    expect(latex).toContain("back\\textbackslash{}slash");
    expect(latex).not.toContain("\\textbackslash\\{\\}");
  });

  it("produces a valid PDF blob for the default project", async () => {
    const bytes = await buildPdfDraftBytes(createDefaultProject());
    expect(bytes.byteLength).toBeGreaterThan(1500);
    // %PDF header and EOF marker — sanity check that pdf-lib produced a real file.
    expect(String.fromCharCode(...bytes.subarray(0, 4))).toBe("%PDF");
    const tail = new TextDecoder("latin1").decode(bytes.subarray(-32));
    expect(tail).toContain("%%EOF");
  });
});

describe("wrapTextToWidth", () => {
  // Use a 1-unit-per-character measure so width assertions are character counts.
  const measure = (s: string) => s.length;

  it("does not silently drop content that exceeds the width", () => {
    const sentinel = "SENTINEL";
    const text = `${"word ".repeat(40)}${sentinel} ${"word ".repeat(40)}`;
    const wrapped = wrapTextToWidth(text, 30, measure);
    expect(wrapped.join(" ")).toContain(sentinel);
  });

  it("breaks on word boundaries when possible", () => {
    const wrapped = wrapTextToWidth(
      "alpha beta gamma delta epsilon",
      12,
      measure,
    );
    expect(wrapped.every((line) => line.length <= 12)).toBe(true);
    // No word should be split when whole-word breaks are possible.
    expect(wrapped.join(" ")).toBe("alpha beta gamma delta epsilon");
  });

  it("hard-breaks a single token longer than the width", () => {
    const wrapped = wrapTextToWidth("abcdefghijklmnopqrstuvwxyz", 10, measure);
    expect(wrapped.length).toBeGreaterThan(1);
    expect(wrapped.join("")).toBe("abcdefghijklmnopqrstuvwxyz");
    expect(wrapped.every((line) => line.length <= 10)).toBe(true);
  });

  it("preserves an empty line as an empty entry", () => {
    expect(wrapTextToWidth("", 80, measure)).toEqual([""]);
  });
});

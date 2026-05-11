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

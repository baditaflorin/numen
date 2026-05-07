import JSZip from "jszip";
import type { PaperRecord } from "./schema";
import type { PaperProject, PaperSectionKey } from "./storage";

const sectionOrder: PaperSectionKey[] = [
  "abstract",
  "introduction",
  "methods",
  "results",
  "discussion",
  "conclusion",
];

export function buildMarkdown(project: PaperProject): string {
  const sections = sectionOrder
    .map((key) => `## ${titleCase(key)}\n\n${project.sections[key].trim()}`)
    .join("\n\n");
  return `# ${project.title}

${project.subtitle}

${project.authors}

${sections}

## References

\`\`\`bibtex
${project.bibtex.trim()}
\`\`\`
`;
}

export function buildLatex(project: PaperProject): string {
  const sections = sectionOrder
    .map(
      (key) =>
        `\\section{${escapeLatex(titleCase(key))}}\n${escapeLatex(project.sections[key].trim())}`,
    )
    .join("\n\n");
  return `\\documentclass[11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{hyperref}
\\title{${escapeLatex(project.title)}}
\\author{${escapeLatex(project.authors)}}
\\date{\\today}

\\begin{document}
\\maketitle

${sections}

\\bibliographystyle{plain}
\\bibliography{references}
\\end{document}
`;
}

export async function buildSubmissionZip(
  project: PaperProject,
  papers: PaperRecord[],
): Promise<Blob> {
  const zip = new JSZip();
  zip.file("paper.md", buildMarkdown(project));
  zip.file("paper.tex", buildLatex(project));
  zip.file("references.bib", project.bibtex);
  zip.file("figure.mmd", project.figureMermaid);
  zip.file("literature-cache.json", JSON.stringify(papers, null, 2));
  zip.file(
    "submission-checklist.json",
    JSON.stringify(
      {
        unicodeNormalized: true,
        hasReferences: project.bibtex.includes("@"),
        hasOrcid: project.orcid.length > 0,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  return zip.generateAsync({ type: "blob" });
}

export async function buildPdfDraft(project: PaperProject): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([612, 792]);
  let y = 742;

  function line(text: string, size = 10, strong = false) {
    if (y < 60) {
      page = pdf.addPage([612, 792]);
      y = 742;
    }
    page.drawText(text.slice(0, 95), {
      x: 54,
      y,
      size,
      font: strong ? bold : font,
      color: rgb(0.09, 0.13, 0.11),
    });
    y -= size + 7;
  }

  line(project.title, 16, true);
  line(project.authors, 11);
  y -= 8;
  sectionOrder.forEach((key) => {
    line(titleCase(key), 12, true);
    wrap(project.sections[key], 92).forEach((chunk) => line(chunk, 10));
    y -= 6;
  });
  line("References", 12, true);
  wrap(project.bibtex.replace(/\s+/g, " "), 92).forEach((chunk) =>
    line(chunk, 9),
  );
  const bytes = await pdf.save();
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([arrayBuffer], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeLatex(value: string): string {
  return value
    .replaceAll("\\", "\\textbackslash{}")
    .replaceAll("_", "\\_")
    .replaceAll("&", "\\&")
    .replaceAll("%", "\\%");
}

function wrap(value: string, width: number): string[] {
  const words = value.split(/\s+/g);
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    if (`${current} ${word}`.trim().length > width) {
      lines.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  });
  if (current) lines.push(current);
  return lines;
}

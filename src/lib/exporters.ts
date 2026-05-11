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
  const bytes = await buildPdfDraftBytes(project);
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([arrayBuffer], { type: "application/pdf" });
}

export async function buildPdfDraftBytes(
  project: PaperProject,
): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 54;
  const marginY = 60;
  const usableWidth = pageWidth - marginX * 2;
  const textColor = rgb(0.09, 0.13, 0.11);

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - marginY;

  const newPage = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - marginY;
  };

  const drawParagraph = (text: string, size: number, strong = false) => {
    const activeFont = strong ? bold : font;
    const lineHeight = size + 4;
    const measure = (s: string) => activeFont.widthOfTextAtSize(s, size);
    for (const sourceLine of text.split(/\r?\n/)) {
      const wrapped =
        sourceLine.length === 0
          ? [""]
          : wrapTextToWidth(sourceLine, usableWidth, measure);
      for (const piece of wrapped) {
        if (y < marginY + size) newPage();
        if (piece.length > 0) {
          page.drawText(piece, {
            x: marginX,
            y,
            size,
            font: activeFont,
            color: textColor,
          });
        }
        y -= lineHeight;
      }
    }
  };

  drawParagraph(project.title, 16, true);
  if (project.subtitle && project.subtitle.trim().length > 0) {
    drawParagraph(project.subtitle, 12, false);
  }
  drawParagraph(project.authors, 11, false);
  if (project.orcid && project.orcid.trim().length > 0) {
    drawParagraph(`ORCID: ${project.orcid}`, 9, false);
  }
  y -= 8;

  sectionOrder.forEach((key) => {
    drawParagraph(titleCase(key), 12, true);
    drawParagraph(project.sections[key].trim(), 10, false);
    y -= 4;
  });

  drawParagraph("References", 12, true);
  // Preserve bibtex entry boundaries (each `@type{key, …}` block) instead of
  // collapsing whitespace, which used to mash every reference together.
  const bibEntries = splitBibtexEntries(project.bibtex);
  if (bibEntries.length === 0) {
    drawParagraph(project.bibtex.trim() || "No references provided.", 9, false);
  } else {
    bibEntries.forEach((entry) => {
      drawParagraph(entry, 9, false);
      y -= 2;
    });
  }

  return await pdf.save();
}

// Wraps a single source line to whatever fits inside `usableWidth`, measured
// with the caller's `measure` function (glyph-aware via pdf-lib in production,
// monospaced for tests). A single token longer than the page is hard-broken at
// the character boundary that still fits — necessary for long URLs and DOIs.
export function wrapTextToWidth(
  text: string,
  usableWidth: number,
  measure: (value: string) => number,
): string[] {
  if (text.length === 0) return [""];
  const words = text.split(/\s+/g).filter((word) => word.length > 0);
  if (words.length === 0) return [""];
  const out: string[] = [];
  let current = "";
  for (const word of words) {
    const tentative = current.length === 0 ? word : `${current} ${word}`;
    if (measure(tentative) <= usableWidth) {
      current = tentative;
      continue;
    }
    if (current.length === 0) {
      let chunk = "";
      for (const ch of word) {
        if (measure(chunk + ch) > usableWidth) {
          out.push(chunk);
          chunk = ch;
        } else {
          chunk += ch;
        }
      }
      current = chunk;
    } else {
      out.push(current);
      current = word;
    }
  }
  if (current.length > 0) out.push(current);
  return out;
}

function splitBibtexEntries(bibtex: string): string[] {
  // Split on `@` that starts an entry. We rejoin with the `@` prefix so each
  // entry's type marker survives. Whitespace inside an entry is normalized to
  // single spaces so the wrapper has room to break, but entry boundaries stay.
  const trimmed = bibtex.trim();
  if (trimmed.length === 0) return [];
  return trimmed
    .split(/(?=^@)/m)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((entry) => entry.replace(/\s+/g, " "));
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

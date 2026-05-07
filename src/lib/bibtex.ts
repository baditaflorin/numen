export type CitationEntry = {
  id: string;
  title: string;
  author: string;
  year: string;
};

export async function parseBibtex(input: string): Promise<CitationEntry[]> {
  if (!input.trim()) return [];
  try {
    await import("@citation-js/plugin-bibtex");
    const core = await import("@citation-js/core");
    const Cite = (core as any).Cite ?? (core as any).default;
    const cite = new Cite(input);
    const data = cite.format("data") as Array<Record<string, any>>;
    return data.map((entry) => ({
      id: String(entry.id ?? entry["citation-key"] ?? "citation"),
      title: String(entry.title ?? "Untitled"),
      author: Array.isArray(entry.author)
        ? entry.author
            .map((author) =>
              [author.given, author.family].filter(Boolean).join(" "),
            )
            .join(", ")
        : "Unknown",
      year: String(entry.issued?.["date-parts"]?.[0]?.[0] ?? ""),
    }));
  } catch {
    return fallbackParse(input);
  }
}

function fallbackParse(input: string): CitationEntry[] {
  return Array.from(input.matchAll(/@\w+\{([^,\n]+),([\s\S]*?)\n\}/g)).map(
    (match) => {
      const fields = match[2];
      return {
        id: match[1],
        title: field(fields, "title") || "Untitled",
        author: field(fields, "author") || "Unknown",
        year: field(fields, "year") || "",
      };
    },
  );
}

function field(input: string, name: string): string {
  const match = input.match(new RegExp(`${name}\\s*=\\s*[{"]([^}"]+)`, "i"));
  return match?.[1]?.trim() ?? "";
}

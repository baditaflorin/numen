declare module "@citation-js/core" {
  export const Cite: new (input: string) => {
    format: (format: string) => unknown;
  };
}

declare module "@citation-js/plugin-bibtex" {}

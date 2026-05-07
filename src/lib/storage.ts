import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "numen";
const PROJECT_STORE = "projects";
const DEFAULT_KEY = "active";

export type PaperSectionKey =
  | "abstract"
  | "introduction"
  | "methods"
  | "results"
  | "discussion"
  | "conclusion";

export type PaperProject = {
  title: string;
  subtitle: string;
  authors: string;
  orcid: string;
  targetVenue: string;
  keywords: string;
  sections: Record<PaperSectionKey, string>;
  bibtex: string;
  figureMermaid: string;
  updatedAt: string;
};

async function db(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(PROJECT_STORE))
        database.createObjectStore(PROJECT_STORE);
    },
  });
}

export async function loadProject(): Promise<PaperProject | undefined> {
  return (await db()).get(PROJECT_STORE, DEFAULT_KEY);
}

export async function saveProject(project: PaperProject): Promise<void> {
  await (await db()).put(PROJECT_STORE, project, DEFAULT_KEY);
}

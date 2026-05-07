import { z } from "zod";

export const AuthorSchema = z.object({
  name: z.string().min(1),
  orcid: z.string().optional(),
});

export const PaperRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  abstract: z.string().min(1),
  authors: AuthorSchema.array().min(1),
  year: z.number().int().min(1900).max(2100),
  venue: z.string().min(1),
  doi: z.string().optional(),
  arxivId: z.string().optional(),
  keywords: z.string().array(),
  ontologyTags: z.string().array(),
  references: z.string().array(),
  citations: z.string().array(),
  embedding: z.number().array(),
});

export const PaperMetaSchema = z.object({
  generatedAt: z.string(),
  sourceCommit: z.string(),
  inputChecksum: z.string(),
  schemaVersion: z.string(),
  artifactVersion: z.string(),
  recordCount: z.number().int().nonnegative(),
});

export type PaperRecord = z.infer<typeof PaperRecordSchema>;
export type PaperMeta = z.infer<typeof PaperMetaSchema>;

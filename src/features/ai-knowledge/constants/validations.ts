import { z } from "zod";

// Contract: file must be a PDF, max request size 50 MB (§3.7).
export const MAX_KNOWLEDGE_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export const uploadKnowledgeDocumentSchema = z.object({
  title: z.string().trim().min(1, "validations.titleRequired"),
  domainId: z
    .number({ message: "validations.domainRequired" })
    .min(1, "validations.domainRequired")
    .max(3, "validations.domainRequired"),
  file: z
    .instanceof(File, { message: "validations.fileRequired" })
    .refine((file) => file.size > 0, "validations.fileRequired")
    .refine(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf"),
      "validations.fileType",
    )
    .refine(
      (file) => file.size <= MAX_KNOWLEDGE_FILE_SIZE_BYTES,
      "validations.fileSize",
    ),
});

export type UploadKnowledgeDocumentFormValues = z.infer<
  typeof uploadKnowledgeDocumentSchema
>;
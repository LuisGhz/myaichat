import { z } from "zod";

const contentLength = 10_000;

export const promptSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Must be 30 characters or less"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(contentLength, `Must be ${contentLength} characters or less`),
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["User", "Assistant"]),
        content: z
          .string()
          .min(1, "Is required")
          .max(contentLength, `Must be ${contentLength} characters or less`),
      })
    )
    .optional(),
  params: z
    .array(
      z.object({
        id: z.string(),
        name: z
          .string()
          .min(1, "Is required")
          .max(15, "Must be 15 characters or less"),
        value: z
          .string()
          .min(1, "Is required")
          .max(100, "Must be 100 characters or less"),
      })
    )
    .optional()
    .refine(
      (params) => {
        if (!params) return true;
        const names = params.map((param) => param.name);
        return new Set(names).size === names.length;
      },
      { message: "Duplicate param names are not allowed" }
    ),
});

export type PromptForm = z.infer<typeof promptSchema>;

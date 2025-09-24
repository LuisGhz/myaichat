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
    .max(contentLength, `Content must be ${contentLength} characters or less`),
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["User", "Assistant"]),
        content: z
          .string()
          .min(1, "Message content is required")
          .max(
            contentLength,
            `Message content must be ${contentLength} characters or less`
          ),
      })
    )
    .optional(),
});

export type PromptForm = z.infer<typeof promptSchema>;

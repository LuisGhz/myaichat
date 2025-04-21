import { z } from "zod";

export const promptSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
  messages: z
    .array(
      z.object({
        id: z.string().optional(),
        role: z.enum(["User", "Assistant"]),
        content: z.string().min(1, "Is required"),
      })
    )
    .optional(),
  params: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Is required"),
        value: z.string().min(1, "Is required"),
      })
    )
    .optional(),
});

export type PromptForm = z.infer<typeof promptSchema>;
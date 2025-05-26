import { z } from "zod";

const contentLength = 10_000;

export const promptSchema = z
  .object({
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
      .optional(),
  })
  .refine(
    (form) => {
      // Check for duplicate parameter names
      if (form.params && form.params.length > 0) {
        const paramNames = form.params.map((param) => param.name);
        const uniqueNames = new Set(paramNames);
        return uniqueNames.size === paramNames.length;
      }
      return true;
    },
    {
      path: ["params"],
      message: "Params names must be unique",
    }
  )
  .refine(
    (form) => {
      // Check if all params are included in content
      if (form.params && form.params.length > 0) {
        const params = form.params
          .filter((param) => param.name.trim() !== "")
          .map((param) => param.name);
        const content = form.content;
        const isValid = params.every((param) => content.includes(`{${param}}`));
        return isValid;
      }
      return true; // Always return true when there are no params
    },
    {
      path: ["params"],
      message: "All parameters must be included in the content",
    }
  );

export type PromptForm = z.infer<typeof promptSchema>;

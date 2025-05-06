import { ModelsValues } from "types/chat/ModelsValues.type";

type ModelPrice = {
  input: number;
  output: number;
}

type ModelMetadata = {
  contextWindow: number;
  maxOutputTokens: number;
  knowledgeCutoff: string;
}

type Models = {
  name: string;
  value: ModelsValues;
  link: string;
  price: ModelPrice;
  metadata: ModelMetadata;
};

export const MODELS: Models[] = [
  {
    name: "GPT 4o",
    value: "gpt-4o",
    link: "https://platform.openai.com/docs/models/gpt-4o",
    price: {
      input: 2.5,
      output: 10,
    },
    metadata: {
      contextWindow: 128_000,
      maxOutputTokens: 16384,
      knowledgeCutoff: "Sep 2023",
    },
  },
  {
    value: "gpt-4o-mini",
    name: "GPT 4o Mini",
    link: "https://platform.openai.com/docs/models/gpt-4o-mini",
    price: {
      input: 0.15,
      output: 0.6,
    },
    metadata: {
      contextWindow: 128_000,
      maxOutputTokens: 16384,
      knowledgeCutoff: "Sep 2023",
    },
  },
  {
    name: "Gemini 2.0 Flash Lite",
    value: "gemini-2.0-flash-lite",
    link: "https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash-lite?hl=es-419",
    price: {
      input: 0.075,
      output: 0.3,
    },
    metadata: {
      contextWindow: 1_000_000,
      maxOutputTokens: 0,
      knowledgeCutoff: "Jun 2024",
    },
  },
  {
    name: "Gemini 2.0 Flash",
    value: "gemini-2.0-flash",
    link: "https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash?hl=es-419",
    price: {
      input: 0.1,
      output: 0.4,
    },
    metadata: {
      contextWindow: 1_000_000,
      maxOutputTokens: 0,
      knowledgeCutoff: "Jun 2024",
    },
  },
  {
    name: "Gemini 2.5 Flash Preview 04 17",
    value: "gemini-2.5-flash-preview-04-17",
    link: "https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash?hl=es-419",
    price: {
      input: 0.15,
      output: 0.6,
    },
    metadata: {
      contextWindow: 128_000,
      maxOutputTokens: 16384,
      knowledgeCutoff: "Jan 2025",
    },
  },
  {
    name: "Gemini 2.5 Pro preview 03 25",
    value: "gemini-2.5-pro-preview-03-25",
    link: "https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro?hl=es-419",
    price: {
      input: 1.25,
      output: 10,
    },
    metadata: {
      contextWindow: 1_000_000,
      maxOutputTokens: 0,
      knowledgeCutoff: "Jan 2025",
    },
  },
] as const;

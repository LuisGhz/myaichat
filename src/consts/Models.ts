import { ModelsValues } from "types/chat/ModelsValues.type";

type ModelPrice = {
  input: number;
  output: number;
};

type ModelMetadata = {
  contextWindow: number;
  maxOutputTokens: number;
  knowledgeCutoff: string;
};

type DevelopBy = {
  name: string;
  link: string;
  imageUrl: string;
};

export type ModelInfo = {
  name: string;
  shortName: string;
  value: ModelsValues;
  developBy: DevelopBy;
  link: string;
  price: ModelPrice;
  metadata: ModelMetadata;
};

export const MODELS: ModelInfo[] = [
  {
    name: "GPT 4o",
    shortName: "4o",
    value: "gpt-4o",
    developBy: {
      name: "OpenAI",
      link: "https://openai.com",
      imageUrl: "https://openai.com/favicon.ico",
    },
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
    shortName: "4om",
    name: "GPT 4o Mini",
    developBy: {
      name: "OpenAI",
      link: "https://openai.com",
      imageUrl: "https://openai.com/favicon.ico",
    },
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
    shortName: "2.0FL",
    value: "gemini-2.0-flash-lite",
    developBy: {
      name: "Google",
      link: "https://gemini.google.com/",
      imageUrl: "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png",
    },
    link: "https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash-lite?hl=es-419",
    price: {
      input: 0.075,
      output: 0.3,
    },
    metadata: {
      contextWindow: 1_048_576,
      maxOutputTokens: 8_192,
      knowledgeCutoff: "Jun 2024",
    },
  },
  {
    name: "Gemini 2.0 Flash",
    shortName: "2.0F",
    value: "gemini-2.0-flash",
    developBy: {
      name: "Google",
      link: "https://gemini.google.com/",
      imageUrl: "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png",
    },
    link: "https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash?hl=es-419",
    price: {
      input: 0.1,
      output: 0.4,
    },
    metadata: {
      contextWindow: 1_048_576,
      maxOutputTokens: 8_192,
      knowledgeCutoff: "Jun 2024",
    },
  },
  {
    name: "Gemini 2.5 Flash Preview 04 17",
    shortName: "2.5FP",
    value: "gemini-2.5-flash-preview-04-17",
    developBy: {
      name: "Google",
      link: "https://gemini.google.com/",
      imageUrl: "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png",
    },
    link: "https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash?hl=es-419",
    price: {
      input: 0.15,
      output: 0.6,
    },
    metadata: {
      contextWindow: 1_048_576,
      maxOutputTokens: 65_536,
      knowledgeCutoff: "Jan 2025",
    },
  },
  {
    name: "Gemini 2.5 Pro Preview 03 25",
    shortName: "2.5PP",
    value: "gemini-2.5-pro-preview-03-25",
    developBy: {
      name: "Google",
      link: "https://gemini.google.com/",
      imageUrl: "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png",
    },
    link: "https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro?hl=es-419",
    price: {
      input: 1.25,
      output: 10,
    },
    metadata: {
      contextWindow: 1_048_576,
      maxOutputTokens: 65_536,
      knowledgeCutoff: "Jan 2025",
    },
  },
] as const;

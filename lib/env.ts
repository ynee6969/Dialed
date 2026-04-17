import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default("claude-3-7-sonnet-latest"),
  OLLAMA_BASE_URL: z.string().default("http://localhost:11434"),
  OLLAMA_MODEL: z.string().default("llama3.1"),
  FIRECRAWL_API_KEY: z.string().optional(),
  FIRECRAWL_BASE_URL: z.string().default("https://api.firecrawl.dev/v1"),
  APP_URL: z.string().default("http://localhost:3000"),
  BOOTSTRAP_ON_STARTUP: z.string().default("false"),
  ENRICHMENT_STALENESS_DAYS: z.coerce.number().default(30),
  MAX_ENRICHMENT_BATCH: z.coerce.number().default(5)
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  OLLAMA_MODEL: process.env.OLLAMA_MODEL,
  FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
  FIRECRAWL_BASE_URL: process.env.FIRECRAWL_BASE_URL,
  APP_URL: process.env.APP_URL,
  BOOTSTRAP_ON_STARTUP:
    process.env.BOOTSTRAP_ON_STARTUP ?? (process.env.DATABASE_URL ? "true" : "false"),
  ENRICHMENT_STALENESS_DAYS: process.env.ENRICHMENT_STALENESS_DAYS,
  MAX_ENRICHMENT_BATCH: process.env.MAX_ENRICHMENT_BATCH
});

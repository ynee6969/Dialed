import type { ExtractionContext, ExtractionResult } from "@/lib/ai/types";
import { AnthropicExtractionProvider } from "@/lib/ai/providers/anthropic";
import { extractionPrompt } from "@/lib/ai/providers/base";
import { OllamaExtractionProvider } from "@/lib/ai/providers/ollama";
import { OpenAIExtractionProvider } from "@/lib/ai/providers/openai";

const providers = [
  new OpenAIExtractionProvider(),
  new AnthropicExtractionProvider(),
  new OllamaExtractionProvider()
];

export function getConfiguredProviders() {
  return providers.filter((provider) => provider.isConfigured());
}

export async function extractWithBestProvider(context: Omit<ExtractionContext, "prompt">) {
  const activeProviders = getConfiguredProviders();

  if (activeProviders.length === 0) {
    return null;
  }

  let lastError: unknown;

  for (const provider of activeProviders) {
    try {
      const result: ExtractionResult = await provider.extractPhoneSpecs({
        ...context,
        prompt: extractionPrompt
      });
      return result;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("No extraction provider succeeded.");
}

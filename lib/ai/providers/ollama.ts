import { env } from "@/lib/env";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";

import type { ExtractionContext, ExtractionProvider, ExtractionResult } from "@/lib/ai/types";

export class OllamaExtractionProvider implements ExtractionProvider {
  name = "ollama";

  isConfigured() {
    return Boolean(process.env.OLLAMA_BASE_URL && process.env.OLLAMA_MODEL);
  }

  async extractPhoneSpecs(context: ExtractionContext): Promise<ExtractionResult> {
    const phoneLabel = getPhoneDisplayName(context.phone.brand, context.phone.model);

    const response = await fetch(`${env.OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.OLLAMA_MODEL,
        stream: false,
        prompt: `${context.prompt}\n\nPhone: ${phoneLabel}\nSource: ${context.document.kind}\nURL: ${context.document.url}\n\n${context.document.markdown}`
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama extraction failed: ${response.status} ${text}`);
    }

    const data = (await response.json()) as { response?: string };
    if (!data.response) {
      throw new Error("Ollama extraction returned no response.");
    }

    return {
      provider: this.name,
      payload: JSON.parse(data.response)
    };
  }
}

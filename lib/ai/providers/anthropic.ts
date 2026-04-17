import { env } from "@/lib/env";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";

import type { ExtractionContext, ExtractionProvider, ExtractionResult } from "@/lib/ai/types";

export class AnthropicExtractionProvider implements ExtractionProvider {
  name = "anthropic";

  isConfigured() {
    return Boolean(env.ANTHROPIC_API_KEY);
  }

  async extractPhoneSpecs(context: ExtractionContext): Promise<ExtractionResult> {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured.");
    }

    const phoneLabel = getPhoneDisplayName(context.phone.brand, context.phone.model);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: env.ANTHROPIC_MODEL,
        max_tokens: 1200,
        temperature: 0.1,
        system: context.prompt,
        messages: [
          {
            role: "user",
            content: `Phone: ${phoneLabel}\nSource: ${context.document.kind}\nURL: ${context.document.url}\n\n${context.document.markdown}`
          }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Anthropic extraction failed: ${response.status} ${text}`);
    }

    const data = (await response.json()) as {
      content?: Array<{ text?: string }>;
    };
    const content = data.content?.[0]?.text;

    if (!content) {
      throw new Error("Anthropic extraction returned no content.");
    }

    return {
      provider: this.name,
      payload: JSON.parse(content)
    };
  }
}

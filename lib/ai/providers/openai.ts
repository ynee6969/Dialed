import { env } from "@/lib/env";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";

import type { ExtractionContext, ExtractionProvider, ExtractionResult } from "@/lib/ai/types";

export class OpenAIExtractionProvider implements ExtractionProvider {
  name = "openai";

  isConfigured() {
    return Boolean(env.OPENAI_API_KEY);
  }

  async extractPhoneSpecs(context: ExtractionContext): Promise<ExtractionResult> {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const phoneLabel = getPhoneDisplayName(context.phone.brand, context.phone.model);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: context.prompt
          },
          {
            role: "user",
            content: `Phone: ${phoneLabel}\nSource: ${context.document.kind}\nURL: ${context.document.url}\n\n${context.document.markdown}`
          }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI extraction failed: ${response.status} ${text}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI extraction returned no content.");
    }

    return {
      provider: this.name,
      payload: JSON.parse(content)
    };
  }
}

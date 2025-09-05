export type ProviderMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
export type ProviderStream = AsyncIterable<string>;

/** OpenAI streaming provider using Chat Completions SSE */
export class OpenAIProvider {
  constructor(
    private apiKey?: string,
    private model: string = "gpt-5",
    private baseUrl: string = "https://api.openai.com"
  ) {}

  async stream(messages: ProviderMessage[]): Promise<ProviderStream> {
    if (!this.apiKey) throw new Error("OpenAI API key missing");

    const body = {
      model: this.model,
      stream: true,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    } as any;

    const url = `${this.baseUrl.replace(/\/$/, "")}/v1/chat/completions`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenAI HTTP ${res.status}: ${res.statusText} ${text}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    async function* sse(): AsyncGenerator<string> {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") return;
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) yield delta as string;
            } catch {}
          }
        }
      } finally {
        reader.releaseLock();
      }
    }
    return sse();
  }
}

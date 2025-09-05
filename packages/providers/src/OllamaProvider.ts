import type { ProviderMessage, ProviderStream } from './OpenAIProvider';

/** Ollama streaming provider using local HTTP API */
export class OllamaProvider {
  constructor(private baseUrl: string = 'http://localhost:11434', private model: string = 'llama3') {}

  async stream(messages: ProviderMessage[]): Promise<ProviderStream> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/api/chat`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        stream: true,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      })
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new Error(`Ollama HTTP ${res.status}: ${res.statusText} ${text}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    async function* ndjson(): AsyncGenerator<string> {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split(/\r?\n/);
          buffer = parts.pop() || '';
          for (const part of parts) {
            if (!part.trim()) continue;
            try {
              const json = JSON.parse(part);
              const chunk = json.message?.content || '';
              if (chunk) yield chunk as string;
            } catch {}
          }
        }
      } finally {
        reader.releaseLock();
      }
    }
    return ndjson();
  }
}


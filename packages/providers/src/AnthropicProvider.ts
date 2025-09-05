import type { ProviderMessage, ProviderStream } from './OpenAIProvider';

/** Anthropic streaming provider using Messages SSE */
export class AnthropicProvider {
  constructor(private apiKey?: string, private model: string = 'claude-3-sonnet-20240229', private baseUrl: string = 'https://api.anthropic.com') {}

  async stream(messages: ProviderMessage[]): Promise<ProviderStream> {
    if (!this.apiKey) throw new Error('Anthropic API key missing');

    // Anthropic expects messages: {role, content:[{type:'text', text}]}
    const mapped = messages.map(m => ({ role: m.role, content: [{ type: 'text', text: m.content }] }));

    const url = `${this.baseUrl.replace(/\/$/, '')}/v1/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        stream: true,
        messages: mapped,
      })
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new Error(`Anthropic HTTP ${res.status}: ${res.statusText} ${text}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    async function* sse(): AsyncGenerator<string> {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (!line.startsWith('data:') && !line.startsWith('event:')) continue;
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim();
              if (!data || data === '[DONE]') continue;
              try {
                const json = JSON.parse(data);
                const delta = json.delta?.text || json.content?.[0]?.text;
                if (delta) yield delta as string;
              } catch {}
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    }
    return sse();
  }
}


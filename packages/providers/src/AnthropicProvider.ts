import type { ProviderMessage, ProviderStream } from './OpenAIProvider';
import { ProviderClient } from '@tui-kit-ai/ai';

/** Anthropic streaming provider using Messages SSE with retry and timeout */
export class AnthropicProvider implements ProviderClient {
  name = 'anthropic' as const;
  private timeout: number;
  private maxRetries: number;

  constructor(
    private apiKey?: string, 
    private model: string = 'claude-3-sonnet-20240229', 
    private baseUrl: string = 'https://api.anthropic.com'
  ) {
    this.timeout = parseInt(process.env.TUI_AI_TIMEOUT_MS || '30000');
    this.maxRetries = parseInt(process.env.TUI_AI_MAX_RETRIES || '2');
  }

  // Unified interface implementation
  async complete(opts: {
    model: string;
    messages: ProviderMessage[];
    stream?: boolean;
    abortSignal?: AbortSignal;
  }): Promise<AsyncIterable<string> | { text: string }> {
    if (opts.stream) {
      return this.stream(opts.messages, opts.abortSignal);
    } else {
      const stream = await this.stream(opts.messages, opts.abortSignal);
      let text = '';
      for await (const chunk of stream) {
        text += chunk;
      }
      return { text };
    }
  }

  async stream(messages: ProviderMessage[], abortSignal?: AbortSignal): Promise<ProviderStream> {
    if (!this.apiKey) throw new Error('Anthropic API key missing');

    // Anthropic expects messages: {role, content:[{type:'text', text}]}
    const mapped = messages.map(m => ({ role: m.role, content: [{ type: 'text', text: m.content }] }));

    const url = `${this.baseUrl.replace(/\/$/, '')}/v1/messages`;

    // Retry with exponential backoff and jitter
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        // Combine abort signals
        if (abortSignal) {
          abortSignal.addEventListener('abort', () => controller.abort());
        }

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
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok || !res.body) {
          const text = await res.text().catch(() => '');
          const error = new Error(`Anthropic HTTP ${res.status}: ${res.statusText} ${text}`);
          
          // Retry on transient errors (429, 5xx)
          if ((res.status === 429 || res.status >= 500) && attempt < this.maxRetries) {
            const delay = this.calculateRetryDelay(attempt);
            await this.sleep(delay);
            continue;
          }
          
          throw error;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        async function* sse(): AsyncGenerator<string> {
          let buffer = '';
          try {
            while (true) {
              if (controller.signal.aborted) break;
              
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

      } catch (error) {
        if (attempt === this.maxRetries || (error as any).name === 'AbortError') {
          throw error;
        }
        
        // Wait before retry with exponential backoff + jitter
        const delay = this.calculateRetryDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw new Error('Max retries exceeded');
  }

  private calculateRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s (capped at 8s)
    const baseDelay = Math.min(1000 * Math.pow(2, attempt), 8000);
    // Add jitter: ±25% random variation
    const jitter = baseDelay * 0.25 * (Math.random() - 0.5);
    return Math.max(100, baseDelay + jitter);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


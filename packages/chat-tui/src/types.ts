export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatProviderLike {
  stream(messages: { role: ChatRole; content: string }[]): Promise<AsyncIterable<string>>;
}


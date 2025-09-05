import blessed, { Widgets } from 'blessed';
import { AIService, Message } from '../streaming/AIService';
import { KEY, safeRender } from '@tui-kit-ai/core';

export type ChatContainerProps = {
  parent: Widgets.Node;
  messages: Message[];
  ai?: AIService;
  systemPrompt?: string;
  onMessageSubmit?: (content: string) => Promise<void> | void;
  onError?: (error: Error) => void;
};

export class ChatContainer {
  root: Widgets.BoxElement;
  history: Widgets.BoxElement;
  input: Widgets.TextboxElement;
  statusBar: Widgets.BoxElement;
  private currentStream: { abort: () => void } | null = null;
  private messages: Message[] = [];

  constructor(props: ChatContainerProps) {
    this.messages = [...props.messages];
    
    this.root = blessed.box({ 
      parent: props.parent, 
      keys: true, 
      mouse: true, 
      border: { type: 'line' }, 
      label: ' Chat ' 
    });
    
    this.history = blessed.box({ 
      parent: this.root, 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 4, 
      scrollable: true, 
      alwaysScroll: true, 
      tags: true 
    });
    
    this.statusBar = blessed.box({
      parent: this.root,
      bottom: 3,
      left: 0,
      right: 0,
      height: 1,
      content: '⌨︎ Enter: send • Esc: clear • Ctrl+C: abort',
      style: { fg: 'gray' }
    });
    
    this.input = blessed.textbox({ 
      parent: this.root, 
      bottom: 0, 
      left: 0, 
      right: 0, 
      height: 3, 
      inputOnFocus: true, 
      border: { type: 'line' }, 
      label: ' Message ' 
    });

    this.renderMessages();

    // Enhanced key handling with abort support
    this.root.key([KEY.enter], async () => {
      const content = this.input.getValue();
      if (!content) return;
      
      this.input.clearValue();
      this.addMessage({ role: 'user', content });
      
      if (props.onMessageSubmit) {
        await props.onMessageSubmit(content);
      } else if (props.ai) {
        await this.handleAIResponse(props.ai, props.systemPrompt, props.onError);
      }
    });

    // Abort current stream with Ctrl+C
    this.root.key([KEY.ctrlC], () => {
      if (this.currentStream) {
        this.currentStream.abort();
        this.currentStream = null;
        this.statusBar.setContent('⏹️  aborted');
        safeRender(this.root.screen);
      }
    });
  }

  private addMessage(message: Message) {
    this.messages.push(message);
    this.renderMessages();
  }

  private async handleAIResponse(ai: AIService, systemPrompt?: string, onError?: (error: Error) => void) {
    try {
      this.statusBar.setContent('🤖 Streaming...');
      safeRender(this.root.screen);

      const messages: Message[] = systemPrompt 
        ? [{ role: 'system', content: systemPrompt }, ...this.messages]
        : this.messages;

      const result = await ai.streamCompletion(messages);
      this.currentStream = result;

      let assistantContent = '';
      let chunkBuffer = '';
      this.addMessage({ role: 'assistant', content: '' });

      for await (const chunk of result.textStream) {
        chunkBuffer += chunk;
        
        // Check for stop sequences
        const stopSequences = ['</tool>', '</function>', '<|end|>', '<|stop|>'];
        const shouldStop = stopSequences.some(seq => chunkBuffer.includes(seq));
        
        if (shouldStop) {
          // Trim content at stop sequence
          const stopIndex = Math.min(...stopSequences.map(seq => {
            const idx = chunkBuffer.indexOf(seq);
            return idx === -1 ? Infinity : idx;
          }));
          chunkBuffer = chunkBuffer.substring(0, stopIndex);
          assistantContent += chunkBuffer;
          this.messages[this.messages.length - 1].content = assistantContent;
          this.renderMessages();
          break; // Stop streaming
        }
        
        // Coalesce small chunks (< 10 chars) to reduce render frequency
        if (chunkBuffer.length >= 10 || chunk.includes('\n') || chunk.includes(' ')) {
          assistantContent += chunkBuffer;
          this.messages[this.messages.length - 1].content = assistantContent;
          this.renderMessages();
          chunkBuffer = '';
        }
      }
      
      // Flush remaining buffer
      if (chunkBuffer) {
        assistantContent += chunkBuffer;
        this.messages[this.messages.length - 1].content = assistantContent;
        this.renderMessages();
      }

      this.currentStream = null;
      this.statusBar.setContent('✅ Complete');
      safeRender(this.root.screen);

    } catch (error) {
      this.currentStream = null;
      this.statusBar.setContent('❌ Error');
      safeRender(this.root.screen);
      
      if (onError) {
        onError(error as Error);
      } else {
        console.error('Chat error:', error);
      }
    }
  }

  renderMessages() {
    const formatted = this.messages
      .map((m) => (m.role === 'user' ? `{bold}You:{/bold} ` + m.content : `{green-fg}AI:{/green-fg} ` + m.content))
      .join('\n');
    this.history.setContent(formatted);
    this.history.setScrollPerc(100);
    safeRender(this.root.screen);
  }

  // Public methods
  addUserMessage(content: string) {
    this.addMessage({ role: 'user', content });
  }

  addAssistantMessage(content: string) {
    this.addMessage({ role: 'assistant', content });
  }

  clearMessages() {
    this.messages = [];
    this.renderMessages();
  }

  destroy() {
    if (this.currentStream) {
      this.currentStream.abort();
    }
    this.root.destroy();
  }
}



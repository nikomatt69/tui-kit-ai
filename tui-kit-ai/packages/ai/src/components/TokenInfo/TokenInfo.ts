import blessed from 'blessed';
import { TokenInfoProps, TokenInfoEvents, TokenInfoMethods } from './TokenInfo.types';

export class TokenInfo implements TokenInfoMethods {
  private screen: blessed.Widgets.Screen;
  private container: blessed.Widgets.BoxElement;
  private header: blessed.Widgets.BoxElement;
  private stats: blessed.Widgets.BoxElement;
  private breakdown: blessed.Widgets.BoxElement | null = null;
  private cost: blessed.Widgets.BoxElement | null = null;
  private footer: blessed.Widgets.BoxElement;
  
  private props: TokenInfoProps;
  private events: TokenInfoEvents;
  private tokens: TokenInfoProps['tokens'];
  private cost: TokenInfoProps['cost'];
  private modelInfo: TokenInfoProps['modelInfo'];

  constructor(props: Partial<TokenInfoProps> = {}) {
    this.props = {
      model: 'gpt-4',
      showCost: true,
      showBreakdown: true,
      showProgress: true,
      width: 80,
      height: 20,
      theme: {
        primary: '#00ff00',
        secondary: '#0088ff',
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0000',
        background: '#000000',
        foreground: '#ffffff',
        border: '#333333'
      },
      tokens: {
        input: 0,
        output: 0,
        total: 0,
        prompt: 0,
        completion: 0,
        system: 0,
        user: 0,
        assistant: 0
      },
      cost: {
        input: 0,
        output: 0,
        total: 0
      },
      modelInfo: {
        name: 'GPT-4',
        provider: 'OpenAI',
        context: 8192,
        pricing: { input: 0.03, output: 0.06 },
        capabilities: ['text-generation', 'function-calling', 'multimodal']
      },
      ...props
    };

    this.events = {
      tokenUpdate: props.onTokenUpdate || (() => {}),
      costUpdate: props.onCostUpdate || (() => {}),
      modelChange: props.onModelChange || (() => {})
    };

    this.tokens = { ...this.props.tokens };
    this.cost = { ...this.props.cost };
    this.modelInfo = { ...this.props.modelInfo };

    this.initialize();
  }

  private initialize(): void {
    this.createScreen();
    this.createContainer();
    this.createHeader();
    this.createStats();
    this.createBreakdown();
    this.createCost();
    this.createFooter();
    this.setupEventHandlers();
  }

  private createScreen(): void {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'TokenInfo Component',
      fullUnicode: true
    });
  }

  private createContainer(): void {
    this.container = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        }
      }
    });
  }

  private createHeader(): void {
    this.header = blessed.box({
      parent: this.container,
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      content: `{green-fg}${this.modelInfo.name}{white-fg} - ${this.modelInfo.provider} | Context: ${this.modelInfo.context.toLocaleString()} tokens`,
      tags: true,
      style: {
        bg: 'blue',
        fg: 'white'
      }
    });
  }

  private createStats(): void {
    this.stats = blessed.box({
      parent: this.container,
      top: 3,
      left: 0,
      width: '100%',
      height: 6,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        }
      }
    });
  }

  private createBreakdown(): void {
    if (!this.props.showBreakdown) return;
    
    this.breakdown = blessed.box({
      parent: this.container,
      top: 9,
      left: 0,
      width: '50%',
      height: 8,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        }
      }
    });
  }

  private createCost(): void {
    if (!this.props.showCost) return;
    
    this.cost = blessed.box({
      parent: this.container,
      top: 9,
      left: '50%',
      width: '50%',
      height: 8,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: this.getThemeColor('border')
        }
      }
    });
  }

  private createFooter(): void {
    this.footer = blessed.box({
      parent: this.container,
      bottom: 0,
      left: 0,
      width: '100%',
      height: 1,
      content: 'Press q to quit, r to reset, + to add tokens, - to subtract tokens',
      style: {
        bg: 'black',
        fg: 'white'
      }
    });
  }

  private setupEventHandlers(): void {
    this.screen.key(['q', 'C-c'], () => {
      process.exit(0);
    });
    
    this.screen.key(['r'], () => {
      this.reset();
    });
    
    this.screen.key(['+'], () => {
      this.addMockTokens();
    });
    
    this.screen.key(['-'], () => {
      this.subtractTokens();
    });
  }

  private getThemeColor(color: keyof TokenInfoProps['theme']): string {
    const colorMap = {
      primary: 'green',
      secondary: 'blue',
      success: 'green',
      warning: 'yellow',
      error: 'red',
      background: 'black',
      foreground: 'white',
      border: 'white'
    };
    return colorMap[color] || 'white';
  }

  private updateStats(): void {
    const statsContent = `
{green-fg}Total Tokens: {white-fg}${this.tokens.total.toLocaleString()}
{blue-fg}Input Tokens: {white-fg}${this.tokens.input.toLocaleString()}
{yellow-fg}Output Tokens: {white-fg}${this.tokens.output.toLocaleString()}
{cyan-fg}Prompt Tokens: {white-fg}${this.tokens.prompt.toLocaleString()}
{magenta-fg}Completion Tokens: {white-fg}${this.tokens.completion.toLocaleString()}
    `.trim();
    
    this.stats.setContent(statsContent);
  }

  private updateBreakdown(): void {
    if (!this.breakdown) return;
    
    const breakdownContent = `
{green-fg}Token Breakdown:
{white-fg}System: ${this.tokens.system.toLocaleString()}
{white-fg}User: ${this.tokens.user.toLocaleString()}
{white-fg}Assistant: ${this.tokens.assistant.toLocaleString()}
{white-fg}Prompt: ${this.tokens.prompt.toLocaleString()}
{white-fg}Completion: ${this.tokens.completion.toLocaleString()}
    `.trim();
    
    this.breakdown.setContent(breakdownContent);
  }

  private updateCost(): void {
    if (!this.cost) return;
    
    const costContent = `
{green-fg}Cost Breakdown:
{white-fg}Input Cost: $${this.cost.input.toFixed(4)}
{white-fg}Output Cost: $${this.cost.output.toFixed(4)}
{green-fg}Total Cost: $${this.cost.total.toFixed(4)}

{yellow-fg}Pricing:
{white-fg}Input: $${this.modelInfo.pricing.input}/1K tokens
{white-fg}Output: $${this.modelInfo.pricing.output}/1K tokens
    `.trim();
    
    this.cost.setContent(costContent);
  }

  private updateCosts(): void {
    this.cost.input = (this.tokens.input / 1000) * this.modelInfo.pricing.input;
    this.cost.output = (this.tokens.output / 1000) * this.modelInfo.pricing.output;
    this.cost.total = this.cost.input + this.cost.output;
  }

  private updateTotals(): void {
    this.tokens.total = this.tokens.input + this.tokens.output;
    this.tokens.prompt = this.tokens.system + this.tokens.user;
    this.tokens.completion = this.tokens.assistant;
  }

  private addMockTokens(): void {
    const randomTokens = {
      input: Math.floor(Math.random() * 100) + 50,
      output: Math.floor(Math.random() * 50) + 25,
      system: Math.floor(Math.random() * 20) + 10,
      user: Math.floor(Math.random() * 80) + 40,
      assistant: Math.floor(Math.random() * 50) + 25
    };
    
    this.addTokens(randomTokens);
  }

  private subtractTokens(): void {
    const subtractAmount = {
      input: Math.min(50, this.tokens.input),
      output: Math.min(25, this.tokens.output),
      system: Math.min(10, this.tokens.system),
      user: Math.min(40, this.tokens.user),
      assistant: Math.min(25, this.tokens.assistant)
    };
    
    this.tokens.input = Math.max(0, this.tokens.input - subtractAmount.input);
    this.tokens.output = Math.max(0, this.tokens.output - subtractAmount.output);
    this.tokens.system = Math.max(0, this.tokens.system - subtractAmount.system);
    this.tokens.user = Math.max(0, this.tokens.user - subtractAmount.user);
    this.tokens.assistant = Math.max(0, this.tokens.assistant - subtractAmount.assistant);
    
    this.updateTotals();
    this.updateCosts();
    this.updateStats();
    this.updateBreakdown();
    this.updateCost();
    this.events.tokenUpdate(this.tokens);
    this.events.costUpdate(this.cost);
  }

  // Public Methods
  public addTokens(tokens: Partial<TokenInfoProps['tokens']>): void {
    Object.keys(tokens).forEach(key => {
      if (this.tokens.hasOwnProperty(key)) {
        this.tokens[key] += tokens[key];
      }
    });
    
    this.updateTotals();
    this.updateCosts();
    this.updateStats();
    this.updateBreakdown();
    this.updateCost();
    this.events.tokenUpdate(this.tokens);
    this.events.costUpdate(this.cost);
  }

  public setModel(model: string): void {
    this.props.model = model;
    this.modelInfo = this.getModelInfo(model);
    this.updateCosts();
    this.updateStats();
    this.updateBreakdown();
    this.updateCost();
    this.updateHeader();
    this.events.modelChange(model);
  }

  private getModelInfo(model: string): TokenInfoProps['modelInfo'] {
    const models = {
      'gpt-4': {
        name: 'GPT-4',
        provider: 'OpenAI',
        context: 8192,
        pricing: { input: 0.03, output: 0.06 },
        capabilities: ['text-generation', 'function-calling', 'multimodal']
      },
      'gpt-3.5-turbo': {
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        context: 4096,
        pricing: { input: 0.001, output: 0.002 },
        capabilities: ['text-generation', 'function-calling']
      },
      'claude-3-opus': {
        name: 'Claude-3 Opus',
        provider: 'Anthropic',
        context: 200000,
        pricing: { input: 0.015, output: 0.075 },
        capabilities: ['text-generation', 'multimodal', 'tool-use']
      },
      'claude-3-sonnet': {
        name: 'Claude-3 Sonnet',
        provider: 'Anthropic',
        context: 200000,
        pricing: { input: 0.003, output: 0.015 },
        capabilities: ['text-generation', 'multimodal', 'tool-use']
      },
      'claude-3-haiku': {
        name: 'Claude-3 Haiku',
        provider: 'Anthropic',
        context: 200000,
        pricing: { input: 0.00025, output: 0.00125 },
        capabilities: ['text-generation', 'multimodal', 'tool-use']
      },
      'gemini-pro': {
        name: 'Gemini Pro',
        provider: 'Google',
        context: 32768,
        pricing: { input: 0.0005, output: 0.0015 },
        capabilities: ['text-generation', 'multimodal']
      },
      'llama-2-70b': {
        name: 'LLaMA-2 70B',
        provider: 'Meta',
        context: 4096,
        pricing: { input: 0.0007, output: 0.0009 },
        capabilities: ['text-generation']
      },
      'llama-2-13b': {
        name: 'LLaMA-2 13B',
        provider: 'Meta',
        context: 4096,
        pricing: { input: 0.0002, output: 0.0002 },
        capabilities: ['text-generation']
      }
    };
    
    return models[model] || models['gpt-4'];
  }

  private updateHeader(): void {
    this.header.setContent(
      `{green-fg}${this.modelInfo.name}{white-fg} - ${this.modelInfo.provider} | Context: ${this.modelInfo.context.toLocaleString()} tokens`
    );
  }

  public reset(): void {
    this.tokens = {
      input: 0,
      output: 0,
      total: 0,
      prompt: 0,
      completion: 0,
      system: 0,
      user: 0,
      assistant: 0
    };
    this.cost = {
      input: 0,
      output: 0,
      total: 0
    };
    this.updateStats();
    this.updateBreakdown();
    this.updateCost();
    this.events.tokenUpdate(this.tokens);
    this.events.costUpdate(this.cost);
  }

  public getStats(): { tokens: TokenInfoProps['tokens']; cost: TokenInfoProps['cost']; model: TokenInfoProps['modelInfo'] } {
    return {
      tokens: { ...this.tokens },
      cost: { ...this.cost },
      model: { ...this.modelInfo }
    };
  }

  public updateProps(newProps: Partial<TokenInfoProps>): void {
    this.props = { ...this.props, ...newProps };
    this.updateStats();
    this.updateBreakdown();
    this.updateCost();
  }

  public render(): void {
    this.screen.render();
  }

  public destroy(): void {
    // Cleanup if needed
  }
}
# TUI-Kit AI Components 🚀

Una suite completa di componenti AI per terminali, progettata per integrare perfettamente con il framework tui-kit. Questi componenti forniscono interfacce potenti e intuitive per lavorare con l'intelligenza artificiale direttamente nel terminale.

## 🎯 Caratteristiche Principali

- **7 Componenti AI Specializzati**: Stream, CodeBlock, TokenInfo, ModelSelector, WebSearchTool, PDFTool, ImageAI
- **Architettura Modulare**: Ogni componente è completamente indipendente e riutilizzabile
- **TypeScript First**: Tipizzazione completa con validazione Zod
- **Temi Personalizzabili**: Supporto per temi dark/light e colori personalizzati
- **Responsive Design**: Adattamento automatico alle dimensioni del terminale
- **Accessibilità**: Supporto completo per navigazione da tastiera e screen reader
- **Performance Ottimizzate**: Gestione efficiente di grandi quantità di dati

## 📦 Installazione

```bash
npm install @tui-kit-ai/ai
```

## 🚀 Quick Start

```typescript
import { 
  Stream, 
  CodeBlock, 
  TokenInfo, 
  ModelSelector,
  WebSearchTool, 
  PDFTool, 
  ImageAI 
} from '@tui-kit-ai/ai';

// Inizializza i componenti
const stream = new Stream({ variant: 'realtime', showProgress: true });
const codeBlock = new CodeBlock({ language: 'typescript', highlightSyntax: true });
const tokenInfo = new TokenInfo({ showCost: true, showBreakdown: true });

// Monta i componenti
stream.mount(document.getElementById('stream-container'));
codeBlock.mount(document.getElementById('code-container'));
tokenInfo.mount(document.getElementById('token-container'));
```

## 🧩 Componenti Disponibili

### 1. Stream Component 🚀

Gestisce streaming real-time con progress tracking e statistiche avanzate.

```typescript
const stream = new Stream({
  variant: 'realtime',
  state: 'streaming',
  showProgress: true,
  showStats: true,
  onChunk: (chunk) => console.log('New chunk:', chunk),
  onStateChange: (state) => console.log('State changed:', state)
});

// Aggiungi chunk di dati
stream.addChunk({
  type: 'text',
  content: 'Hello, World!',
  metadata: { source: 'api' }
});
```

**Varianti**: `default`, `realtime`, `buffered`, `chunked`, `minimal`
**Stati**: `idle`, `connecting`, `streaming`, `paused`, `completed`, `error`, `focused`

### 2. CodeBlock Component 💻

Blocchi di codice con syntax highlighting e supporto multi-linguaggio.

```typescript
const codeBlock = new CodeBlock({
  language: 'typescript',
  theme: 'dark',
  variant: 'detailed',
  code: `
    function greet(name: string): string {
      return \`Hello, \${name}!\`;
    }
  `,
  showLineNumbers: true,
  copyable: true,
  searchable: true
});

// Cerca nel codice
const results = codeBlock.searchCode('function');
console.log('Search results:', results);
```

**Linguaggi Supportati**: JavaScript, TypeScript, Python, Java, C++, Go, Rust, HTML, CSS, SQL, e molti altri
**Temi**: Dark, light, monokai, dracula, github, vs-code, atom, solarized

### 3. TokenInfo Component 📊

Tracciamento utilizzo token, analisi costi e informazioni modello.

```typescript
const tokenInfo = new TokenInfo({
  showCost: true,
  showBreakdown: true,
  showLimits: true,
  costInfo: {
    model: 'gpt-4',
    inputCostPer1K: 0.03,
    outputCostPer1K: 0.06,
    currency: 'USD'
  },
  onTokenUpdate: (stats) => console.log('Token stats:', stats)
});

// Aggiungi utilizzo token
tokenInfo.addTokenUsage('input', 150, 0.0045);
tokenInfo.addTokenUsage('output', 75, 0.0045);
```

**Tipi Token**: `input`, `output`, `total`, `prompt`, `completion`, `system`, `user`, `assistant`

### 4. ModelSelector Component 🤖

Selezione e confronto modelli AI con filtri avanzati.

```typescript
const modelSelector = new ModelSelector({
  showProvider: true,
  showCapabilities: true,
  showCost: true,
  models: [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      capabilities: ['text-generation', 'function-calling'],
      maxTokens: 8192,
      inputCostPer1K: 0.03,
      outputCostPer1K: 0.06
    }
  ],
  onModelSelect: (model) => console.log('Selected model:', model)
});
```

**Provider Supportati**: OpenAI, Anthropic, Google, Meta, Microsoft, Amazon, Cohere, HuggingFace, Local, Custom
**Capacità**: text-generation, code-generation, image-generation, function-calling, tool-use, multimodal

### 5. WebSearchTool Component 🔍

Ricerca web con motori multipli e filtri avanzati.

```typescript
const webSearch = new WebSearchTool({
  defaultEngine: 'google',
  showFilters: true,
  showHistory: true,
  onSearch: (query, results) => console.log('Search results:', results)
});

// Esegui ricerca
const results = await webSearch.search('artificial intelligence', {
  engine: 'google',
  type: 'webpage',
  numResults: 10
});
```

**Motori**: Google, Bing, DuckDuckGo, Yahoo, Brave, Custom
**Tipi Risultati**: webpage, news, image, video, shopping, academic, social

### 6. PDFTool Component 📄

Elaborazione PDF, estrazione testo, ricerca e analisi.

```typescript
const pdfTool = new PDFTool({
  showDocumentList: true,
  showPageViewer: true,
  showSearchResults: true,
  onDocumentLoad: (doc) => console.log('Document loaded:', doc)
});

// Carica documento PDF
const document = await pdfTool.loadDocument(file);

// Estrai testo
const text = pdfTool.extractText([1, 2, 3]);

// Cerca nel documento
const results = pdfTool.search('keyword');
```

**Operazioni**: Caricamento, visualizzazione pagine, estrazione testo/tabelle/immagini, ricerca

### 7. ImageAI Component 🎨

Generazione e analisi immagini AI con modelli multipli.

```typescript
const imageAI = new ImageAI({
  defaultModel: 'dall-e-3',
  showPromptEditor: true,
  showGallery: true,
  showAnalysis: true,
  onImageGenerate: (request) => console.log('Generating:', request)
});

// Genera immagine
const images = await imageAI.generateImage({
  prompt: 'A beautiful sunset over mountains',
  model: 'dall-e-3',
  size: '1024x1024',
  quality: 'hd'
});

// Analizza immagine
const analysis = await imageAI.analyzeImage({
  image: imageUrl,
  model: 'gpt-4-vision',
  task: 'describe'
});
```

**Modelli Generazione**: DALL-E 2/3, Midjourney, Stable Diffusion, Imagen, Parti
**Modelli Analisi**: GPT-4 Vision, Claude 3 Vision, Gemini Vision, LLaVA

## 🎨 Sistema di Styling

Tutti i componenti supportano un sistema di styling unificato:

```typescript
const customTheme = {
  primary: '#00ff00',
  secondary: '#0088ff',
  success: '#00ff00',
  warning: '#ffaa00',
  error: '#ff0000',
  background: '#000000',
  foreground: '#ffffff',
  border: '#333333',
  accent: '#ff6b6b',
  info: '#4ecdc4'
};

const component = new Stream({ theme: customTheme });
```

**Varianti**: `default`, `compact`, `detailed`, `minimal`, `expanded`
**Dimensioni**: `xs`, `sm`, `md`, `lg`, `xl`, `full`
**Stati**: `default`, `loading`, `error`, `success`, `focused`, `disabled`

## 🔧 Configurazione Avanzata

### Inizializzazione Globale

```typescript
import { initializeAIComponents } from '@tui-kit-ai/ai';

initializeAIComponents({
  theme: customTheme,
  debug: true,
  errorHandler: (error) => {
    console.error('AI Component Error:', error);
    // Invia a servizio di tracking errori
  }
});
```

### Gestione Eventi

```typescript
const component = new Stream({
  onChunk: (chunk) => {
    // Gestisci nuovo chunk
  },
  onStateChange: (state) => {
    // Gestisci cambio stato
  },
  onError: (error) => {
    // Gestisci errori
  }
});
```

### Validazione Props

Tutti i componenti utilizzano Zod per la validazione delle props:

```typescript
import { StreamPropsSchema } from '@tui-kit-ai/ai';

const props = StreamPropsSchema.parse({
  variant: 'realtime',
  showProgress: true
});
```

## 📱 Responsive Design

I componenti si adattano automaticamente alle dimensioni del terminale:

```typescript
// Stili responsive automatici
const component = new Stream({
  width: 80,  // Si adatta automaticamente
  height: 20  // Si adatta automaticamente
});
```

## ♿ Accessibilità

Supporto completo per accessibilità:

- **Navigazione da tastiera**: Tutti i componenti supportano navigazione con Tab, Enter, Escape
- **Screen reader**: Supporto ARIA completo
- **Alto contrasto**: Temi ottimizzati per accessibilità
- **Focus management**: Gestione intelligente del focus

## 🚀 Esempi Pratici

### Dashboard AI Completa

```typescript
import { 
  Stream, CodeBlock, TokenInfo, ModelSelector,
  WebSearchTool, PDFTool, ImageAI 
} from '@tui-kit-ai/ai';

class AIDashboard {
  private components: any[] = [];
  
  constructor(container: HTMLElement) {
    this.initializeComponents(container);
  }
  
  private initializeComponents(container: HTMLElement) {
    // Stream per output AI
    const stream = new Stream({
      variant: 'realtime',
      showProgress: true,
      showStats: true
    });
    
    // CodeBlock per codice generato
    const codeBlock = new CodeBlock({
      language: 'typescript',
      highlightSyntax: true,
      copyable: true
    });
    
    // TokenInfo per monitoraggio costi
    const tokenInfo = new TokenInfo({
      showCost: true,
      showBreakdown: true,
      showLimits: true
    });
    
    // ModelSelector per scelta modelli
    const modelSelector = new ModelSelector({
      showProvider: true,
      showCapabilities: true,
      showCost: true
    });
    
    // WebSearchTool per ricerche
    const webSearch = new WebSearchTool({
      defaultEngine: 'google',
      showFilters: true,
      showHistory: true
    });
    
    // PDFTool per documenti
    const pdfTool = new PDFTool({
      showDocumentList: true,
      showPageViewer: true,
      showSearchResults: true
    });
    
    // ImageAI per immagini
    const imageAI = new ImageAI({
      defaultModel: 'dall-e-3',
      showPromptEditor: true,
      showGallery: true,
      showAnalysis: true
    });
    
    this.components = [stream, codeBlock, tokenInfo, modelSelector, webSearch, pdfTool, imageAI];
    
    // Monta i componenti
    this.components.forEach((component, index) => {
      const element = document.createElement('div');
      element.id = `ai-component-${index}`;
      container.appendChild(element);
      component.mount(element);
    });
  }
  
  public destroy() {
    this.components.forEach(component => component.destroy());
  }
}

// Utilizzo
const dashboard = new AIDashboard(document.getElementById('ai-dashboard'));
```

### CLI AI Tool

```typescript
import { Stream, CodeBlock, TokenInfo } from '@tui-kit-ai/ai';

class CLIAITool {
  private stream: Stream;
  private codeBlock: CodeBlock;
  private tokenInfo: TokenInfo;
  
  constructor() {
    this.stream = new Stream({
      variant: 'realtime',
      onChunk: (chunk) => this.handleChunk(chunk)
    });
    
    this.codeBlock = new CodeBlock({
      language: 'typescript',
      onCodeChange: (code) => this.handleCodeChange(code)
    });
    
    this.tokenInfo = new TokenInfo({
      onTokenUpdate: (stats) => this.handleTokenUpdate(stats)
    });
  }
  
  private handleChunk(chunk: any) {
    if (chunk.type === 'code') {
      this.codeBlock.setCode(chunk.content);
    }
    
    // Aggiorna token info
    this.tokenInfo.addTokenUsage('input', chunk.content.length);
  }
  
  private handleCodeChange(code: string) {
    // Esegui validazione o compilazione
    console.log('Code changed:', code);
  }
  
  private handleTokenUpdate(stats: any) {
    // Aggiorna UI con statistiche token
    console.log('Token stats:', stats);
  }
}
```

## 🔍 Debug e Sviluppo

### Modalità Debug

```typescript
import { DEV_UTILS } from '@tui-kit-ai/ai';

// Abilita debug mode
DEV_UTILS.enableDebugMode();

// Log personalizzati
DEV_UTILS.log('Component initialized', { component: 'Stream' });
DEV_UTILS.warn('Deprecated API used', { api: 'oldMethod' });
DEV_UTILS.error('Error occurred', { error: 'Network timeout' });
```

### Performance Monitoring

```typescript
import { PERFORMANCE } from '@tui-kit-ai/ai';

// Traccia rendering componenti
PERFORMANCE.trackComponentRender('Stream', 150);

// Traccia richieste API
PERFORMANCE.trackAPIRequest('/api/generate', 2000, true);

// Traccia interazioni utente
PERFORMANCE.trackUserInteraction('CodeBlock', 'copy');
```

## 🧪 Testing

```typescript
import { Stream, StreamPropsSchema } from '@tui-kit-ai/ai';

describe('Stream Component', () => {
  let stream: Stream;
  
  beforeEach(() => {
    stream = new Stream({
      variant: 'default',
      showProgress: true
    });
  });
  
  afterEach(() => {
    stream.destroy();
  });
  
  test('should validate props correctly', () => {
    const validProps = StreamPropsSchema.parse({
      variant: 'realtime',
      showProgress: true
    });
    
    expect(validProps.variant).toBe('realtime');
    expect(validProps.showProgress).toBe(true);
  });
  
  test('should handle chunk addition', () => {
    const initialChunks = stream.getStats().totalChunks;
    
    stream.addChunk({
      type: 'text',
      content: 'Test chunk'
    });
    
    expect(stream.getStats().totalChunks).toBe(initialChunks + 1);
  });
});
```

## 📚 API Reference

### Stream Component

#### Props
- `variant`: `'default' | 'realtime' | 'buffered' | 'chunked' | 'minimal'`
- `state`: `'idle' | 'connecting' | 'streaming' | 'paused' | 'completed' | 'error' | 'focused'`
- `showProgress`: `boolean` - Mostra barra di progresso
- `showStats`: `boolean` - Mostra statistiche in tempo reale
- `onChunk`: `(chunk: StreamChunk) => void` - Callback per nuovi chunk
- `onStateChange`: `(state: StreamState) => void` - Callback per cambio stato

#### Methods
- `start()`: Avvia lo streaming
- `pause()`: Mette in pausa lo streaming
- `resume()`: Riprende lo streaming
- `stop()`: Ferma lo streaming
- `addChunk(chunk)`: Aggiunge un nuovo chunk
- `getStats()`: Restituisce le statistiche correnti
- `getProgress()`: Restituisce il progresso corrente

### CodeBlock Component

#### Props
- `language`: `Language` - Linguaggio di programmazione
- `theme`: `CodeTheme` - Tema per syntax highlighting
- `code`: `string` - Codice da visualizzare
- `showLineNumbers`: `boolean` - Mostra numeri di riga
- `copyable`: `boolean` - Abilita copia del codice
- `searchable`: `boolean` - Abilita ricerca nel codice

#### Methods
- `setCode(code)`: Imposta il codice
- `getCode()`: Restituisce il codice corrente
- `setLanguage(language)`: Cambia il linguaggio
- `copyToClipboard()`: Copia il codice negli appunti
- `searchCode(query)`: Cerca nel codice
- `formatCode()`: Formatta il codice

### TokenInfo Component

#### Props
- `showCost`: `boolean` - Mostra informazioni sui costi
- `showBreakdown`: `boolean` - Mostra breakdown dettagliato
- `showLimits`: `boolean` - Mostra limiti di utilizzo
- `costInfo`: `CostInfo` - Informazioni sui costi del modello

#### Methods
- `addTokenUsage(type, count, cost)`: Aggiunge utilizzo token
- `getStats()`: Restituisce le statistiche correnti
- `getCostInfo()`: Restituisce le informazioni sui costi
- `resetStats()`: Resetta le statistiche
- `calculateCost(tokens, type)`: Calcola il costo per i token

## 🤝 Contribuire

1. Fork del repository
2. Crea un branch per la feature (`git checkout -b feature/amazing-feature`)
3. Commit delle modifiche (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è licenziato sotto la licenza MIT - vedi il file [LICENSE](LICENSE) per i dettagli.

## 🙏 Ringraziamenti

- [tui-kit](https://github.com/tui-kit/tui-kit) per il framework base
- [Zod](https://github.com/colinhacks/zod) per la validazione TypeScript
- Tutti i contributor che hanno reso possibile questo progetto

## 📞 Supporto

- 📧 Email: support@tui-kit-ai.com
- 💬 Discord: [TUI-Kit AI Community](https://discord.gg/tui-kit-ai)
- 📖 Documentazione: [docs.tui-kit-ai.com](https://docs.tui-kit-ai.com)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/tui-kit-ai/ai/issues)

---

**TUI-Kit AI Components** - Potenzia le tue applicazioni terminale con l'intelligenza artificiale! 🚀
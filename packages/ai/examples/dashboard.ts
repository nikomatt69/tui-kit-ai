#!/usr/bin/env ts-node

/**
 * TUI Kit AI - Dashboard Example
 * 
 * Questo esempio mostra come utilizzare tutti i componenti AI insieme
 * per creare una dashboard completa per applicazioni AI.
 */

import blessed from 'blessed';
import { 
  Stream, CodeBlock, TokenInfo, ModelSelector,
  WebSearchTool, PDFTool, ImageAI 
} from '../src/components';

// Creazione dello screen principale
const screen = blessed.screen({
  smartCSR: true,
  title: 'TUI Kit AI - Dashboard Example'
});

// Configurazione layout
const layout = {
  header: { top: 0, left: 0, width: '100%', height: 3 },
  main: { top: 3, left: 0, width: '100%', height: '100%-6' },
  footer: { top: '100%-3', left: 0, width: '100%', height: 3 }
};

// Header
const header = blessed.box({
  parent: screen,
  ...layout.header,
  content: '🎉 TUI Kit AI - Dashboard Completa',
  style: {
    bg: 'blue',
    fg: 'white',
    bold: true,
    border: { fg: 'blue' }
  },
  border: { type: 'line' },
  align: 'center',
  valign: 'middle'
});

// Footer
const footer = blessed.box({
  parent: screen,
  ...layout.footer,
  content: 'Press [q] to quit | [Tab] to switch focus | [h] for help',
  style: {
    bg: 'gray',
    fg: 'white',
    border: { fg: 'gray' }
  },
  border: { type: 'line' },
  align: 'center',
  valign: 'middle'
});

// Container principale
const mainContainer = blessed.box({
  parent: screen,
  ...layout.main,
  style: {
    bg: 'black',
    border: { fg: 'white' }
  },
  border: { type: 'line' }
});

// Layout a griglia per i componenti
const gridLayout = {
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
};

// 1. Stream Component
const streamContainer = blessed.box({
  parent: mainContainer,
  top: 0,
  left: 0,
  width: '50%',
  height: '33%',
  style: {
    bg: 'black',
    border: { fg: 'green' }
  },
  border: { type: 'line' }
});

const stream = new Stream({
  parent: streamContainer,
  variant: 'realtime',
  size: 'full',
  showProgress: true,
  showStats: true,
  showChunkInfo: true,
  autoStart: true,
  maxChunks: 100,
  onChunk: (chunk) => {
    console.log(`Stream chunk: ${chunk.type} - ${chunk.content.substring(0, 50)}...`);
  },
  onComplete: (stats) => {
    console.log(`Stream completed: ${stats.totalChunks} chunks in ${stats.duration}ms`);
  }
});

// 2. CodeBlock Component
const codeBlockContainer = blessed.box({
  parent: mainContainer,
  top: 0,
  left: '50%',
  width: '50%',
  height: '33%',
  style: {
    bg: 'black',
    border: { fg: 'blue' }
  },
  border: { type: 'line' }
});

const codeBlock = new CodeBlock({
  parent: codeBlockContainer,
  variant: 'detailed',
  size: 'full',
  code: `// Esempio di codice TypeScript
import { Stream, CodeBlock } from '@tui-kit-ai/ai';

const stream = new Stream({
  variant: 'realtime',
  showProgress: true,
  onChunk: (chunk) => {
    console.log('New chunk:', chunk);
  }
});

const codeBlock = new CodeBlock({
  language: 'typescript',
  theme: 'vs-code',
  showLineNumbers: true,
  highlightSyntax: true
});`,
  language: 'typescript',
  theme: 'vs-code',
  showLineNumbers: true,
  highlightSyntax: true,
  copyable: true,
  expandable: true,
  onCodeChange: (code) => {
    console.log('Code changed:', code.length, 'characters');
  }
});

// 3. TokenInfo Component
const tokenInfoContainer = blessed.box({
  parent: mainContainer,
  top: '33%',
  left: 0,
  width: '33%',
  height: '33%',
  style: {
    bg: 'black',
    border: { fg: 'yellow' }
  },
  border: { type: 'line' }
});

const tokenInfo = new TokenInfo({
  parent: tokenInfoContainer,
  variant: 'compact',
  size: 'full',
  showCost: true,
  showBreakdown: true,
  showProgress: true,
  showModelInfo: true,
  inputCostPer1K: 0.001,
  outputCostPer1K: 0.002,
  currency: '$',
  onTokenUpdate: (stats) => {
    console.log(`Token usage: ${stats.totalTokens} tokens, $${stats.totalCost.toFixed(4)}`);
  }
});

// Simula aggiornamenti token
setInterval(() => {
  const tokenTypes = ['input', 'output', 'prompt', 'completion'] as const;
  const randomType = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
  const randomCount = Math.floor(Math.random() * 100) + 10;
  
  tokenInfo.addTokenUsage(randomType, randomCount);
}, 2000);

// 4. ModelSelector Component
const modelSelectorContainer = blessed.box({
  parent: mainContainer,
  top: '33%',
  left: '33%',
  width: '34%',
  height: '33%',
  style: {
    bg: 'black',
    border: { fg: 'magenta' }
  },
  border: { type: 'line' }
});

const modelSelector = new ModelSelector({
  parent: modelSelectorContainer,
  variant: 'compact',
  size: 'full',
  showProvider: true,
  showCapabilities: true,
  showCost: true,
  enableFiltering: true,
  enableSearch: true,
  onModelSelect: (model) => {
    console.log('Selected model:', model.name, 'by', model.provider);
  }
});

// 5. WebSearchTool Component
const webSearchContainer = blessed.box({
  parent: mainContainer,
  top: '33%',
  left: '67%',
  width: '33%',
  height: '33%',
  style: {
    bg: 'black',
    border: { fg: 'cyan' }
  },
  border: { type: 'line' }
});

const webSearch = new WebSearchTool({
  parent: webSearchContainer,
  variant: 'compact',
  size: 'full',
  defaultEngine: 'google',
  showFilters: true,
  showHistory: true,
  showResults: true,
  enableFiltering: true,
  enableSearch: true,
  onSearch: (query, engine, filters) => {
    console.log(`Search: "${query}" on ${engine}`);
  }
});

// 6. PDFTool Component
const pdfToolContainer = blessed.box({
  parent: mainContainer,
  top: '66%',
  left: 0,
  width: '50%',
  height: '34%',
  style: {
    bg: 'black',
    border: { fg: 'red' }
  },
  border: { type: 'line' }
});

const pdfTool = new PDFTool({
  parent: pdfToolContainer,
  variant: 'compact',
  size: 'full',
  showDocumentList: true,
  showPageViewer: true,
  showSearchResults: true,
  enableTextExtraction: true,
  enableTableExtraction: true,
  onDocumentLoad: (doc) => {
    console.log('PDF loaded:', doc.name, `${doc.pages} pages`);
  }
});

// 7. ImageAI Component
const imageAIContainer = blessed.box({
  parent: mainContainer,
  top: '66%',
  left: '50%',
  width: '50%',
  height: '34%',
  style: {
    bg: 'black',
    border: { fg: 'white' }
  },
  border: { type: 'line' }
});

const imageAI = new ImageAI({
  parent: imageAIContainer,
  variant: 'compact',
  size: 'full',
  defaultModel: 'dall-e-3',
  showPromptEditor: true,
  showImageGallery: true,
  showAnalysisResults: true,
  defaultStyle: 'realistic',
  defaultQuality: 'high',
  onImageGenerate: (request) => {
    console.log('Generating image:', request.prompt);
  },
  onImageAnalyze: (request) => {
    console.log('Analyzing image:', request.imageId);
  }
});

// Help overlay
const helpOverlay = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '80%',
  height: '80%',
  style: {
    bg: 'blue',
    fg: 'white',
    border: { fg: 'white' }
  },
  border: { type: 'line' },
  content: `
🎉 TUI Kit AI - Dashboard Help

COMPONENTI:
┌─────────────────────────────────────────────────────────┐
│ Stream (Verde)     │ CodeBlock (Blu)                   │
│ - Streaming AI     │ - Syntax highlighting             │
│ - Progress tracking│ - Multi-language support          │
│ - Real-time stats  │ - Copy/expand functionality       │
├─────────────────────────────────────────────────────────┤
│ TokenInfo (Giallo) │ ModelSelector (Magenta) │ WebSearch│
│ - Token tracking   │ - AI model selection    │ (Ciano)  │
│ - Cost analysis    │ - Provider filtering    │ - Web    │
│ - Usage stats      │ - Capability search     │   search │
├─────────────────────────────────────────────────────────┤
│ PDFTool (Rosso)    │ ImageAI (Bianco)                  │
│ - PDF processing   │ - Image generation                 │
│ - Text extraction  │ - AI analysis                      │
│ - Document search  │ - Style/quality control            │
└─────────────────────────────────────────────────────────┘

CONTROLLI:
• [Tab] - Cambia focus tra componenti
• [q] - Esci dall'applicazione
• [h] - Mostra/nascondi questo help
• [↑↓←→] - Navigazione nei componenti
• [Enter] - Seleziona elemento
• [Space] - Azioni rapide
• [Esc] - Annulla operazione

Ogni componente ha i suoi controlli specifici:
• Stream: [s] start, [p] pause, [r] resume, [c] clear
• CodeBlock: [c] copy, [e] expand, [l] line numbers
• TokenInfo: [r] refresh, [c] clear stats
• ModelSelector: [f] filters, [s] search, [e] engine
• WebSearch: [s] search, [f] filters, [h] history
• PDFTool: [l] load, [s] search, [a] analyze
• ImageAI: [g] generate, [a] analyze, [d] download

Press [h] to close this help.
`,
  hidden: true,
  scrollable: true,
  alwaysScroll: true
});

// Event handlers
let helpVisible = false;

screen.key(['q', 'C-c'], () => {
  return process.exit(0);
});

screen.key(['h'], () => {
  helpVisible = !helpVisible;
  helpOverlay.setContent(helpVisible ? helpOverlay.content : '');
  helpOverlay.toggle();
  screen.render();
});

screen.key(['escape'], () => {
  if (helpVisible) {
    helpVisible = false;
    helpOverlay.hide();
    screen.render();
  }
});

// Focus management
const components = [stream, codeBlock, tokenInfo, modelSelector, webSearch, pdfTool, imageAI];
let currentFocus = 0;

screen.key(['tab'], () => {
  currentFocus = (currentFocus + 1) % components.length;
  components[currentFocus].el.focus();
  screen.render();
});

// Inizializza il focus sul primo componente
components[0].el.focus();

// Simula dati per i componenti
setTimeout(() => {
  // Simula chunk per lo stream
  const streamChunks = [
    { type: 'text', content: 'Benvenuto nel TUI Kit AI!' },
    { type: 'text', content: 'Questo è un esempio di streaming real-time.' },
    { type: 'code', content: 'const example = "Hello World";' },
    { type: 'json', content: '{"status": "success", "data": "example"}' },
    { type: 'progress', content: 'Processing...', progress: 50 }
  ];
  
  streamChunks.forEach((chunk, index) => {
    setTimeout(() => {
      stream.addChunk({
        id: `chunk-${index}`,
        type: chunk.type as any,
        content: chunk.content,
        timestamp: Date.now(),
        progress: chunk.progress
      });
    }, index * 1000);
  });
}, 1000);

// Log di benvenuto
console.log('🎉 TUI Kit AI Dashboard avviata!');
console.log('Usa [Tab] per navigare tra i componenti');
console.log('Usa [h] per l\'help');
console.log('Usa [q] per uscire');

// Render iniziale
screen.render();
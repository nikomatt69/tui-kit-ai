# TUI Kit AI - Componenti AI per Terminali

Una suite completa di componenti AI per applicazioni terminale basate su blessed, progettata per integrare perfettamente con il framework tui-kit-ai.

## 🚀 Componenti Disponibili

### 1. Stream Component 🚀
**Streaming real-time con gestione chunk e progress tracking**

```typescript
import { Stream } from '@tui-kit-ai/ai';

const stream = new Stream({
  variant: 'realtime',
  showProgress: true,
  showStats: true,
  autoStart: true,
  onChunk: (chunk) => console.log('New chunk:', chunk),
  onComplete: (stats) => console.log('Stream completed:', stats)
});
```

**Caratteristiche:**
- Streaming real-time con gestione chunk
- Progress tracking e statistiche
- Varianti: default, realtime, buffered, chunked, minimal
- Stati: connecting, streaming, paused, completed, error, focused
- Supporto per chunk di diversi tipi (text, code, json, markdown, error, progress, metadata)

### 2. CodeBlock Component 💻
**Blocchi di codice con syntax highlighting e numeri di riga**

```typescript
import { CodeBlock } from '@tui-kit-ai/ai';

const codeBlock = new CodeBlock({
  code: 'const hello = "world";',
  language: 'typescript',
  theme: 'dark',
  showLineNumbers: true,
  highlightSyntax: true,
  copyable: true,
  expandable: true
});
```

**Caratteristiche:**
- Syntax highlighting per 30+ linguaggi
- Temi: dark, light, monokai, dracula, github, vs-code, atom, solarized
- Numeri di riga, copia, espansione/collasso
- Supporto per errori e metadati
- Varianti: default, compact, detailed, minimal, expanded

### 3. TokenInfo Component 📊
**Tracciamento utilizzo token e analisi costi**

```typescript
import { TokenInfo } from '@tui-kit-ai/ai';

const tokenInfo = new TokenInfo({
  showCost: true,
  showBreakdown: true,
  showProgress: true,
  showModelInfo: true,
  inputCostPer1K: 0.001,
  outputCostPer1K: 0.002,
  onTokenUpdate: (stats) => console.log('Token stats:', stats)
});
```

**Caratteristiche:**
- Tracciamento token per tipo (input, output, prompt, completion, system, user, assistant)
- Calcolo costi in tempo reale
- Breakdown dettagliato e progress bar
- Informazioni modello e statistiche
- Varianti: default, compact, detailed, minimal, expanded

### 4. ModelSelector Component 🤖
**Selezione e confronto modelli AI**

```typescript
import { ModelSelector } from '@tui-kit-ai/ai';

const modelSelector = new ModelSelector({
  showProvider: true,
  showCapabilities: true,
  showCost: true,
  showComparison: true,
  enableFiltering: true,
  enableSearch: true,
  onModelSelect: (model) => console.log('Selected model:', model)
});
```

**Caratteristiche:**
- Supporto per 10+ provider (OpenAI, Anthropic, Google, Meta, Microsoft, Amazon, Cohere, HuggingFace, Local, Custom)
- Filtri per provider, capacità, performance, costo, disponibilità
- Confronto modelli e ricerca
- Varianti: default, compact, detailed, minimal, expanded

### 5. WebSearchTool Component 🔍
**Ricerca web con motori multipli e filtri avanzati**

```typescript
import { WebSearchTool } from '@tui-kit-ai/ai';

const webSearch = new WebSearchTool({
  defaultEngine: 'google',
  showFilters: true,
  showHistory: true,
  showResults: true,
  enableFiltering: true,
  enableSearch: true,
  onSearch: (query, engine, filters) => console.log('Search:', query)
});
```

**Caratteristiche:**
- Motori: Google, Bing, DuckDuckGo, Yahoo, Brave, Custom
- Tipi risultati: webpage, news, image, video, shopping, academic, social
- Filtri avanzati e cronologia
- Barra di ricerca e risultati con metadati
- Varianti: default, compact, detailed, minimal, expanded

### 6. PDFTool Component 📄
**Elaborazione PDF, estrazione testo e analisi**

```typescript
import { PDFTool } from '@tui-kit-ai/ai';

const pdfTool = new PDFTool({
  showDocumentList: true,
  showPageViewer: true,
  showSearchResults: true,
  showAnalysisResults: true,
  enableTextExtraction: true,
  enableTableExtraction: true,
  enableImageExtraction: true,
  onDocumentLoad: (doc) => console.log('Document loaded:', doc)
});
```

**Caratteristiche:**
- Caricamento e visualizzazione PDF
- Estrazione testo, tabelle, immagini
- Ricerca e analisi documenti
- Metadati, segnalibri, annotazioni
- Varianti: default, compact, detailed, minimal, expanded

### 7. ImageAI Component 🎨
**Generazione e analisi immagini AI**

```typescript
import { ImageAI } from '@tui-kit-ai/ai';

const imageAI = new ImageAI({
  defaultModel: 'dall-e-3',
  showPromptEditor: true,
  showImageGallery: true,
  showAnalysisResults: true,
  defaultStyle: 'realistic',
  defaultQuality: 'high',
  onImageGenerate: (request) => console.log('Generating:', request)
});
```

**Caratteristiche:**
- Modelli generazione: DALL-E 2/3, Midjourney, Stable Diffusion, Imagen, Parti
- Modelli analisi: GPT-4 Vision, Claude 3 Vision, Gemini Vision, LLaVA
- Editor prompt, galleria immagini, cronologia
- Analisi oggetti, colori, emozioni
- Varianti: default, compact, detailed, minimal, expanded

## 🎨 Sistema di Styling Unificato

Tutti i componenti seguono un sistema di styling coerente:

### Varianti
- **default**: Stile standard con colori blu
- **compact**: Versione compatta con padding ridotto
- **detailed**: Versione dettagliata con più informazioni
- **minimal**: Stile minimale con bordi sottili
- **expanded**: Versione espansa con più spazio

### Dimensioni
- **xs**: Extra small (8 righe)
- **sm**: Small (12 righe)
- **md**: Medium (16 righe)
- **lg**: Large (20 righe)
- **xl**: Extra large (24 righe)
- **full**: Full height (100%)

### Stati
- **default**: Stato normale
- **loading**: Caricamento in corso
- **error**: Errore
- **success**: Operazione completata
- **focused**: Elemento focalizzato
- **disabled**: Elemento disabilitato

## 🔧 Caratteristiche Tecniche

### Validazione
- Schemi Zod per tutte le props
- Validazione runtime con messaggi di errore dettagliati
- Warnings per configurazioni non ottimali

### Event Handling
- Sistema eventi completo con callback
- Eventi tipizzati per TypeScript
- Supporto per eventi personalizzati

### Accessibilità
- Supporto ARIA per screen reader
- Navigazione tastiera completa
- Indicatori visivi per stati

### Performance
- Gestione efficiente di grandi quantità di dati
- Lazy loading per contenuti pesanti
- Caching intelligente per operazioni costose

## 📚 Esempi di Utilizzo

### Dashboard AI Completa

```typescript
import { 
  Stream, CodeBlock, TokenInfo, ModelSelector,
  WebSearchTool, PDFTool, ImageAI 
} from '@tui-kit-ai/ai';

// Creazione dashboard AI completa
const dashboard = {
  stream: new Stream({ 
    variant: 'realtime', 
    showProgress: true,
    autoStart: true 
  }),
  
  codeBlock: new CodeBlock({ 
    language: 'typescript', 
    highlightSyntax: true,
    showLineNumbers: true 
  }),
  
  tokenInfo: new TokenInfo({ 
    showCost: true, 
    showBreakdown: true,
    showModelInfo: true 
  }),
  
  modelSelector: new ModelSelector({ 
    showProvider: true, 
    showCapabilities: true,
    enableFiltering: true 
  }),
  
  webSearch: new WebSearchTool({ 
    defaultEngine: 'google', 
    showFilters: true,
    showHistory: true 
  }),
  
  pdfTool: new PDFTool({ 
    showDocumentList: true, 
    showPageViewer: true,
    enableTextExtraction: true 
  }),
  
  imageAI: new ImageAI({ 
    defaultModel: 'dall-e-3', 
    showPromptEditor: true,
    showImageGallery: true 
  })
};
```

### Configurazione Avanzata

```typescript
// Configurazione con validazione e eventi
const advancedConfig = {
  stream: {
    variant: 'realtime' as const,
    size: 'lg' as const,
    showProgress: true,
    showStats: true,
    maxChunks: 1000,
    chunkDelay: 100,
    onChunk: (chunk) => {
      console.log(`Chunk ${chunk.id}: ${chunk.content}`);
    },
    onComplete: (stats) => {
      console.log(`Stream completed: ${stats.totalChunks} chunks, ${stats.duration}ms`);
    }
  },
  
  codeBlock: {
    variant: 'detailed' as const,
    size: 'xl' as const,
    language: 'typescript' as const,
    theme: 'vs-code' as const,
    showLineNumbers: true,
    highlightSyntax: true,
    copyable: true,
    expandable: true,
    onCodeChange: (code) => {
      console.log('Code changed:', code);
    }
  }
};
```

## 🎯 Casi d'Uso Principali

### CLI AI Tools
Applicazioni terminale complete per AI con interfaccia ricca e interattiva.

### AI Development
Dashboard per sviluppo e testing di modelli AI con monitoraggio real-time.

### Content Creation
Editor per prompt e generazione contenuti con preview e analisi.

### Data Analysis
Visualizzazione streaming e analisi dati con grafici e statistiche.

### Document Processing
Gestione PDF e documenti con estrazione e analisi automatica.

### Web Research
Ricerca e aggregazione informazioni web con filtri avanzati.

### Image Generation
Creazione e analisi immagini AI con galleria e cronologia.

## 🚀 Installazione

```bash
npm install @tui-kit-ai/ai
```

## 📖 Documentazione API

Per la documentazione completa dell'API, consulta i file TypeScript che includono:
- Interfacce complete per tutte le props
- Tipi per eventi e callback
- Esempi di utilizzo
- Configurazioni avanzate

## 🤝 Contributi

Questo progetto fa parte del framework tui-kit-ai e segue gli stessi standard di qualità e architettura. Per contribuire:

1. Segui il pattern architetturale esistente
2. Mantieni la coerenza con i componenti core
3. Aggiungi validazione Zod per tutte le props
4. Implementa il sistema di styling unificato
5. Scrivi test completi per tutte le funzionalità

## 📄 Licenza

Questo progetto è rilasciato sotto la stessa licenza del framework tui-kit-ai.

---

**TUI Kit AI** - Porta il potere dell'AI nel tuo terminale! 🎉
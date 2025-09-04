import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../core/src/components/BaseComponent';
import { PDFToolProps, PDFToolVariants, PDFToolSizes, PDFToolStates, PDFDocument, PDFOperation, PDFSearchResult, PDFAnalysisResult } from './PDFTool.types';
import { PDFToolStyles } from './PDFTool.styles';
import { validateComponent, ValidationResult } from '../../../core/src/validation/component-validator';

export class PDFTool implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: PDFToolProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private documentListElement?: Widgets.BoxElement;
  private pageViewerElement?: Widgets.BoxElement;
  private searchResultsElement?: Widgets.BoxElement;
  private analysisResultsElement?: Widgets.BoxElement;
  private metadataElement?: Widgets.BoxElement;
  private bookmarksElement?: Widgets.BoxElement;
  private annotationsElement?: Widgets.BoxElement;
  private toolbarElement?: Widgets.BoxElement;
  private documents: PDFDocument[] = [];
  private currentDocument?: PDFDocument;
  private currentPage: number = 1;
  private searchResults: PDFSearchResult[] = [];
  private analysisResult?: PDFAnalysisResult;
  private currentDocumentIndex: number = 0;
  private currentSearchIndex: number = 0;
  private isProcessing: boolean = false;

  constructor(props: PDFToolProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('PDFTool', props);
    
    if (!this.validationResult.success) {
      console.error('❌ PDFTool validation failed:', this.validationResult.errors);
      throw new Error(`PDFTool validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ PDFTool warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.documents = this.props.documents || [];
    this.currentDocument = this.props.currentDocument;
    this.currentPage = this.props.currentPage || 1;
    this.searchResults = this.props.searchResults || [];
    this.analysisResult = this.props.analysisResult;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: PDFToolStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupPDFToolStructure();
    this.setupEventHandlers();
    this.updateDisplay();
  }
  
  private setupPDFToolStructure() {
    const { showDocumentList, showPageViewer, showSearchResults, showAnalysisResults, showMetadata, showBookmarks, showAnnotations } = this.props;
    let topOffset = 0;
    
    // Create header
    this.headerElement = this.el.parent?.append({
      type: 'box',
      content: '📄 PDF Tool',
      style: PDFToolStyles.getHeaderStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: 3,
    }) as Widgets.BoxElement;
    topOffset += 3;
    
    // Create toolbar
    this.toolbarElement = this.el.parent?.append({
      type: 'box',
      content: this.formatToolbar(),
      style: PDFToolStyles.getToolbarStyle(this.props),
      top: topOffset,
      left: 0,
      width: '100%',
      height: 2,
    }) as Widgets.BoxElement;
    topOffset += 2;
    
    // Create document list if enabled
    if (showDocumentList) {
      this.documentListElement = this.el.parent?.append({
        type: 'box',
        content: this.formatDocumentList(),
        style: PDFToolStyles.getDocumentListStyle(this.props),
        top: topOffset,
        left: 0,
        width: '25%',
        height: '100%-8',
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
    
    // Create main content area
    const contentLeft = showDocumentList ? '25%' : 0;
    const contentWidth = showDocumentList ? '75%' : '100%';
    const contentHeight = '100%-8';
    
    // Create page viewer if enabled
    if (showPageViewer) {
      this.pageViewerElement = this.el.parent?.append({
        type: 'box',
        content: this.formatPageViewer(),
        style: PDFToolStyles.getPageViewerStyle(this.props),
        top: topOffset,
        left: contentLeft,
        width: contentWidth,
        height: contentHeight,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
    
    // Create search results if enabled
    if (showSearchResults) {
      this.searchResultsElement = this.el.parent?.append({
        type: 'box',
        content: this.formatSearchResults(),
        style: PDFToolStyles.getSearchResultsStyle(this.props),
        top: '100%-3',
        left: 0,
        width: '50%',
        height: 3,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
    
    // Create analysis results if enabled
    if (showAnalysisResults) {
      this.analysisResultsElement = this.el.parent?.append({
        type: 'box',
        content: this.formatAnalysisResults(),
        style: PDFToolStyles.getAnalysisResultsStyle(this.props),
        top: '100%-3',
        left: '50%',
        width: '50%',
        height: 3,
        scrollable: true,
        alwaysScroll: true,
      }) as Widgets.BoxElement;
    }
    
    // Create metadata if enabled
    if (showMetadata) {
      this.metadataElement = this.el.parent?.append({
        type: 'box',
        content: this.formatMetadata(),
        style: PDFToolStyles.getMetadataStyle(this.props),
        top: '100%-1',
        left: 0,
        width: '100%',
        height: 1,
      }) as Widgets.BoxElement;
    }
  }
  
  private setupEventHandlers() {
    // Handle keyboard events
    this.el.key(['up'], () => {
      this.navigateUp();
    });
    
    this.el.key(['down'], () => {
      this.navigateDown();
    });
    
    this.el.key(['left'], () => {
      this.previousPage();
    });
    
    this.el.key(['right'], () => {
      this.nextPage();
    });
    
    this.el.key(['enter'], () => {
      this.selectCurrentItem();
    });
    
    this.el.key(['l'], () => {
      this.loadDocument();
    });
    
    this.el.key(['s'], () => {
      this.startSearch();
    });
    
    this.el.key(['a'], () => {
      this.startAnalysis();
    });
    
    this.el.key(['e'], () => {
      this.extractText();
    });
    
    this.el.key(['t'], () => {
      this.extractTables();
    });
    
    this.el.key(['i'], () => {
      this.extractImages();
    });
    
    this.el.key(['r'], () => {
      this.refreshDocument();
    });
    
    this.el.key(['c'], () => {
      this.clearResults();
    });
    
    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focused');
      this.props.onFocus?.();
    });
    
    this.el.on('blur', () => {
      this.setState('default');
      this.props.onBlur?.();
    });
  }
  
  private formatToolbar(): string {
    const operations = ['[L]oad', '[S]earch', '[A]nalyze', '[E]xtract Text', '[T]ables', '[I]mages', '[R]efresh', '[C]lear'];
    return `Tools: ${operations.join(' | ')}`;
  }
  
  private formatDocumentList(): string {
    if (this.documents.length === 0) {
      return 'No documents loaded\n\nPress [L] to load a document';
    }
    
    return this.documents
      .map((doc, index) => {
        const isCurrent = index === this.currentDocumentIndex;
        const prefix = isCurrent ? '→ ' : '  ';
        const status = doc.loaded ? '✓' : '○';
        const size = this.formatFileSize(doc.size);
        
        return `${prefix}${status} ${doc.name} (${size})`;
      })
      .join('\n');
  }
  
  private formatPageViewer(): string {
    if (!this.currentDocument) {
      return 'No document selected\n\nSelect a document from the list';
    }
    
    if (!this.currentDocument.loaded) {
      return `Document: ${this.currentDocument.name}\nStatus: Not loaded\n\nPress [L] to load the document`;
    }
    
    const pageInfo = `Page ${this.currentPage} of ${this.currentDocument.pages}`;
    const content = this.currentDocument.content?.pages[this.currentPage - 1]?.text || 'No content available';
    
    return `${pageInfo}\n\n${content}`;
  }
  
  private formatSearchResults(): string {
    if (this.searchResults.length === 0) {
      return 'No search results\n\nPress [S] to search';
    }
    
    return this.searchResults
      .map((result, index) => {
        const isCurrent = index === this.currentSearchIndex;
        const prefix = isCurrent ? '→ ' : '  ';
        const relevance = Math.round(result.relevance * 100);
        
        return `${prefix}Page ${result.page}: ${result.text.substring(0, 50)}... (${relevance}%)`;
      })
      .join('\n');
  }
  
  private formatAnalysisResults(): string {
    if (!this.analysisResult) {
      return 'No analysis results\n\nPress [A] to analyze';
    }
    
    return `Type: ${this.analysisResult.documentType}\n` +
           `Language: ${this.analysisResult.language}\n` +
           `Sentiment: ${this.analysisResult.sentiment}\n` +
           `Topics: ${this.analysisResult.topics.slice(0, 3).join(', ')}`;
  }
  
  private formatMetadata(): string {
    if (!this.currentDocument) {
      return 'No document selected';
    }
    
    const doc = this.currentDocument;
    return `Document: ${doc.name} | Pages: ${doc.pages} | Size: ${this.formatFileSize(doc.size)} | Author: ${doc.author || 'Unknown'}`;
  }
  
  private formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  private navigateUp() {
    if (this.currentDocumentIndex > 0) {
      this.currentDocumentIndex--;
      this.currentDocument = this.documents[this.currentDocumentIndex];
      this.props.onDocumentSelect?.(this.currentDocument);
      this.updateDisplay();
    }
  }
  
  private navigateDown() {
    if (this.currentDocumentIndex < this.documents.length - 1) {
      this.currentDocumentIndex++;
      this.currentDocument = this.documents[this.currentDocumentIndex];
      this.props.onDocumentSelect?.(this.currentDocument);
      this.updateDisplay();
    }
  }
  
  private previousPage() {
    if (this.currentDocument && this.currentPage > 1) {
      this.currentPage--;
      this.props.onPageChange?.(this.currentPage);
      this.updateDisplay();
    }
  }
  
  private nextPage() {
    if (this.currentDocument && this.currentPage < this.currentDocument.pages) {
      this.currentPage++;
      this.props.onPageChange?.(this.currentPage);
      this.updateDisplay();
    }
  }
  
  private selectCurrentItem() {
    if (this.currentDocument) {
      this.props.onDocumentSelect?.(this.currentDocument);
    }
  }
  
  private loadDocument() {
    if (this.currentDocument && !this.currentDocument.loaded) {
      this.isProcessing = true;
      this.setState('loading');
      this.updateDisplay();
      
      // Simulate document loading
      setTimeout(() => {
        this.currentDocument!.loaded = true;
        this.currentDocument!.content = {
          text: 'Sample PDF content...',
          pages: [
            {
              number: 1,
              text: 'This is page 1 content...',
              width: 612,
              height: 792,
              rotation: 0,
              images: [],
              tables: [],
              annotations: [],
            },
          ],
          tables: [],
          images: [],
          bookmarks: [],
          annotations: [],
        };
        
        this.isProcessing = false;
        this.setState('success');
        this.props.onDocumentLoad?.(this.currentDocument!);
        this.updateDisplay();
      }, 2000);
    }
  }
  
  private startSearch() {
    if (!this.currentDocument || !this.currentDocument.loaded) {
      return;
    }
    
    this.isProcessing = true;
    this.setState('loading');
    this.updateDisplay();
    
    // Simulate search
    setTimeout(() => {
      this.searchResults = [
        {
          page: 1,
          text: 'Sample search result text',
          x: 100,
          y: 200,
          width: 200,
          height: 20,
          context: 'This is the context around the search result...',
          relevance: 0.95,
        },
        {
          page: 2,
          text: 'Another search result',
          x: 150,
          y: 300,
          width: 180,
          height: 20,
          context: 'More context for the second result...',
          relevance: 0.87,
        },
      ];
      
      this.isProcessing = false;
      this.setState('success');
      this.props.onSearch?.(this.props.searchTerm || 'sample', this.searchResults);
      this.updateDisplay();
    }, 1500);
  }
  
  private startAnalysis() {
    if (!this.currentDocument || !this.currentDocument.loaded) {
      return;
    }
    
    this.isProcessing = true;
    this.setState('loading');
    this.updateDisplay();
    
    // Simulate analysis
    setTimeout(() => {
      this.analysisResult = {
        documentType: 'Technical Document',
        language: 'English',
        topics: ['technology', 'programming', 'software'],
        entities: ['JavaScript', 'TypeScript', 'Node.js'],
        sentiment: 'neutral',
        summary: 'This document discusses various programming concepts and technologies.',
        keyPoints: [
          'Introduction to programming',
          'Overview of technologies',
          'Best practices and recommendations',
        ],
        statistics: {
          wordCount: 1500,
          sentenceCount: 75,
          paragraphCount: 15,
          averageWordsPerSentence: 20,
          readabilityScore: 8.5,
        },
      };
      
      this.isProcessing = false;
      this.setState('success');
      this.props.onAnalysis?.(this.analysisResult);
      this.updateDisplay();
    }, 3000);
  }
  
  private extractText() {
    if (!this.currentDocument || !this.currentDocument.loaded) {
      return;
    }
    
    const text = this.currentDocument.content?.text || 'No text content available';
    this.props.onTextExtract?.(text);
    this.updateDisplay();
  }
  
  private extractTables() {
    if (!this.currentDocument || !this.currentDocument.loaded) {
      return;
    }
    
    const tables = this.currentDocument.content?.tables || [];
    this.props.onTableExtract?.(tables);
    this.updateDisplay();
  }
  
  private extractImages() {
    if (!this.currentDocument || !this.currentDocument.loaded) {
      return;
    }
    
    const images = this.currentDocument.content?.images || [];
    this.props.onImageExtract?.(images);
    this.updateDisplay();
  }
  
  private refreshDocument() {
    if (this.currentDocument) {
      this.loadDocument();
    }
  }
  
  private clearResults() {
    this.searchResults = [];
    this.analysisResult = undefined;
    this.currentSearchIndex = 0;
    this.updateDisplay();
  }
  
  private updateDisplay() {
    if (this.documentListElement) {
      this.documentListElement.setContent(this.formatDocumentList());
    }
    
    if (this.pageViewerElement) {
      this.pageViewerElement.setContent(this.formatPageViewer());
    }
    
    if (this.searchResultsElement) {
      this.searchResultsElement.setContent(this.formatSearchResults());
    }
    
    if (this.analysisResultsElement) {
      this.analysisResultsElement.setContent(this.formatAnalysisResults());
    }
    
    if (this.metadataElement) {
      this.metadataElement.setContent(this.formatMetadata());
    }
    
    if (this.toolbarElement) {
      this.toolbarElement.setContent(this.formatToolbar());
    }
    
    this.render();
  }
  
  private render() {
    this.el.screen?.render();
  }
  
  // Public methods
  addDocument(document: PDFDocument) {
    this.documents.push(document);
    if (!this.currentDocument) {
      this.currentDocument = document;
      this.currentDocumentIndex = this.documents.length - 1;
    }
    this.updateDisplay();
  }
  
  removeDocument(documentId: string) {
    this.documents = this.documents.filter(doc => doc.id !== documentId);
    if (this.currentDocument?.id === documentId) {
      this.currentDocument = this.documents[0];
      this.currentDocumentIndex = 0;
    }
    this.updateDisplay();
  }
  
  setCurrentDocument(document: PDFDocument) {
    this.currentDocument = document;
    this.currentDocumentIndex = this.documents.findIndex(doc => doc.id === document.id);
    this.currentPage = 1;
    this.props.onDocumentSelect?.(document);
    this.updateDisplay();
  }
  
  setCurrentPage(page: number) {
    if (this.currentDocument && page >= 1 && page <= this.currentDocument.pages) {
      this.currentPage = page;
      this.props.onPageChange?.(page);
      this.updateDisplay();
    }
  }
  
  setSearchResults(results: PDFSearchResult[]) {
    this.searchResults = results;
    this.currentSearchIndex = 0;
    this.updateDisplay();
  }
  
  setAnalysisResult(result: PDFAnalysisResult) {
    this.analysisResult = result;
    this.updateDisplay();
  }
  
  // Implement required methods by delegating to base component
  setVariant = (variant: PDFToolVariants) => {
    this.props.variant = variant;
    this.el.style = PDFToolStyles.getStyle(this.props);
    this.render();
  };
  
  setSize = (size: PDFToolSizes) => {
    this.props.size = size;
    this.el.style = PDFToolStyles.getStyle(this.props);
    this.render();
  };
  
  setState = (state: PDFToolStates) => {
    this.props.state = state;
    this.el.style = PDFToolStyles.getStyle(this.props);
    this.render();
  };
  
  getConfig = () => ({
    variant: this.props.variant || 'default',
    size: this.props.size || 'md',
    state: this.props.state || 'default',
    documentsCount: this.documents.length,
    currentDocument: this.currentDocument,
    currentPage: this.currentPage,
    searchResultsCount: this.searchResults.length,
    hasAnalysisResult: !!this.analysisResult,
  });
  
  update = (props: Partial<PDFToolProps>) => {
    this.props = { ...this.props, ...props };
    this.el.style = PDFToolStyles.getStyle(this.props);
    this.render();
  };
  
  // Static method to create PDF tool with specific configuration
  static create(props: PDFToolProps): PDFTool {
    return new PDFTool(props);
  }
  
  // Utility methods
  getDocuments(): PDFDocument[] {
    return [...this.documents];
  }
  
  getCurrentDocument(): PDFDocument | undefined {
    return this.currentDocument;
  }
  
  getCurrentPage(): number {
    return this.currentPage;
  }
  
  getSearchResults(): PDFSearchResult[] {
    return [...this.searchResults];
  }
  
  getAnalysisResult(): PDFAnalysisResult | undefined {
    return this.analysisResult;
  }
  
  isProcessingState(): boolean {
    return this.isProcessing;
  }
}
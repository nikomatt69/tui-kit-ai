import { PDFToolProps, PDFDocument, PDFPage, PDFSearchResult, PDFTable, PDFImage, PDFAnnotation, PDFBookmark, PDFToolEvents, PDFToolMethods } from './PDFTool.types';
import { generatePDFToolStyles, getPDFToolVariantClass, getPDFToolStateClass } from './PDFTool.styles';

export class PDFTool implements PDFToolMethods {
  private props: PDFToolProps;
  private element: HTMLElement | null = null;
  private events: PDFToolEvents;
  private currentDocument: PDFDocument | null = null;
  private currentPage: number = 1;
  private searchQuery: string = '';
  private searchResults: PDFSearchResult[] = [];

  constructor(props: Partial<PDFToolProps> = {}) {
    this.props = {
      variant: 'default',
      state: 'default',
      documents: [],
      currentPage: 1,
      searchQuery: '',
      searchResults: [],
      showDocumentList: true,
      showPageViewer: true,
      showSearchResults: true,
      showMetadata: false,
      showAnnotations: true,
      showBookmarks: true,
      showThumbnails: true,
      zoomLevel: 1.0,
      pageMode: 'single',
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
        border: '#333333',
        accent: '#ff6b6b',
        info: '#4ecdc4'
      },
      ...props
    };

    this.events = {
      documentLoad: props.onDocumentLoad || (() => {}),
      documentChange: props.onDocumentChange || (() => {}),
      pageChange: props.onPageChange || (() => {}),
      search: props.onSearch || (() => {}),
      textExtract: props.onTextExtract || (() => {}),
      tableExtract: props.onTableExtract || (() => {}),
      imageExtract: props.onImageExtract || (() => {}),
      annotationAdd: props.onAnnotationAdd || (() => {}),
      bookmarkClick: props.onBookmarkClick || (() => {}),
      export: () => {},
      refresh: () => {}
    };

    this.initialize();
  }

  private initialize(): void {
    this.createElement();
    this.attachEventListeners();
    this.updateStyles();
    this.render();
  }

  private createElement(): void {
    this.element = document.createElement('div');
    this.element.className = `pdftool-container ${getPDFToolVariantClass(this.props.variant)} ${getPDFToolStateClass(this.props.state)}`;
    this.element.setAttribute('data-pdftool-id', this.generateId());
  }

  private attachEventListeners(): void {
    if (!this.element) return;

    // Focus events
    this.element.addEventListener('focus', () => {
      this.setState('focused');
    });

    this.element.addEventListener('blur', () => {
      if (this.props.state === 'focused') {
        this.setState('default');
      }
    });

    // Click events
    this.element.addEventListener('click', (event) => {
      this.handleClick(event);
    });

    // Keyboard events
    this.element.addEventListener('keydown', (event) => {
      this.handleKeydown(event);
    });

    // Make element focusable
    this.element.setAttribute('tabindex', '0');
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('pdftool-action')) {
      const actionId = target.getAttribute('data-action-id');
      if (actionId) {
        this.handleAction(actionId);
      }
    } else if (target.classList.contains('pdftool-document')) {
      const documentId = target.getAttribute('data-document-id');
      if (documentId) {
        this.setCurrentDocument(documentId);
      }
    } else if (target.classList.contains('pdftool-search-result')) {
      const resultIndex = target.getAttribute('data-result-index');
      if (resultIndex) {
        this.handleSearchResultClick(parseInt(resultIndex));
      }
    } else if (target.classList.contains('pdftool-button')) {
      const buttonAction = target.getAttribute('data-button-action');
      if (buttonAction) {
        this.handleButtonAction(buttonAction);
      }
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        if (this.currentDocument) {
          this.previousPage();
        }
        break;
      case 'ArrowRight':
        if (this.currentDocument) {
          this.nextPage();
        }
        break;
      case 'f':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.focusSearch();
        }
        break;
      case 'Escape':
        this.clearSearch();
        break;
    }
  }

  private handleAction(actionId: string): void {
    switch (actionId) {
      case 'refresh':
        this.refreshStats();
        break;
      case 'export':
        this.exportDocument('pdf');
        break;
      case 'toggle-sidebar':
        this.toggleSidebar();
        break;
      case 'toggle-metadata':
        this.props.showMetadata = !this.props.showMetadata;
        this.render();
        break;
      case 'toggle-viewer':
        this.props.showPageViewer = !this.props.showPageViewer;
        this.render();
        break;
    }
  }

  private handleButtonAction(action: string): void {
    switch (action) {
      case 'load-file':
        this.loadFile();
        break;
      case 'extract-text':
        this.extractText();
        break;
      case 'extract-tables':
        this.extractTables();
        break;
      case 'extract-images':
        this.extractImages();
        break;
      case 'search':
        this.performSearch();
        break;
      case 'previous-page':
        this.previousPage();
        break;
      case 'next-page':
        this.nextPage();
        break;
      case 'zoom-in':
        this.setZoom(this.props.zoomLevel + 0.1);
        break;
      case 'zoom-out':
        this.setZoom(this.props.zoomLevel - 0.1);
        break;
      case 'fit-width':
        this.setZoom(1.0);
        break;
    }
  }

  private handleSearchResultClick(index: number): void {
    const result = this.searchResults[index];
    if (result) {
      this.setCurrentPage(result.pageNumber);
      this.events.search(this.searchQuery, this.searchResults);
    }
  }

  private focusSearch(): void {
    const searchInput = this.element?.querySelector('.pdftool-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  private clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.props.searchQuery = '';
    this.props.searchResults = [];
    this.render();
  }

  private toggleSidebar(): void {
    this.props.showDocumentList = !this.props.showDocumentList;
    this.render();
  }

  private loadFile(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.loadDocument(file);
      }
    };
    input.click();
  }

  private generateId(): string {
    return `pdftool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateStyles(): void {
    if (!this.element) return;

    const styleConfig = {
      variant: this.props.variant,
      state: this.props.state,
      width: this.props.width,
      height: this.props.height,
      theme: this.props.theme
    };

    const styles = generatePDFToolStyles(styleConfig);
    
    // Remove existing styles
    const existingStyle = this.element.querySelector('style');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new styles
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    this.element.appendChild(styleElement);
  }

  private render(): void {
    if (!this.element) return;

    const { variant, state, showDocumentList, showPageViewer, showSearchResults, showMetadata } = this.props;
    
    this.element.className = `pdftool-container ${getPDFToolVariantClass(variant)} ${getPDFToolStateClass(state)}`;
    
    this.element.innerHTML = `
      <div class="pdftool-header">
        <div class="pdftool-title">
          <span>PDF Tool</span>
          <span class="pdftool-status">${state}</span>
        </div>
        <div class="pdftool-actions">
          <button class="pdftool-action" data-action-id="refresh" title="Refresh">🔄</button>
          <button class="pdftool-action" data-action-id="export" title="Export">📊</button>
          <button class="pdftool-action" data-action-id="toggle-sidebar" title="Toggle Sidebar">📁</button>
          <button class="pdftool-action" data-action-id="toggle-metadata" title="Toggle Metadata">ℹ️</button>
          <button class="pdftool-action" data-action-id="toggle-viewer" title="Toggle Viewer">👁️</button>
        </div>
      </div>
      
      ${this.renderToolbar()}
      
      <div class="pdftool-content">
        ${showDocumentList ? this.renderSidebar() : ''}
        <div class="pdftool-main">
          ${this.renderDocuments()}
          ${showPageViewer ? this.renderViewer() : ''}
        </div>
      </div>
      
      ${showSearchResults ? this.renderSearchResults() : ''}
      ${showMetadata ? this.renderMetadata() : ''}
      
      <div class="pdftool-footer">
        <div class="pdftool-footer-info">
          <div class="pdftool-footer-info-item">
            <span>📄</span>
            <span>${this.props.documents.length} documents</span>
          </div>
          <div class="pdftool-footer-info-item">
            <span>📖</span>
            <span>Page ${this.currentPage}${this.currentDocument ? ` of ${this.currentDocument.pages}` : ''}</span>
          </div>
          <div class="pdftool-footer-info-item">
            <span>🔍</span>
            <span>${this.searchResults.length} results</span>
          </div>
        </div>
        <div class="pdftool-footer-actions">
          <span>Use arrow keys to navigate pages</span>
        </div>
      </div>
    `;
  }

  private renderToolbar(): string {
    return `
      <div class="pdftool-toolbar">
        <div class="pdftool-toolbar-left">
          <button class="pdftool-button" data-button-action="load-file">📁 Load PDF</button>
          <button class="pdftool-button" data-button-action="extract-text">📝 Extract Text</button>
          <button class="pdftool-button" data-button-action="extract-tables">📊 Extract Tables</button>
          <button class="pdftool-button" data-button-action="extract-images">🖼️ Extract Images</button>
        </div>
        <div class="pdftool-toolbar-right">
          <input 
            type="text" 
            class="pdftool-input pdftool-search-input" 
            placeholder="Search in document..." 
            value="${this.searchQuery}"
          />
          <button class="pdftool-button" data-button-action="search">🔍</button>
          <button class="pdftool-button" data-button-action="previous-page">⬅️</button>
          <button class="pdftool-button" data-button-action="next-page">➡️</button>
          <button class="pdftool-button" data-button-action="zoom-out">🔍-</button>
          <span class="pdftool-zoom-level">${Math.round(this.props.zoomLevel * 100)}%</span>
          <button class="pdftool-button" data-button-action="zoom-in">🔍+</button>
        </div>
      </div>
    `;
  }

  private renderSidebar(): string {
    return `
      <div class="pdftool-sidebar">
        <div class="pdftool-sidebar-header">
          <h3>Documents</h3>
        </div>
        <div class="pdftool-documents">
          ${this.props.documents.map(doc => `
            <div class="pdftool-document ${this.currentDocument?.id === doc.id ? 'active' : ''}" data-document-id="${doc.id}">
              <div class="pdftool-document-header">
                <div class="pdftool-document-name">${doc.name}</div>
                <div class="pdftool-document-size">${this.formatBytes(doc.size)}</div>
              </div>
              <div class="pdftool-document-info">
                ${doc.title ? `<div>Title: ${doc.title}</div>` : ''}
                ${doc.author ? `<div>Author: ${doc.author}</div>` : ''}
                ${doc.pages} pages
              </div>
              <div class="pdftool-document-meta">
                <span class="pdftool-document-pages">${doc.pages} pages</span>
                <span class="pdftool-document-date">${doc.creationDate ? this.formatDate(doc.creationDate) : 'Unknown'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private renderDocuments(): string {
    if (this.props.documents.length === 0) {
      return '<div class="pdftool-empty">No PDF documents loaded. Click "Load PDF" to add documents.</div>';
    }
    
    return '';
  }

  private renderViewer(): string {
    if (!this.currentDocument) {
      return '<div class="pdftool-empty">No document selected. Choose a document from the sidebar.</div>';
    }
    
    const page = this.getPage(this.currentPage);
    if (!page) {
      return '<div class="pdftool-empty">Page not found.</div>';
    }
    
    return `
      <div class="pdftool-viewer">
        <div class="pdftool-viewer-header">
          <div class="pdftool-viewer-title">${this.currentDocument.name}</div>
          <div class="pdftool-viewer-controls">
            <span>Page ${this.currentPage} of ${this.currentDocument.pages}</span>
          </div>
        </div>
        <div class="pdftool-viewer-content">
          <div class="pdftool-page" style="transform: scale(${this.props.zoomLevel})">
            <div class="pdftool-page-content">
              ${this.renderPageContent(page)}
            </div>
            <div class="pdftool-page-number">${this.currentPage}</div>
          </div>
        </div>
      </div>
    `;
  }

  private renderPageContent(page: PDFPage): string {
    // Mock page content - in real implementation, this would render actual PDF content
    return `
      <h2>Sample PDF Content</h2>
      <p>This is a mock representation of page ${page.pageNumber} content.</p>
      <p>In a real implementation, this would display the actual PDF page content including text, images, and formatting.</p>
      <p>The page dimensions are ${page.width} x ${page.height} points.</p>
      ${page.textContent ? `<div class="extracted-text">${page.textContent}</div>` : ''}
    `;
  }

  private renderSearchResults(): string {
    if (this.searchResults.length === 0) {
      return '';
    }
    
    return `
      <div class="pdftool-search-results">
        <div class="pdftool-search-results-title">Search Results (${this.searchResults.length})</div>
        ${this.searchResults.map((result, index) => `
          <div class="pdftool-search-result" data-result-index="${index}">
            <div class="pdftool-search-result-header">
              <span>Page ${result.pageNumber}</span>
              <span class="pdftool-search-result-page">${result.matchIndex}/${result.totalMatches}</span>
            </div>
            <div class="pdftool-search-result-text">${result.text}</div>
            <div class="pdftool-search-result-context">${result.context}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderMetadata(): string {
    if (!this.currentDocument) {
      return '';
    }
    
    const doc = this.currentDocument;
    
    return `
      <div class="pdftool-metadata">
        <div class="pdftool-metadata-title">Document Metadata</div>
        <div class="pdftool-metadata-grid">
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Title</div>
            <div class="pdftool-metadata-value">${doc.title || 'Unknown'}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Author</div>
            <div class="pdftool-metadata-value">${doc.author || 'Unknown'}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Subject</div>
            <div class="pdftool-metadata-value">${doc.subject || 'Unknown'}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Creator</div>
            <div class="pdftool-metadata-value">${doc.creator || 'Unknown'}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Producer</div>
            <div class="pdftool-metadata-value">${doc.producer || 'Unknown'}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Pages</div>
            <div class="pdftool-metadata-value">${doc.pages}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Size</div>
            <div class="pdftool-metadata-value">${this.formatBytes(doc.size)}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Language</div>
            <div class="pdftool-metadata-value">${doc.language || 'Unknown'}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Created</div>
            <div class="pdftool-metadata-value">${doc.creationDate ? this.formatDate(doc.creationDate) : 'Unknown'}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Modified</div>
            <div class="pdftool-metadata-value">${doc.modificationDate ? this.formatDate(doc.modificationDate) : 'Unknown'}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Encrypted</div>
            <div class="pdftool-metadata-value">${doc.isEncrypted ? 'Yes' : 'No'}</div>
          </div>
          <div class="pdftool-metadata-item">
            <div class="pdftool-metadata-label">Password Protected</div>
            <div class="pdftool-metadata-value">${doc.isPasswordProtected ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>
    `;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  private setState(newState: string): void {
    if (this.props.state !== newState) {
      this.props.state = newState as any;
      this.updateStyles();
      this.render();
    }
  }

  private async performSearch(): Promise<void> {
    const searchInput = this.element?.querySelector('.pdftool-search-input') as HTMLInputElement;
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (!query || !this.currentDocument) return;
    
    this.searchQuery = query;
    this.props.searchQuery = query;
    
    try {
      this.setState('loading');
      const results = this.search(query);
      this.searchResults = results;
      this.props.searchResults = results;
      this.setState('success');
      this.events.search(query, results);
    } catch (error) {
      this.setState('error');
      console.error('Search error:', error);
    }
  }

  private extractText(): void {
    if (!this.currentDocument) return;
    
    const text = this.extractText();
    this.events.textExtract(text);
  }

  private extractTables(): void {
    if (!this.currentDocument) return;
    
    const tables = this.extractTables();
    this.events.tableExtract(tables);
  }

  private extractImages(): void {
    if (!this.currentDocument) return;
    
    const images = this.extractImages();
    this.events.imageExtract(images);
  }

  private refreshStats(): void {
    this.events.refresh();
    this.render();
  }

  // Public Methods
  public async loadDocument(file: File | string | ArrayBuffer): Promise<PDFDocument> {
    this.setState('loading');
    
    try {
      let data: ArrayBuffer;
      let name: string;
      
      if (file instanceof File) {
        data = await file.arrayBuffer();
        name = file.name;
      } else if (typeof file === 'string') {
        // URL or file path
        const response = await fetch(file);
        data = await response.arrayBuffer();
        name = file.split('/').pop() || 'document.pdf';
      } else {
        data = file;
        name = 'document.pdf';
      }
      
      // Mock PDF document creation
      const document: PDFDocument = {
        id: this.generateId(),
        name,
        size: data.byteLength,
        pages: Math.floor(Math.random() * 50) + 1,
        title: name.replace('.pdf', ''),
        author: 'Unknown Author',
        subject: 'PDF Document',
        creator: 'PDF Tool',
        producer: 'PDF Tool',
        creationDate: new Date(),
        modificationDate: new Date(),
        keywords: [],
        language: 'en',
        isEncrypted: false,
        isPasswordProtected: false,
        permissions: {
          print: true,
          modify: true,
          copy: true,
          addAnnotations: true,
          fillForms: true,
          extractForAccessibility: true,
          assemble: true,
          printHighRes: true
        },
        metadata: {},
        data
      };
      
      this.props.documents.push(document);
      this.currentDocument = document;
      this.props.currentDocument = document.id;
      this.currentPage = 1;
      this.props.currentPage = 1;
      
      this.setState('success');
      this.events.documentLoad(document);
      this.render();
      
      return document;
    } catch (error) {
      this.setState('error');
      throw error;
    }
  }

  public getDocument(id: string): PDFDocument | null {
    return this.props.documents.find(doc => doc.id === id) || null;
  }

  public getCurrentDocument(): PDFDocument | null {
    return this.currentDocument;
  }

  public setCurrentDocument(id: string): void {
    const document = this.getDocument(id);
    if (document) {
      this.currentDocument = document;
      this.props.currentDocument = id;
      this.currentPage = 1;
      this.props.currentPage = 1;
      this.events.documentChange(document);
      this.render();
    }
  }

  public getPage(pageNumber: number): PDFPage | null {
    if (!this.currentDocument) return null;
    
    // Mock page creation
    return {
      pageNumber,
      width: 612,
      height: 792,
      rotation: 0,
      textContent: `This is mock content for page ${pageNumber} of ${this.currentDocument.name}.`,
      images: [],
      annotations: [],
      bookmarks: []
    };
  }

  public getCurrentPage(): number {
    return this.currentPage;
  }

  public setCurrentPage(pageNumber: number): void {
    if (this.currentDocument && pageNumber >= 1 && pageNumber <= this.currentDocument.pages) {
      this.currentPage = pageNumber;
      this.props.currentPage = pageNumber;
      this.events.pageChange(pageNumber);
      this.render();
    }
  }

  public nextPage(): void {
    if (this.currentDocument) {
      this.setCurrentPage(this.currentPage + 1);
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.setCurrentPage(this.currentPage - 1);
    }
  }

  public search(query: string): PDFSearchResult[] {
    if (!this.currentDocument) return [];
    
    // Mock search results
    const results: PDFSearchResult[] = [];
    const totalPages = this.currentDocument.pages;
    const matchesPerPage = Math.floor(Math.random() * 3) + 1;
    
    for (let page = 1; page <= Math.min(totalPages, 5); page++) {
      for (let match = 1; match <= matchesPerPage; match++) {
        results.push({
          pageNumber: page,
          text: `Found "${query}" in page ${page}`,
          x: Math.random() * 500,
          y: Math.random() * 700,
          width: 100,
          height: 20,
          context: `This is the context around the search result for "${query}" on page ${page}.`,
          matchIndex: match,
          totalMatches: matchesPerPage
        });
      }
    }
    
    return results;
  }

  public extractText(pageNumbers?: number[]): string {
    if (!this.currentDocument) return '';
    
    const pages = pageNumbers || Array.from({ length: this.currentDocument.pages }, (_, i) => i + 1);
    let extractedText = '';
    
    pages.forEach(pageNum => {
      const page = this.getPage(pageNum);
      if (page) {
        extractedText += `Page ${pageNum}:\n${page.textContent}\n\n`;
      }
    });
    
    return extractedText;
  }

  public extractTables(pageNumbers?: number[]): PDFTable[] {
    if (!this.currentDocument) return [];
    
    // Mock table extraction
    const tables: PDFTable[] = [];
    const pages = pageNumbers || [this.currentPage];
    
    pages.forEach(pageNum => {
      tables.push({
        id: `table-${pageNum}-1`,
        pageNumber: pageNum,
        x: 50,
        y: 100,
        width: 500,
        height: 200,
        rows: 3,
        columns: 3,
        data: [
          ['Header 1', 'Header 2', 'Header 3'],
          ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
          ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
        ],
        headers: ['Header 1', 'Header 2', 'Header 3']
      });
    });
    
    return tables;
  }

  public extractImages(pageNumbers?: number[]): PDFImage[] {
    if (!this.currentDocument) return [];
    
    // Mock image extraction
    const images: PDFImage[] = [];
    const pages = pageNumbers || [this.currentPage];
    
    pages.forEach(pageNum => {
      images.push({
        id: `image-${pageNum}-1`,
        pageNumber: pageNum,
        x: 100,
        y: 200,
        width: 200,
        height: 150,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        format: 'PNG',
        compression: 'FlateDecode',
        colorspace: 'DeviceRGB'
      });
    });
    
    return images;
  }

  public addAnnotation(annotation: Omit<PDFAnnotation, 'id'>): void {
    const newAnnotation: PDFAnnotation = {
      ...annotation,
      id: this.generateId()
    };
    
    this.events.annotationAdd(newAnnotation);
  }

  public removeAnnotation(annotationId: string): void {
    // Implementation would remove annotation from current page
  }

  public getAnnotations(pageNumber?: number): PDFAnnotation[] {
    // Mock annotations
    return [];
  }

  public getBookmarks(): PDFBookmark[] {
    if (!this.currentDocument) return [];
    
    // Mock bookmarks
    return [
      {
        id: 'bookmark-1',
        title: 'Chapter 1',
        pageNumber: 1,
        level: 1,
        children: []
      },
      {
        id: 'bookmark-2',
        title: 'Chapter 2',
        pageNumber: 5,
        level: 1,
        children: []
      }
    ];
  }

  public setZoom(level: number): void {
    this.props.zoomLevel = Math.max(0.1, Math.min(3.0, level));
    this.render();
  }

  public getZoom(): number {
    return this.props.zoomLevel;
  }

  public setPageMode(mode: 'single' | 'continuous' | 'two-page'): void {
    this.props.pageMode = mode;
    this.render();
  }

  public getPageMode(): 'single' | 'continuous' | 'two-page' {
    return this.props.pageMode;
  }

  public exportDocument(format: 'pdf' | 'text' | 'html' | 'json'): string {
    if (!this.currentDocument) return '';
    
    switch (format) {
      case 'text':
        return this.extractText();
      case 'html':
        return this.exportToHTML();
      case 'json':
        return JSON.stringify(this.currentDocument, null, 2);
      default:
        return '';
    }
  }

  private exportToHTML(): string {
    if (!this.currentDocument) return '';
    
    return `
      <html>
        <head>
          <title>${this.currentDocument.title || this.currentDocument.name}</title>
        </head>
        <body>
          <h1>${this.currentDocument.title || this.currentDocument.name}</h1>
          <p>Author: ${this.currentDocument.author || 'Unknown'}</p>
          <p>Pages: ${this.currentDocument.pages}</p>
          <div class="content">
            ${this.extractText()}
          </div>
        </body>
      </html>
    `;
  }

  public exportPage(pageNumber: number, format: 'image' | 'text' | 'json'): string {
    const page = this.getPage(pageNumber);
    if (!page) return '';
    
    switch (format) {
      case 'text':
        return page.textContent;
      case 'json':
        return JSON.stringify(page, null, 2);
      default:
        return '';
    }
  }

  public getDocumentStats(): {
    totalDocuments: number;
    totalPages: number;
    totalSize: number;
    averagePages: number;
    averageSize: number;
  } {
    const totalPages = this.props.documents.reduce((sum, doc) => sum + doc.pages, 0);
    const totalSize = this.props.documents.reduce((sum, doc) => sum + doc.size, 0);
    
    return {
      totalDocuments: this.props.documents.length,
      totalPages,
      totalSize,
      averagePages: this.props.documents.length > 0 ? totalPages / this.props.documents.length : 0,
      averageSize: this.props.documents.length > 0 ? totalSize / this.props.documents.length : 0
    };
  }

  public validateDocument(document: PDFDocument): boolean {
    return document.id && document.name && document.pages > 0 && document.size > 0;
  }

  public getDocumentInfo(document: PDFDocument): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    info: Record<string, any>;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!document.id) errors.push('Missing document ID');
    if (!document.name) errors.push('Missing document name');
    if (document.pages <= 0) errors.push('Invalid page count');
    if (document.size <= 0) errors.push('Invalid file size');
    
    if (document.isEncrypted) warnings.push('Document is encrypted');
    if (document.isPasswordProtected) warnings.push('Document is password protected');
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      info: {
        id: document.id,
        name: document.name,
        pages: document.pages,
        size: document.size,
        encrypted: document.isEncrypted,
        passwordProtected: document.isPasswordProtected
      }
    };
  }

  // DOM Methods
  public mount(container: HTMLElement): void {
    if (this.element && container) {
      container.appendChild(this.element);
    }
  }

  public unmount(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  public updateProps(newProps: Partial<PDFToolProps>): void {
    this.props = { ...this.props, ...newProps };
    this.updateStyles();
    this.render();
  }

  public getElement(): HTMLElement | null {
    return this.element;
  }

  public destroy(): void {
    this.unmount();
    this.element = null;
  }
}
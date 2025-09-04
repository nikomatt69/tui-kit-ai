import { PDFToolVariant, PDFToolState } from './PDFTool.types';

// PDF Tool Style Configuration
export interface PDFToolStyleConfig {
  variant: PDFToolVariant;
  state: PDFToolState;
  width: number;
  height: number;
  theme: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    foreground: string;
    border: string;
    accent: string;
    info: string;
  };
}

// Generate PDF Tool Styles
export function generatePDFToolStyles(config: PDFToolStyleConfig): string {
  const { variant, state, width, height, theme } = config;
  
  const styles: string[] = [];
  
  // Base container styles
  styles.push(`
    .pdftool-container {
      width: ${width}ch;
      height: ${height}em;
      background: ${theme.background};
      color: ${theme.foreground};
      border: 1px solid ${theme.border};
      border-radius: 6px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }
  `);
  
  // Variant-specific styles
  switch (variant) {
    case 'compact':
      styles.push(`
        .pdftool-container.compact {
          height: auto;
          min-height: 4em;
          padding: 0.5em;
        }
        .pdftool-container.compact .pdftool-header {
          padding: 0.25em 0.5em;
          font-size: 0.8em;
        }
        .pdftool-container.compact .pdftool-content {
          padding: 0.25em 0.5em;
          font-size: 0.9em;
        }
        .pdftool-container.compact .pdftool-documents {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.5em;
        }
      `);
      break;
      
    case 'detailed':
      styles.push(`
        .pdftool-container.detailed {
          border: 2px solid ${theme.border};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .pdftool-container.detailed .pdftool-header {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${theme.border};
        }
        .pdftool-container.detailed .pdftool-footer {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-top: 1px solid ${theme.border};
        }
        .pdftool-container.detailed .pdftool-sidebar {
          display: block;
        }
        .pdftool-container.detailed .pdftool-metadata {
          display: block;
        }
      `);
      break;
      
    case 'minimal':
      styles.push(`
        .pdftool-container.minimal {
          border: none;
          background: transparent;
          border-radius: 0;
        }
        .pdftool-container.minimal .pdftool-header,
        .pdftool-container.minimal .pdftool-footer {
          display: none;
        }
        .pdftool-container.minimal .pdftool-documents {
          grid-template-columns: 1fr;
        }
      `);
      break;
      
    case 'expanded':
      styles.push(`
        .pdftool-container.expanded {
          height: auto;
          min-height: 30em;
        }
        .pdftool-container.expanded .pdftool-content {
          flex: 1;
          overflow-y: auto;
        }
        .pdftool-container.expanded .pdftool-sidebar {
          display: block;
        }
        .pdftool-container.expanded .pdftool-metadata {
          display: block;
        }
        .pdftool-container.expanded .pdftool-viewer {
          display: block;
        }
      `);
      break;
  }
  
  // State-specific styles
  switch (state) {
    case 'loading':
      styles.push(`
        .pdftool-container.loading {
          border-color: ${theme.warning};
        }
        .pdftool-container.loading .pdftool-content {
          opacity: 0.6;
        }
        .pdftool-container.loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border: 2px solid ${theme.warning};
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `);
      break;
      
    case 'error':
      styles.push(`
        .pdftool-container.error {
          border-color: ${theme.error};
          background: ${theme.error}11;
        }
        .pdftool-container.error .pdftool-status {
          color: ${theme.error};
        }
        .pdftool-container.error .pdftool-status::after {
          content: ' ❌';
        }
      `);
      break;
      
    case 'success':
      styles.push(`
        .pdftool-container.success {
          border-color: ${theme.success};
        }
        .pdftool-container.success .pdftool-status {
          color: ${theme.success};
        }
        .pdftool-container.success .pdftool-status::after {
          content: ' ✅';
        }
      `);
      break;
      
    case 'focused':
      styles.push(`
        .pdftool-container.focused {
          border-color: ${theme.primary};
          box-shadow: 0 0 15px ${theme.primary}44;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }
      `);
      break;
      
    case 'disabled':
      styles.push(`
        .pdftool-container.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        .pdftool-container.disabled .pdftool-status {
          color: ${theme.foreground}66;
        }
        .pdftool-container.disabled .pdftool-status::after {
          content: ' 🚫';
        }
      `);
      break;
  }
  
  // Header styles
  styles.push(`
    .pdftool-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75em 1em;
      background: ${theme.background}dd;
      border-bottom: 1px solid ${theme.border};
      font-size: 0.9em;
    }
    .pdftool-title {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-weight: 600;
      color: ${theme.primary};
    }
    .pdftool-status {
      font-size: 0.8em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pdftool-actions {
      display: flex;
      gap: 0.5em;
    }
    .pdftool-action {
      background: none;
      border: none;
      color: ${theme.foreground};
      cursor: pointer;
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.8em;
      transition: all 0.2s ease;
    }
    .pdftool-action:hover {
      background: ${theme.primary}22;
      color: ${theme.primary};
    }
    .pdftool-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `);
  
  // Toolbar styles
  styles.push(`
    .pdftool-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em 1em;
      background: ${theme.background}88;
      border-bottom: 1px solid ${theme.border};
      font-size: 0.8em;
    }
    .pdftool-toolbar-left {
      display: flex;
      gap: 0.5em;
      align-items: center;
    }
    .pdftool-toolbar-right {
      display: flex;
      gap: 0.5em;
      align-items: center;
    }
    .pdftool-button {
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-family: inherit;
      font-size: 0.8em;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .pdftool-button:hover {
      background: ${theme.primary}22;
      border-color: ${theme.primary};
    }
    .pdftool-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pdftool-input {
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-family: inherit;
      font-size: 0.8em;
    }
    .pdftool-input:focus {
      outline: none;
      border-color: ${theme.primary};
    }
    .pdftool-select {
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-family: inherit;
      font-size: 0.8em;
    }
    .pdftool-select:focus {
      outline: none;
      border-color: ${theme.primary};
    }
  `);
  
  // Content styles
  styles.push(`
    .pdftool-content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    .pdftool-sidebar {
      display: none;
      width: 250px;
      background: ${theme.background}88;
      border-right: 1px solid ${theme.border};
      overflow-y: auto;
    }
    .pdftool-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .pdftool-documents {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1em;
      padding: 1em;
      overflow-y: auto;
    }
    .pdftool-document {
      background: ${theme.background}88;
      border: 1px solid ${theme.border};
      border-radius: 6px;
      padding: 1em;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .pdftool-document:hover {
      background: ${theme.primary}11;
      border-color: ${theme.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .pdftool-document.active {
      background: ${theme.primary}22;
      border-color: ${theme.primary};
      box-shadow: 0 0 10px ${theme.primary}33;
    }
    .pdftool-document-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5em;
    }
    .pdftool-document-name {
      font-weight: 600;
      color: ${theme.primary};
      font-size: 0.9em;
      line-height: 1.3;
    }
    .pdftool-document-size {
      background: ${theme.secondary}22;
      color: ${theme.secondary};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pdftool-document-info {
      font-size: 0.8em;
      color: ${theme.foreground}88;
      margin-bottom: 0.5em;
    }
    .pdftool-document-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.7em;
      color: ${theme.foreground}66;
    }
    .pdftool-document-pages {
      color: ${theme.accent};
      font-weight: 500;
    }
    .pdftool-document-date {
      color: ${theme.info};
    }
  `);
  
  // Viewer styles
  styles.push(`
    .pdftool-viewer {
      display: none;
      flex: 1;
      background: ${theme.background};
      border: 1px solid ${theme.border};
      border-radius: 4px;
      margin: 1em;
      overflow: hidden;
      position: relative;
    }
    .pdftool-viewer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em 1em;
      background: ${theme.background}88;
      border-bottom: 1px solid ${theme.border};
      font-size: 0.8em;
    }
    .pdftool-viewer-title {
      font-weight: 600;
      color: ${theme.primary};
    }
    .pdftool-viewer-controls {
      display: flex;
      gap: 0.5em;
      align-items: center;
    }
    .pdftool-viewer-content {
      flex: 1;
      overflow: auto;
      padding: 1em;
      background: ${theme.background};
    }
    .pdftool-page {
      background: white;
      border: 1px solid ${theme.border};
      border-radius: 4px;
      margin: 0 auto 1em auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
    }
    .pdftool-page-content {
      padding: 1em;
      font-family: 'Times New Roman', serif;
      line-height: 1.6;
      color: #333;
    }
    .pdftool-page-number {
      position: absolute;
      bottom: 0.5em;
      right: 0.5em;
      background: ${theme.background}dd;
      color: ${theme.foreground};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.7em;
    }
  `);
  
  // Search results styles
  styles.push(`
    .pdftool-search-results {
      padding: 1em;
      border-top: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .pdftool-search-results-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .pdftool-search-result {
      background: ${theme.background}66;
      border: 1px solid ${theme.border};
      border-radius: 3px;
      padding: 0.75em;
      margin-bottom: 0.5em;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .pdftool-search-result:hover {
      background: ${theme.primary}11;
      border-color: ${theme.primary};
    }
    .pdftool-search-result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25em;
    }
    .pdftool-search-result-page {
      background: ${theme.accent}22;
      color: ${theme.accent};
      padding: 0.125em 0.375em;
      border-radius: 2px;
      font-size: 0.7em;
      font-weight: 500;
    }
    .pdftool-search-result-text {
      font-size: 0.8em;
      color: ${theme.foreground};
      margin-bottom: 0.25em;
    }
    .pdftool-search-result-context {
      font-size: 0.7em;
      color: ${theme.foreground}88;
      font-style: italic;
    }
  `);
  
  // Metadata styles
  styles.push(`
    .pdftool-metadata {
      display: none;
      padding: 1em;
      border-top: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .pdftool-metadata-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .pdftool-metadata-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5em;
    }
    .pdftool-metadata-item {
      display: flex;
      flex-direction: column;
      padding: 0.5em;
      background: ${theme.background}66;
      border-radius: 3px;
      font-size: 0.8em;
    }
    .pdftool-metadata-label {
      color: ${theme.foreground}88;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25em;
    }
    .pdftool-metadata-value {
      color: ${theme.foreground};
      font-weight: 500;
    }
  `);
  
  // Footer styles
  styles.push(`
    .pdftool-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em 1em;
      background: ${theme.background}dd;
      border-top: 1px solid ${theme.border};
      font-size: 0.8em;
      color: ${theme.foreground}88;
    }
    .pdftool-footer-info {
      display: flex;
      gap: 1em;
    }
    .pdftool-footer-info-item {
      display: flex;
      align-items: center;
      gap: 0.25em;
    }
    .pdftool-footer-actions {
      display: flex;
      gap: 0.5em;
    }
  `);
  
  // Scrollbar styles
  styles.push(`
    .pdftool-sidebar::-webkit-scrollbar,
    .pdftool-documents::-webkit-scrollbar,
    .pdftool-viewer-content::-webkit-scrollbar {
      width: 6px;
    }
    .pdftool-sidebar::-webkit-scrollbar-track,
    .pdftool-documents::-webkit-scrollbar-track,
    .pdftool-viewer-content::-webkit-scrollbar-track {
      background: ${theme.background};
    }
    .pdftool-sidebar::-webkit-scrollbar-thumb,
    .pdftool-documents::-webkit-scrollbar-thumb,
    .pdftool-viewer-content::-webkit-scrollbar-thumb {
      background: ${theme.border};
      border-radius: 3px;
    }
    .pdftool-sidebar::-webkit-scrollbar-thumb:hover,
    .pdftool-documents::-webkit-scrollbar-thumb:hover,
    .pdftool-viewer-content::-webkit-scrollbar-thumb:hover {
      background: ${theme.primary};
    }
  `);
  
  return styles.join('\n');
}

// Get variant-specific class names
export function getPDFToolVariantClass(variant: PDFToolVariant): string {
  return `pdftool-${variant}`;
}

// Get state-specific class names
export function getPDFToolStateClass(state: PDFToolState): string {
  return `pdftool-${state}`;
}

// Generate responsive styles
export function generateResponsivePDFToolStyles(): string {
  return `
    @media (max-width: 768px) {
      .pdftool-container {
        width: 100%;
        height: auto;
        min-height: 200px;
      }
      .pdftool-content {
        flex-direction: column;
      }
      .pdftool-sidebar {
        width: 100%;
        height: 200px;
        border-right: none;
        border-bottom: 1px solid ${theme.border};
      }
      .pdftool-documents {
        grid-template-columns: 1fr;
        gap: 0.5em;
      }
      .pdftool-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5em;
      }
      .pdftool-footer {
        flex-direction: column;
        gap: 0.5em;
      }
      .pdftool-toolbar {
        flex-direction: column;
        gap: 0.5em;
      }
      .pdftool-toolbar-left,
      .pdftool-toolbar-right {
        width: 100%;
        justify-content: center;
      }
    }
    
    @media (max-width: 480px) {
      .pdftool-container {
        padding: 0.5em;
        font-size: 0.8em;
      }
      .pdftool-content {
        padding: 0.5em;
      }
      .pdftool-document {
        padding: 0.75em;
      }
      .pdftool-document-name {
        font-size: 0.8em;
      }
      .pdftool-document-info {
        font-size: 0.7em;
      }
      .pdftool-metadata-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}
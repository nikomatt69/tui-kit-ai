import { WebSearchToolVariant, WebSearchToolState, SearchEngine, SearchResultType } from './WebSearchTool.types';

// Web Search Tool Style Configuration
export interface WebSearchToolStyleConfig {
  variant: WebSearchToolVariant;
  state: WebSearchToolState;
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

// Generate Web Search Tool Styles
export function generateWebSearchToolStyles(config: WebSearchToolStyleConfig): string {
  const { variant, state, width, height, theme } = config;
  
  const styles: string[] = [];
  
  // Base container styles
  styles.push(`
    .websearchtool-container {
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
        .websearchtool-container.compact {
          height: auto;
          min-height: 4em;
          padding: 0.5em;
        }
        .websearchtool-container.compact .websearchtool-header {
          padding: 0.25em 0.5em;
          font-size: 0.8em;
        }
        .websearchtool-container.compact .websearchtool-content {
          padding: 0.25em 0.5em;
          font-size: 0.9em;
        }
        .websearchtool-container.compact .websearchtool-results {
          grid-template-columns: 1fr;
          gap: 0.5em;
        }
      `);
      break;
      
    case 'detailed':
      styles.push(`
        .websearchtool-container.detailed {
          border: 2px solid ${theme.border};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .websearchtool-container.detailed .websearchtool-header {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${theme.border};
        }
        .websearchtool-container.detailed .websearchtool-footer {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-top: 1px solid ${theme.border};
        }
        .websearchtool-container.detailed .websearchtool-filters {
          display: block;
        }
        .websearchtool-container.detailed .websearchtool-history {
          display: block;
        }
      `);
      break;
      
    case 'minimal':
      styles.push(`
        .websearchtool-container.minimal {
          border: none;
          background: transparent;
          border-radius: 0;
        }
        .websearchtool-container.minimal .websearchtool-header,
        .websearchtool-container.minimal .websearchtool-footer {
          display: none;
        }
        .websearchtool-container.minimal .websearchtool-results {
          grid-template-columns: 1fr;
        }
      `);
      break;
      
    case 'expanded':
      styles.push(`
        .websearchtool-container.expanded {
          height: auto;
          min-height: 30em;
        }
        .websearchtool-container.expanded .websearchtool-content {
          flex: 1;
          overflow-y: auto;
        }
        .websearchtool-container.expanded .websearchtool-filters {
          display: block;
        }
        .websearchtool-container.expanded .websearchtool-history {
          display: block;
        }
        .websearchtool-container.expanded .websearchtool-stats {
          display: block;
        }
      `);
      break;
  }
  
  // State-specific styles
  switch (state) {
    case 'loading':
      styles.push(`
        .websearchtool-container.loading {
          border-color: ${theme.warning};
        }
        .websearchtool-container.loading .websearchtool-content {
          opacity: 0.6;
        }
        .websearchtool-container.loading::after {
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
        .websearchtool-container.error {
          border-color: ${theme.error};
          background: ${theme.error}11;
        }
        .websearchtool-container.error .websearchtool-status {
          color: ${theme.error};
        }
        .websearchtool-container.error .websearchtool-status::after {
          content: ' ❌';
        }
      `);
      break;
      
    case 'success':
      styles.push(`
        .websearchtool-container.success {
          border-color: ${theme.success};
        }
        .websearchtool-container.success .websearchtool-status {
          color: ${theme.success};
        }
        .websearchtool-container.success .websearchtool-status::after {
          content: ' ✅';
        }
      `);
      break;
      
    case 'focused':
      styles.push(`
        .websearchtool-container.focused {
          border-color: ${theme.primary};
          box-shadow: 0 0 15px ${theme.primary}44;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }
      `);
      break;
      
    case 'disabled':
      styles.push(`
        .websearchtool-container.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        .websearchtool-container.disabled .websearchtool-status {
          color: ${theme.foreground}66;
        }
        .websearchtool-container.disabled .websearchtool-status::after {
          content: ' 🚫';
        }
      `);
      break;
  }
  
  // Header styles
  styles.push(`
    .websearchtool-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75em 1em;
      background: ${theme.background}dd;
      border-bottom: 1px solid ${theme.border};
      font-size: 0.9em;
    }
    .websearchtool-title {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-weight: 600;
      color: ${theme.primary};
    }
    .websearchtool-status {
      font-size: 0.8em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .websearchtool-actions {
      display: flex;
      gap: 0.5em;
    }
    .websearchtool-action {
      background: none;
      border: none;
      color: ${theme.foreground};
      cursor: pointer;
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.8em;
      transition: all 0.2s ease;
    }
    .websearchtool-action:hover {
      background: ${theme.primary}22;
      color: ${theme.primary};
    }
    .websearchtool-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `);
  
  // Search bar styles
  styles.push(`
    .websearchtool-search {
      padding: 0.75em 1em;
      border-bottom: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .websearchtool-search-bar {
      display: flex;
      gap: 0.5em;
      align-items: center;
    }
    .websearchtool-search-input {
      flex: 1;
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.75em 1em;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.9em;
    }
    .websearchtool-search-input:focus {
      outline: none;
      border-color: ${theme.primary};
      box-shadow: 0 0 5px ${theme.primary}33;
    }
    .websearchtool-search-input::placeholder {
      color: ${theme.foreground}66;
    }
    .websearchtool-search-button {
      background: ${theme.primary};
      color: ${theme.background};
      border: none;
      padding: 0.75em 1.5em;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.9em;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .websearchtool-search-button:hover {
      background: ${theme.primary}dd;
      transform: translateY(-1px);
    }
    .websearchtool-search-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .websearchtool-search-options {
      display: flex;
      gap: 0.5em;
      margin-top: 0.5em;
    }
    .websearchtool-search-select {
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.5em;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.8em;
    }
    .websearchtool-search-select:focus {
      outline: none;
      border-color: ${theme.primary};
    }
  `);
  
  // Filters styles
  styles.push(`
    .websearchtool-filters {
      display: none;
      padding: 0.5em 1em;
      border-bottom: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .websearchtool-filters-title {
      font-size: 0.8em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .websearchtool-filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.5em;
    }
    .websearchtool-filter {
      display: flex;
      flex-direction: column;
      gap: 0.25em;
    }
    .websearchtool-filter-label {
      font-size: 0.7em;
      color: ${theme.foreground}88;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .websearchtool-filter-select {
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-family: inherit;
      font-size: 0.8em;
    }
    .websearchtool-filter-select:focus {
      outline: none;
      border-color: ${theme.primary};
    }
    .websearchtool-filter-checkbox {
      display: flex;
      align-items: center;
      gap: 0.25em;
      font-size: 0.8em;
    }
    .websearchtool-filter-checkbox input {
      accent-color: ${theme.primary};
    }
  `);
  
  // Content styles
  styles.push(`
    .websearchtool-content {
      flex: 1;
      padding: 1em;
      overflow-y: auto;
    }
    .websearchtool-results {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1em;
    }
    .websearchtool-result {
      background: ${theme.background}88;
      border: 1px solid ${theme.border};
      border-radius: 6px;
      padding: 1em;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .websearchtool-result:hover {
      background: ${theme.primary}11;
      border-color: ${theme.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .websearchtool-result-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5em;
    }
    .websearchtool-result-title {
      font-weight: 600;
      color: ${theme.primary};
      font-size: 0.9em;
      line-height: 1.3;
    }
    .websearchtool-result-type {
      background: ${theme.secondary}22;
      color: ${theme.secondary};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .websearchtool-result-description {
      font-size: 0.8em;
      color: ${theme.foreground}88;
      margin-bottom: 0.5em;
      line-height: 1.4;
    }
    .websearchtool-result-snippet {
      font-size: 0.8em;
      color: ${theme.foreground};
      margin-bottom: 0.5em;
      line-height: 1.4;
      font-style: italic;
    }
    .websearchtool-result-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.7em;
      color: ${theme.foreground}66;
    }
    .websearchtool-result-domain {
      color: ${theme.accent};
      font-weight: 500;
    }
    .websearchtool-result-date {
      color: ${theme.info};
    }
    .websearchtool-result-score {
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      background: ${theme.primary}22;
      color: ${theme.primary};
      padding: 0.125em 0.375em;
      border-radius: 2px;
      font-size: 0.7em;
      font-weight: 500;
    }
  `);
  
  // History styles
  styles.push(`
    .websearchtool-history {
      display: none;
      padding: 1em;
      border-top: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .websearchtool-history-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .websearchtool-history-list {
      max-height: 200px;
      overflow-y: auto;
    }
    .websearchtool-history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em;
      background: ${theme.background}66;
      border-radius: 3px;
      margin-bottom: 0.25em;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .websearchtool-history-item:hover {
      background: ${theme.primary}11;
    }
    .websearchtool-history-query {
      font-size: 0.8em;
      color: ${theme.foreground};
      font-weight: 500;
    }
    .websearchtool-history-meta {
      display: flex;
      gap: 0.5em;
      font-size: 0.7em;
      color: ${theme.foreground}66;
    }
    .websearchtool-history-engine {
      color: ${theme.secondary};
    }
    .websearchtool-history-date {
      color: ${theme.info};
    }
    .websearchtool-history-count {
      color: ${theme.accent};
    }
  `);
  
  // Stats styles
  styles.push(`
    .websearchtool-stats {
      display: none;
      padding: 1em;
      border-top: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .websearchtool-stats-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .websearchtool-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 0.5em;
    }
    .websearchtool-stat {
      background: ${theme.background}66;
      border-radius: 3px;
      padding: 0.5em;
      text-align: center;
    }
    .websearchtool-stat-value {
      font-size: 1.2em;
      font-weight: bold;
      color: ${theme.primary};
    }
    .websearchtool-stat-label {
      font-size: 0.7em;
      color: ${theme.foreground}88;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `);
  
  // Footer styles
  styles.push(`
    .websearchtool-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em 1em;
      background: ${theme.background}dd;
      border-top: 1px solid ${theme.border};
      font-size: 0.8em;
      color: ${theme.foreground}88;
    }
    .websearchtool-footer-info {
      display: flex;
      gap: 1em;
    }
    .websearchtool-footer-info-item {
      display: flex;
      align-items: center;
      gap: 0.25em;
    }
    .websearchtool-footer-actions {
      display: flex;
      gap: 0.5em;
    }
  `);
  
  // Scrollbar styles
  styles.push(`
    .websearchtool-content::-webkit-scrollbar,
    .websearchtool-history-list::-webkit-scrollbar {
      width: 6px;
    }
    .websearchtool-content::-webkit-scrollbar-track,
    .websearchtool-history-list::-webkit-scrollbar-track {
      background: ${theme.background};
    }
    .websearchtool-content::-webkit-scrollbar-thumb,
    .websearchtool-history-list::-webkit-scrollbar-thumb {
      background: ${theme.border};
      border-radius: 3px;
    }
    .websearchtool-content::-webkit-scrollbar-thumb:hover,
    .websearchtool-history-list::-webkit-scrollbar-thumb:hover {
      background: ${theme.primary};
    }
  `);
  
  return styles.join('\n');
}

// Get variant-specific class names
export function getWebSearchToolVariantClass(variant: WebSearchToolVariant): string {
  return `websearchtool-${variant}`;
}

// Get state-specific class names
export function getWebSearchToolStateClass(state: WebSearchToolState): string {
  return `websearchtool-${state}`;
}

// Get engine-specific class names
export function getEngineClass(engine: SearchEngine): string {
  return `engine-${engine}`;
}

// Get result type-specific class names
export function getResultTypeClass(type: SearchResultType): string {
  return `result-type-${type}`;
}

// Generate responsive styles
export function generateResponsiveWebSearchToolStyles(): string {
  return `
    @media (max-width: 768px) {
      .websearchtool-container {
        width: 100%;
        height: auto;
        min-height: 200px;
      }
      .websearchtool-results {
        grid-template-columns: 1fr;
        gap: 0.5em;
      }
      .websearchtool-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5em;
      }
      .websearchtool-footer {
        flex-direction: column;
        gap: 0.5em;
      }
      .websearchtool-search-bar {
        flex-direction: column;
        gap: 0.5em;
      }
      .websearchtool-search-options {
        flex-direction: column;
        gap: 0.25em;
      }
      .websearchtool-filters-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .websearchtool-container {
        padding: 0.5em;
        font-size: 0.8em;
      }
      .websearchtool-content {
        padding: 0.5em;
      }
      .websearchtool-result {
        padding: 0.75em;
      }
      .websearchtool-result-title {
        font-size: 0.8em;
      }
      .websearchtool-result-description {
        font-size: 0.7em;
      }
      .websearchtool-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;
}
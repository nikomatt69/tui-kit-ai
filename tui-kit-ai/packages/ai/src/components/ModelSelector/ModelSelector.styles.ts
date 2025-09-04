import { ModelSelectorVariant, ModelSelectorState, Provider, Capability, PerformanceLevel, Availability } from './ModelSelector.types';

// Model Selector Style Configuration
export interface ModelSelectorStyleConfig {
  variant: ModelSelectorVariant;
  state: ModelSelectorState;
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

// Generate Model Selector Styles
export function generateModelSelectorStyles(config: ModelSelectorStyleConfig): string {
  const { variant, state, width, height, theme } = config;
  
  const styles: string[] = [];
  
  // Base container styles
  styles.push(`
    .modelselector-container {
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
        .modelselector-container.compact {
          height: auto;
          min-height: 4em;
          padding: 0.5em;
        }
        .modelselector-container.compact .modelselector-header {
          padding: 0.25em 0.5em;
          font-size: 0.8em;
        }
        .modelselector-container.compact .modelselector-content {
          padding: 0.25em 0.5em;
          font-size: 0.9em;
        }
        .modelselector-container.compact .modelselector-models {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.5em;
        }
      `);
      break;
      
    case 'detailed':
      styles.push(`
        .modelselector-container.detailed {
          border: 2px solid ${theme.border};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .modelselector-container.detailed .modelselector-header {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${theme.border};
        }
        .modelselector-container.detailed .modelselector-footer {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-top: 1px solid ${theme.border};
        }
        .modelselector-container.detailed .modelselector-filters {
          display: block;
        }
        .modelselector-container.detailed .modelselector-comparison {
          display: block;
        }
      `);
      break;
      
    case 'minimal':
      styles.push(`
        .modelselector-container.minimal {
          border: none;
          background: transparent;
          border-radius: 0;
        }
        .modelselector-container.minimal .modelselector-header,
        .modelselector-container.minimal .modelselector-footer {
          display: none;
        }
        .modelselector-container.minimal .modelselector-models {
          grid-template-columns: repeat(2, 1fr);
        }
      `);
      break;
      
    case 'expanded':
      styles.push(`
        .modelselector-container.expanded {
          height: auto;
          min-height: 30em;
        }
        .modelselector-container.expanded .modelselector-content {
          flex: 1;
          overflow-y: auto;
        }
        .modelselector-container.expanded .modelselector-filters {
          display: block;
        }
        .modelselector-container.expanded .modelselector-comparison {
          display: block;
        }
        .modelselector-container.expanded .modelselector-details {
          display: block;
        }
      `);
      break;
  }
  
  // State-specific styles
  switch (state) {
    case 'loading':
      styles.push(`
        .modelselector-container.loading {
          border-color: ${theme.warning};
        }
        .modelselector-container.loading .modelselector-content {
          opacity: 0.6;
        }
        .modelselector-container.loading::after {
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
        .modelselector-container.error {
          border-color: ${theme.error};
          background: ${theme.error}11;
        }
        .modelselector-container.error .modelselector-status {
          color: ${theme.error};
        }
        .modelselector-container.error .modelselector-status::after {
          content: ' ❌';
        }
      `);
      break;
      
    case 'success':
      styles.push(`
        .modelselector-container.success {
          border-color: ${theme.success};
        }
        .modelselector-container.success .modelselector-status {
          color: ${theme.success};
        }
        .modelselector-container.success .modelselector-status::after {
          content: ' ✅';
        }
      `);
      break;
      
    case 'focused':
      styles.push(`
        .modelselector-container.focused {
          border-color: ${theme.primary};
          box-shadow: 0 0 15px ${theme.primary}44;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }
      `);
      break;
      
    case 'disabled':
      styles.push(`
        .modelselector-container.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        .modelselector-container.disabled .modelselector-status {
          color: ${theme.foreground}66;
        }
        .modelselector-container.disabled .modelselector-status::after {
          content: ' 🚫';
        }
      `);
      break;
  }
  
  // Header styles
  styles.push(`
    .modelselector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75em 1em;
      background: ${theme.background}dd;
      border-bottom: 1px solid ${theme.border};
      font-size: 0.9em;
    }
    .modelselector-title {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-weight: 600;
      color: ${theme.primary};
    }
    .modelselector-status {
      font-size: 0.8em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .modelselector-actions {
      display: flex;
      gap: 0.5em;
    }
    .modelselector-action {
      background: none;
      border: none;
      color: ${theme.foreground};
      cursor: pointer;
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.8em;
      transition: all 0.2s ease;
    }
    .modelselector-action:hover {
      background: ${theme.primary}22;
      color: ${theme.primary};
    }
    .modelselector-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `);
  
  // Search styles
  styles.push(`
    .modelselector-search {
      padding: 0.5em 1em;
      border-bottom: 1px solid ${theme.border};
    }
    .modelselector-search-input {
      width: 100%;
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.5em;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.9em;
    }
    .modelselector-search-input:focus {
      outline: none;
      border-color: ${theme.primary};
      box-shadow: 0 0 5px ${theme.primary}33;
    }
    .modelselector-search-input::placeholder {
      color: ${theme.foreground}66;
    }
  `);
  
  // Filters styles
  styles.push(`
    .modelselector-filters {
      display: none;
      padding: 0.5em 1em;
      border-bottom: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .modelselector-filters-title {
      font-size: 0.8em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .modelselector-filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.5em;
    }
    .modelselector-filter {
      display: flex;
      flex-direction: column;
      gap: 0.25em;
    }
    .modelselector-filter-label {
      font-size: 0.7em;
      color: ${theme.foreground}88;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .modelselector-filter-select {
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-family: inherit;
      font-size: 0.8em;
    }
    .modelselector-filter-select:focus {
      outline: none;
      border-color: ${theme.primary};
    }
    .modelselector-filter-checkbox {
      display: flex;
      align-items: center;
      gap: 0.25em;
      font-size: 0.8em;
    }
    .modelselector-filter-checkbox input {
      accent-color: ${theme.primary};
    }
  `);
  
  // Content styles
  styles.push(`
    .modelselector-content {
      flex: 1;
      padding: 1em;
      overflow-y: auto;
    }
    .modelselector-models {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1em;
    }
    .modelselector-model {
      background: ${theme.background}88;
      border: 1px solid ${theme.border};
      border-radius: 6px;
      padding: 1em;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .modelselector-model:hover {
      background: ${theme.primary}11;
      border-color: ${theme.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .modelselector-model.selected {
      background: ${theme.primary}22;
      border-color: ${theme.primary};
      box-shadow: 0 0 10px ${theme.primary}33;
    }
    .modelselector-model-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5em;
    }
    .modelselector-model-name {
      font-weight: 600;
      color: ${theme.primary};
      font-size: 0.9em;
    }
    .modelselector-model-provider {
      background: ${theme.secondary}22;
      color: ${theme.secondary};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .modelselector-model-description {
      font-size: 0.8em;
      color: ${theme.foreground}88;
      margin-bottom: 0.5em;
      line-height: 1.4;
    }
    .modelselector-model-capabilities {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25em;
      margin-bottom: 0.5em;
    }
    .modelselector-capability {
      background: ${theme.accent}22;
      color: ${theme.accent};
      padding: 0.125em 0.375em;
      border-radius: 2px;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .modelselector-model-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.7em;
      color: ${theme.foreground}66;
    }
    .modelselector-model-cost {
      color: ${theme.accent};
      font-weight: 500;
    }
    .modelselector-model-tokens {
      color: ${theme.info};
    }
    .modelselector-model-performance {
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .modelselector-model-performance.basic { background: ${theme.error}; }
    .modelselector-model-performance.standard { background: ${theme.warning}; }
    .modelselector-model-performance.advanced { background: ${theme.info}; }
    .modelselector-model-performance.premium { background: ${theme.primary}; }
    .modelselector-model-performance.enterprise { background: ${theme.accent}; }
  `);
  
  // Comparison styles
  styles.push(`
    .modelselector-comparison {
      display: none;
      padding: 1em;
      border-top: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .modelselector-comparison-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .modelselector-comparison-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8em;
    }
    .modelselector-comparison-table th,
    .modelselector-comparison-table td {
      padding: 0.5em;
      text-align: left;
      border-bottom: 1px solid ${theme.border};
    }
    .modelselector-comparison-table th {
      background: ${theme.background}88;
      color: ${theme.primary};
      font-weight: 600;
    }
    .modelselector-comparison-table tr:hover {
      background: ${theme.primary}11;
    }
  `);
  
  // Details styles
  styles.push(`
    .modelselector-details {
      display: none;
      padding: 1em;
      border-top: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .modelselector-details-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .modelselector-details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5em;
    }
    .modelselector-details-item {
      display: flex;
      flex-direction: column;
      padding: 0.5em;
      background: ${theme.background}66;
      border-radius: 3px;
      font-size: 0.8em;
    }
    .modelselector-details-item-label {
      color: ${theme.foreground}88;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25em;
    }
    .modelselector-details-item-value {
      color: ${theme.foreground};
      font-weight: 500;
    }
  `);
  
  // Footer styles
  styles.push(`
    .modelselector-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em 1em;
      background: ${theme.background}dd;
      border-top: 1px solid ${theme.border};
      font-size: 0.8em;
      color: ${theme.foreground}88;
    }
    .modelselector-footer-info {
      display: flex;
      gap: 1em;
    }
    .modelselector-footer-info-item {
      display: flex;
      align-items: center;
      gap: 0.25em;
    }
    .modelselector-footer-actions {
      display: flex;
      gap: 0.5em;
    }
  `);
  
  // Scrollbar styles
  styles.push(`
    .modelselector-content::-webkit-scrollbar {
      width: 6px;
    }
    .modelselector-content::-webkit-scrollbar-track {
      background: ${theme.background};
    }
    .modelselector-content::-webkit-scrollbar-thumb {
      background: ${theme.border};
      border-radius: 3px;
    }
    .modelselector-content::-webkit-scrollbar-thumb:hover {
      background: ${theme.primary};
    }
  `);
  
  return styles.join('\n');
}

// Get variant-specific class names
export function getModelSelectorVariantClass(variant: ModelSelectorVariant): string {
  return `modelselector-${variant}`;
}

// Get state-specific class names
export function getModelSelectorStateClass(state: ModelSelectorState): string {
  return `modelselector-${state}`;
}

// Get provider-specific class names
export function getProviderClass(provider: Provider): string {
  return `provider-${provider}`;
}

// Get capability-specific class names
export function getCapabilityClass(capability: Capability): string {
  return `capability-${capability}`;
}

// Get performance-specific class names
export function getPerformanceClass(performance: PerformanceLevel): string {
  return `performance-${performance}`;
}

// Get availability-specific class names
export function getAvailabilityClass(availability: Availability): string {
  return `availability-${availability}`;
}

// Generate responsive styles
export function generateResponsiveModelSelectorStyles(): string {
  return `
    @media (max-width: 768px) {
      .modelselector-container {
        width: 100%;
        height: auto;
        min-height: 200px;
      }
      .modelselector-models {
        grid-template-columns: 1fr;
        gap: 0.5em;
      }
      .modelselector-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5em;
      }
      .modelselector-footer {
        flex-direction: column;
        gap: 0.5em;
      }
      .modelselector-filters-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .modelselector-container {
        padding: 0.5em;
        font-size: 0.8em;
      }
      .modelselector-content {
        padding: 0.5em;
      }
      .modelselector-model {
        padding: 0.75em;
      }
      .modelselector-model-name {
        font-size: 0.8em;
      }
      .modelselector-model-description {
        font-size: 0.7em;
      }
    }
  `;
}
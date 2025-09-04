import { ImageAIVariant, ImageAIState, GenerationModel, AnalysisModel, ImageSize, ImageQuality, ImageStyle, AnalysisTask } from './ImageAI.types';

// Image AI Style Configuration
export interface ImageAIStyleConfig {
  variant: ImageAIVariant;
  state: ImageAIState;
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

// Generate Image AI Styles
export function generateImageAIStyles(config: ImageAIStyleConfig): string {
  const { variant, state, width, height, theme } = config;
  
  const styles: string[] = [];
  
  // Base container styles
  styles.push(`
    .imageai-container {
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
        .imageai-container.compact {
          height: auto;
          min-height: 4em;
          padding: 0.5em;
        }
        .imageai-container.compact .imageai-header {
          padding: 0.25em 0.5em;
          font-size: 0.8em;
        }
        .imageai-container.compact .imageai-content {
          padding: 0.25em 0.5em;
          font-size: 0.9em;
        }
        .imageai-container.compact .imageai-gallery {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.5em;
        }
      `);
      break;
      
    case 'detailed':
      styles.push(`
        .imageai-container.detailed {
          border: 2px solid ${theme.border};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .imageai-container.detailed .imageai-header {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${theme.border};
        }
        .imageai-container.detailed .imageai-footer {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-top: 1px solid ${theme.border};
        }
        .imageai-container.detailed .imageai-sidebar {
          display: block;
        }
        .imageai-container.detailed .imageai-settings {
          display: block;
        }
      `);
      break;
      
    case 'minimal':
      styles.push(`
        .imageai-container.minimal {
          border: none;
          background: transparent;
          border-radius: 0;
        }
        .imageai-container.minimal .imageai-header,
        .imageai-container.minimal .imageai-footer {
          display: none;
        }
        .imageai-container.minimal .imageai-gallery {
          grid-template-columns: repeat(3, 1fr);
        }
      `);
      break;
      
    case 'expanded':
      styles.push(`
        .imageai-container.expanded {
          height: auto;
          min-height: 30em;
        }
        .imageai-container.expanded .imageai-content {
          flex: 1;
          overflow-y: auto;
        }
        .imageai-container.expanded .imageai-sidebar {
          display: block;
        }
        .imageai-container.expanded .imageai-settings {
          display: block;
        }
        .imageai-container.expanded .imageai-analysis {
          display: block;
        }
      `);
      break;
  }
  
  // State-specific styles
  switch (state) {
    case 'loading':
      styles.push(`
        .imageai-container.loading {
          border-color: ${theme.warning};
        }
        .imageai-container.loading .imageai-content {
          opacity: 0.6;
        }
        .imageai-container.loading::after {
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
        .imageai-container.error {
          border-color: ${theme.error};
          background: ${theme.error}11;
        }
        .imageai-container.error .imageai-status {
          color: ${theme.error};
        }
        .imageai-container.error .imageai-status::after {
          content: ' ❌';
        }
      `);
      break;
      
    case 'success':
      styles.push(`
        .imageai-container.success {
          border-color: ${theme.success};
        }
        .imageai-container.success .imageai-status {
          color: ${theme.success};
        }
        .imageai-container.success .imageai-status::after {
          content: ' ✅';
        }
      `);
      break;
      
    case 'focused':
      styles.push(`
        .imageai-container.focused {
          border-color: ${theme.primary};
          box-shadow: 0 0 15px ${theme.primary}44;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }
      `);
      break;
      
    case 'disabled':
      styles.push(`
        .imageai-container.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        .imageai-container.disabled .imageai-status {
          color: ${theme.foreground}66;
        }
        .imageai-container.disabled .imageai-status::after {
          content: ' 🚫';
        }
      `);
      break;
  }
  
  // Header styles
  styles.push(`
    .imageai-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75em 1em;
      background: ${theme.background}dd;
      border-bottom: 1px solid ${theme.border};
      font-size: 0.9em;
    }
    .imageai-title {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-weight: 600;
      color: ${theme.primary};
    }
    .imageai-status {
      font-size: 0.8em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .imageai-actions {
      display: flex;
      gap: 0.5em;
    }
    .imageai-action {
      background: none;
      border: none;
      color: ${theme.foreground};
      cursor: pointer;
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.8em;
      transition: all 0.2s ease;
    }
    .imageai-action:hover {
      background: ${theme.primary}22;
      color: ${theme.primary};
    }
    .imageai-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `);
  
  // Prompt editor styles
  styles.push(`
    .imageai-prompt-editor {
      padding: 1em;
      border-bottom: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .imageai-prompt-editor-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .imageai-prompt-input {
      width: 100%;
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.75em 1em;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.9em;
      resize: vertical;
      min-height: 3em;
    }
    .imageai-prompt-input:focus {
      outline: none;
      border-color: ${theme.primary};
      box-shadow: 0 0 5px ${theme.primary}33;
    }
    .imageai-prompt-input::placeholder {
      color: ${theme.foreground}66;
    }
    .imageai-prompt-controls {
      display: flex;
      gap: 0.5em;
      margin-top: 0.5em;
      align-items: center;
    }
    .imageai-prompt-select {
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.5em;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.8em;
    }
    .imageai-prompt-select:focus {
      outline: none;
      border-color: ${theme.primary};
    }
    .imageai-prompt-button {
      background: ${theme.primary};
      color: ${theme.background};
      border: none;
      padding: 0.5em 1em;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.8em;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .imageai-prompt-button:hover {
      background: ${theme.primary}dd;
      transform: translateY(-1px);
    }
    .imageai-prompt-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  `);
  
  // Content styles
  styles.push(`
    .imageai-content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    .imageai-sidebar {
      display: none;
      width: 250px;
      background: ${theme.background}88;
      border-right: 1px solid ${theme.border};
      overflow-y: auto;
    }
    .imageai-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .imageai-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1em;
      padding: 1em;
      overflow-y: auto;
    }
    .imageai-image {
      background: ${theme.background}88;
      border: 1px solid ${theme.border};
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .imageai-image:hover {
      background: ${theme.primary}11;
      border-color: ${theme.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .imageai-image.selected {
      background: ${theme.primary}22;
      border-color: ${theme.primary};
      box-shadow: 0 0 10px ${theme.primary}33;
    }
    .imageai-image-preview {
      width: 100%;
      height: 150px;
      background: ${theme.background}66;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${theme.foreground}66;
      font-size: 0.8em;
    }
    .imageai-image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .imageai-image-info {
      padding: 0.75em;
    }
    .imageai-image-prompt {
      font-size: 0.8em;
      color: ${theme.foreground};
      margin-bottom: 0.5em;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .imageai-image-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.7em;
      color: ${theme.foreground}66;
    }
    .imageai-image-model {
      background: ${theme.secondary}22;
      color: ${theme.secondary};
      padding: 0.125em 0.375em;
      border-radius: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .imageai-image-date {
      color: ${theme.info};
    }
  `);
  
  // Analysis styles
  styles.push(`
    .imageai-analysis {
      display: none;
      padding: 1em;
      border-top: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .imageai-analysis-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .imageai-analysis-result {
      background: ${theme.background}66;
      border: 1px solid ${theme.border};
      border-radius: 3px;
      padding: 0.75em;
      margin-bottom: 0.5em;
    }
    .imageai-analysis-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5em;
    }
    .imageai-analysis-task {
      background: ${theme.accent}22;
      color: ${theme.accent};
      padding: 0.125em 0.375em;
      border-radius: 2px;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .imageai-analysis-confidence {
      color: ${theme.info};
      font-size: 0.7em;
      font-weight: 500;
    }
    .imageai-analysis-text {
      font-size: 0.8em;
      color: ${theme.foreground};
      line-height: 1.4;
    }
    .imageai-analysis-objects {
      margin-top: 0.5em;
    }
    .imageai-analysis-object {
      display: inline-block;
      background: ${theme.primary}22;
      color: ${theme.primary};
      padding: 0.125em 0.375em;
      border-radius: 2px;
      font-size: 0.7em;
      margin: 0.125em;
    }
  `);
  
  // Settings styles
  styles.push(`
    .imageai-settings {
      display: none;
      padding: 1em;
      border-top: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .imageai-settings-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .imageai-settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5em;
    }
    .imageai-setting {
      display: flex;
      flex-direction: column;
      gap: 0.25em;
    }
    .imageai-setting-label {
      font-size: 0.7em;
      color: ${theme.foreground}88;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .imageai-setting-select {
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-family: inherit;
      font-size: 0.8em;
    }
    .imageai-setting-select:focus {
      outline: none;
      border-color: ${theme.primary};
    }
    .imageai-setting-input {
      background: ${theme.background};
      border: 1px solid ${theme.border};
      color: ${theme.foreground};
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-family: inherit;
      font-size: 0.8em;
    }
    .imageai-setting-input:focus {
      outline: none;
      border-color: ${theme.primary};
    }
  `);
  
  // History styles
  styles.push(`
    .imageai-history {
      padding: 1em;
      border-top: 1px solid ${theme.border};
      background: ${theme.background}88;
    }
    .imageai-history-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .imageai-history-list {
      max-height: 200px;
      overflow-y: auto;
    }
    .imageai-history-item {
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
    .imageai-history-item:hover {
      background: ${theme.primary}11;
    }
    .imageai-history-prompt {
      font-size: 0.8em;
      color: ${theme.foreground};
      font-weight: 500;
    }
    .imageai-history-meta {
      display: flex;
      gap: 0.5em;
      font-size: 0.7em;
      color: ${theme.foreground}66;
    }
    .imageai-history-model {
      color: ${theme.secondary};
    }
    .imageai-history-date {
      color: ${theme.info};
    }
  `);
  
  // Footer styles
  styles.push(`
    .imageai-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em 1em;
      background: ${theme.background}dd;
      border-top: 1px solid ${theme.border};
      font-size: 0.8em;
      color: ${theme.foreground}88;
    }
    .imageai-footer-info {
      display: flex;
      gap: 1em;
    }
    .imageai-footer-info-item {
      display: flex;
      align-items: center;
      gap: 0.25em;
    }
    .imageai-footer-actions {
      display: flex;
      gap: 0.5em;
    }
  `);
  
  // Scrollbar styles
  styles.push(`
    .imageai-sidebar::-webkit-scrollbar,
    .imageai-gallery::-webkit-scrollbar,
    .imageai-history-list::-webkit-scrollbar {
      width: 6px;
    }
    .imageai-sidebar::-webkit-scrollbar-track,
    .imageai-gallery::-webkit-scrollbar-track,
    .imageai-history-list::-webkit-scrollbar-track {
      background: ${theme.background};
    }
    .imageai-sidebar::-webkit-scrollbar-thumb,
    .imageai-gallery::-webkit-scrollbar-thumb,
    .imageai-history-list::-webkit-scrollbar-thumb {
      background: ${theme.border};
      border-radius: 3px;
    }
    .imageai-sidebar::-webkit-scrollbar-thumb:hover,
    .imageai-gallery::-webkit-scrollbar-thumb:hover,
    .imageai-history-list::-webkit-scrollbar-thumb:hover {
      background: ${theme.primary};
    }
  `);
  
  return styles.join('\n');
}

// Get variant-specific class names
export function getImageAIVariantClass(variant: ImageAIVariant): string {
  return `imageai-${variant}`;
}

// Get state-specific class names
export function getImageAIStateClass(state: ImageAIState): string {
  return `imageai-${state}`;
}

// Get model-specific class names
export function getGenerationModelClass(model: GenerationModel): string {
  return `model-${model}`;
}

// Get analysis model-specific class names
export function getAnalysisModelClass(model: AnalysisModel): string {
  return `analysis-model-${model}`;
}

// Generate responsive styles
export function generateResponsiveImageAIStyles(): string {
  return `
    @media (max-width: 768px) {
      .imageai-container {
        width: 100%;
        height: auto;
        min-height: 200px;
      }
      .imageai-content {
        flex-direction: column;
      }
      .imageai-sidebar {
        width: 100%;
        height: 200px;
        border-right: none;
        border-bottom: 1px solid ${theme.border};
      }
      .imageai-gallery {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5em;
      }
      .imageai-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5em;
      }
      .imageai-footer {
        flex-direction: column;
        gap: 0.5em;
      }
      .imageai-prompt-controls {
        flex-direction: column;
        gap: 0.25em;
      }
      .imageai-settings-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .imageai-container {
        padding: 0.5em;
        font-size: 0.8em;
      }
      .imageai-content {
        padding: 0.5em;
      }
      .imageai-image {
        padding: 0.5em;
      }
      .imageai-image-prompt {
        font-size: 0.7em;
      }
      .imageai-gallery {
        grid-template-columns: 1fr;
      }
    }
  `;
}
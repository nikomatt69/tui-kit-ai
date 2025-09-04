import { TokenInfoVariant, TokenInfoState } from './TokenInfo.types';

// Token Info Style Configuration
export interface TokenInfoStyleConfig {
  variant: TokenInfoVariant;
  state: TokenInfoState;
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

// Generate Token Info Styles
export function generateTokenInfoStyles(config: TokenInfoStyleConfig): string {
  const { variant, state, width, height, theme } = config;
  
  const styles: string[] = [];
  
  // Base container styles
  styles.push(`
    .tokeninfo-container {
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
        .tokeninfo-container.compact {
          height: auto;
          min-height: 4em;
          padding: 0.5em;
        }
        .tokeninfo-container.compact .tokeninfo-header {
          padding: 0.25em 0.5em;
          font-size: 0.8em;
        }
        .tokeninfo-container.compact .tokeninfo-content {
          padding: 0.25em 0.5em;
          font-size: 0.9em;
        }
        .tokeninfo-container.compact .tokeninfo-stats {
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.5em;
        }
      `);
      break;
      
    case 'detailed':
      styles.push(`
        .tokeninfo-container.detailed {
          border: 2px solid ${theme.border};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .tokeninfo-container.detailed .tokeninfo-header {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${theme.border};
        }
        .tokeninfo-container.detailed .tokeninfo-footer {
          background: ${theme.background}dd;
          backdrop-filter: blur(10px);
          border-top: 1px solid ${theme.border};
        }
        .tokeninfo-container.detailed .tokeninfo-breakdown {
          display: block;
        }
        .tokeninfo-container.detailed .tokeninfo-trends {
          display: block;
        }
      `);
      break;
      
    case 'minimal':
      styles.push(`
        .tokeninfo-container.minimal {
          border: none;
          background: transparent;
          border-radius: 0;
        }
        .tokeninfo-container.minimal .tokeninfo-header,
        .tokeninfo-container.minimal .tokeninfo-footer {
          display: none;
        }
        .tokeninfo-container.minimal .tokeninfo-stats {
          grid-template-columns: repeat(3, 1fr);
        }
      `);
      break;
      
    case 'expanded':
      styles.push(`
        .tokeninfo-container.expanded {
          height: auto;
          min-height: 25em;
        }
        .tokeninfo-container.expanded .tokeninfo-content {
          flex: 1;
          overflow-y: auto;
        }
        .tokeninfo-container.expanded .tokeninfo-breakdown {
          display: block;
        }
        .tokeninfo-container.expanded .tokeninfo-trends {
          display: block;
        }
        .tokeninfo-container.expanded .tokeninfo-details {
          display: block;
        }
      `);
      break;
  }
  
  // State-specific styles
  switch (state) {
    case 'loading':
      styles.push(`
        .tokeninfo-container.loading {
          border-color: ${theme.warning};
        }
        .tokeninfo-container.loading .tokeninfo-content {
          opacity: 0.6;
        }
        .tokeninfo-container.loading::after {
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
        .tokeninfo-container.error {
          border-color: ${theme.error};
          background: ${theme.error}11;
        }
        .tokeninfo-container.error .tokeninfo-status {
          color: ${theme.error};
        }
        .tokeninfo-container.error .tokeninfo-status::after {
          content: ' ❌';
        }
      `);
      break;
      
    case 'success':
      styles.push(`
        .tokeninfo-container.success {
          border-color: ${theme.success};
        }
        .tokeninfo-container.success .tokeninfo-status {
          color: ${theme.success};
        }
        .tokeninfo-container.success .tokeninfo-status::after {
          content: ' ✅';
        }
      `);
      break;
      
    case 'warning':
      styles.push(`
        .tokeninfo-container.warning {
          border-color: ${theme.warning};
          background: ${theme.warning}11;
        }
        .tokeninfo-container.warning .tokeninfo-status {
          color: ${theme.warning};
        }
        .tokeninfo-container.warning .tokeninfo-status::after {
          content: ' ⚠️';
        }
      `);
      break;
      
    case 'critical':
      styles.push(`
        .tokeninfo-container.critical {
          border-color: ${theme.error};
          background: ${theme.error}22;
          animation: pulse-critical 2s infinite;
        }
        .tokeninfo-container.critical .tokeninfo-status {
          color: ${theme.error};
        }
        .tokeninfo-container.critical .tokeninfo-status::after {
          content: ' 🚨';
        }
        @keyframes pulse-critical {
          0%, 100% { box-shadow: 0 0 5px ${theme.error}; }
          50% { box-shadow: 0 0 20px ${theme.error}; }
        }
      `);
      break;
      
    case 'focused':
      styles.push(`
        .tokeninfo-container.focused {
          border-color: ${theme.primary};
          box-shadow: 0 0 15px ${theme.primary}44;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }
      `);
      break;
  }
  
  // Header styles
  styles.push(`
    .tokeninfo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75em 1em;
      background: ${theme.background}dd;
      border-bottom: 1px solid ${theme.border};
      font-size: 0.9em;
    }
    .tokeninfo-title {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-weight: 600;
      color: ${theme.primary};
    }
    .tokeninfo-model {
      background: ${theme.primary}22;
      color: ${theme.primary};
      padding: 0.25em 0.5em;
      border-radius: 4px;
      font-size: 0.8em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tokeninfo-status {
      font-size: 0.8em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tokeninfo-actions {
      display: flex;
      gap: 0.5em;
    }
    .tokeninfo-action {
      background: none;
      border: none;
      color: ${theme.foreground};
      cursor: pointer;
      padding: 0.25em 0.5em;
      border-radius: 3px;
      font-size: 0.8em;
      transition: all 0.2s ease;
    }
    .tokeninfo-action:hover {
      background: ${theme.primary}22;
      color: ${theme.primary};
    }
    .tokeninfo-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `);
  
  // Content styles
  styles.push(`
    .tokeninfo-content {
      flex: 1;
      padding: 1em;
      overflow-y: auto;
    }
    .tokeninfo-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1em;
      margin-bottom: 1em;
    }
    .tokeninfo-stat {
      background: ${theme.background}88;
      border: 1px solid ${theme.border};
      border-radius: 4px;
      padding: 0.75em;
      text-align: center;
      transition: all 0.2s ease;
    }
    .tokeninfo-stat:hover {
      background: ${theme.primary}11;
      border-color: ${theme.primary};
    }
    .tokeninfo-stat-value {
      font-size: 1.5em;
      font-weight: bold;
      color: ${theme.primary};
      margin-bottom: 0.25em;
    }
    .tokeninfo-stat-label {
      font-size: 0.8em;
      color: ${theme.foreground}88;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tokeninfo-stat-cost {
      font-size: 0.9em;
      color: ${theme.accent};
      margin-top: 0.25em;
    }
    .tokeninfo-stat-percentage {
      font-size: 0.8em;
      color: ${theme.info};
      margin-top: 0.25em;
    }
  `);
  
  // Progress bar styles
  styles.push(`
    .tokeninfo-progress {
      width: 100%;
      height: 8px;
      background: ${theme.border};
      border-radius: 4px;
      overflow: hidden;
      margin: 0.5em 0;
    }
    .tokeninfo-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, ${theme.primary}, ${theme.secondary});
      border-radius: 4px;
      transition: width 0.3s ease;
      position: relative;
    }
    .tokeninfo-progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: progress-shine 2s infinite;
    }
    @keyframes progress-shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .tokeninfo-progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.8em;
      color: ${theme.foreground}88;
      margin-bottom: 0.25em;
    }
  `);
  
  // Breakdown styles
  styles.push(`
    .tokeninfo-breakdown {
      display: none;
      margin-top: 1em;
      padding-top: 1em;
      border-top: 1px solid ${theme.border};
    }
    .tokeninfo-breakdown-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .tokeninfo-breakdown-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5em;
    }
    .tokeninfo-breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em;
      background: ${theme.background}66;
      border-radius: 3px;
      font-size: 0.8em;
    }
    .tokeninfo-breakdown-item-type {
      color: ${theme.foreground};
      font-weight: 500;
    }
    .tokeninfo-breakdown-item-count {
      color: ${theme.primary};
      font-weight: bold;
    }
    .tokeninfo-breakdown-item-percentage {
      color: ${theme.info};
      font-size: 0.7em;
    }
    .tokeninfo-breakdown-item-cost {
      color: ${theme.accent};
      font-size: 0.7em;
    }
  `);
  
  // Trends styles
  styles.push(`
    .tokeninfo-trends {
      display: none;
      margin-top: 1em;
      padding-top: 1em;
      border-top: 1px solid ${theme.border};
    }
    .tokeninfo-trends-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .tokeninfo-trends-chart {
      height: 60px;
      background: ${theme.background}66;
      border-radius: 3px;
      position: relative;
      overflow: hidden;
    }
    .tokeninfo-trends-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.primary};
      opacity: 0.8;
    }
    .tokeninfo-trends-points {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
    }
    .tokeninfo-trends-point {
      position: absolute;
      width: 4px;
      height: 4px;
      background: ${theme.primary};
      border-radius: 50%;
      transform: translateY(50%);
    }
  `);
  
  // Details styles
  styles.push(`
    .tokeninfo-details {
      display: none;
      margin-top: 1em;
      padding-top: 1em;
      border-top: 1px solid ${theme.border};
    }
    .tokeninfo-details-title {
      font-size: 0.9em;
      font-weight: 600;
      color: ${theme.primary};
      margin-bottom: 0.5em;
    }
    .tokeninfo-details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.5em;
    }
    .tokeninfo-details-item {
      display: flex;
      flex-direction: column;
      padding: 0.5em;
      background: ${theme.background}66;
      border-radius: 3px;
      font-size: 0.8em;
    }
    .tokeninfo-details-item-label {
      color: ${theme.foreground}88;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25em;
    }
    .tokeninfo-details-item-value {
      color: ${theme.foreground};
      font-weight: 500;
    }
  `);
  
  // Footer styles
  styles.push(`
    .tokeninfo-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em 1em;
      background: ${theme.background}dd;
      border-top: 1px solid ${theme.border};
      font-size: 0.8em;
      color: ${theme.foreground}88;
    }
    .tokeninfo-footer-info {
      display: flex;
      gap: 1em;
    }
    .tokeninfo-footer-info-item {
      display: flex;
      align-items: center;
      gap: 0.25em;
    }
    .tokeninfo-footer-actions {
      display: flex;
      gap: 0.5em;
    }
  `);
  
  // Scrollbar styles
  styles.push(`
    .tokeninfo-content::-webkit-scrollbar {
      width: 6px;
    }
    .tokeninfo-content::-webkit-scrollbar-track {
      background: ${theme.background};
    }
    .tokeninfo-content::-webkit-scrollbar-thumb {
      background: ${theme.border};
      border-radius: 3px;
    }
    .tokeninfo-content::-webkit-scrollbar-thumb:hover {
      background: ${theme.primary};
    }
  `);
  
  return styles.join('\n');
}

// Get variant-specific class names
export function getTokenInfoVariantClass(variant: TokenInfoVariant): string {
  return `tokeninfo-${variant}`;
}

// Get state-specific class names
export function getTokenInfoStateClass(state: TokenInfoState): string {
  return `tokeninfo-${state}`;
}

// Generate responsive styles
export function generateResponsiveTokenInfoStyles(): string {
  return `
    @media (max-width: 768px) {
      .tokeninfo-container {
        width: 100%;
        height: auto;
        min-height: 200px;
      }
      .tokeninfo-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5em;
      }
      .tokeninfo-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5em;
      }
      .tokeninfo-footer {
        flex-direction: column;
        gap: 0.5em;
      }
      .tokeninfo-breakdown-list {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .tokeninfo-container {
        padding: 0.5em;
        font-size: 0.8em;
      }
      .tokeninfo-stats {
        grid-template-columns: 1fr;
      }
      .tokeninfo-content {
        padding: 0.5em;
      }
      .tokeninfo-stat {
        padding: 0.5em;
      }
      .tokeninfo-stat-value {
        font-size: 1.2em;
      }
    }
  `;
}
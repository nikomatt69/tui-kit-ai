import { StreamVariant, StreamState } from './Stream.types';

// Stream Style Configuration
export interface StreamStyleConfig {
  variant: StreamVariant;
  state: StreamState;
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
  };
}

// Generate Stream Styles
export function generateStreamStyles(config: StreamStyleConfig): string {
  const { variant, state, width, height, theme } = config;
  
  const styles: string[] = [];
  
  // Base container styles
  styles.push(`
    .stream-container {
      width: ${width}ch;
      height: ${height}em;
      background: ${theme.background};
      color: ${theme.foreground};
      border: 1px solid ${theme.border};
      border-radius: 4px;
      padding: 1em;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      overflow: hidden;
      position: relative;
    }
  `);
  
  // Variant-specific styles
  switch (variant) {
    case 'realtime':
      styles.push(`
        .stream-container.realtime {
          border-color: ${theme.primary};
          box-shadow: 0 0 10px ${theme.primary}33;
        }
        .stream-container.realtime .stream-content {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `);
      break;
      
    case 'buffered':
      styles.push(`
        .stream-container.buffered {
          border-color: ${theme.secondary};
        }
        .stream-container.buffered .stream-buffer {
          background: ${theme.secondary}22;
          border: 1px dashed ${theme.secondary};
          border-radius: 2px;
          padding: 0.5em;
          margin: 0.5em 0;
        }
      `);
      break;
      
    case 'chunked':
      styles.push(`
        .stream-container.chunked .stream-chunk {
          border-left: 3px solid ${theme.primary};
          padding-left: 0.5em;
          margin: 0.25em 0;
          background: ${theme.background};
          transition: background 0.2s ease;
        }
        .stream-container.chunked .stream-chunk:hover {
          background: ${theme.primary}11;
        }
      `);
      break;
      
    case 'minimal':
      styles.push(`
        .stream-container.minimal {
          border: none;
          background: transparent;
          padding: 0;
        }
        .stream-container.minimal .stream-header,
        .stream-container.minimal .stream-footer {
          display: none;
        }
      `);
      break;
  }
  
  // State-specific styles
  switch (state) {
    case 'connecting':
      styles.push(`
        .stream-container.connecting {
          border-color: ${theme.warning};
        }
        .stream-container.connecting .stream-status {
          color: ${theme.warning};
        }
        .stream-container.connecting .stream-status::after {
          content: ' ⚡';
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `);
      break;
      
    case 'streaming':
      styles.push(`
        .stream-container.streaming {
          border-color: ${theme.success};
        }
        .stream-container.streaming .stream-status {
          color: ${theme.success};
        }
        .stream-container.streaming .stream-content {
          animation: stream-flow 0.5s ease-in-out infinite alternate;
        }
        @keyframes stream-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(2px); }
        }
      `);
      break;
      
    case 'paused':
      styles.push(`
        .stream-container.paused {
          border-color: ${theme.warning};
          opacity: 0.7;
        }
        .stream-container.paused .stream-status {
          color: ${theme.warning};
        }
        .stream-container.paused .stream-status::after {
          content: ' ⏸️';
        }
      `);
      break;
      
    case 'completed':
      styles.push(`
        .stream-container.completed {
          border-color: ${theme.success};
        }
        .stream-container.completed .stream-status {
          color: ${theme.success};
        }
        .stream-container.completed .stream-status::after {
          content: ' ✅';
        }
      `);
      break;
      
    case 'error':
      styles.push(`
        .stream-container.error {
          border-color: ${theme.error};
          background: ${theme.error}11;
        }
        .stream-container.error .stream-status {
          color: ${theme.error};
        }
        .stream-container.error .stream-status::after {
          content: ' ❌';
        }
      `);
      break;
      
    case 'focused':
      styles.push(`
        .stream-container.focused {
          border-color: ${theme.primary};
          box-shadow: 0 0 15px ${theme.primary}44;
          transform: scale(1.02);
          transition: all 0.2s ease;
        }
      `);
      break;
  }
  
  // Progress bar styles
  styles.push(`
    .stream-progress {
      width: 100%;
      height: 4px;
      background: ${theme.border};
      border-radius: 2px;
      overflow: hidden;
      margin: 0.5em 0;
    }
    .stream-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, ${theme.primary}, ${theme.secondary});
      border-radius: 2px;
      transition: width 0.3s ease;
      position: relative;
    }
    .stream-progress-bar::after {
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
  `);
  
  // Statistics styles
  styles.push(`
    .stream-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.8em;
      color: ${theme.foreground}88;
      margin-top: 0.5em;
      padding-top: 0.5em;
      border-top: 1px solid ${theme.border};
    }
    .stream-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stream-stat-value {
      font-weight: bold;
      color: ${theme.primary};
    }
    .stream-stat-label {
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `);
  
  // Content styles
  styles.push(`
    .stream-content {
      flex: 1;
      overflow-y: auto;
      padding: 0.5em 0;
      line-height: 1.4;
    }
    .stream-chunk {
      margin: 0.25em 0;
      padding: 0.25em 0;
      border-bottom: 1px solid ${theme.border}33;
    }
    .stream-chunk:last-child {
      border-bottom: none;
    }
    .stream-chunk-text {
      color: ${theme.foreground};
    }
    .stream-chunk-code {
      color: ${theme.secondary};
      font-family: 'JetBrains Mono', monospace;
      background: ${theme.background}88;
      padding: 0.25em;
      border-radius: 2px;
    }
    .stream-chunk-data {
      color: ${theme.primary};
    }
    .stream-chunk-error {
      color: ${theme.error};
      background: ${theme.error}11;
      padding: 0.25em;
      border-radius: 2px;
    }
    .stream-chunk-metadata {
      color: ${theme.foreground}66;
      font-size: 0.8em;
      font-style: italic;
    }
    .stream-chunk-timestamp {
      color: ${theme.foreground}44;
      font-size: 0.7em;
      float: right;
    }
  `);
  
  // Header and footer styles
  styles.push(`
    .stream-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5em;
      padding-bottom: 0.5em;
      border-bottom: 1px solid ${theme.border};
    }
    .stream-title {
      font-weight: bold;
      color: ${theme.primary};
    }
    .stream-status {
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stream-footer {
      margin-top: 0.5em;
      padding-top: 0.5em;
      border-top: 1px solid ${theme.border};
      font-size: 0.8em;
      color: ${theme.foreground}88;
    }
  `);
  
  // Scrollbar styles
  styles.push(`
    .stream-content::-webkit-scrollbar {
      width: 6px;
    }
    .stream-content::-webkit-scrollbar-track {
      background: ${theme.background};
    }
    .stream-content::-webkit-scrollbar-thumb {
      background: ${theme.border};
      border-radius: 3px;
    }
    .stream-content::-webkit-scrollbar-thumb:hover {
      background: ${theme.primary};
    }
  `);
  
  return styles.join('\n');
}

// Get variant-specific class names
export function getStreamVariantClass(variant: StreamVariant): string {
  return `stream-${variant}`;
}

// Get state-specific class names
export function getStreamStateClass(state: StreamState): string {
  return `stream-${state}`;
}

// Get chunk type-specific class names
export function getChunkTypeClass(type: string): string {
  return `stream-chunk-${type}`;
}

// Generate responsive styles
export function generateResponsiveStreamStyles(): string {
  return `
    @media (max-width: 768px) {
      .stream-container {
        width: 100%;
        height: auto;
        min-height: 200px;
      }
      .stream-stats {
        flex-direction: column;
        gap: 0.5em;
      }
      .stream-stat {
        flex-direction: row;
        justify-content: space-between;
      }
    }
    
    @media (max-width: 480px) {
      .stream-container {
        padding: 0.5em;
        font-size: 0.9em;
      }
      .stream-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25em;
      }
    }
  `;
}
// Main AI Components Package
export * from './components';

// Package information
export const PACKAGE_NAME = '@tui-kit-ai/ai';
export const PACKAGE_VERSION = '1.0.0';
export const PACKAGE_DESCRIPTION = 'AI-powered terminal UI components for tui-kit';

// Component availability
export const AVAILABLE_COMPONENTS = [
  'Stream',
  'CodeBlock', 
  'TokenInfo',
  'ModelSelector',
  'WebSearchTool',
  'PDFTool',
  'ImageAI'
] as const;

export type AvailableComponent = typeof AVAILABLE_COMPONENTS[number];

// Feature flags
export const FEATURES = {
  STREAMING: true,
  CODE_HIGHLIGHTING: true,
  TOKEN_TRACKING: true,
  MODEL_SELECTION: true,
  WEB_SEARCH: true,
  PDF_PROCESSING: true,
  IMAGE_AI: true,
  RESPONSIVE_DESIGN: true,
  THEME_SUPPORT: true,
  ACCESSIBILITY: true
} as const;

// API endpoints and configurations
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000
  }
} as const;

// Supported formats and standards
export const SUPPORTED_FORMATS = {
  IMAGES: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
  DOCUMENTS: ['pdf', 'txt', 'md', 'html', 'xml'],
  CODE: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'go', 'rs', 'php', 'rb', 'swift', 'kt'],
  DATA: ['json', 'csv', 'yaml', 'xml', 'toml', 'ini']
} as const;

// Browser compatibility
export const BROWSER_SUPPORT = {
  CHROME: '>= 80',
  FIREFOX: '>= 75',
  SAFARI: '>= 13',
  EDGE: '>= 80'
} as const;

// Development utilities
export const DEV_UTILS = {
  enableDebugMode: () => {
    if (typeof window !== 'undefined') {
      (window as any).__TUI_KIT_AI_DEBUG__ = true;
    }
  },
  
  disableDebugMode: () => {
    if (typeof window !== 'undefined') {
      (window as any).__TUI_KIT_AI_DEBUG__ = false;
    }
  },
  
  isDebugMode: () => {
    return typeof window !== 'undefined' && (window as any).__TUI_KIT_AI_DEBUG__ === true;
  },
  
  log: (message: string, data?: any) => {
    if (DEV_UTILS.isDebugMode()) {
      console.log(`[TUI-Kit-AI] ${message}`, data);
    }
  },
  
  warn: (message: string, data?: any) => {
    if (DEV_UTILS.isDebugMode()) {
      console.warn(`[TUI-Kit-AI] ${message}`, data);
    }
  },
  
  error: (message: string, data?: any) => {
    if (DEV_UTILS.isDebugMode()) {
      console.error(`[TUI-Kit-AI] ${message}`, data);
    }
  }
} as const;

// Performance monitoring
export const PERFORMANCE = {
  trackComponentRender: (componentName: string, renderTime: number) => {
    if (DEV_UTILS.isDebugMode()) {
      DEV_UTILS.log(`Component ${componentName} rendered in ${renderTime}ms`);
    }
  },
  
  trackAPIRequest: (endpoint: string, duration: number, success: boolean) => {
    if (DEV_UTILS.isDebugMode()) {
      DEV_UTILS.log(`API request to ${endpoint} took ${duration}ms (${success ? 'success' : 'failed'})`);
    }
  },
  
  trackUserInteraction: (componentName: string, action: string) => {
    if (DEV_UTILS.isDebugMode()) {
      DEV_UTILS.log(`User interaction: ${action} on ${componentName}`);
    }
  }
} as const;

// Error handling utilities
export const ERROR_HANDLING = {
  createError: (message: string, code?: string, details?: any) => {
    const error = new Error(message);
    (error as any).code = code;
    (error as any).details = details;
    (error as any).timestamp = new Date().toISOString();
    return error;
  },
  
  handleError: (error: Error, context?: string) => {
    const errorInfo = {
      message: error.message,
      code: (error as any).code,
      details: (error as any).details,
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack
    };
    
    DEV_UTILS.error('Error occurred', errorInfo);
    
    // In production, you might want to send this to an error tracking service
    if (typeof window !== 'undefined' && (window as any).__TUI_KIT_AI_ERROR_HANDLER__) {
      (window as any).__TUI_KIT_AI_ERROR_HANDLER__(errorInfo);
    }
    
    return errorInfo;
  }
} as const;

// Validation utilities
export const VALIDATION = {
  isValidComponentName: (name: string): name is AvailableComponent => {
    return AVAILABLE_COMPONENTS.includes(name as AvailableComponent);
  },
  
  isValidTheme: (theme: any): boolean => {
    return theme && 
           typeof theme.primary === 'string' &&
           typeof theme.secondary === 'string' &&
           typeof theme.background === 'string' &&
           typeof theme.foreground === 'string';
  },
  
  isValidSize: (size: any): boolean => {
    return size && 
           typeof size.width === 'number' && 
           typeof size.height === 'number' &&
           size.width > 0 && 
           size.height > 0;
  }
} as const;

// Initialization function
export function initializeAIComponents(options: {
  theme?: any;
  debug?: boolean;
  errorHandler?: (error: any) => void;
} = {}) {
  if (options.debug) {
    DEV_UTILS.enableDebugMode();
  }
  
  if (options.errorHandler && typeof window !== 'undefined') {
    (window as any).__TUI_KIT_AI_ERROR_HANDLER__ = options.errorHandler;
  }
  
  DEV_UTILS.log('TUI-Kit-AI components initialized', {
    version: PACKAGE_VERSION,
    components: AVAILABLE_COMPONENTS,
    features: FEATURES,
    options
  });
  
  return {
    version: PACKAGE_VERSION,
    components: AVAILABLE_COMPONENTS,
    features: FEATURES,
    utils: {
      DEV_UTILS,
      PERFORMANCE,
      ERROR_HANDLING,
      VALIDATION
    }
  };
}

// Default export
export default {
  PACKAGE_NAME,
  PACKAGE_VERSION,
  PACKAGE_DESCRIPTION,
  AVAILABLE_COMPONENTS,
  FEATURES,
  API_CONFIG,
  SUPPORTED_FORMATS,
  BROWSER_SUPPORT,
  DEV_UTILS,
  PERFORMANCE,
  ERROR_HANDLING,
  VALIDATION,
  initializeAIComponents
};
import blessed, { Widgets } from 'blessed';

// Centralized key mapping for consistent behavior
export const KEY = {
  up: 'up',
  down: 'down', 
  left: 'left',
  right: 'right',
  enter: 'enter',
  esc: 'escape',
  backspace: 'backspace',
  del: 'delete',
  pageUp: 'pageup',
  pageDown: 'pagedown',
  ctrlC: 'C-c',
  tab: 'tab',
  space: 'space',
  // Advanced navigation
  home: 'home',
  end: 'end',
  ctrlUp: 'C-up',
  ctrlDown: 'C-down',
  ctrlLeft: 'C-left',
  ctrlRight: 'C-right',
} as const;

// Safe render with 60fps throttling
let raf: NodeJS.Timeout | null = null;
export function safeRender(screen: Widgets.Screen) {
  if (raf) return;
  raf = setTimeout(() => { 
    screen.render(); 
    raf = null; 
  }, 16); // ~60fps
}

export type TerminalContext = {
  screen: Widgets.Screen;
  render: () => void;
};

export function useTerminal(): TerminalContext {
  const screen = blessed.screen({
    smartCSR: true,
    dockBorders: true,
    fullUnicode: true,
  });
  
  // Global key handlers
  screen.key([KEY.ctrlC], () => process.exit(0));
  
  return { 
    screen, 
    render: () => safeRender(screen)
  };
}

// Selection history utility for List/Table/Tree components
export class SelectionManager {
  private history = new Map<string, number>();
  private currentId: string | null = null;

  setSelection(id: string, index: number) {
    this.history.set(id, index);
    this.currentId = id;
  }

  getSelection(id: string): number | undefined {
    return this.history.get(id);
  }

  // Try to restore selection by ID, fallback to clamped index
  restoreSelection(id: string, items: any[], fallbackIndex: number = 0): number {
    const savedIndex = this.history.get(id);
    if (savedIndex !== undefined && savedIndex < items.length) {
      return savedIndex;
    }
    return Math.min(fallbackIndex, Math.max(0, items.length - 1));
  }

  clearHistory() {
    this.history.clear();
    this.currentId = null;
  }
}

// Mount screen utility for consistent setup
export function mountScreen(blessed: typeof import('blessed')) {
  const screen = blessed.screen({ 
    smartCSR: true, 
    dockBorders: true,
    fullUnicode: true,
  });
  
  const render = () => safeRender(screen);
  
  screen.key([KEY.ctrlC], () => process.exit(0));
  
  return { screen, render };
}



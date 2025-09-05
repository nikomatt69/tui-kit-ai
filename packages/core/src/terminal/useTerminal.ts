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



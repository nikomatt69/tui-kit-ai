/**
 * Utility functions for TUI Kit components
 */

/**
 * Merge multiple style objects
 */
export function mergeStyles(...styles: Record<string, any>[]): Record<string, any> {
  return Object.assign({}, ...styles);
}

/**
 * Create a style object with focus state
 */
export function createFocusableStyle(baseStyle: Record<string, any>, focusStyle: Record<string, any>) {
  return {
    ...baseStyle,
    focus: focusStyle,
  };
}

/**
 * Convert color names to blessed-compatible values
 */
export function resolveColor(color: string): string {
  const colorMap: Record<string, string> = {
    black: 'black',
    red: 'red',
    green: 'green',
    yellow: 'yellow',
    blue: 'blue',
    magenta: 'magenta',
    cyan: 'cyan',
    white: 'white',
    gray: 'gray',
    lightred: 'lightred',
    lightgreen: 'lightgreen',
    lightyellow: 'lightyellow',
    lightblue: 'lightblue',
    lightmagenta: 'lightmagenta',
    lightcyan: 'lightcyan',
    lightgray: 'lightgray',
  };
  
  return colorMap[color] || color;
}

/**
 * Create border style object
 */
export function createBorder(type: 'line' | 'bg' = 'line', fg?: string, bg?: string) {
  return {
    type,
    ...(fg && { fg }),
    ...(bg && { bg }),
  };
}

/**
 * Animation helper for terminal animations
 */
export class Animation {
  private frames: string[];
  private currentFrame = 0;
  private interval?: NodeJS.Timeout;
  
  constructor(frames: string[], speed = 100) {
    this.frames = frames;
  }
  
  start(callback: (frame: string) => void) {
    this.interval = setInterval(() => {
      callback(this.frames[this.currentFrame]);
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, 100);
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
}
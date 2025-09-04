/**
 * Common types for TUI Kit components
 */

export interface ComponentProps {
  parent?: any;
  children?: any[];
  top?: string | number;
  left?: string | number;
  width?: string | number;
  height?: string | number;
  right?: string | number;
  bottom?: string | number;
  content?: string;
  label?: string;
  style?: Record<string, any>;
  border?: any;
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  hidden?: boolean;
  focusable?: boolean;
  scrollable?: boolean;
  mouse?: boolean;
  keys?: boolean;
  vi?: boolean;
}

export interface StyleProps {
  fg?: string;
  bg?: string;
  bold?: boolean;
  underline?: boolean;
  blink?: boolean;
  inverse?: boolean;
  invisible?: boolean;
  focus?: {
    fg?: string;
    bg?: string;
    bold?: boolean;
    underline?: boolean;
    blink?: boolean;
    inverse?: boolean;
    invisible?: boolean;
  };
}

export interface BorderProps {
  type?: 'line' | 'bg';
  fg?: string;
  bg?: string;
  ch?: string;
}

export type Color = 
  | 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white'
  | 'gray' | 'lightred' | 'lightgreen' | 'lightyellow' | 'lightblue' 
  | 'lightmagenta' | 'lightcyan' | 'lightgray';

export type BorderType = 'line' | 'bg';
import blessed from 'blessed';
import { Box, Text, Button, Flex } from '@tui-kit-ai/core';

// Create screen
const screen = blessed.screen({
  smartCSR: true,
  title: 'TUI Kit AI - Basic App',
});

// Create main container
const mainContainer = new Box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  bg: 'blue',
  fg: 'white',
  border: {
    type: 'line',
    fg: 'cyan',
  },
  label: ' TUI Kit AI Basic App ',
});

// Create header
const header = new Text({
  parent: mainContainer,
  top: 1,
  left: 2,
  content: 'Welcome to TUI Kit AI! 🚀',
  fg: 'yellow',
  bold: true,
});

// Create content area
const content = new Box({
  parent: mainContainer,
  top: 3,
  left: 2,
  right: 2,
  height: '60%',
  bg: 'black',
  fg: 'white',
  border: {
    type: 'line',
    fg: 'green',
  },
  label: ' Content ',
});

// Add some content
const welcomeText = new Text({
  parent: content,
  top: 1,
  left: 2,
  content: 'This is a basic TUI application built with TUI Kit AI.',
  fg: 'white',
});

const featuresText = new Text({
  parent: content,
  top: 3,
  left: 2,
  content: 'Features:',
  fg: 'cyan',
  bold: true,
});

const feature1 = new Text({
  parent: content,
  top: 4,
  left: 4,
  content: '• Beautiful terminal UI components',
  fg: 'white',
});

const feature2 = new Text({
  parent: content,
  top: 5,
  left: 4,
  content: '• TypeScript support',
  fg: 'white',
});

const feature3 = new Text({
  parent: content,
  top: 6,
  left: 4,
  content: '• Easy to customize and extend',
  fg: 'white',
});

// Create button container
const buttonContainer = new Flex({
  parent: mainContainer,
  top: '70%',
  left: 2,
  right: 2,
  height: 5,
  direction: 'horizontal',
  gap: 2,
});

// Create buttons
const primaryButton = new Button({
  parent: buttonContainer,
  label: 'Primary Action',
  variant: 'default',
  size: 'default',
  onClick: () => {
    content.setContent('Primary button clicked! 🎉');
    screen.render();
  },
});

const secondaryButton = new Button({
  parent: buttonContainer,
  label: 'Secondary',
  variant: 'secondary',
  size: 'default',
  onClick: () => {
    content.setContent('Secondary button clicked! ✨');
    screen.render();
  },
});

// Create footer
const footer = new Text({
  parent: mainContainer,
  bottom: 1,
  left: 2,
  content: 'Press Ctrl+C to exit | TUI Kit AI v0.1.0',
  fg: 'gray',
});

// Handle exit
screen.key(['escape', 'q', 'C-c'], () => {
  process.exit(0);
});

// Initial render
screen.render();

console.log('🚀 TUI Kit AI Basic App started!');
console.log('💡 Press Ctrl+C to exit');
#!/usr/bin/env node

import blessed from 'blessed';
import { TokenInfo } from '../../src/components/TokenInfo/TokenInfo';
import { TokenInfoProps } from '../../src/components/TokenInfo/TokenInfo.types';

// Create main screen
const screen = blessed.screen({
  smartCSR: true,
  title: 'TokenInfo Component Example'
});

// Create container
const container = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'cyan'
    }
  }
});

// Create header
const header = blessed.box({
  parent: container,
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  content: '{green-fg}TokenInfo Component Example{white-fg} - Press + to add tokens, - to subtract, m to change model, r to reset, q to quit',
  tags: true,
  style: {
    bg: 'blue',
    fg: 'white'
  }
});

// Available models
const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'gemini-pro', 'llama-2-70b', 'llama-2-13b'];
let currentModelIndex = 0;

// Create tokeninfo component
const tokenInfoOptions: Partial<TokenInfoProps> = {
  model: models[currentModelIndex],
  showCost: true,
  showBreakdown: true,
  showProgress: true,
  onTokenUpdate: (tokens) => {
    console.log('Tokens updated:', tokens);
  },
  onCostUpdate: (cost) => {
    console.log('Cost updated:', cost);
  },
  onModelChange: (model) => {
    console.log('Model changed to:', model);
  }
};

const tokenInfo = new TokenInfo(tokenInfoOptions);

// Create controls
const controls = blessed.box({
  parent: container,
  top: 3,
  left: 0,
  width: '100%',
  height: 3,
  content: `{yellow-fg}Controls:{white-fg} +=add tokens, -=subtract tokens, m=change model, r=reset, q=quit | Current: ${models[currentModelIndex]}`,
  tags: true,
  style: {
    bg: 'black',
    fg: 'white'
  }
});

// Event handlers
screen.key(['q', 'C-c'], () => {
  tokenInfo.destroy();
  process.exit(0);
});

screen.key(['+'], () => {
  tokenInfo.addTokens({
    input: Math.floor(Math.random() * 100) + 50,
    output: Math.floor(Math.random() * 50) + 25,
    system: Math.floor(Math.random() * 20) + 10,
    user: Math.floor(Math.random() * 80) + 40,
    assistant: Math.floor(Math.random() * 50) + 25
  });
});

screen.key(['-'], () => {
  tokenInfo.addTokens({
    input: -Math.floor(Math.random() * 50),
    output: -Math.floor(Math.random() * 25),
    system: -Math.floor(Math.random() * 10),
    user: -Math.floor(Math.random() * 40),
    assistant: -Math.floor(Math.random() * 25)
  });
});

screen.key(['m'], () => {
  currentModelIndex = (currentModelIndex + 1) % models.length;
  const newModel = models[currentModelIndex];
  tokenInfo.setModel(newModel);
  controls.setContent(`{yellow-fg}Controls:{white-fg} +=add tokens, -=subtract tokens, m=change model, r=reset, q=quit | Current: ${newModel}`);
  screen.render();
});

screen.key(['r'], () => {
  tokenInfo.reset();
});

// Auto-add tokens periodically
setInterval(() => {
  tokenInfo.addTokens({
    input: Math.floor(Math.random() * 20) + 10,
    output: Math.floor(Math.random() * 10) + 5,
    system: Math.floor(Math.random() * 5) + 2,
    user: Math.floor(Math.random() * 15) + 8,
    assistant: Math.floor(Math.random() * 10) + 5
  });
}, 3000);

// Render the screen
screen.render();

console.log('TokenInfo Component Example started!');
console.log('Press + to add tokens, - to subtract tokens, m to change model, r to reset, q to quit');
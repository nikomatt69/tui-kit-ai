#!/usr/bin/env node

import blessed from 'blessed';
import { Stream } from '../../src/components/Stream/Stream';
import { StreamOptions } from '../../src/components/Stream/Stream.types';

// Create main screen
const screen = blessed.screen({
  smartCSR: true,
  title: 'Stream Component Example'
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
  content: '{green-fg}Stream Component Example{white-fg} - Press s to start, p to pause, r to reset, q to quit',
  tags: true,
  style: {
    bg: 'blue',
    fg: 'white'
  }
});

// Create stream component
const streamOptions: StreamOptions = {
  variant: 'realtime',
  showProgress: true,
  showStats: true,
  onChunk: (chunk) => {
    console.log('New chunk:', chunk);
  },
  onStateChange: (state) => {
    console.log('State changed:', state);
  }
};

const stream = new Stream(streamOptions);

// Create controls
const controls = blessed.box({
  parent: container,
  top: 3,
  left: 0,
  width: '100%',
  height: 3,
  content: '{yellow-fg}Controls:{white-fg} s=start, p=pause, r=reset, q=quit',
  tags: true,
  style: {
    bg: 'black',
    fg: 'white'
  }
});

// Create stream display area
const streamArea = blessed.box({
  parent: container,
  top: 6,
  left: 0,
  width: '100%',
  height: '85%',
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'white'
    }
  }
});

// Event handlers
screen.key(['q', 'C-c'], () => {
  stream.destroy();
  process.exit(0);
});

screen.key(['s'], () => {
  stream.start();
});

screen.key(['p'], () => {
  if (stream.isActive()) {
    if (stream.isPaused()) {
      stream.resume();
    } else {
      stream.pause();
    }
  }
});

screen.key(['r'], () => {
  stream.clear();
});

// Add some mock chunks periodically
setInterval(() => {
  if (stream.isActive() && !stream.isPaused()) {
    const types = ['text', 'code', 'data'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const chunks = {
      text: [
        'Processing user request...',
        'Analyzing data patterns...',
        'Generating response...',
        'Validating results...',
        'Finalizing output...'
      ],
      code: [
        'function processData(data) { return data.map(x => x * 2); }',
        'const result = await api.call(endpoint, params);',
        'if (condition) { return success; } else { return error; }'
      ],
      data: [
        '{"status": "processing", "progress": 45}',
        '{"items": [1, 2, 3], "total": 3}',
        '{"error": null, "result": "success"}'
      ]
    };
    
    const content = chunks[type][Math.floor(Math.random() * chunks[type].length)];
    
    stream.addChunk({
      type,
      content,
      metadata: { source: 'mock', timestamp: Date.now() }
    });
  }
}, 2000);

// Render the screen
screen.render();

console.log('Stream Component Example started!');
console.log('Press s to start streaming, p to pause/resume, r to reset, q to quit');
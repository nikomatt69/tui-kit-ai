#!/usr/bin/env node

import blessed from 'blessed';
import { CodeBlock } from '../../src/components/CodeBlock/CodeBlock';
import { CodeBlockProps } from '../../src/components/CodeBlock/CodeBlock.types';

// Create main screen
const screen = blessed.screen({
  smartCSR: true,
  title: 'CodeBlock Component Example'
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
  content: '{green-fg}CodeBlock Component Example{white-fg} - Press l to change language, t to change theme, c to copy, q to quit',
  tags: true,
  style: {
    bg: 'blue',
    fg: 'white'
  }
});

// Sample code examples
const codeExamples = {
  javascript: `function processData(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date().toISOString()
  }));
}

const result = processData([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
]);

console.log(result);`,
  
  typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

function processUser(user: User): User & { processed: boolean } {
  return {
    ...user,
    processed: true
  };
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

const processedUser = processUser(user);`,
  
  python: `def process_data(data):
    """Process a list of data items."""
    processed = []
    for item in data:
        processed_item = {
            **item,
            'processed': True,
            'timestamp': datetime.now().isoformat()
        }
        processed.append(processed_item)
    return processed

# Example usage
data = [
    {'id': 1, 'name': 'John'},
    {'id': 2, 'name': 'Jane'}
]

result = process_data(data)
print(result)`,
  
  java: `public class DataProcessor {
    private String timestamp;
    
    public DataProcessor() {
        this.timestamp = new Date().toString();
    }
    
    public List<Map<String, Object>> processData(List<Map<String, Object>> data) {
        return data.stream()
            .map(item -> {
                Map<String, Object> processed = new HashMap<>(item);
                processed.put("processed", true);
                processed.put("timestamp", this.timestamp);
                return processed;
            })
            .collect(Collectors.toList());
    }
}`
};

const languages = Object.keys(codeExamples);
let currentLanguageIndex = 0;

// Create codeblock component
const codeBlockOptions: Partial<CodeBlockProps> = {
  language: languages[currentLanguageIndex],
  theme: 'dark',
  code: codeExamples[languages[currentLanguageIndex]],
  showLineNumbers: true,
  showCopyButton: true,
  expandable: true,
  onCopy: (code) => {
    console.log('Code copied to clipboard!');
  },
  onExpand: (expanded) => {
    console.log('Code block expanded:', expanded);
  },
  onLanguageChange: (language) => {
    console.log('Language changed to:', language);
  }
};

const codeBlock = new CodeBlock(codeBlockOptions);

// Create controls
const controls = blessed.box({
  parent: container,
  top: 3,
  left: 0,
  width: '100%',
  height: 3,
  content: `{yellow-fg}Controls:{white-fg} l=change language, t=change theme, c=copy, e=toggle expand, q=quit | Current: ${languages[currentLanguageIndex]}`,
  tags: true,
  style: {
    bg: 'black',
    fg: 'white'
  }
});

// Event handlers
screen.key(['q', 'C-c'], () => {
  codeBlock.destroy();
  process.exit(0);
});

screen.key(['l'], () => {
  currentLanguageIndex = (currentLanguageIndex + 1) % languages.length;
  const newLanguage = languages[currentLanguageIndex];
  codeBlock.setLanguage(newLanguage);
  codeBlock.setCode(codeExamples[newLanguage]);
  controls.setContent(`{yellow-fg}Controls:{white-fg} l=change language, t=change theme, c=copy, e=toggle expand, q=quit | Current: ${newLanguage}`);
  screen.render();
});

screen.key(['t'], () => {
  const themes = ['dark', 'light', 'monokai', 'dracula'];
  const currentTheme = codeBlock.getTheme();
  const currentIndex = themes.indexOf(currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  codeBlock.setTheme(nextTheme);
  console.log('Theme changed to:', nextTheme);
});

screen.key(['c'], () => {
  codeBlock.copyToClipboard();
});

screen.key(['e'], () => {
  codeBlock.toggleExpanded();
});

// Render the screen
screen.render();

console.log('CodeBlock Component Example started!');
console.log('Press l to change language, t to change theme, c to copy, e to toggle expand, q to quit');
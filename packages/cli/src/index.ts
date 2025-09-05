#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { presetCommand } from './commands/preset';
import { updateCommand } from './commands/update';
import fs from 'fs';
import path from 'path';
import { TEMPLATE } from './templates/ai-app';

const program = new Command();

program
  .name('tui')
  .description('TUI-Kit-AI - shadcn/ui for Terminal with Vercel AI SDK')
  .version('0.1.0')
  // Global options
  .option('--model <model>', 'AI model to use (e.g., gpt-4, claude-3-sonnet)', 'gpt-4')
  .option('--provider <provider>', 'AI provider (openai|anthropic|ollama)', 'openai')
  .option('--debug', 'Enable debug mode with verbose logging', false)
  .option('--no-color', 'Disable colored output', false);

// Initialize project (shadcn-like)
program
  .command('init')
  .description('Initialize a new TUI-Kit-AI project with configuration')
  .option('--renderer <type>', 'Renderer to use (blessed|ink)', 'blessed')
  .option('--force', 'Overwrite existing configuration', false)
  .action(async (options) => {
    await initCommand(options);
  });

// Add components (shadcn-like)  
program
  .command('add')
  .description('Add components to your project')
  .argument('[components...]', 'Components to add')
  .option('--force', 'Overwrite existing components', false)
  .option('--all', 'Add all available components', false)
  .action(async (components, options) => {
    if (components.length === 0 && !options.all) {
      console.log('Available components:');
      console.log('');
      console.log('Layout:');
      console.log('  box           Container with styling and layout');
      console.log('  stack         Flexbox-like layout container');
      console.log('');
      console.log('Input:');
      console.log('  button        Clickable button with variants');
      console.log('  input         Text input field');  
      console.log('  textarea      Multi-line text input');
      console.log('');
      console.log('Display:');
      console.log('  text          Styled text component');
      console.log('  heading       Multi-level headings');
      console.log('  badge         Status and info badges');
      console.log('');
      console.log('Feedback:');
      console.log('  spinner       Loading spinner animations');
      console.log('  progress      Progress bars and indicators');
      console.log('');
      console.log('AI:');
      console.log('  chat-layout   Complete chat interface');
      console.log('  message-list  Message history display');  
      console.log('  prompt-editor Input editor for prompts');
      console.log('');
      console.log('Usage:');
      console.log('  tui add button input        Add specific components');
      console.log('  tui add --all               Add all components');
      process.exit(0);
    }
    
    await addCommand(components, options);
  });

// Component presets
program
  .command('preset')
  .description('Manage component presets')
  .argument('<action>', 'Action to perform (list|add)')
  .argument('[name]', 'Preset name')
  .option('--force', 'Overwrite existing components', false)
  .action(async (action, name, options) => {
    await presetCommand(action, name, options);
  });

// Update components
program
  .command('update')  
  .description('Update components to latest versions')
  .argument('[components...]', 'Components to update (default: all)')
  .option('--force', 'Force update even with user modifications', false)
  .option('--check', 'Only check for updates without applying', false)
  .action(async (components, options) => {
    await updateCommand(components, options);
  });

// Legacy generate command (for compatibility)
program
  .command('generate')
  .description('Generate components, agents, or CLI templates (legacy)')
  .option('--type <type>', 'Type to generate: component|agent|cli')
  .option('--name <name>', 'Name')
  .action((opts) => {
    console.log('⚠️ The "generate" command is deprecated. Use the new commands:');
    console.log('');
    console.log('Instead of:');
    console.log('  tui generate --type=cli --name=my-app');
    console.log('');
    console.log('Use:');
    console.log('  mkdir my-app && cd my-app');
    console.log('  tui init');
    console.log('  tui preset add minimal');
    console.log('');
    
    if (opts.type === 'cli') {
      // Provide legacy support
      const targetDir = path.resolve(process.cwd(), opts.name || 'ai-cli-app');
      fs.mkdirSync(targetDir, { recursive: true });
      const srcDir = path.join(targetDir, 'src');
      fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'index.ts'), TEMPLATE, 'utf8');
      fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify({ 
        name: opts.name || 'ai-cli-app', 
        private: true, 
        scripts: { dev: 'tsx src/index.ts' }, 
        dependencies: { 
          '@tui-kit-ai/core': '*', 
          '@tui-kit-ai/ai': '*', 
          blessed: '^0.1.81', 
          tsx: '^4.17.0' 
        } 
      }, null, 2));
      console.log('✅ Created legacy AI CLI at', targetDir);
      console.log('💡 Consider using the new workflow for better experience!');
      return;
    }
    
    console.log('Generate invoked with options', opts);
  });

// Hidden dev commands
program
  .command('dev', { hidden: true })
  .description('Development utilities')
  .argument('<action>', 'Dev action')
  .action((action) => {
    console.log(`🔧 Dev action: ${action}`);
    // Add development utilities here
  });

// Global error handling and validation
program.hook('preAction', (thisCommand, actionCommand) => {
  const options = thisCommand.opts();
  
  // Set debug mode
  if (options.debug) {
    process.env.TUI_AI_DEBUG = '1';
  }
  
  // Validate API keys based on provider
  if (actionCommand.name() !== 'init' && actionCommand.name() !== 'add' && actionCommand.name() !== 'update') {
    const provider = options.provider || 'openai';
    
    if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
      console.error('❌ Missing OPENAI_API_KEY environment variable');
      console.error('   Set it with: export OPENAI_API_KEY=your_key_here');
      process.exit(1);
    }
    
    if (provider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
      console.error('❌ Missing ANTHROPIC_API_KEY environment variable');
      console.error('   Set it with: export ANTHROPIC_API_KEY=your_key_here');
      process.exit(1);
    }
    
    if (provider === 'ollama' && !process.env.OLLAMA_BASE_URL) {
      console.warn('⚠️  OLLAMA_BASE_URL not set, using default: http://localhost:11434');
      process.env.OLLAMA_BASE_URL = 'http://localhost:11434';
    }
  }
  
  // Print active configuration with precedence
  if (options.debug) {
    const provider = options.provider || process.env.TUI_PROVIDER || 'openai';
    const model = options.model || process.env.TUI_MODEL || 'gpt-4';
    const theme = process.env.TUI_THEME || 'dark';
    const stream = process.env.TUI_STREAM !== 'off' ? 'on' : 'off';
    const retries = process.env.TUI_AI_MAX_RETRIES || '2';
    
    console.log(`[tui] provider=${provider} model=${model} theme=${theme} stream=${stream} retries=${retries}`);
  }
});

// Error handling
program.configureOutput({
  outputError: (str, write) => {
    // Add some color and formatting to errors
    write(`❌ ${str}`);
  }
});

// Show help if no command provided
program.on('command:*', () => {
  console.error('❌ Invalid command: %s\\n', program.args.join(' '));
  program.help();
});

// Global error handler
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  if (process.env.TUI_AI_DEBUG === '1') {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Parse CLI arguments
program.parse();

// Show help if no arguments
if (!process.argv.slice(2).length) {
  console.log('🎯 TUI-Kit-AI - Terminal UI Components with AI Integration\\n');
  program.help();
}

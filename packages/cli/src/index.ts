#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { removeCommand } from './commands/remove';
import { updateCommand } from './commands/update';

class TUIKitCLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCLI();
  }

  private setupCLI() {
    this.program
      .name('tui-kit')
      .description('TUI Kit - Terminal UI Kit for blessed-based applications')
      .version('0.1.0');

    // Add shadcn-ui-like commands
    this.program
      .command('init')
      .description('Initialize a new TUI Kit project')
      .option('-r, --renderer <renderer>', 'Renderer to use (blessed)', 'blessed')
      .option('-f, --force', 'Force overwrite existing config')
      .action(async (options) => {
        await initCommand(options);
      });

    this.program
      .command('add <components...>')
      .description('Add TUI components to your project')
      .option('-f, --force', 'Force overwrite existing components')
      .option('-a, --all', 'Add all available components')
      .action(async (components, options) => {
        await addCommand(components, options);
      });

    this.program
      .command('list')
      .description('List all available TUI components')
      .action(async () => {
        await listCommand();
      });

    this.program
      .command('remove <components...>')
      .description('Remove TUI components from your project')
      .option('-f, --force', 'Force removal without confirmation')
      .action(async (components, options) => {
        await removeCommand(components, options);
      });

    this.program
      .command('update')
      .description('Update TUI Kit components to latest versions')
      .action(async () => {
        await updateCommand();
      });

    // Add help command
    this.program.addHelpText('after', `
Examples:
  $ tui-kit init
  $ tui-kit add button input text
  $ tui-kit add --all
  $ tui-kit list
  $ tui-kit remove button
  $ tui-kit update

For more information, visit: https://github.com/nikomatt69/tui-kit-ai
    `);
  }

  async run() {
    try {
      await this.program.parseAsync();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  const cli = new TUIKitCLI();
  cli.run();
}

export { TUIKitCLI };

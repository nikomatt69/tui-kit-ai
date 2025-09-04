#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { CreateCommand } from './commands/create';
import { DevCommand } from './commands/dev';
import { BuildCommand } from './commands/build';
import { TestCommand } from './commands/test';

class TUIKitCLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCLI();
  }

  private setupCLI() {
    this.program
      .name('tui-kit')
      .description('TUI Kit AI - Terminal UI Kit for AI Applications')
      .version('0.1.0');

    // Add commands
    this.program.addCommand(new CreateCommand().getCommand());
    this.program.addCommand(new DevCommand().getCommand());
    this.program.addCommand(new BuildCommand().getCommand());
    this.program.addCommand(new TestCommand().getCommand());

    // Add help command
    this.program.addHelpText('after', `
Examples:
  $ tui-kit create component Button
  $ tui-kit create app my-chat-app --template ai-chat
  $ tui-kit create agent CodeAssistant
  $ tui-kit dev
  $ tui-kit build
  $ tui-kit test

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

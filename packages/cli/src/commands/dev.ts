import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';

interface DevOptions {
  example?: string;
  watch?: boolean;
  port?: number;
}

export class DevCommand {
  private program: Command;

  constructor() {
    this.program = new Command('dev');
    this.setupCommand();
  }

  private setupCommand() {
    this.program
      .description('Start development server for examples or apps')
      .option('-e, --example <name>', 'Example to run (todo-agent, code-assistant, multi-agent)')
      .option('-w, --watch', 'Enable watch mode')
      .option('-p, --port <port>', 'Port to run on', '3000')
      .action(async (options: DevOptions) => {
        await this.execute(options);
      });
  }

  async execute(options: DevOptions) {
    try {
      if (options.example) {
        await this.runExample(options.example, options);
      } else {
        await this.showExamples();
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  }

  private async showExamples() {
    console.log(chalk.blue('🚀 Available Examples:'));
    console.log('');
    
    const examplesDir = path.join(process.cwd(), 'examples');
    if (await fs.pathExists(examplesDir)) {
      const examples = await fs.readdir(examplesDir);
      
      for (const example of examples) {
        const packageJsonPath = path.join(examplesDir, example, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
          const packageJson = await fs.readJson(packageJsonPath);
          console.log(chalk.green(`  ${example}`));
          console.log(chalk.gray(`    ${packageJson.description || 'No description'}`));
          console.log(chalk.yellow(`    Run: tui-kit dev --example ${example}`));
          console.log('');
        }
      }
    } else {
      console.log(chalk.yellow('No examples found. Create some examples first!'));
    }
    
    console.log(chalk.blue('Usage:'));
    console.log(chalk.gray('  tui-kit dev --example <name>'));
    console.log(chalk.gray('  tui-kit dev --example todo-agent'));
  }

  private async runExample(exampleName: string, options: DevOptions) {
    const examplePath = path.join(process.cwd(), 'examples', exampleName);
    
    if (!(await fs.pathExists(examplePath))) {
      throw new Error(`Example "${exampleName}" not found. Available examples: ${await this.getAvailableExamples().join(', ')}`);
    }

    const packageJsonPath = path.join(examplePath, 'package.json');
    if (!(await fs.pathExists(packageJsonPath))) {
      throw new Error(`Example "${exampleName}" is missing package.json`);
    }

    console.log(chalk.blue(`🚀 Starting ${exampleName}...`));
    
    // Check if dependencies are installed
    const nodeModulesPath = path.join(examplePath, 'node_modules');
    if (!(await fs.pathExists(nodeModulesPath))) {
      console.log(chalk.yellow('📦 Installing dependencies...'));
      execSync('npm install', { cwd: examplePath, stdio: 'inherit' });
    }

    // Check if build is needed
    const distPath = path.join(examplePath, 'dist');
    if (!(await fs.pathExists(distPath))) {
      console.log(chalk.yellow('🔨 Building example...'));
      execSync('npm run build', { cwd: examplePath, stdio: 'inherit' });
    }

    // Start the example
    console.log(chalk.green(`✅ Starting ${exampleName} in development mode...`));
    
    const packageJson = await fs.readJson(packageJsonPath);
    const devScript = packageJson.scripts?.dev || 'npm start';
    
    if (options.watch) {
      console.log(chalk.blue('👀 Watch mode enabled'));
      execSync(`${devScript} --watch`, { cwd: examplePath, stdio: 'inherit' });
    } else {
      execSync(devScript, { cwd: examplePath, stdio: 'inherit' });
    }
  }

  private async getAvailableExamples(): Promise<string[]> {
    const examplesDir = path.join(process.cwd(), 'examples');
    if (await fs.pathExists(examplesDir)) {
      return await fs.readdir(examplesDir);
    }
    return [];
  }

  getCommand(): Command {
    return this.program;
  }
}
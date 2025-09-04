import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';

interface BuildOptions {
  package?: string;
  watch?: boolean;
  clean?: boolean;
  production?: boolean;
}

export class BuildCommand {
  private program: Command;

  constructor() {
    this.program = new Command('build');
    this.setupCommand();
  }

  private setupCommand() {
    this.program
      .description('Build TUI Kit packages and examples')
      .option('-p, --package <name>', 'Specific package to build (core, ai, agents, providers, cli)')
      .option('-w, --watch', 'Enable watch mode')
      .option('-c, --clean', 'Clean build directory before building')
      .option('--production', 'Build for production (minified)')
      .action(async (options: BuildOptions) => {
        await this.execute(options);
      });
  }

  async execute(options: BuildOptions) {
    try {
      if (options.package) {
        await this.buildPackage(options.package, options);
      } else {
        await this.buildAll(options);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Build error: ${error.message}`));
      process.exit(1);
    }
  }

  private async buildPackage(packageName: string, options: BuildOptions) {
    const packagePath = path.join(process.cwd(), 'packages', packageName);
    
    if (!(await fs.pathExists(packagePath))) {
      throw new Error(`Package "${packageName}" not found. Available packages: ${await this.getAvailablePackages().join(', ')}`);
    }

    console.log(chalk.blue(`🔨 Building package: ${packageName}`));

    if (options.clean) {
      console.log(chalk.yellow('🧹 Cleaning build directory...'));
      execSync('npm run clean', { cwd: packagePath, stdio: 'inherit' });
    }

    const buildScript = options.watch ? 'npm run dev' : 'npm run build';
    
    if (options.watch) {
      console.log(chalk.blue('👀 Watch mode enabled'));
      execSync(buildScript, { cwd: packagePath, stdio: 'inherit' });
    } else {
      execSync(buildScript, { cwd: packagePath, stdio: 'inherit' });
      console.log(chalk.green(`✅ Package ${packageName} built successfully`));
    }
  }

  private async buildAll(options: BuildOptions) {
    console.log(chalk.blue('🔨 Building all packages...'));

    const packages = await this.getAvailablePackages();
    
    for (const packageName of packages) {
      try {
        await this.buildPackage(packageName, options);
      } catch (error) {
        console.error(chalk.red(`❌ Failed to build ${packageName}: ${error.message}`));
        if (!options.watch) {
          process.exit(1);
        }
      }
    }

    if (!options.watch) {
      console.log(chalk.green('✅ All packages built successfully'));
    }
  }

  private async getAvailablePackages(): Promise<string[]> {
    const packagesDir = path.join(process.cwd(), 'packages');
    if (await fs.pathExists(packagesDir)) {
      return await fs.readdir(packagesDir);
    }
    return [];
  }

  getCommand(): Command {
    return this.program;
  }
}
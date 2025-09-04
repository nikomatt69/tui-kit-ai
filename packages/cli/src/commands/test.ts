import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';

interface TestOptions {
  package?: string;
  watch?: boolean;
  coverage?: boolean;
  verbose?: boolean;
}

export class TestCommand {
  private program: Command;

  constructor() {
    this.program = new Command('test');
    this.setupCommand();
  }

  private setupCommand() {
    this.program
      .description('Run tests for TUI Kit packages')
      .option('-p, --package <name>', 'Specific package to test (core, ai, agents, providers, cli)')
      .option('-w, --watch', 'Enable watch mode')
      .option('-c, --coverage', 'Generate coverage report')
      .option('-v, --verbose', 'Verbose output')
      .action(async (options: TestOptions) => {
        await this.execute(options);
      });
  }

  async execute(options: TestOptions) {
    try {
      if (options.package) {
        await this.testPackage(options.package, options);
      } else {
        await this.testAll(options);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Test error: ${error.message}`));
      process.exit(1);
    }
  }

  private async testPackage(packageName: string, options: TestOptions) {
    const packagePath = path.join(process.cwd(), 'packages', packageName);
    
    if (!(await fs.pathExists(packagePath))) {
      throw new Error(`Package "${packageName}" not found. Available packages: ${await this.getAvailablePackages().join(', ')}`);
    }

    const packageJsonPath = path.join(packagePath, 'package.json');
    if (!(await fs.pathExists(packageJsonPath))) {
      throw new Error(`Package ${packageName} is missing package.json`);
    }

    const packageJson = await fs.readJson(packageJsonPath);
    
    if (!packageJson.scripts?.test) {
      console.log(chalk.yellow(`⚠️ Package ${packageName} has no test script`));
      return;
    }

    console.log(chalk.blue(`🧪 Testing package: ${packageName}`));

    const testScript = options.watch ? 'npm run test:watch' : 'npm run test';
    const args = [];
    
    if (options.coverage) {
      args.push('--coverage');
    }
    
    if (options.verbose) {
      args.push('--verbose');
    }

    try {
      execSync(`${testScript} ${args.join(' ')}`, { 
        cwd: packagePath, 
        stdio: 'inherit' 
      });
      
      if (!options.watch) {
        console.log(chalk.green(`✅ Package ${packageName} tests passed`));
      }
    } catch (error) {
      if (!options.watch) {
        throw new Error(`Tests failed for package ${packageName}`);
      }
    }
  }

  private async testAll(options: TestOptions) {
    console.log(chalk.blue('🧪 Running tests for all packages...'));

    const packages = await this.getAvailablePackages();
    let failedPackages: string[] = [];
    
    for (const packageName of packages) {
      try {
        await this.testPackage(packageName, options);
      } catch (error) {
        failedPackages.push(packageName);
        if (!options.watch) {
          console.error(chalk.red(`❌ Tests failed for ${packageName}: ${error.message}`));
        }
      }
    }

    if (!options.watch) {
      if (failedPackages.length === 0) {
        console.log(chalk.green('✅ All package tests passed'));
      } else {
        console.error(chalk.red(`❌ Tests failed for packages: ${failedPackages.join(', ')}`));
        process.exit(1);
      }
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
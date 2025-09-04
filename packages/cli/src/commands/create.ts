#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';

interface CreateOptions {
  type: 'component' | 'app' | 'agent' | 'hook' | 'provider';
  name: string;
  template?: string;
  package?: string;
  force?: boolean;
}

export class CreateCommand {
  private program: Command;

  constructor() {
    this.program = new Command('create');
    this.setupCommand();
  }

  private setupCommand() {
    this.program
      .description('Create new TUI Kit components, apps, or agents')
      .argument('<type>', 'Type of item to create (component|app|agent|hook|provider)')
      .argument('<name>', 'Name of the item to create')
      .option('-t, --template <template>', 'Template to use')
      .option('-p, --package <package>', 'Package to create in (default: core)')
      .option('-f, --force', 'Force overwrite existing files')
      .action(async (type: string, name: string, options: any) => {
        await this.execute({
          type: type as CreateOptions['type'],
          name,
          template: options.template,
          package: options.package,
          force: options.force,
        });
      });
  }

  async execute(options: CreateOptions) {
    try {
      console.log(chalk.blue(`🚀 Creating ${options.type}: ${options.name}`));

      switch (options.type) {
        case 'component':
          await this.createComponent(options);
          break;
        case 'app':
          await this.createApp(options);
          break;
        case 'agent':
          await this.createAgent(options);
          break;
        case 'hook':
          await this.createHook(options);
          break;
        case 'provider':
          await this.createProvider(options);
          break;
        default:
          throw new Error(`Unknown type: ${options.type}`);
      }

      console.log(chalk.green(`✅ Successfully created ${options.type}: ${options.name}`));
    } catch (error) {
      console.error(chalk.red(`❌ Error creating ${options.type}: ${error.message}`));
      process.exit(1);
    }
  }

  private async createComponent(options: CreateOptions) {
    const packageName = options.package || 'core';
    const componentPath = path.join(process.cwd(), 'packages', packageName, 'src', 'components', options.name);
    
    if (await fs.pathExists(componentPath) && !options.force) {
      throw new Error(`Component ${options.name} already exists. Use --force to overwrite.`);
    }

    await fs.ensureDir(componentPath);

    // Create component files
    const files = [
      {
        name: 'index.ts',
        content: this.generateComponentIndex(options.name),
      },
      {
        name: `${options.name}.ts`,
        content: this.generateComponentClass(options.name),
      },
      {
        name: `${options.name}.types.ts`,
        content: this.generateComponentTypes(options.name),
      },
      {
        name: `${options.name}.styles.ts`,
        content: this.generateComponentStyles(options.name),
      },
      {
        name: `${options.name}.test.ts`,
        content: this.generateComponentTest(options.name),
      },
    ];

    for (const file of files) {
      await fs.writeFile(path.join(componentPath, file.name), file.content);
    }

    // Update components index
    await this.updateComponentsIndex(packageName, options.name);
  }

  private async createApp(options: CreateOptions) {
    const appPath = path.join(process.cwd(), 'examples', options.name);
    
    if (await fs.pathExists(appPath) && !options.force) {
      throw new Error(`App ${options.name} already exists. Use --force to overwrite.`);
    }

    const template = options.template || 'basic-app';
    const templatePath = path.join(process.cwd(), 'templates', template);
    
    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template ${template} not found. Available templates: basic-app, ai-chat, agent-system`);
    }

    await fs.copy(templatePath, appPath);
    
    // Update package.json
    const packageJsonPath = path.join(appPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = options.name;
      packageJson.description = `Example ${options.name} app using TUI Kit AI`;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    console.log(chalk.blue(`📁 App created at: ${appPath}`));
    console.log(chalk.yellow(`📦 Run: cd examples/${options.name} && npm install`));
  }

  private async createAgent(options: CreateOptions) {
    const agentPath = path.join(process.cwd(), 'packages', 'agents', 'src', 'custom', options.name);
    
    if (await fs.pathExists(agentPath) && !options.force) {
      throw new Error(`Agent ${options.name} already exists. Use --force to overwrite.`);
    }

    await fs.ensureDir(agentPath);

    const files = [
      {
        name: 'index.ts',
        content: this.generateAgentIndex(options.name),
      },
      {
        name: `${options.name}.ts`,
        content: this.generateAgentClass(options.name),
      },
      {
        name: `${options.name}.types.ts`,
        content: this.generateAgentTypes(options.name),
      },
      {
        name: `${options.name}.test.ts`,
        content: this.generateAgentTest(options.name),
      },
    ];

    for (const file of file) {
      await fs.writeFile(path.join(agentPath, file.name), file.content);
    }
  }

  private async createHook(options: CreateOptions) {
    const packageName = options.package || 'ai';
    const hookPath = path.join(process.cwd(), 'packages', packageName, 'src', 'hooks', options.name);
    
    if (await fs.pathExists(hookPath) && !options.force) {
      throw new Error(`Hook ${options.name} already exists. Use --force to overwrite.`);
    }

    await fs.ensureDir(hookPath);

    const files = [
      {
        name: 'index.ts',
        content: this.generateHookIndex(options.name),
      },
      {
        name: `${options.name}.ts`,
        content: this.generateHookImplementation(options.name),
      },
      {
        name: `${options.name}.types.ts`,
        content: this.generateHookTypes(options.name),
      },
    ];

    for (const file of files) {
      await fs.writeFile(path.join(hookPath, file.name), file.content);
    }
  }

  private async createProvider(options: CreateOptions) {
    const providerPath = path.join(process.cwd(), 'packages', 'providers', 'src', options.name);
    
    if (await fs.pathExists(providerPath) && !options.force) {
      throw new Error(`Provider ${options.name} already exists. Use --force to overwrite.`);
    }

    await fs.ensureDir(providerPath);

    const files = [
      {
        name: 'index.ts',
        content: this.generateProviderIndex(options.name),
      },
      {
        name: `${options.name}.ts`,
        content: this.generateProviderClass(options.name),
      },
      {
        name: `${options.name}.types.ts`,
        content: this.generateProviderTypes(options.name),
      },
      {
        name: `${options.name}.test.ts`,
        content: this.generateProviderTest(options.name),
      },
    ];

    for (const file of files) {
      await fs.writeFile(path.join(providerPath, file.name), file.content);
    }
  }

  // Template generators
  private generateComponentIndex(name: string): string {
    return `export { ${name} } from './${name}';\nexport type { ${name}Props } from './${name}.types';\n`;
  }

  private generateComponentClass(name: string): string {
    return `import { Widgets } from 'blessed';\nimport { BaseProps, Component, createBoxBase } from '../BaseComponent';\nimport { ${name}Props } from './${name}.types';\nimport { ${name}Styles } from './${name}.styles';\n\nexport class ${name} implements Component<Widgets.BoxElement> {\n  el: Widgets.BoxElement;\n  theme: any;\n  destroy: () => void;\n  \n  constructor(props: ${name}Props) {\n    const comp = createBoxBase<Widgets.BoxElement>({\n      ...props,\n      style: ${name}Styles.getStyle(props)\n    });\n    \n    this.el = comp.el;\n    this.theme = comp.theme;\n    this.destroy = comp.destroy;\n    \n    this.setupEventHandlers(props);\n  }\n  \n  private setupEventHandlers(props: ${name}Props) {\n    // Setup event handlers here\n  }\n  \n  // Variant system methods\n  setVariant(variant: string) {\n    this.el.style = ${name}Styles.getStyle({ ...this.props, variant });\n  }\n  \n  setSize(size: string) {\n    this.el.style = ${name}Styles.getStyle({ ...this.props, size });\n  }\n}\n`;
  }

  private generateComponentTypes(name: string): string {
    return `import { BaseProps } from '../BaseComponent';\n\nexport interface ${name}Props extends BaseProps {\n  // Add your component-specific props here\n}\n\nexport type ${name}Variants = 'default' | 'primary' | 'secondary';\nexport type ${name}Sizes = 'sm' | 'md' | 'lg';\n`;
  }

  private generateComponentStyles(name: string): string {
    return `import { ${name}Props } from './${name}.types';\nimport { tokens } from '../../theming/tokens';\n\nexport class ${name}Styles {\n  static getStyle(props: ${name}Props) {\n    const baseStyle = {\n      bg: tokens.colors.gray[100],\n      fg: tokens.colors.gray[900],\n      border: {\n        type: 'line',\n        fg: tokens.colors.gray[300],\n      },\n    };\n    \n    // Apply variants and sizes here\n    \n    return baseStyle;\n  }\n}\n`;
  }

  private generateComponentTest(name: string): string {
    return `import { ${name} } from './${name}';\nimport { createMockScreen } from '../../test-utils';\n\ndescribe('${name}', () => {\n  let screen: any;\n  \n  beforeEach(() => {\n    screen = createMockScreen();\n  });\n  \n  it('should render correctly', () => {\n    const component = new ${name}({\n      parent: screen\n    });\n    \n    expect(component.el).toBeDefined();\n  });\n});\n`;
  }

  // Agent template generators
  private generateAgentIndex(name: string): string {
    return `export { ${name} } from './${name}';\nexport type { ${name}Config } from './${name}.types';\n`;
  }

  private generateAgentClass(name: string): string {
    return `import { BaseAgent, AgentConfig } from '../../base/BaseAgent';\nimport { ${name}Config } from './${name}.types';\n\nexport class ${name} extends BaseAgent {\n  private config: ${name}Config;\n  \n  constructor(config: ${name}Config) {\n    super(config);\n    this.config = config;\n  }\n  \n  async start() {\n    // Initialize your agent\n    console.log('Starting ${name} agent...');\n  }\n  \n  async stop() {\n    // Cleanup your agent\n    console.log('Stopping ${name} agent...');\n  }\n  \n  // Add your agent-specific methods here\n}\n`;
  }

  private generateAgentTypes(name: string): string {
    return `import { AgentConfig } from '../../base/BaseAgent';\n\nexport interface ${name}Config extends AgentConfig {\n  // Add your agent-specific config here\n}\n`;
  }

  private generateAgentTest(name: string): string {
    return `import { ${name} } from './${name}';\n\ndescribe('${name}', () => {\n  it('should create agent instance', () => {\n    const agent = new ${name}({\n      name: 'test-${name}',\n      description: 'Test agent'\n    });\n    \n    expect(agent).toBeDefined();\n  });\n});\n`;
  }

  // Hook template generators
  private generateHookIndex(name: string): string {
    return `export { use${name} } from './${name}';\nexport type { Use${name}Options, Use${name}Return } from './${name}.types';\n`;
  }

  private generateHookImplementation(name: string): string {
    return `import { Use${name}Options, Use${name}Return } from './${name}.types';\n\nexport function use${name}(options: Use${name}Options): Use${name}Return {\n  // Implement your hook logic here\n  \n  return {\n    // Return your hook values\n  };\n}\n`;
  }

  private generateHookTypes(name: string): string {
    return `export interface Use${name}Options {\n  // Add your hook options here\n}\n\nexport interface Use${name}Return {\n  // Add your hook return values here\n}\n`;
  }

  // Provider template generators
  private generateProviderIndex(name: string): string {
    return `export { ${name}Provider } from './${name}';\nexport type { ${name}Config, ${name}Response } from './${name}.types';\n`;
  }

  private generateProviderClass(name: string): string {
    return `import { BaseProvider, ProviderConfig } from '../base/BaseProvider';\nimport { ${name}Config, ${name}Response } from './${name}.types';\n\nexport class ${name}Provider extends BaseProvider {\n  private config: ${name}Config;\n  \n  constructor(config: ${name}Config) {\n    super(config);\n    this.config = config;\n  }\n  \n  async generateText(prompt: string): Promise<${name}Response> {\n    // Implement your provider logic here\n    throw new Error('Not implemented');\n  }\n}\n`;
  }

  private generateProviderTypes(name: string): string {
    return `export interface ${name}Config {\n  apiKey: string;\n  // Add your provider-specific config here\n}\n\nexport interface ${name}Response {\n  text: string;\n  // Add your provider-specific response here\n}\n`;
  }

  private generateProviderTest(name: string): string {
    return `import { ${name}Provider } from './${name}';\n\ndescribe('${name}Provider', () => {\n  it('should create provider instance', () => {\n    const provider = new ${name}Provider({\n      apiKey: 'test-key'\n    });\n    \n    expect(provider).toBeDefined();\n  });\n});\n`;
  }

  private async updateComponentsIndex(packageName: string, componentName: string) {
    const indexPath = path.join(process.cwd(), 'packages', packageName, 'src', 'components', 'index.ts');
    
    if (await fs.pathExists(indexPath)) {
      let content = await fs.readFile(indexPath, 'utf-8');
      content += `export { ${componentName} } from './${componentName}';\n`;
      await fs.writeFile(indexPath, content);
    }
  }

  getCommand(): Command {
    return this.program;
  }
}
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface RemoveOptions {
  force?: boolean;
}

export async function removeCommand(
  components: string[],
  options: RemoveOptions = {}
) {
  const { force = false } = options;
  const cwd = process.cwd();
  const configPath = path.join(cwd, 'tui.config.ts');

  // Check if project is initialized
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('❌ No tui.config.ts found. Run "tui-kit init" first.'));
    process.exit(1);
  }

  const componentsDir = path.join(cwd, 'src', 'components', 'ui');

  if (!fs.existsSync(componentsDir)) {
    console.log(chalk.yellow('⚠️ No components directory found. Nothing to remove.'));
    return;
  }

  console.log(chalk.blue('🗑️ Removing TUI components...\n'));

  let removedComponents = [];

  for (const componentName of components) {
    const componentFile = path.join(componentsDir, `${componentName}.ts`);
    
    if (!fs.existsSync(componentFile)) {
      console.warn(chalk.yellow(`⚠️ Component ${componentName} not found`));
      continue;
    }

    // Ask for confirmation if not forced
    if (!force) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Remove ${componentName} component?`,
          default: false
        }
      ]);

      if (!confirm) {
        console.log(chalk.gray(`⏭️ Skipped ${componentName}`));
        continue;
      }
    }

    try {
      fs.unlinkSync(componentFile);
      console.log(chalk.green(`✅ Removed ${componentName}`));
      removedComponents.push(componentName);
    } catch (error) {
      console.error(chalk.red(`❌ Failed to remove ${componentName}:`), error.message);
    }
  }

  if (removedComponents.length > 0) {
    console.log(chalk.green(`\n🎉 Successfully removed ${removedComponents.length} component(s):`));
    removedComponents.forEach(comp => console.log(chalk.gray(`  - ${comp}`)));
  } else {
    console.log(chalk.yellow('\n⚠️ No components were removed.'));
  }
}
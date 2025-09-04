import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { COMPONENTS } from './registry';

export async function updateCommand() {
  const cwd = process.cwd();
  const configPath = path.join(cwd, 'tui.config.ts');

  // Check if project is initialized
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('❌ No tui.config.ts found. Run "tui-kit init" first.'));
    process.exit(1);
  }

  const componentsDir = path.join(cwd, 'src', 'components', 'ui');

  if (!fs.existsSync(componentsDir)) {
    console.log(chalk.yellow('⚠️ No components directory found. Nothing to update.'));
    return;
  }

  console.log(chalk.blue('🔄 Updating TUI components...\n'));

  let updatedComponents = [];
  let skippedComponents = [];

  // Get all existing component files
  const existingFiles = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts');

  for (const file of existingFiles) {
    const componentName = file.replace('.ts', '');
    const component = COMPONENTS[componentName as keyof typeof COMPONENTS];

    if (!component) {
      console.warn(chalk.yellow(`⚠️ Unknown component: ${componentName}`));
      skippedComponents.push(componentName);
      continue;
    }

    const filePath = path.join(componentsDir, file);
    const existingContent = fs.readFileSync(filePath, 'utf8');
    const newContent = component.template();

    // Simple check: if content is different, update it
    if (existingContent !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(chalk.green(`✅ Updated ${component.name}`));
      updatedComponents.push(component.name);
    } else {
      console.log(chalk.gray(`⏭️ ${component.name} is already up to date`));
    }
  }

  if (updatedComponents.length > 0) {
    console.log(chalk.green(`\n🎉 Successfully updated ${updatedComponents.length} component(s)!`));
    updatedComponents.forEach(comp => console.log(chalk.gray(`  - ${comp}`)));
  } else {
    console.log(chalk.green('\n✨ All components are up to date!'));
  }

  if (skippedComponents.length > 0) {
    console.log(chalk.yellow(`\n⚠️ Skipped ${skippedComponents.length} component(s):`));
    skippedComponents.forEach(comp => console.log(chalk.gray(`  - ${comp}`)));
  }
}
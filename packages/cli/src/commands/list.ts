import chalk from 'chalk';
import { COMPONENTS } from './registry';

export async function listCommand() {
  console.log(chalk.blue('📋 Available TUI Components:\n'));

  const categories = {
    'Layout': ['box', 'stack', 'grid', 'flex'],
    'Input': ['button', 'input', 'textarea', 'select', 'checkbox', 'radio'],
    'Display': ['text', 'list', 'table', 'progress', 'loading'],
    'Navigation': ['menu', 'tabs', 'breadcrumb'],
    'Feedback': ['alert', 'modal', 'tooltip', 'notification'],
    'Data': ['chart', 'tree', 'calendar']
  };

  for (const [category, componentNames] of Object.entries(categories)) {
    console.log(chalk.yellow(`📁 ${category}`));
    
    for (const componentName of componentNames) {
      const component = COMPONENTS[componentName as keyof typeof COMPONENTS];
      if (component) {
        console.log(`  ${chalk.green('✓')} ${componentName.padEnd(12)} - ${component.description}`);
      }
    }
    console.log('');
  }

  console.log(chalk.gray('Usage: tui-kit add <component-name>'));
  console.log(chalk.gray('Example: tui-kit add button input text'));
}
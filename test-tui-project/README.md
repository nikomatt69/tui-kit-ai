# TUI Kit CLI Demo

This project demonstrates how the TUI Kit CLI works, similar to shadcn-ui but for blessed-based terminal UI components.

## How the CLI Works

The TUI Kit CLI provides commands similar to shadcn-ui:

### 1. Initialize a Project
```bash
tui-kit init
```
This creates:
- `tui.config.ts` - Configuration file
- `src/components/ui/` - Directory for UI components
- `src/lib/utils.ts` - Utility functions
- `src/types/index.ts` - TypeScript type definitions
- Installs required dependencies (blessed, @types/blessed, tsx, typescript)

### 2. Add Components
```bash
tui-kit add button input text
```
This adds blessed-based TUI components to your project:
- `src/components/ui/button.ts` - Interactive button component
- `src/components/ui/input.ts` - Text input component
- `src/components/ui/text.ts` - Text display component
- Updates `src/components/ui/index.ts` with exports

### 3. List Available Components
```bash
tui-kit list
```
Shows all available components organized by category:
- Layout: box, stack, grid, flex
- Input: button, input, textarea, select, checkbox, radio
- Display: text, list, table, progress, loading
- Navigation: menu, tabs, breadcrumb
- Feedback: alert, modal, tooltip, notification
- Data: chart, tree, calendar

### 4. Remove Components
```bash
tui-kit remove button input
```
Removes specified components from your project.

### 5. Update Components
```bash
tui-kit update
```
Updates all components to their latest versions.

## Component Features

Each component includes:
- **TypeScript support** with proper type definitions
- **Blessed integration** for terminal UI rendering
- **Consistent styling** with variant support
- **Event handling** for user interactions
- **Accessibility** with keyboard navigation
- **Customizable props** for different use cases

## Example Usage

```typescript
import { ButtonComponent } from './components/ui/button';
import { InputComponent } from './components/ui/input';

// Create a button with different variants
const primaryButton = ButtonComponent({
  variant: 'primary',
  children: 'Click me!',
  onClick: () => console.log('Button clicked!')
});

// Create an input field
const input = InputComponent({
  placeholder: 'Enter text...',
  onChange: (value) => console.log('Input:', value)
});
```

## Benefits of TUI Kit CLI

1. **Copy-paste approach**: Components are copied to your project, not installed as dependencies
2. **Full customization**: You own the component code and can modify it as needed
3. **Type safety**: Full TypeScript support with proper type definitions
4. **Blessed integration**: Built specifically for blessed terminal UI library
5. **Consistent API**: All components follow the same patterns and conventions
6. **Easy updates**: Update components individually or all at once

## Running the Demo

```bash
# Install dependencies
npm install

# Run the demo application
npm run dev
```

Use Tab to navigate between components, Enter to activate buttons, and Escape/q/Ctrl+C to quit.
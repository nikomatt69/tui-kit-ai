import { execSync } from "child_process";
import fs from "fs";
import path from "path";

interface AddOptions {
  force?: boolean;
  all?: boolean;
}

// Component registry with copy-paste templates
const COMPONENTS = {
  // Layout
  box: {
    name: "Box",
    path: "box.ts",
    dependencies: ["blessed"],
    template: generateBoxComponent,
  },
  stack: {
    name: "Stack",
    path: "stack.ts",
    dependencies: ["blessed"],
    template: generateStackComponent,
  },

  // Input
  button: {
    name: "Button",
    path: "button.ts",
    dependencies: ["blessed", "class-variance-authority"],
    template: generateButtonComponent,
  },
  input: {
    name: "Input",
    path: "input.ts",
    dependencies: ["blessed", "class-variance-authority"],
    template: generateInputComponent,
  },
  textarea: {
    name: "Textarea",
    path: "textarea.ts",
    dependencies: ["blessed"],
    template: generateTextareaComponent,
  },

  // Display
  text: {
    name: "Text",
    path: "text.ts",
    dependencies: ["blessed", "class-variance-authority"],
    template: generateTextComponent,
  },
  heading: {
    name: "Heading",
    path: "heading.ts",
    dependencies: ["blessed"],
    template: generateHeadingComponent,
  },
  badge: {
    name: "Badge",
    path: "badge.ts",
    dependencies: ["blessed", "class-variance-authority"],
    template: generateBadgeComponent,
  },

  // Feedback
  spinner: {
    name: "Spinner",
    path: "spinner.ts",
    dependencies: ["blessed"],
    template: generateSpinnerComponent,
  },
  progress: {
    name: "Progress",
    path: "progress.ts",
    dependencies: ["blessed"],
    template: generateProgressComponent,
  },

  // AI Components
  "chat-layout": {
    name: "ChatLayout",
    path: "chat-layout.ts",
    dependencies: ["blessed", "ai"],
    template: generateChatLayoutComponent,
  },
  "message-list": {
    name: "MessageList",
    path: "message-list.ts",
    dependencies: ["blessed", "ai"],
    template: generateMessageListComponent,
  },
  "prompt-editor": {
    name: "PromptEditor",
    path: "prompt-editor.ts",
    dependencies: ["blessed"],
    template: generatePromptEditorComponent,
  },
};

export async function addCommand(
  components: string[],
  options: AddOptions = {}
) {
  const { force = false, all = false } = options;
  const cwd = process.cwd();
  const configPath = path.join(cwd, "tui.config.ts");

  // Check if project is initialized
  if (!fs.existsSync(configPath)) {
    console.error('❌ No tui.config.ts found. Run "tui init" first.');
    process.exit(1);
  }

  // Determine components to add
  const componentsToAdd = all ? Object.keys(COMPONENTS) : components;

  if (componentsToAdd.length === 0) {
    console.error("❌ No components specified. Available components:");
    console.log(
      Object.keys(COMPONENTS)
        .map((c) => `  ${c}`)
        .join("\n")
    );
    process.exit(1);
  }

  const componentsDir = path.join(cwd, "src", "components", "ui");

  // Ensure components directory exists
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  console.log("🔄 Adding components...");

  let addedComponents = [];
  let allDependencies = new Set<string>();

  for (const componentName of componentsToAdd) {
    const component = COMPONENTS[componentName as keyof typeof COMPONENTS];

    if (!component) {
      console.warn(`⚠️ Unknown component: ${componentName}`);
      continue;
    }

    const filePath = path.join(componentsDir, component.path);

    // Check if component already exists
    if (fs.existsSync(filePath) && !force) {
      console.warn(
        `⚠️ ${component.name} already exists. Use --force to overwrite.`
      );
      continue;
    }

    // Generate component code
    const componentCode = component.template();
    fs.writeFileSync(filePath, componentCode, "utf8");

    console.log(`✅ Added ${component.name}`);
    addedComponents.push(component.name);

    // Collect dependencies
    component.dependencies.forEach((dep) => allDependencies.add(dep));
  }

  // Install missing dependencies
  if (allDependencies.size > 0) {
    console.log("📦 Checking dependencies...");

    const packageJsonPath = path.join(cwd, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const existingDeps = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      };

      const missingDeps = Array.from(allDependencies).filter(
        (dep) => !existingDeps[dep]
      );

      if (missingDeps.length > 0) {
        console.log(
          `⚙️ Installing missing dependencies: ${missingDeps.join(", ")}`
        );
        try {
          if (fs.existsSync("yarn.lock")) {
            execSync(`yarn add ${missingDeps.join(" ")}`, { stdio: "inherit" });
          } else {
            execSync(`npm install ${missingDeps.join(" ")}`, {
              stdio: "inherit",
            });
          }
        } catch (error) {
          console.warn(
            `⚠️ Could not install dependencies automatically: ${missingDeps.join(
              ", "
            )}`
          );
        }
      }
    }
  }

  // Generate index.ts with exports
  generateIndexFile(componentsDir, addedComponents);

  console.log(`\n🎉 Successfully added ${addedComponents.length} components!`);
  console.log("\\nYou can now import them:");
  addedComponents.forEach((comp) => {
    console.log(`  import { ${comp} } from './components/ui';`);
  });
}

function generateIndexFile(componentsDir: string, components: string[]) {
  const indexPath = path.join(componentsDir, "index.ts");
  let indexContent = "";

  // Read existing index if it exists
  if (fs.existsSync(indexPath)) {
    indexContent = fs.readFileSync(indexPath, "utf8");
  }

  // Add exports for new components
  components.forEach((componentName) => {
    const component =
      COMPONENTS[componentName.toLowerCase() as keyof typeof COMPONENTS];
    if (
      component &&
      !indexContent.includes(
        `export * from './${component.path.replace(".ts", "")}';`
      )
    ) {
      indexContent += `export * from './${component.path.replace(".ts", "")}`;
    }
  });

  fs.writeFileSync(indexPath, indexContent, "utf8");
}

// Component template generators
function generateBoxComponent(): string {
  return `import blessed from 'blessed';
import { cn, resolveBlessedColor } from '../../lib/utils';
import config from '../../../tui.config';

export interface BoxProps {
  parent?: blessed.Widgets.Node;
  children?: blessed.Widgets.Node[];
  
  // Layout
  top?: string | number;
  left?: string | number;
  width?: string | number;
  height?: string | number;
  right?: string | number;
  bottom?: string | number;
  
  // Styling
  bg?: string;
  fg?: string;
  border?: keyof typeof config.tokens.borderStyle;
  borderColor?: string;
  radius?: keyof typeof config.tokens.radius;
  
  // Spacing
  p?: number;  // padding
  px?: number; // horizontal padding
  py?: number; // vertical padding
  pt?: number; // padding-top
  pr?: number; // padding-right  
  pb?: number; // padding-bottom
  pl?: number; // padding-left
  
  // Content
  content?: string;
  label?: string;
  
  // Behavior
  scrollable?: boolean;
  hidden?: boolean;
  focusable?: boolean;
  
  // Events
  onClick?: () => void;
}

export class Box {
  public el: blessed.Widgets.BoxElement;
  
  constructor(props: BoxProps) {
    const {
      parent,
      children,
      bg,
      fg, 
      border = 'none',
      borderColor,
      radius,
      p, px, py, pt, pr, pb, pl,
      scrollable = false,
      hidden = false,
      focusable = false,
      onClick,
      ...restProps
    } = props;
    
    // Resolve colors from tokens
    const resolvedBg = bg ? resolveBlessedColor(bg, config.tokens) : undefined;
    const resolvedFg = fg ? resolveBlessedColor(fg, config.tokens) : undefined;
    const resolvedBorderColor = borderColor ? resolveBlessedColor(borderColor, config.tokens) : undefined;
    
    // Calculate padding
    const padding = this.resolvePadding({ p, px, py, pt, pr, pb, pl });
    
    // Create blessed box
    this.el = blessed.box({
      parent,
      scrollable,
      hidden,
      mouse: !!onClick,
      keys: focusable,
      
      // Styling
      style: {
        bg: resolvedBg,
        fg: resolvedFg,
        border: {
          fg: resolvedBorderColor || resolvedFg
        }
      },
      
      // Border
      border: border !== 'none' ? {
        type: config.tokens.borderStyle[border]
      } : undefined,
      
      // Padding
      padding,
      
      ...restProps
    });
    
    // Add children
    if (children) {
      children.forEach(child => {
        child.parent = this.el;
      });
    }
    
    // Event handlers
    if (onClick) {
      this.el.on('click', onClick);
    }
  }
  
  private resolvePadding(padding: any) {
    const { p, px, py, pt, pr, pb, pl } = padding;
    
    return {
      top: pt ?? py ?? p ?? 0,
      right: pr ?? px ?? p ?? 0, 
      bottom: pb ?? py ?? p ?? 0,
      left: pl ?? px ?? p ?? 0
    };
  }
  
  // Utility methods
  setContent(content: string) {
    this.el.setContent(content);
  }
  
  focus() {
    this.el.focus();
  }
  
  hide() {
    this.el.hide();
  }
  
  show() {
    this.el.show();
  }
}

export default Box;
`;
}

function generateButtonComponent(): string {
  return `import blessed from 'blessed';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, resolveBlessedColor } from '../../lib/utils';
import config from '../../../tui.config';

const buttonVariants = cva('', {
  variants: config.variants.button,
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    tone: 'neutral'
  }
});

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  parent?: blessed.Widgets.Node;
  
  // Layout
  top?: string | number;
  left?: string | number;
  width?: string | number;
  height?: string | number;
  right?: string | number;
  bottom?: string | number;
  
  // Content
  text?: string;
  children?: string;
  
  // Behavior
  disabled?: boolean;
  focusable?: boolean;
  
  // Events
  onPress?: () => void;
  onClick?: () => void;
}

export class Button {
  public el: blessed.Widgets.ButtonElement;
  private isPressed = false;
  
  constructor(props: ButtonProps) {
    const {
      parent,
      variant = 'primary',
      size = 'md',
      tone = 'neutral',
      text,
      children,
      disabled = false,
      focusable = true,
      onPress,
      onClick,
      ...restProps
    } = props;
    
    const content = text || children || '';
    
    // Get variant styles
    const variantStyles = config.variants.button;
    const baseStyle = {
      ...variantStyles.variant[variant],
      ...variantStyles.size[size],
      ...variantStyles.tone[tone]
    };
    
    // Resolve colors
    const resolvedBg = baseStyle.bg ? resolveBlessedColor(baseStyle.bg, config.tokens) : undefined;
    const resolvedFg = baseStyle.fg ? resolveBlessedColor(baseStyle.fg, config.tokens) : undefined;
    const resolvedBorder = baseStyle.border ? resolveBlessedColor(baseStyle.border, config.tokens) : undefined;
    
    this.el = blessed.button({
      parent,
      content,
      mouse: !disabled,
      keys: focusable && !disabled,
      
      style: {
        bg: resolvedBg,
        fg: resolvedFg,
        border: {
          fg: resolvedBorder
        },
        
        // Focus styles
        focus: {
          bg: disabled ? resolvedBg : this.lightenColor(resolvedBg),
          fg: resolvedFg,
          bold: true
        },
        
        // Hover styles (mouse)
        hover: disabled ? {} : {
          bg: this.lightenColor(resolvedBg),
          fg: resolvedFg
        }
      },
      
      border: baseStyle.border !== 'transparent' ? {
        type: 'line'
      } : undefined,
      
      height: baseStyle.height || 3,
      padding: {
        left: baseStyle.px || 2,
        right: baseStyle.px || 2,
        top: 0,
        bottom: 0
      },
      
      ...restProps
    });
    
    // Event handlers
    const handlePress = () => {
      if (disabled) return;
      
      this.isPressed = true;
      this.el.style.bg = this.darkenColor(resolvedBg);
      this.el.screen?.render();
      
      setTimeout(() => {
        this.isPressed = false;
        this.el.style.bg = resolvedBg;
        this.el.screen?.render();
      }, 100);
      
      onPress?.();
      onClick?.();
    };
    
    this.el.on('press', handlePress);
    this.el.on('click', handlePress);
  }
  
  private lightenColor(color?: string): string {
    // Simple color lightening for hover effect
    if (!color || color === 'transparent') return color || '';
    
    // For hex colors, increase brightness
    if (color.startsWith('#')) {
      // Simple hex lightening
      return color;
    }
    
    return color;
  }
  
  private darkenColor(color?: string): string {
    // Simple color darkening for pressed effect  
    if (!color || color === 'transparent') return color || '';
    return color;
  }
  
  // Utility methods
  press() {
    this.el.press();
  }
  
  focus() {
    this.el.focus();
  }
  
  disable() {
    this.el.style.fg = '#666666';
    this.el.mouse = false;
  }
  
  enable() {
    this.el.mouse = true;
  }
}

export default Button;
`;
}

function generateInputComponent(): string {
  return `import blessed from 'blessed';
import { cva, type VariantProps } from 'class-variance-authority';
import { resolveBlessedColor } from '../../lib/utils';
import config from '../../../tui.config';

const inputVariants = cva('', {
  variants: config.variants.input,
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
});

export interface InputProps extends VariantProps<typeof inputVariants> {
  parent?: blessed.Widgets.Node;
  
  // Layout
  top?: string | number;
  left?: string | number;
  width?: string | number;
  height?: string | number;
  right?: string | number;
  bottom?: string | number;
  
  // Input
  placeholder?: string;
  value?: string;
  password?: boolean;
  
  // Behavior
  disabled?: boolean;
  focusable?: boolean;
  
  // Events
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export class Input {
  public el: blessed.Widgets.TextboxElement;
  
  constructor(props: InputProps) {
    const {
      parent,
      variant = 'default',
      size = 'md',
      placeholder = '',
      value = '',
      password = false,
      disabled = false,
      focusable = true,
      onChange,
      onSubmit,
      onFocus,
      onBlur,
      ...restProps
    } = props;
    
    // Get variant styles
    const variantStyles = config.variants.input;
    const baseStyle = {
      ...variantStyles.variant[variant],
      ...variantStyles.size[size]
    };
    
    // Resolve colors
    const resolvedBg = baseStyle.bg ? resolveBlessedColor(baseStyle.bg, config.tokens) : undefined;
    const resolvedFg = baseStyle.fg ? resolveBlessedColor(baseStyle.fg, config.tokens) : undefined;
    const resolvedBorder = baseStyle.border ? resolveBlessedColor(baseStyle.border, config.tokens) : undefined;
    
    this.el = blessed.textbox({
      parent,
      mouse: !disabled,
      keys: focusable && !disabled,
      inputOnFocus: true,
      
      style: {
        bg: resolvedBg,
        fg: resolvedFg,
        border: {
          fg: resolvedBorder
        },
        
        focus: {
          bg: resolvedBg,
          fg: resolvedFg,
          border: {
            fg: config.tokens.colors.accent['400']
          }
        }
      },
      
      border: baseStyle.border !== 'transparent' ? {
        type: 'line'
      } : undefined,
      
      height: baseStyle.height || 3,
      padding: {
        left: baseStyle.px || 1,
        right: baseStyle.px || 1,
        top: 0,
        bottom: 0
      },
      
      ...restProps
    });
    
    // Set initial value and placeholder
    if (value) {
      this.el.setValue(value);
    }
    
    // Password mode
    if (password) {
      this.el.secret = true;
    }
    
    // Event handlers
    this.el.on('submit', (value: string) => {
      onSubmit?.(value);
    });
    
    let lastValue = value;
    this.el.on('keypress', () => {
      // Debounced change detection
      setTimeout(() => {
        const currentValue = this.el.getValue();
        if (currentValue !== lastValue) {
          lastValue = currentValue;
          onChange?.(currentValue);
        }
      }, 0);
    });
    
    this.el.on('focus', () => {
      onFocus?.();
    });
    
    this.el.on('blur', () => {
      onBlur?.();
    });
    
    // Placeholder handling
    if (placeholder && !value) {
      this.showPlaceholder();
    }
  }
  
  private showPlaceholder() {
    // Simple placeholder implementation
    if (!this.el.getValue()) {
      this.el.style.fg = config.tokens.colors.neutral['500'];
      this.el.setValue(this.placeholder);
    }
  }
  
  // Utility methods
  getValue(): string {
    return this.el.getValue();
  }
  
  setValue(value: string) {
    this.el.setValue(value);
  }
  
  focus() {
    this.el.focus();
  }
  
  clear() {
    this.el.clearValue();
  }
  
  disable() {
    this.el.style.fg = '#666666';
    this.el.mouse = false;
  }
  
  enable() {
    this.el.mouse = true;
  }
}

export default Input;
`;
}

// Placeholder implementations for other components
function generateStackComponent(): string {
  return "// Stack component implementation";
}
function generateTextareaComponent(): string {
  return "// Textarea component implementation";
}
function generateTextComponent(): string {
  return "// Text component implementation";
}
function generateHeadingComponent(): string {
  return "// Heading component implementation";
}
function generateBadgeComponent(): string {
  return "// Badge component implementation";
}
function generateSpinnerComponent(): string {
  return "// Spinner component implementation";
}
function generateProgressComponent(): string {
  return "// Progress component implementation";
}
function generateChatLayoutComponent(): string {
  return "// ChatLayout component implementation";
}
function generateMessageListComponent(): string {
  return "// MessageList component implementation";
}
function generatePromptEditorComponent(): string {
  return "// PromptEditor component implementation";
}

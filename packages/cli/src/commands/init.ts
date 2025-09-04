import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";

interface InitOptions {
  renderer?: "blessed";
  force?: boolean;
}

export async function initCommand(options: InitOptions = {}) {
  const { renderer = "blessed", force = false } = options;
  const cwd = process.cwd();
  const configPath = path.join(cwd, "tui.config.ts");

  console.log(chalk.blue("🎯 Initializing TUI Kit project..."));

  // Check if config already exists
  if (fs.existsSync(configPath) && !force) {
    console.error(chalk.red("❌ tui.config.ts already exists. Use --force to overwrite."));
    process.exit(1);
  }

  // Create tui.config.ts
  const configTemplate = generateConfigTemplate(renderer);
  fs.writeFileSync(configPath, configTemplate, "utf8");
  console.log(chalk.green("✅ Created tui.config.ts"));

  // Create components directory
  const componentsDir = path.join(cwd, "src", "components", "ui");
  fs.mkdirSync(componentsDir, { recursive: true });
  console.log(chalk.green("✅ Created components/ui directory"));

  // Create lib directory with utils
  const libDir = path.join(cwd, "src", "lib");
  fs.mkdirSync(libDir, { recursive: true });

  const utilsTemplate = generateUtilsTemplate();
  fs.writeFileSync(path.join(libDir, "utils.ts"), utilsTemplate, "utf8");
  console.log(chalk.green("✅ Created lib/utils.ts"));

  // Create types directory
  const typesDir = path.join(cwd, "src", "types");
  fs.mkdirSync(typesDir, { recursive: true });

  const typesTemplate = generateTypesTemplate();
  fs.writeFileSync(path.join(typesDir, "index.ts"), typesTemplate, "utf8");
  console.log(chalk.green("✅ Created types/index.ts"));

  // Install dependencies
  console.log(chalk.blue("📦 Installing dependencies..."));
  try {
    const packageJsonPath = path.join(cwd, "package.json");
    let packageJson: any = {};

    if (fs.existsSync(packageJsonPath)) {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    } else {
      packageJson = {
        name: path.basename(cwd),
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "tsx src/index.ts",
          build: "tsc",
        },
      };
    }

    // Add dependencies for blessed-based TUI
    const dependencies = {
      blessed: "^0.1.81",
      "@types/blessed": "^0.1.25",
      tsx: "^4.17.0",
      typescript: "^5.5.4",
    };

    packageJson.dependencies = { ...packageJson.dependencies, ...dependencies };

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf8"
    );

    if (fs.existsSync("yarn.lock")) {
      execSync("yarn install", { stdio: "inherit" });
    } else {
      execSync("npm install", { stdio: "inherit" });
    }

    console.log(chalk.green("✅ Dependencies installed"));
  } catch (error) {
    console.warn(
      chalk.yellow("⚠️ Could not install dependencies automatically. Please run:")
    );
    console.warn(
      chalk.gray("yarn add blessed @types/blessed tsx typescript")
    );
  }

  console.log(chalk.green("\n🎉 TUI Kit initialized successfully!"));
  console.log(chalk.gray("\nNext steps:"));
  console.log(chalk.gray("  • Add components: tui-kit add button input text"));
  console.log(chalk.gray("  • List available components: tui-kit list"));
  console.log(chalk.gray("  • Start building your TUI app!"));
}

function generateConfigTemplate(renderer: "blessed"): string {
  return `import type { TuiConfig } from '@tui-kit-ai/cli';

export default {
  renderer: "${renderer}",
  components: {
    path: "./src/components/ui",
  },
  utils: {
    path: "./src/lib/utils.ts",
  },
  types: {
    path: "./src/types/index.ts",
  },
} satisfies TuiConfig;
`;
}

function generateUtilsTemplate(): string {
  return `/**
 * Utility functions for TUI Kit components
 */

/**
 * Merge multiple style objects
 */
export function mergeStyles(...styles: Record<string, any>[]): Record<string, any> {
  return Object.assign({}, ...styles);
}

/**
 * Create a style object with focus state
 */
export function createFocusableStyle(baseStyle: Record<string, any>, focusStyle: Record<string, any>) {
  return {
    ...baseStyle,
    focus: focusStyle,
  };
}

/**
 * Convert color names to blessed-compatible values
 */
export function resolveColor(color: string): string {
  const colorMap: Record<string, string> = {
    black: 'black',
    red: 'red',
    green: 'green',
    yellow: 'yellow',
    blue: 'blue',
    magenta: 'magenta',
    cyan: 'cyan',
    white: 'white',
    gray: 'gray',
    lightred: 'lightred',
    lightgreen: 'lightgreen',
    lightyellow: 'lightyellow',
    lightblue: 'lightblue',
    lightmagenta: 'lightmagenta',
    lightcyan: 'lightcyan',
    lightgray: 'lightgray',
  };
  
  return colorMap[color] || color;
}

/**
 * Create border style object
 */
export function createBorder(type: 'line' | 'bg' = 'line', fg?: string, bg?: string) {
  return {
    type,
    ...(fg && { fg }),
    ...(bg && { bg }),
  };
}

/**
 * Animation helper for terminal animations
 */
export class Animation {
  private frames: string[];
  private currentFrame = 0;
  private interval?: NodeJS.Timeout;
  
  constructor(frames: string[], speed = 100) {
    this.frames = frames;
  }
  
  start(callback: (frame: string) => void) {
    this.interval = setInterval(() => {
      callback(this.frames[this.currentFrame]);
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, 100);
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
}
`;
}

function generateTypesTemplate(): string {
  return `/**
 * Common types for TUI Kit components
 */

export interface ComponentProps {
  parent?: any;
  children?: any[];
  top?: string | number;
  left?: string | number;
  width?: string | number;
  height?: string | number;
  right?: string | number;
  bottom?: string | number;
  content?: string;
  label?: string;
  style?: Record<string, any>;
  border?: any;
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  hidden?: boolean;
  focusable?: boolean;
  scrollable?: boolean;
  mouse?: boolean;
  keys?: boolean;
  vi?: boolean;
}

export interface StyleProps {
  fg?: string;
  bg?: string;
  bold?: boolean;
  underline?: boolean;
  blink?: boolean;
  inverse?: boolean;
  invisible?: boolean;
  focus?: {
    fg?: string;
    bg?: string;
    bold?: boolean;
    underline?: boolean;
    blink?: boolean;
    inverse?: boolean;
    invisible?: boolean;
  };
}

export interface BorderProps {
  type?: 'line' | 'bg';
  fg?: string;
  bg?: string;
  ch?: string;
}

export type Color = 
  | 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white'
  | 'gray' | 'lightred' | 'lightgreen' | 'lightyellow' | 'lightblue' 
  | 'lightmagenta' | 'lightcyan' | 'lightgray';

export type BorderType = 'line' | 'bg';
`;
}

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

interface InitOptions {
  renderer?: "blessed" | "ink";
  force?: boolean;
}

export async function initCommand(options: InitOptions = {}) {
  const { renderer = "blessed", force = false } = options;
  const cwd = process.cwd();
  const configPath = path.join(cwd, "tui.config.ts");

  console.log("🎯 Initializing TUI-Kit-AI project...");

  // Check if config already exists
  if (fs.existsSync(configPath) && !force) {
    console.error("❌ tui.config.ts already exists. Use --force to overwrite.");
    process.exit(1);
  }

  // Create tui.config.ts
  const configTemplate = generateConfigTemplate(renderer);
  fs.writeFileSync(configPath, configTemplate, "utf8");
  console.log("✅ Created tui.config.ts");

  // Create components directory
  const componentsDir = path.join(cwd, "src", "components", "ui");
  fs.mkdirSync(componentsDir, { recursive: true });
  console.log("✅ Created components/ui directory");

  // Create lib directory with utils
  const libDir = path.join(cwd, "src", "lib");
  fs.mkdirSync(libDir, { recursive: true });

  const utilsTemplate = generateUtilsTemplate();
  fs.writeFileSync(path.join(libDir, "utils.ts"), utilsTemplate, "utf8");
  console.log("✅ Created lib/utils.ts");

  // Install dependencies
  console.log("📦 Installing dependencies...");
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

    // Add dependencies based on renderer
    const dependencies = {
      zod: "^3.22.4",
      "class-variance-authority": "^0.7.0",
      clsx: "^2.0.0",
      "tailwind-merge": "^2.0.0", // For utility merging patterns
      tsx: "^4.17.0",
      typescript: "^5.5.4",
    };
    if (renderer === "blessed") {
      (dependencies as any)["blessed"] = "^0.1.81";
      (dependencies as any)["@types/blessed"] = "^0.1.25";
    } else {
      (dependencies as any)["ink"] = "^4.4.1";
      (dependencies as any)["react"] = "^18.2.0";
      (dependencies as any)["@types/react"] = "^18.2.0";
    }

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

    console.log("✅ Dependencies installed");
  } catch (error) {
    console.warn(
      "⚠️ Could not install dependencies automatically. Please run:"
    );
    console.warn(
      renderer === "blessed"
        ? "yarn add blessed @types/blessed zod class-variance-authority clsx tsx typescript"
        : "yarn add ink react @types/react zod class-variance-authority clsx tsx typescript"
    );
  }

  console.log("\\n🎉 TUI-Kit-AI initialized successfully!");
  console.log("\\nNext steps:");
  console.log("  tui add button        # Add a button component");
  console.log("  tui add input         # Add an input component");
  console.log("  tui preset add minimal # Add minimal component preset");
  console.log(
    "\\n📚 Check out examples at: https://github.com/tui-kit-ai/examples"
  );
}

function generateConfigTemplate(renderer: "blessed" | "ink"): string {
  return `import { defineConfig } from '@tui-kit-ai/core';
import type { TuiConfig } from '@tui-kit-ai/core';

export default defineConfig({
  renderer: ${renderer}
`;
}

function generateUtilsTemplate(): string {
  return `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names (adapted for terminal styling)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a token path like 'colors.accent.500' to actual value
 */
export function resolveToken(path: string, tokens: any): any {
  return path.split('.').reduce((obj, key) => obj?.[key], tokens);
}

/**
 * Apply variant styles from config
 */
export function applyVariants(
  baseStyles: Record<string, any>,
  variants: Record<string, any>,
  props: Record<string, any>
) {
  let styles = { ...baseStyles };
  
  Object.keys(variants).forEach(key => {
    const propValue = props[key];
    if (propValue && variants[key][propValue]) {
      styles = { ...styles, ...variants[key][propValue] };
    }
  });
  
  return styles;
}

/**
 * Convert semantic colors to blessed-compatible values
 */
export function resolveBlessedColor(color: string, tokens: any): string {
  if (color.startsWith('#')) return color;
  
  const resolved = resolveToken(color, tokens);
  return resolved || color;
}

/**
 * Animation frame helper for terminal animations
 */
export class TerminalAnimation {
  private frames: string[];
  private currentFrame = 0;
  private interval?: NodeJS.Timeout;
  
  constructor(frames: string | string[], speed = 100) {
    this.frames = Array.isArray(frames) ? frames : frames.split('');
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

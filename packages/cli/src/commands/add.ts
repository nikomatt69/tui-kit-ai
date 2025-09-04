import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { COMPONENTS } from "./registry";

interface AddOptions {
  force?: boolean;
  all?: boolean;
}

export async function addCommand(
  components: string[],
  options: AddOptions = {}
) {
  const { force = false, all = false } = options;
  const cwd = process.cwd();
  const configPath = path.join(cwd, "tui.config.ts");

  // Check if project is initialized
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('❌ No tui.config.ts found. Run "tui-kit init" first.'));
    process.exit(1);
  }

  // Determine components to add
  const componentsToAdd = all ? Object.keys(COMPONENTS) : components;

  if (componentsToAdd.length === 0) {
    console.error(chalk.red("❌ No components specified. Available components:"));
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

  console.log(chalk.blue("🔄 Adding components..."));

  let addedComponents = [];
  let allDependencies = new Set<string>();

  for (const componentName of componentsToAdd) {
    const component = COMPONENTS[componentName as keyof typeof COMPONENTS];

    if (!component) {
      console.warn(chalk.yellow(`⚠️ Unknown component: ${componentName}`));
      continue;
    }

    const filePath = path.join(componentsDir, component.path);

    // Check if component already exists
    if (fs.existsSync(filePath) && !force) {
      console.warn(
        chalk.yellow(`⚠️ ${component.name} already exists. Use --force to overwrite.`)
      );
      continue;
    }

    // Generate component code
    const componentCode = component.template();
    fs.writeFileSync(filePath, componentCode, "utf8");

    console.log(chalk.green(`✅ Added ${component.name}`));
    addedComponents.push(component.name);

    // Collect dependencies
    component.dependencies.forEach((dep) => allDependencies.add(dep));
  }

  // Install missing dependencies
  if (allDependencies.size > 0) {
    console.log(chalk.blue("📦 Checking dependencies..."));

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
          chalk.blue(`⚙️ Installing missing dependencies: ${missingDeps.join(", ")}`)
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
            chalk.yellow(`⚠️ Could not install dependencies automatically: ${missingDeps.join(", ")}`)
          );
        }
      }
    }
  }

  // Generate index.ts with exports
  generateIndexFile(componentsDir, addedComponents);

  if (addedComponents.length > 0) {
    console.log(chalk.green(`\n🎉 Successfully added ${addedComponents.length} component(s)!`));
    console.log(chalk.gray("\nYou can now import them:"));
    addedComponents.forEach((comp) => {
      console.log(chalk.gray(`  import { ${comp} } from './components/ui';`));
    });
  } else {
    console.log(chalk.yellow("\n⚠️ No components were added."));
  }
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
    const component = COMPONENTS[componentName.toLowerCase() as keyof typeof COMPONENTS];
    if (component && !indexContent.includes(`export * from './${component.path.replace(".ts", "")}';`)) {
      indexContent += `export * from './${component.path.replace(".ts", "")}';\n`;
    }
  });

  fs.writeFileSync(indexPath, indexContent, "utf8");
}
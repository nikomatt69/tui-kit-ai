import { execSync } from "child_process";
import fs from "fs";
import path from "path";

interface UpdateOptions {
  force?: boolean;
  check?: boolean;
}

export async function updateCommand(
  components: string[] = [],
  options: UpdateOptions = {}
) {
  const { force = false, check = false } = options;
  const cwd = process.cwd();
  const configPath = path.join(cwd, "tui.config.ts");

  // Check if project is initialized
  if (!fs.existsSync(configPath)) {
    console.error('❌ No tui.config.ts found. Run "tui init" first.');
    process.exit(1);
  }

  const componentsDir = path.join(cwd, "src", "components", "ui");

  if (!fs.existsSync(componentsDir)) {
    console.log("ℹ️ No components directory found. Nothing to update.");
    return;
  }

  // Get existing component files
  const existingFiles = fs
    .readdirSync(componentsDir)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts")
    .map((file) => file.replace(".ts", ""));

  const componentsToUpdate =
    components.length > 0
      ? components.filter((c) => existingFiles.includes(c))
      : existingFiles;

  if (componentsToUpdate.length === 0) {
    console.log("ℹ️ No components to update.");
    return;
  }

  console.log(
    `🔍 Checking ${componentsToUpdate.length} components for updates...`
  );

  // Check for updates from upstream (this would normally check against npm registry)
  const updatesAvailable = await checkForUpdates(componentsToUpdate);

  if (check) {
    // Just show available updates
    if (updatesAvailable.length === 0) {
      console.log("✅ All components are up to date!");
    } else {
      console.log("📦 Updates available for:");
      updatesAvailable.forEach((component) => {
        console.log(
          `  • ${component.name} (${component.currentVersion} → ${component.latestVersion})`
        );
      });
      console.log('\\nRun "tui update" to apply updates.');
    }
    return;
  }

  if (updatesAvailable.length === 0) {
    console.log("✅ All components are up to date!");
    return;
  }

  // Apply updates
  let updatedCount = 0;

  for (const update of updatesAvailable) {
    const filePath = path.join(componentsDir, `${update.name}.ts`);

    if (fs.existsSync(filePath)) {
      // Create backup
      const backupPath = `${filePath}.backup`;
      fs.copyFileSync(filePath, backupPath);

      try {
        // Get the current content
        const currentContent = fs.readFileSync(filePath, "utf8");

        // Generate the updated content (this would normally fetch from registry)
        const updatedContent = await getUpdatedComponentCode(update.name);

        // Check if there are user modifications
        const hasUserMods = detectUserModifications(
          currentContent,
          update.originalCode
        );

        if (hasUserMods && !force) {
          console.log(
            `⚠️ ${update.name} has user modifications. Use --force to overwrite or manually merge.`
          );

          // Show diff
          console.log("\\nChanges detected in:");
          console.log(`  ${filePath}`);
          console.log("\\nTo see diff: git diff --no-index \\\\");
          console.log(`  ${filePath}.backup ${filePath}`);

          continue;
        }

        // Apply update
        if (hasUserMods) {
          // Try to merge changes intelligently
          const mergedContent = mergeUpdates(
            currentContent,
            updatedContent,
            update.originalCode
          );
          fs.writeFileSync(filePath, mergedContent, "utf8");
          console.log(`✅ Updated ${update.name} (with merge)`);
        } else {
          // Direct replacement
          fs.writeFileSync(filePath, updatedContent, "utf8");
          console.log(`✅ Updated ${update.name}`);
        }

        // Remove backup if successful
        fs.unlinkSync(backupPath);
        updatedCount++;
      } catch (error) {
        // Restore backup on error
        if (fs.existsSync(backupPath)) {
          fs.copyFileSync(backupPath, filePath);
          fs.unlinkSync(backupPath);
        }
        console.error(`❌ Failed to update ${update.name}: ${error}`);
      }
    }
  }

  if (updatedCount > 0) {
    console.log(`\n🎉 Successfully updated ${updatedCount} components!`);

    // Check if dependencies need updating
    await updateDependencies();

    console.log("\\n💡 Remember to:");
    console.log("  • Test your components after updates");
    console.log("  • Check for breaking changes in the changelog");
    console.log("  • Update your TypeScript if needed");
  }
}

interface ComponentUpdate {
  name: string;
  currentVersion: string;
  latestVersion: string;
  originalCode: string;
  hasBreakingChanges: boolean;
}

async function checkForUpdates(
  components: string[]
): Promise<ComponentUpdate[]> {
  // In a real implementation, this would check against an npm registry or GitHub
  // For now, we'll simulate some updates

  const mockUpdates: ComponentUpdate[] = [
    // Simulate that 'button' has an update available
    ...(components.includes("button")
      ? [
          {
            name: "button",
            currentVersion: "0.1.0",
            latestVersion: "0.1.1",
            originalCode: "",
            hasBreakingChanges: false,
          },
        ]
      : []),

    // Simulate that 'input' has a breaking change
    ...(components.includes("input")
      ? [
          {
            name: "input",
            currentVersion: "0.1.0",
            latestVersion: "0.2.0",
            originalCode: "",
            hasBreakingChanges: true,
          },
        ]
      : []),
  ];

  // In production, this would make HTTP requests to check versions
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockUpdates;
}

async function getUpdatedComponentCode(componentName: string): Promise<string> {
  // In a real implementation, this would fetch the latest component code
  // For now, return a placeholder
  return `// Updated ${componentName}`;
}

function detectUserModifications(
  currentContent: string,
  originalCode: string
): boolean {
  // Simple heuristic: check if the file has been significantly modified
  // In practice, you'd want more sophisticated diff analysis

  // Check for custom comments, additional imports, or substantial changes
  const hasCustomComments =
    currentContent.includes("// Custom:") ||
    currentContent.includes("// User:");
  const hasAdditionalImports =
    currentContent
      .split("\\n")
      .filter((line) => line.trim().startsWith("import")).length > 3;
  const lengthDifference = Math.abs(
    currentContent.length - originalCode.length
  );

  return hasCustomComments || hasAdditionalImports || lengthDifference > 100;
}

function mergeUpdates(
  current: string,
  updated: string,
  original: string
): string {
  // Simple merge strategy: preserve user modifications where possible
  // In a real implementation, you'd use a proper 3-way merge algorithm

  const currentLines = current.split("\\n");
  const updatedLines = updated.split("\\n");

  // Start with the updated version and preserve user customizations
  let merged = updated;

  // Look for user comments and try to preserve them
  const userComments = currentLines.filter(
    (line) =>
      line.trim().startsWith("// Custom:") || line.trim().startsWith("// User:")
  );

  if (userComments.length > 0) {
    // Add user comments at the top
    merged = userComments.join("\\n") + "\\n" + merged;
  }

  return merged;
}

async function updateDependencies() {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  // Check if any core dependencies need updating
  try {
    console.log("📦 Checking for dependency updates...");

    if (fs.existsSync("yarn.lock")) {
      // Use yarn outdated to check
      const result = execSync("yarn outdated --json", {
        encoding: "utf8",
        stdio: "pipe",
      });
      // Parse and show outdated packages
    } else {
      // Use npm outdated
      const result = execSync("npm outdated --json", {
        encoding: "utf8",
        stdio: "pipe",
      });
    }
  } catch (error) {
    // npm/yarn outdated returns non-zero exit code when packages are outdated
    // This is expected behavior
  }
}

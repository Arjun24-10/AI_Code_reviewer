import "dotenv/config";
import fs from "fs";
import path from "path";
import { reviewCode } from "./reviewer.js";

// Accept a target directory as CLI arg, default to current dir
const targetDir = process.argv[2] || ".";
const outputFile = process.argv[3] || "model_summary/gemini_report.md";

if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY not set in .env");
  process.exit(1);
}

// Supported extensions to review
const SUPPORTED_EXTENSIONS = [".js", ".ts", ".jsx", ".tsx", ".py", ".java", ".go", ".rb", ".php", ".cs"];

// Folders to skip
const SKIP_DIRS = ["node_modules", ".git", "dist", "build", ".next", "coverage", "vendor"];

/**
 * Recursively collect all reviewable files from a directory
 */
function collectFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) {
        results = results.concat(collectFiles(fullPath));
      }
    } else if (SUPPORTED_EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = collectFiles(targetDir);

if (files.length === 0) {
  console.log("No reviewable files found in:", targetDir);
  process.exit(0);
}

console.log(`Found ${files.length} file(s) to review in: ${targetDir}\n`);

let report = `# Gemini Code Review Report\n\n`;
report += `**Target:** \`${targetDir}\`\n`;
report += `**Files Reviewed:** ${files.length}\n`;
report += `**Date:** ${new Date().toDateString()}\n`;
report += `**Model:** Gemini 2.0 Flash\n\n---\n\n`;

let hasIssues = false;

for (const file of files) {
  console.log(`Reviewing: ${file}`);
  const code = fs.readFileSync(file, "utf-8");
  const lang = path.extname(file).slice(1);

  try {
    const review = await reviewCode(code, lang);
    report += `## \`${file}\`\n\n${review}\n\n---\n\n`;

    // Flag if review contains issues (for CI exit code)
    if (/bug|error|vulnerability|security|critical/i.test(review)) {
      hasIssues = true;
    }
  } catch (err) {
    console.error(`Failed to review ${file}:`, err.message);
    report += `## \`${file}\`\n\n> Review failed: ${err.message}\n\n---\n\n`;
  }
}

// Ensure output directory exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, report);
console.log(`\nDone! Report saved to: ${outputFile}`);

// Exit with code 1 if issues found (useful for CI to flag the PR)
if (hasIssues) {
  console.warn("\nIssues detected in reviewed code. Check the report.");
  process.exit(1);
}

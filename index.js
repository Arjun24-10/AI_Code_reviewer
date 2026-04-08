import "dotenv/config";
import fs from "fs";
import path from "path";
import { reviewCode } from "./reviewer.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node index.js <file-path> [language]");
  console.error("Example: node index.js src/app.js javascript");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not set. Copy .env.example to .env and add your key.");
  process.exit(1);
}

const filePath = args[0];
const language = args[1] || path.extname(filePath).slice(1); // infer from extension

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

const code = fs.readFileSync(filePath, "utf-8");

console.log(`\nReviewing: ${filePath}\n${"─".repeat(50)}\n`);

try {
  const review = await reviewCode(code, language);
  console.log(review);
} catch (err) {
  console.error("Review failed:", err.message);
  process.exit(1);
}

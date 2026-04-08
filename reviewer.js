import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const SYSTEM_PROMPT = `You are an expert code reviewer. When given code, analyze it and provide:
1. A brief summary of what the code does
2. Bugs or potential errors
3. Security vulnerabilities
4. Performance issues
5. Code quality and readability suggestions
6. Best practice violations

Be concise and actionable. Format your response with clear sections.`;

/**
 * Reviews code using Gemini API
 * @param {string} code - The source code to review
 * @param {string} language - Optional language hint
 * @returns {Promise<string>} The review text
 */
export async function reviewCode(code, language = "") {
  const userMessage = language
    ? `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
    : `Review this code:\n\n\`\`\`\n${code}\n\`\`\``;

  const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n${userMessage}`);
  return result.response.text();
}

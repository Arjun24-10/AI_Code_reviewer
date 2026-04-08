import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert code reviewer. When given code, analyze it and provide:
1. A brief summary of what the code does
2. Bugs or potential errors
3. Security vulnerabilities
4. Performance issues
5. Code quality and readability suggestions
6. Best practice violations

Be concise and actionable. Format your response with clear sections.`;

/**
 * Reviews code using OpenAI's API
 * @param {string} code - The source code to review
 * @param {string} language - Optional language hint (e.g. "javascript", "python")
 * @returns {Promise<string>} The review text
 */
export async function reviewCode(code, language = "") {
  const userMessage = language
    ? `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
    : `Review this code:\n\n\`\`\`\n${code}\n\`\`\``;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
}

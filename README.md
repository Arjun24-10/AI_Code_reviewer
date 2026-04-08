# AI Code Reviewer

A CLI tool that uses OpenAI's GPT-4o to review your code and surface bugs, security issues, and improvement suggestions.

## Setup

```bash
npm install
cp .env.example .env
# Add your OpenAI API key to .env
```

## Usage

```bash
node index.js <file-path> [language]
```

Examples:

```bash
node index.js src/app.js
node index.js utils/auth.py python
node index.js components/Button.tsx typescript
```

Language is auto-detected from the file extension if not provided.

## What it reviews

- Bugs and potential errors   
- Security vulnerabilities
- Performance issues
- Code quality and readability
- Best practice violations

To use a different model, update the `model` field in `reviewer.js`.

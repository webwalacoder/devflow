import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// Initialize Groq model
const groqModel = groq("llama-3.1-8b-instant"); // Example free model, check your Groq dashboard

export async function POST(req: Request) {
  try {
    const { question, content } = await req.json();

    // Validate input
    const validatedData = AIAnswerSchema.safeParse({ question, content });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    // Generate answer
    const { text } = await generateText({
      model: groqModel,
      system: `
You are a technical writer.

Rules:
- Output ONLY valid GitHub-flavored Markdown.
- Use headings, lists, emphasis, and code blocks.
- NEVER use HTML.
- Output Markdown using ONLY # headings. Do NOT use ==== or ---- style headings. Do NOT use bold text as headings.
- ALL code must be inside triple backticks and properly closed.
- Use lowercase identifiers for languages like: js for Javascript, ts for Typescript, py for Python and so on for codeblocks.
- Never write code outside fenced blocks.
- If unsure, do NOT include code.
`,
      prompt: `
Question:
${question}

Context:
${content}

Generate a clear markdown-formatted answer.
`,
      temperature: 0.6,
    });

    return NextResponse.json({ success: true, data: text });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

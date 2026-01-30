import { techMap } from "@/constants/techMap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDeviconClassName(techName: string) {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Dictionary mapping possible technology names to Devicon class names
  // const techMap: { [key: string]: string } = {
  //   // JavaScript variations
  //   javascript: "devicon-javascript-plain",
  //   js: "devicon-javascript-plain",

  //   // TypeScript variations
  //   typescript: "devicon-typescript-plain",
  //   ts: "devicon-typescript-plain",

  //   // React variations
  //   react: "devicon-react-original",
  //   reactjs: "devicon-react-original",

  //   // Next.js variations
  //   nextjs: "devicon-nextjs-plain",
  //   next: "devicon-nextjs-plain",

  //   // Node.js variations
  //   nodejs: "devicon-nodejs-plain",
  //   node: "devicon-nodejs-plain",

  //   // Bun.js variations
  //   bun: "devicon-bun-plain",
  //   bunjs: "devicon-bun-plain",

  //   // Deno.js variations
  //   deno: "devicon-denojs-original",
  //   denojs: "devicon-denojs-plain",

  //   // Python variations
  //   python: "devicon-python-plain",

  //   // Java variations
  //   java: "devicon-java-plain",

  //   // C++ variations
  //   "c++": "devicon-cplusplus-plain",
  //   cpp: "devicon-cplusplus-plain",

  //   // C# variations
  //   "c#": "devicon-csharp-plain",
  //   csharp: "devicon-csharp-plain",

  //   // PHP variations
  //   php: "devicon-php-plain",

  //   // HTML variations
  //   html: "devicon-html5-plain",
  //   html5: "devicon-html5-plain",

  //   // CSS variations
  //   css: "devicon-css3-plain",
  //   css3: "devicon-css3-plain",

  //   // Git variations
  //   git: "devicon-git-plain",

  //   // Docker variations
  //   docker: "devicon-docker-plain",

  //   // MongoDB variations
  //   mongodb: "devicon-mongodb-plain",
  //   mongo: "devicon-mongodb-plain",

  //   // MySQL variations
  //   mysql: "devicon-mysql-plain",

  //   // PostgreSQL variations
  //   postgresql: "devicon-postgresql-plain",
  //   postgres: "devicon-postgresql-plain",

  //   // AWS variations
  //   aws: "devicon-amazonwebservices-original",
  //   "amazon web services": "devicon-amazonwebservices-original",

  //   // Tailwind CSS variations
  //   tailwind: "devicon-tailwindcss-original",
  //   tailwindcss: "devicon-tailwindcss-original",
  // };

  return `${techMap[normalizedTech] || "devicon-devicon-plain"} colored`;
}

export function getTechDescription(techName: string): string {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Mapping technology names to descriptions
  const techDescriptionMap: { [key: string]: string } = {
    javascript:
      "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
    typescript:
      "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
    react:
      "React is a popular library for building fast, component-based user interfaces and web applications.",
    nextjs:
      "Next.js is a React framework for building fast, SEO-friendly, and production-grade web applications.",
    nodejs:
      "Node.js is a runtime for building fast and scalable server-side applications using JavaScript.",
    python:
      "Python is a beginner-friendly language known for its versatility and simplicity in various fields.",
    java: "Java is a versatile, cross-platform language widely used in enterprise and Android development.",
    "c++":
      "C++ is a high-performance language ideal for system programming, games, and large-scale applications.",
    git: "Git is a version control system that helps developers track changes and collaborate on code efficiently.",
    docker:
      "Docker simplifies app deployment by containerizing environments, ensuring consistency across platforms.",
    mongodb:
      "MongoDB is a flexible NoSQL database ideal for handling unstructured data and scalable applications.",
    mysql:
      "MySQL is a popular open-source relational database management system known for its stability and performance.",
    postgresql:
      "PostgreSQL is a powerful open-source SQL database known for its scalability and robustness.",
    aws: "Amazon Web Services (AWS) is a cloud computing platform that offers a wide range of services for building, deploying, and managing web and mobile applications.",
  };

  return (
    techDescriptionMap[normalizedTech] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  );
}

export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();

  const diffMilliseconds = now.getTime() - date.getTime();
  const diffSeconds = Math.round(diffMilliseconds / 1000);
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.round(diffHours / 24);

  return `${diffDays} days ago`;
};

export function parseZodErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(issue.message);
  }

  return fieldErrors;
}

export const formatNumber = (number: number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};

// Allowed languages mapping for MDXEditor
const ALLOWED_LANGUAGES: Record<string, string> = {
  js: "js",
  javascript: "js",
  ts: "ts",
  typescript: "ts",
  jsx: "jsx",
  tsx: "tsx",
  html: "html",
  css: "css",
  scss: "scss",
  saas: "saas",
  bash: "bash",
  json: "json",
  txt: "txt",
  text: "txt",
  "": "", // empty for unspecified
};

export function normalizeHeadings(md: string) {
  return (
    md
      // Remove Setext underline headings (==== / ----)
      .replace(/^[=-]{3,}$/gm, "")
      // Convert bold-only headings to h2
      .replace(/^\*\*(.+?)\*\*$/gm, "## $1")
  );
}

export function normalizeCodeBlocks(md: string) {
  const fenceCount = (md.match(/```/g) || []).length;

  // If odd, close the last block
  if (fenceCount % 2 !== 0) {
    return md + "\n```";
  }

  return md;
}

export function stripMDX(md: string) {
  return (
    md
      // Remove JSX-like tags
      .replace(/<[^>]+>/g, "")
      // Remove MDX imports/exports
      .replace(/^(import|export).+$/gm, "")
  );
}

export function cleanupMarkdown(md: string) {
  return md
    .replace(/\n{3,}/g, "\n\n") // normalize spacing
    .trim();
}

/**
 * Sanitize fenced code block languages for MDXEditor
 */
export function sanitizeCodeBlockLanguages(md: string) {
  return md.replace(/```(\w*)/g, (_, lang) => {
    const cleanedLang = lang.toLowerCase();
    const safeLang = ALLOWED_LANGUAGES[cleanedLang] ?? "";
    return `\`\`\`${safeLang}`;
  });
}

/**
 * Fully safe MDX transformation
 */
export function toSafeMDX(markdown: string) {
  let safe = markdown;

  safe = normalizeHeadings(safe);
  safe = normalizeCodeBlocks(safe);
  safe = stripMDX(safe);
  safe = sanitizeCodeBlockLanguages(safe);
  safe = cleanupMarkdown(safe);

  return safe;
}

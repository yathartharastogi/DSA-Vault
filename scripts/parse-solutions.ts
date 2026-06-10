import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface Problem {
  id: string;
  name: string;
  slug: string;
  platform: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  topics: string[];
  timeComplexity: string;
  spaceComplexity: string;
  submittedBy: string;
  date: string;
  day: number | null;
  filename: string;
  language: string;
  solution: string;
  filepath: string;
}

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".github",
  ".next",
  "node_modules",
  "src",
  "public",
  "scripts",
  "data",
]);

const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ".cpp": "cpp",
  ".cc": "cpp",
  ".c": "cpp",
  ".java": "java",
  ".py": "python",
  ".js": "javascript",
  ".ts": "typescript",
  ".go": "go",
  ".rs": "rust",
  ".cs": "csharp",
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Convert D/M/YYYY or DD/MM/YYYY into YYYY-MM-DD for stable lexicographical sorting
function normalizeDate(dateStr: string): string {
  const cleanStr = dateStr.trim();
  const parts = cleanStr.split("/");
  
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      const pad = (n: number) => n.toString().padStart(2, "0");
      // D/M/YYYY (standard in India/Europe)
      // If m > 12, then parts[0] is month and parts[1] is day (M/D/YYYY).
      if (m > 12) {
        return `${y}-${pad(d)}-${pad(m)}`;
      } else {
        return `${y}-${pad(m)}-${pad(d)}`;
      }
    }
  }
  
  return cleanStr;
}

function stripHeader(content: string): string {
  const trimmed = content.trim();
  
  // Strip block comments: /* ... */
  if (trimmed.startsWith("/*")) {
    const endBlockIndex = trimmed.indexOf("*/");
    if (endBlockIndex !== -1) {
      return trimmed.substring(endBlockIndex + 2).trim();
    }
  }
  
  // Strip block comments: """ ... """ (Python)
  if (trimmed.startsWith('"""')) {
    const endBlockIndex = trimmed.indexOf('"""', 3);
    if (endBlockIndex !== -1) {
      return trimmed.substring(endBlockIndex + 3).trim();
    }
  }

  // Strip block comments: ''' ... ''' (Python)
  if (trimmed.startsWith("'''")) {
    const endBlockIndex = trimmed.indexOf("'''", 3);
    if (endBlockIndex !== -1) {
      return trimmed.substring(endBlockIndex + 3).trim();
    }
  }
  
  // Strip contiguous single-line comments (// or #) or blank lines
  const lines = content.split(/\r?\n/);
  let startIdx = 0;
  while (startIdx < lines.length) {
    const line = lines[startIdx].trim();
    if (line === "" || line.startsWith("//") || line.startsWith("#") || line.startsWith("*")) {
      startIdx++;
    } else {
      break;
    }
  }
  
  return lines.slice(startIdx).join("\n").trim();
}

function parseFile(filepath: string, platformFolder: string): Problem | null {
  const content = fs.readFileSync(filepath, "utf-8");
  const ext = path.extname(filepath);
  const filename = path.basename(filepath);
  const language = EXTENSION_TO_LANGUAGE[ext.toLowerCase()] || "text";

  // Default fallback values
  let name = filename.replace(ext, "").replace(/([A-Z])/g, " $1").trim(); // e.g. TwoSum -> Two Sum
  let platform = platformFolder;
  let id = generateSlug(name);
  let difficulty = "Medium";
  let topics: string[] = [];
  let timeComplexity = "O(n)";
  let spaceComplexity = "O(n)";
  let submittedBy = "Developer";
  let date = new Date().toISOString().split("T")[0];
  let day: number | null = null;

  // Regular expression to find "Key : Value" lines inside comments
  const lines = content.split(/\r?\n/);
  
  for (const line of lines) {
    const match = line.match(/^\s*(?:\*|\/\/|#)?\s*(Problem|Platform|Difficulty|Topic|Topics|Time Complexity|Space Complexity|Submitted by|Submitted on|Date|Day)\s*:\s*(.*)$/i);
    if (match) {
      const key = match[1].toLowerCase().replace(" ", "");
      let val = match[2].replace(/\*\/$/, "").trim();

      if (key === "problem") {
        name = val;
      } else if (key === "platform") {
        if (val.includes("#")) {
          const parts = val.split("#");
          platform = parts[0].trim();
          id = parts[1].trim();
        } else {
          platform = val;
        }
      } else if (key === "difficulty") {
        difficulty = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
      } else if (key === "topic" || key === "topics") {
        topics = val.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
      } else if (key === "timecomplexity") {
        timeComplexity = val;
      } else if (key === "spacecomplexity") {
        spaceComplexity = val;
      } else if (key === "submittedby") {
        submittedBy = val;
      } else if (key === "submittedon" || key === "date") {
        date = normalizeDate(val);
      } else if (key === "day") {
        const parsedDay = parseInt(val, 10);
        if (!isNaN(parsedDay)) {
          day = parsedDay;
        }
      }
    }
  }

  const cleanCode = stripHeader(content);

  return {
    id,
    name,
    slug: generateSlug(name),
    platform,
    difficulty,
    topics,
    timeComplexity,
    spaceComplexity,
    submittedBy,
    date,
    day,
    filename,
    language,
    solution: cleanCode,
    filepath: filepath.replace(/\\/g, "/"),
  };
}

function scanDirectory(dir: string, platformFolder: string, results: Problem[]) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath, platformFolder, results);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext in EXTENSION_TO_LANGUAGE) {
        const problem = parseFile(fullPath, platformFolder);
        if (problem) {
          results.push(problem);
        }
      }
    }
  }
}

function main() {
  console.log("Parsing solution files for DSA Vault...");
  const workspaceRoot = process.cwd();
  
  let solutionsDir = workspaceRoot;
  let tempDirCreated = false;
  const tempDirName = "temp-solutions-clone";

  // Check if remote flag is present or building on Vercel
  const forceRemote = process.argv.includes("--remote") || process.env.VERCEL === "1";

  if (forceRemote) {
    console.log("Remote build triggered. Cloning solutions from https://github.com/yathartharastogi/DSA-Problems...");
    const tempPath = path.join(workspaceRoot, tempDirName);
    if (fs.existsSync(tempPath)) {
      fs.rmSync(tempPath, { recursive: true, force: true });
    }
    
    try {
      execSync(`git clone https://github.com/yathartharastogi/DSA-Problems ${tempDirName}`, {
        stdio: "inherit",
      });
      solutionsDir = tempPath;
      tempDirCreated = true;
    } catch (err) {
      console.error("Failed to clone remote repository. Using workspace files instead:", err);
    }
  }

  const results: Problem[] = [];
  const items = fs.readdirSync(solutionsDir);

  for (const item of items) {
    const fullPath = path.join(solutionsDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !IGNORED_DIRECTORIES.has(item) && item !== tempDirName) {
      console.log(`Scanning platform folder: ${item}`);
      scanDirectory(fullPath, item, results);
    }
  }

  // Calculate earliest date to compute relative coding journey Day N dynamically
  let earliestDateStr = "";
  for (const p of results) {
    if (p.date && p.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      if (!earliestDateStr || p.date.localeCompare(earliestDateStr) < 0) {
        earliestDateStr = p.date;
      }
    }
  }

  const startDate = earliestDateStr ? new Date(earliestDateStr + "T00:00:00") : new Date();

  // Dynamic journey day assignment
  for (const p of results) {
    if (p.day === null && p.date && p.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const currentDate = new Date(p.date + "T00:00:00");
      const diffTime = currentDate.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      p.day = diffDays + 1;
    }
  }

  // Sort by date (descending), day (descending), then name
  results.sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }
    if (a.day !== null && b.day !== null && a.day !== b.day) {
      return b.day - a.day;
    }
    return a.name.localeCompare(b.name);
  });

  const dataDir = path.join(workspaceRoot, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  fs.writeFileSync(
    path.join(dataDir, "problems.json"),
    JSON.stringify(results, null, 2),
    "utf-8"
  );

  console.log(`Success! Parsed ${results.length} problems and wrote to data/problems.json.`);

  // Clean up temp repository
  if (tempDirCreated && fs.existsSync(solutionsDir)) {
    console.log("Cleaning up temporary clone...");
    fs.rmSync(solutionsDir, { recursive: true, force: true });
  }
}

main();

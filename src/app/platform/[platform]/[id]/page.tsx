import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User, Database, Code2 } from "lucide-react";
import { codeToHtml } from "shiki";
import CodeViewer from "@/components/code-viewer";

interface Problem {
  id: string;
  name: string;
  slug: string;
  platform: string;
  difficulty: string;
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

// Generate static parameters for all problems
export async function generateStaticParams() {
  try {
    const dataFilePath = path.join(process.cwd(), "data", "problems.json");
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const dataStr = fs.readFileSync(dataFilePath, "utf-8");
    const problems: Problem[] = JSON.parse(dataStr);

    return problems.map((p) => ({
      platform: p.platform.toLowerCase(),
      id: p.id.toLowerCase(),
    }));
  } catch (err) {
    console.error("Error generating static params for problems:", err);
    return [];
  }
}

interface PageProps {
  params: Promise<{ platform: string; id: string }>;
}

export default async function ProblemPage({ params }: PageProps) {
  const { platform, id } = await params;
  let problems: Problem[] = [];

  try {
    const dataFilePath = path.join(process.cwd(), "data", "problems.json");
    if (fs.existsSync(dataFilePath)) {
      const dataStr = fs.readFileSync(dataFilePath, "utf-8");
      problems = JSON.parse(dataStr);
    }
  } catch (err) {
    console.error("Failed to read problems.json:", err);
  }

  // Find the problem
  const problem = problems.find(
    (p) =>
      p.platform.toLowerCase() === platform.toLowerCase() &&
      p.id.toLowerCase() === id.toLowerCase()
  );

  if (!problem) {
    notFound();
  }

  // Highlight solution using Shiki dual-theme on the server
  let highlightedHtml = "";
  try {
    highlightedHtml = await codeToHtml(problem.solution, {
      lang: problem.language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });
  } catch (err) {
    console.error("Failed to highlight code with Shiki:", err);
    highlightedHtml = `<pre><code>${problem.solution}</code></pre>`;
  }

  const difficultyColors = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30";
      case "Medium":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30";
      case "Hard":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30";
      default:
        return "bg-zinc-50 text-zinc-700 dark:bg-zinc-800/20 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-850";
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href={`/platform/${problem.platform.toLowerCase()}`}
          className="inline-flex items-center space-x-1.5 text-xs text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to {problem.platform}</span>
        </Link>
      </div>

      {/* Title & Metadata Top */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-muted bg-card border border-border px-2 py-0.5 rounded">
                {problem.platform} #{problem.id}
              </span>
              {problem.day && (
                <span className="text-xs font-mono text-muted bg-card border border-border px-2 py-0.5 rounded">
                  Day {problem.day}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{problem.name}</h1>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${difficultyColors(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        {/* Topics */}
        {problem.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {problem.topics.map((t) => (
              <span
                key={t}
                className="text-[10px] sm:text-xs font-medium bg-card text-muted-foreground border border-border px-2.5 py-0.5 rounded-md"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Grid of complexity card details */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card/50 p-4 transition-colors">
          <div className="flex items-center space-x-2 text-muted mb-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Time Complexity</span>
          </div>
          <p className="text-sm font-mono font-bold">{problem.timeComplexity}</p>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4 transition-colors">
          <div className="flex items-center space-x-2 text-muted mb-1">
            <Database className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Space Complexity</span>
          </div>
          <p className="text-sm font-mono font-bold">{problem.spaceComplexity}</p>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4 transition-colors">
          <div className="flex items-center space-x-2 text-muted mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Date Solved</span>
          </div>
          <p className="text-sm font-medium">{problem.date}</p>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4 transition-colors">
          <div className="flex items-center space-x-2 text-muted mb-1">
            <User className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Submitted By</span>
          </div>
          <p className="text-sm font-medium truncate" title={problem.submittedBy}>
            {problem.submittedBy}
          </p>
        </div>
      </section>

      {/* Code Viewer Section */}
      <section className="space-y-3 pt-2">
        <h2 className="text-lg font-semibold tracking-tight">Solution</h2>
        <CodeViewer 
          highlightedHtml={highlightedHtml} 
          rawCode={problem.solution} 
          language={problem.language} 
        />
      </section>
    </div>
  );
}

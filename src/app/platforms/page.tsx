import fs from "fs";
import path from "path";
import Link from "next/link";
import { ChevronRight, Award, ExternalLink, Code2 } from "lucide-react";

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
  filepath: string;
}

export default async function PlatformsPage() {
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

  // Aggregate stats per platform
  const platformStats: Record<
    string,
    { total: number; easy: number; medium: number; hard: number }
  > = {
    "LeetCode": { total: 0, easy: 0, medium: 0, hard: 0 },
    "Codeforces": { total: 0, easy: 0, medium: 0, hard: 0 },
    "Codechef": { total: 0, easy: 0, medium: 0, hard: 0 },
  };

  problems.forEach((p) => {
    const standardName = Object.keys(platformStats).find(
      key => key.toLowerCase() === p.platform.toLowerCase()
    ) || p.platform;

    if (!platformStats[standardName]) {
      platformStats[standardName] = { total: 0, easy: 0, medium: 0, hard: 0 };
    }
    platformStats[standardName].total++;
    if (p.difficulty === "Easy") platformStats[standardName].easy++;
    else if (p.difficulty === "Medium") platformStats[standardName].medium++;
    else if (p.difficulty === "Hard") platformStats[standardName].hard++;
  });

  const platforms = Object.entries(platformStats).map(([name, stats]) => ({
    name,
    ...stats,
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight">Coding Platforms</h1>
        <p className="text-muted text-sm sm:text-base max-w-xl">
          Detailed breakdown of problems solved and difficulty distributions across different coding platforms.
        </p>
      </section>

      {/* Grid */}
      {platforms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => {
            const easyPct = platform.total > 0 ? (platform.easy / platform.total) * 100 : 0;
            const mediumPct = platform.total > 0 ? (platform.medium / platform.total) * 100 : 0;
            const hardPct = platform.total > 0 ? (platform.hard / platform.total) * 100 : 0;

            return (
              <div
                key={platform.name}
                className="group rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/35 transition-all duration-200"
              >
                <div>
                  {/* Title and Top */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold tracking-tight text-foreground">
                        {platform.name}
                      </h2>
                      <p className="text-xs text-muted">
                        Platform Profile
                      </p>
                    </div>
                    <span className="flex items-center space-x-1 text-xs text-muted font-mono bg-background border border-border px-2.5 py-1 rounded-full">
                      <Code2 className="h-3.5 w-3.5" />
                      <span>{platform.total} Solved</span>
                    </span>
                  </div>

                  {/* Difficulty breakdown numbers */}
                  <div className="grid grid-cols-3 gap-2 text-center mb-6">
                    <div className="bg-background/50 border border-border/40 rounded-lg p-2.5">
                      <div className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-1">Easy</div>
                      <div className="text-lg font-bold text-emerald-500">{platform.easy}</div>
                    </div>
                    <div className="bg-background/50 border border-border/40 rounded-lg p-2.5">
                      <div className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-1">Medium</div>
                      <div className="text-lg font-bold text-amber-500">{platform.medium}</div>
                    </div>
                    <div className="bg-background/50 border border-border/40 rounded-lg p-2.5">
                      <div className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-1">Hard</div>
                      <div className="text-lg font-bold text-rose-500">{platform.hard}</div>
                    </div>
                  </div>

                  {/* Horizontal Stacked Bar */}
                  <div className="space-y-2 mb-6">
                    <div className="h-2 w-full rounded-full bg-background overflow-hidden flex">
                      <div
                        style={{ width: `${easyPct}%` }}
                        className="bg-emerald-500 h-full transition-all"
                        title={`Easy: ${easyPct.toFixed(0)}%`}
                      />
                      <div
                        style={{ width: `${mediumPct}%` }}
                        className="bg-amber-500 h-full transition-all"
                        title={`Medium: ${mediumPct.toFixed(0)}%`}
                      />
                      <div
                        style={{ width: `${hardPct}%` }}
                        className="bg-rose-500 h-full transition-all"
                        title={`Hard: ${hardPct.toFixed(0)}%`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted font-mono">
                      <span>Easy {easyPct.toFixed(0)}%</span>
                      <span>Medium {mediumPct.toFixed(0)}%</span>
                      <span>Hard {hardPct.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* View Details Link */}
                <Link
                  href={`/platform/${platform.name.toLowerCase()}`}
                  className="mt-4 flex items-center justify-between text-xs font-semibold text-muted group-hover:text-foreground transition-colors pt-4 border-t border-border/40"
                >
                  <span>Browse Problems</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card/10">
          <p className="text-sm text-foreground font-semibold">No platform data available</p>
          <p className="text-xs text-muted mt-1">Make sure you have solution folders added to the repository.</p>
        </div>
      )}
    </div>
  );
}

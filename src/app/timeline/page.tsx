import fs from "fs";
import path from "path";
import Link from "next/link";
import { Calendar, CheckCircle2, ChevronRight } from "lucide-react";

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

interface TimelineGroup {
  label: string;
  dayNumber: number | null;
  dateStr: string;
  problems: Problem[];
}

export default async function TimelinePage() {
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

  // Group by Day, fallback to Date
  const groupsMap: Record<string, { dayNumber: number | null; dateStr: string; problems: Problem[] }> = {};

  problems.forEach((p) => {
    let key = "";
    let dayNumber: number | null = null;

    if (p.day !== null) {
      key = `Day ${p.day}`;
      dayNumber = p.day;
    } else {
      key = p.date;
    }

    if (!groupsMap[key]) {
      groupsMap[key] = {
        dayNumber,
        dateStr: p.date,
        problems: [],
      };
    }
    groupsMap[key].problems.push(p);
  });

  // Sort groups: Day descending, otherwise Date descending
  const timelineGroups: TimelineGroup[] = Object.entries(groupsMap)
    .map(([label, info]) => ({
      label,
      ...info,
    }))
    .sort((a, b) => {
      if (a.dayNumber !== null && b.dayNumber !== null) {
        return b.dayNumber - a.dayNumber; // Latest day first
      }
      if (a.dayNumber !== null) return -1; // Days on top
      if (b.dayNumber !== null) return 1;

      return b.dateStr.localeCompare(a.dateStr); // Latest date first
    });

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
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight">Challenge Timeline</h1>
        <p className="text-muted text-sm sm:text-base max-w-xl">
          Tracking problem-solving consistency day-by-day. Chronological record of solutions added to the vault.
        </p>
      </section>

      {/* Timeline Layout */}
      {timelineGroups.length > 0 ? (
        <section className="relative pl-6 sm:pl-8 border-l border-border space-y-12 py-4 ml-3 sm:ml-4">
          {timelineGroups.map((group) => (
            <div key={group.label} className="relative">
              {/* Vertical timeline node indicator */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex items-center justify-center h-4 w-4 rounded-full border-2 border-border bg-background transition-colors duration-200">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45" />
              </div>

              {/* Group Label / Title */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4">
                <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                  {group.label}
                  <span className="text-[10px] font-mono text-muted font-normal">
                    ({group.problems.length} {group.problems.length === 1 ? "problem" : "problems"})
                  </span>
                </h2>
                <div className="flex items-center text-xs text-muted font-mono">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{group.dateStr}</span>
                </div>
              </div>

              {/* Problems list cards for this day */}
              <div className="grid gap-3">
                {group.problems.map((problem) => (
                  <div
                    key={`${problem.platform}-${problem.id}`}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:border-foreground/35 transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted font-mono bg-background px-1.5 py-0.5 rounded border border-border/80">
                          #{problem.id}
                        </span>
                        <Link
                          href={`/platform/${problem.platform.toLowerCase()}/${problem.id.toLowerCase()}`}
                          className="text-sm font-semibold text-foreground hover:underline decoration-muted transition-colors"
                        >
                          {problem.name}
                        </Link>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${difficultyColors(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-muted">
                        <span>{problem.platform}</span>
                        {problem.topics.length > 0 && (
                          <>
                            <span className="h-3 w-px bg-border" />
                            <span className="truncate max-w-[200px]">
                              {problem.topics.join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/platform/${problem.platform.toLowerCase()}/${problem.id.toLowerCase()}`}
                      className="flex items-center space-x-1 text-xs text-muted group-hover:text-foreground font-medium transition-colors self-start sm:self-auto"
                    >
                      <span>View Solution</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card/10">
          <p className="text-sm text-foreground font-semibold">No timeline data available</p>
          <p className="text-xs text-muted mt-1">Add problems containing Day or Date tags in comment headers.</p>
        </div>
      )}
    </div>
  );
}

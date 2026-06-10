import fs from "fs";
import path from "path";
import StatisticsCharts from "@/components/statistics-charts";

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

export default async function StatisticsPage() {
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

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight">Vault Statistics</h1>
        <p className="text-muted text-sm sm:text-base max-w-xl">
          Visual analytics and metrics summarizing total solved programming challenges, topics distribution, and platforms comparison.
        </p>
      </section>

      {/* Charts Display */}
      <StatisticsCharts problems={problems} />
    </div>
  );
}

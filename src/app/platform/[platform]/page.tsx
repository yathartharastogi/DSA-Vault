import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import PlatformDashboard from "@/components/platform-dashboard";

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

// Generate static parameters for all unique platforms
export async function generateStaticParams() {
  try {
    const dataFilePath = path.join(process.cwd(), "data", "problems.json");
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const dataStr = fs.readFileSync(dataFilePath, "utf-8");
    const problems: Problem[] = JSON.parse(dataStr);

    const platforms = Array.from(new Set(problems.map((p) => p.platform.toLowerCase())));
    return platforms.map((platform) => ({
      platform,
    }));
  } catch (err) {
    console.error("Error generating static params for platforms:", err);
    return [];
  }
}

interface PageProps {
  params: Promise<{ platform: string }>;
}

export default async function PlatformPage({ params }: PageProps) {
  const { platform } = await params;
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

  // Find matching problems for this platform
  const platformProblems = problems.filter(
    (p) => p.platform.toLowerCase() === platform.toLowerCase()
  );

  if (platformProblems.length === 0) {
    notFound();
  }

  // Get the display name of the platform (e.g. "LeetCode" instead of "leetcode")
  const platformName = platformProblems[0].platform;

  return <PlatformDashboard platformName={platformName} problems={platformProblems} />;
}

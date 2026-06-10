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

const TRACKED_PLATFORMS = ["LeetCode", "Codeforces", "Codechef"];

// Generate static parameters for all unique platforms + standard profiles
export async function generateStaticParams() {
  try {
    const dataFilePath = path.join(process.cwd(), "data", "problems.json");
    let problems: Problem[] = [];
    
    if (fs.existsSync(dataFilePath)) {
      const dataStr = fs.readFileSync(dataFilePath, "utf-8");
      problems = JSON.parse(dataStr);
    }

    const platforms = Array.from(new Set(problems.map((p) => p.platform.toLowerCase())));
    const allPlatforms = Array.from(new Set([...platforms, "leetcode", "codeforces", "codechef"]));
    
    return allPlatforms.map((platform) => ({
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

  // Normalize / verify platform
  const isValidPlatform = TRACKED_PLATFORMS.some(
    (p) => p.toLowerCase() === platform.toLowerCase()
  ) || problems.some((p) => p.platform.toLowerCase() === platform.toLowerCase());

  if (!isValidPlatform) {
    notFound();
  }

  // Find matching problems for this platform
  const platformProblems = problems.filter(
    (p) => p.platform.toLowerCase() === platform.toLowerCase()
  );

  // Get standard platform casing or fallback
  const standardName = TRACKED_PLATFORMS.find(
    (p) => p.toLowerCase() === platform.toLowerCase()
  );
  const platformName = standardName || (platformProblems[0]?.platform || platform);

  return <PlatformDashboard platformName={platformName} problems={platformProblems} />;
}

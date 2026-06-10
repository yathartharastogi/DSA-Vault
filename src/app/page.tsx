import fs from "fs";
import path from "path";
import HomeDashboard from "@/components/home-dashboard";

export default async function Page() {
  let problems = [];

  try {
    const dataFilePath = path.join(process.cwd(), "data", "problems.json");
    if (fs.existsSync(dataFilePath)) {
      const dataStr = fs.readFileSync(dataFilePath, "utf-8");
      problems = JSON.parse(dataStr);
    }
  } catch (err) {
    console.error("Failed to read problems.json:", err);
  }

  return <HomeDashboard initialProblems={problems} />;
}

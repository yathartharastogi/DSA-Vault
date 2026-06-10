"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Award, Clock, Code2, Tag, BookOpen, Layers } from "lucide-react";

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

interface HomeDashboardProps {
  initialProblems: Problem[];
}

export default function HomeDashboard({ initialProblems }: HomeDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  // Calculate statistics
  const stats = useMemo(() => {
    const total = initialProblems.length;
    const easy = initialProblems.filter((p) => p.difficulty === "Easy").length;
    const medium = initialProblems.filter((p) => p.difficulty === "Medium").length;
    const hard = initialProblems.filter((p) => p.difficulty === "Hard").length;

    // Platform counts
    const platformsMap: Record<string, number> = {
      "LeetCode": 0,
      "Codeforces": 0,
      "Codechef": 0
    };
    initialProblems.forEach((p) => {
      const standardName = Object.keys(platformsMap).find(
        key => key.toLowerCase() === p.platform.toLowerCase()
      );
      if (standardName) {
        platformsMap[standardName]++;
      } else {
        platformsMap[p.platform] = 1;
      }
    });
    const platforms = Object.entries(platformsMap).map(([name, count]) => ({
      name,
      count,
    }));

    // Unique topics
    const topicsSet = new Set<string>();
    initialProblems.forEach((p) => p.topics.forEach((t) => topicsSet.add(t)));
    const allTopics = ["All", ...Array.from(topicsSet).sort()];

    return { total, easy, medium, hard, platforms, allTopics };
  }, [initialProblems]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return initialProblems.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.platform.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty =
        selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
      
      const matchesTopic =
        selectedTopic === "All" || p.topics.includes(selectedTopic);

      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [initialProblems, searchQuery, selectedDifficulty, selectedTopic]);

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

  // Container motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="space-y-4 max-w-2xl py-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          DSA Vault
        </h1>
        <p className="text-base sm:text-lg text-muted font-normal leading-relaxed">
          A curated archive of Data Structures and Algorithms problems solved throughout my coding journey.
        </p>
      </section>

      {/* Hero Stats */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Solved</span>
              <Code2 className="h-4 w-4" />
            </div>
            <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200">
            <div className="flex items-center justify-between text-emerald-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Easy</span>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-3xl font-bold tracking-tight">{stats.easy}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200">
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Medium</span>
              <div className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <div className="text-3xl font-bold tracking-tight">{stats.medium}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200">
            <div className="flex items-center justify-between text-rose-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Hard</span>
              <div className="h-2 w-2 rounded-full bg-rose-500" />
            </div>
            <div className="text-3xl font-bold tracking-tight">{stats.hard}</div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Platforms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.platforms.map((platform) => (
            <Link
              key={platform.name}
              href={`/platform/${platform.name.toLowerCase()}`}
              className="group rounded-xl border border-border bg-card p-5 hover:border-foreground/35 transition-all duration-200 cursor-pointer flex justify-between items-center"
            >
              <div className="space-y-1">
                <div className="font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                  {platform.name}
                </div>
                <div className="text-xs text-muted">
                  {platform.count} {platform.count === 1 ? "problem" : "problems"} solved
                </div>
              </div>
              <ChevronDown className="h-4 w-4 -rotate-90 text-muted group-hover:text-foreground transition-all duration-200 group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* Filters and Problem List */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <h2 className="text-lg font-semibold tracking-tight">All Problems</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
              />
            </div>

            {/* Difficulty Tabs */}
            <div className="flex bg-card border border-border p-0.5 rounded-lg text-xs">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-md transition-all font-medium ${
                    selectedDifficulty === diff
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Topic Select */}
            <div className="relative">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="appearance-none w-full sm:w-44 pl-3 pr-8 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
              >
                <option value="All">All Topics</option>
                {stats.allTopics.filter(t => t !== "All").map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Problems List */}
        <AnimatePresence mode="popLayout">
          {filteredProblems.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-3"
            >
              {filteredProblems.map((problem) => (
                <motion.div
                  key={`${problem.platform}-${problem.id}`}
                  variants={itemVariants}
                  layoutId={`${problem.platform}-${problem.id}`}
                  className="group rounded-lg border border-border bg-card p-4 hover:border-foreground/35 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs text-muted font-mono bg-background px-2 py-0.5 rounded border border-border/60">
                        #{problem.id}
                      </span>
                      <Link
                        href={`/platform/${problem.platform.toLowerCase()}/${problem.id.toLowerCase()}`}
                        className="font-medium text-foreground hover:underline transition-colors decoration-muted"
                      >
                        {problem.name}
                      </Link>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${difficultyColors(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                      <span className="font-medium">{problem.platform}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" /> {problem.timeComplexity}
                      </span>
                      {problem.topics.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span className="truncate max-w-[150px] sm:max-w-xs">
                            {problem.topics.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0">
                    <span className="text-[10px] text-muted font-mono sm:mb-1">
                      {problem.date}
                    </span>
                    {problem.day && (
                      <span className="text-[10px] font-mono text-muted bg-background border border-border/80 px-1.5 py-0.5 rounded">
                        Day {problem.day}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center border border-dashed border-border rounded-xl bg-card/20"
            >
              <Layers className="h-8 w-8 text-muted mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm text-foreground font-semibold">No problems found</p>
              <p className="text-xs text-muted mt-1">Try adjusting your filters or search terms</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

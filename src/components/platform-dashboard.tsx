"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Clock, Tag, ArrowLeft, Code2 } from "lucide-react";

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

interface PlatformDashboardProps {
  platformName: string;
  problems: Problem[];
}

export default function PlatformDashboard({ platformName, problems }: PlatformDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  // Calculate difficulty counts for this platform
  const stats = useMemo(() => {
    const total = problems.length;
    const easy = problems.filter((p) => p.difficulty === "Easy").length;
    const medium = problems.filter((p) => p.difficulty === "Medium").length;
    const hard = problems.filter((p) => p.difficulty === "Hard").length;
    return { total, easy, medium, hard };
  }, [problems]);

  // Filter problems for list
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty =
        selectedDifficulty === "All" || p.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [problems, searchQuery, selectedDifficulty]);

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
    <div className="space-y-8">
      {/* Back link */}
      <div>
        <Link
          href="/platforms"
          className="inline-flex items-center space-x-1 text-xs text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Platforms</span>
        </Link>
      </div>

      {/* Platform Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">{platformName}</h1>
          <p className="text-muted text-sm">
            Curated archive of {stats.total} {stats.total === 1 ? "problem" : "problems"} solved on {platformName}.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex gap-4">
          <div className="flex flex-col px-3 py-1.5 border border-border/60 bg-card/50 rounded-lg text-center min-w-[70px]">
            <span className="text-[9px] font-mono text-muted uppercase tracking-wider">Easy</span>
            <span className="text-sm font-bold text-emerald-500">{stats.easy}</span>
          </div>
          <div className="flex flex-col px-3 py-1.5 border border-border/60 bg-card/50 rounded-lg text-center min-w-[70px]">
            <span className="text-[9px] font-mono text-muted uppercase tracking-wider">Medium</span>
            <span className="text-sm font-bold text-amber-500">{stats.medium}</span>
          </div>
          <div className="flex flex-col px-3 py-1.5 border border-border/60 bg-card/50 rounded-lg text-center min-w-[70px]">
            <span className="text-[9px] font-mono text-muted uppercase tracking-wider">Hard</span>
            <span className="text-sm font-bold text-rose-500">{stats.hard}</span>
          </div>
        </div>
      </section>

      {/* Search & Filter Header */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder={`Search in ${platformName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex bg-card border border-border p-0.5 rounded-lg text-xs self-start sm:self-auto">
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                  selectedDifficulty === diff
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {diff}
              </button>
            ))}
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
                  key={problem.id}
                  variants={itemVariants}
                  layoutId={problem.id}
                  className="group rounded-lg border border-border bg-card p-4 hover:border-foreground/35 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs text-muted font-mono bg-background px-2 py-0.5 rounded border border-border/60">
                        #{problem.id}
                      </span>
                      <Link
                        href={`/platform/${platformName.toLowerCase()}/${problem.id.toLowerCase()}`}
                        className="font-medium text-foreground hover:underline transition-colors decoration-muted"
                      >
                        {problem.name}
                      </Link>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${difficultyColors(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" /> {problem.timeComplexity}
                      </span>
                      {problem.topics.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span className="truncate max-w-[200px] sm:max-w-md">
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
              <Code2 className="h-8 w-8 text-muted mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm text-foreground font-semibold">No problems found</p>
              <p className="text-xs text-muted mt-1">Try adjusting your filters or search terms</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

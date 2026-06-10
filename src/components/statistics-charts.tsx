"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Code2, Target, Trophy, Award } from "lucide-react";

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

interface StatisticsChartsProps {
  problems: Problem[];
}

export default function StatisticsCharts({ problems }: StatisticsChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute all data summaries
  const { difficultyData, platformData, topicData, statsSummary } = useMemo(() => {
    const total = problems.length;
    const easy = problems.filter((p) => p.difficulty === "Easy").length;
    const medium = problems.filter((p) => p.difficulty === "Medium").length;
    const hard = problems.filter((p) => p.difficulty === "Hard").length;

    // Difficulty chart format
    const difficultyData = [
      { name: "Easy", value: easy, color: "#10B981" }, // emerald-500
      { name: "Medium", value: medium, color: "#F59E0B" }, // amber-500
      { name: "Hard", value: hard, color: "#EF4444" }, // red-500
    ].filter((item) => item.value > 0);

    // Platform count mapping
    const platformMap: Record<string, number> = {};
    problems.forEach((p) => {
      platformMap[p.platform] = (platformMap[p.platform] || 0) + 1;
    });
    const platformData = Object.entries(platformMap).map(([name, count]) => ({
      name,
      value: count,
    })).sort((a, b) => b.value - a.value);

    // Topics frequency mapping
    const topicMap: Record<string, number> = {};
    problems.forEach((p) => {
      p.topics.forEach((topic) => {
        topicMap[topic] = (topicMap[topic] || 0) + 1;
      });
    });
    const topicData = Object.entries(topicMap)
      .map(([name, count]) => ({
        name,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 topics

    const topicsTotal = Object.keys(topicMap).length;

    return {
      difficultyData,
      platformData,
      topicData,
      statsSummary: {
        total,
        easy,
        medium,
        hard,
        topicsTotal,
        platformsTotal: Object.keys(platformMap).length,
      },
    };
  }, [problems]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs font-mono">
          <p className="font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-muted mt-1">
            Count: <span className="text-foreground font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 w-full animate-pulse bg-card/40 rounded-xl border border-border" />
        <div className="h-80 w-full animate-pulse bg-card/40 rounded-xl border border-border" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Summary Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center space-x-2 text-muted mb-1">
            <Code2 className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Total Solutions</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">{statsSummary.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center space-x-2 text-muted mb-1">
            <Target className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Platforms</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">{statsSummary.platformsTotal}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center space-x-2 text-muted mb-1">
            <Award className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Topics Mastery</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">{statsSummary.topicsTotal}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center space-x-2 text-muted mb-1">
            <Trophy className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Hard Solved</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">{statsSummary.hard}</p>
        </div>
      </section>

      {/* Main Charts Row 1: Difficulty & Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Difficulty Chart */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold tracking-tight">Difficulty distribution</h3>
            <p className="text-xs text-muted">Breakdown of Easy, Medium, and Hard solutions</p>
          </div>
          <div className="h-64 flex justify-center items-center">
            {difficultyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-muted font-mono">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted">No difficulty stats available.</p>
            )}
          </div>
        </div>

        {/* Platform Chart */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold tracking-tight">Platforms breakdown</h3>
            <p className="text-xs text-muted">Comparison of solved problems by platform</p>
          </div>
          <div className="h-64">
            {platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--muted-foreground)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                  <Bar 
                    dataKey="value" 
                    fill="var(--foreground)" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted">No platform stats available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Topics horizontal Bar Chart */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold tracking-tight">Top Topics</h3>
          <p className="text-xs text-muted">Frequency distribution of solved topics (top 8)</p>
        </div>
        <div className="h-72">
          {topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topicData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 30, bottom: 0 }}
              >
                <XAxis 
                  type="number" 
                  stroke="var(--muted-foreground)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                <Bar 
                  dataKey="value" 
                  fill="var(--foreground)" 
                  opacity={0.8}
                  radius={[0, 4, 4, 0]} 
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted text-center py-20">No topic stats available.</p>
          )}
        </div>
      </section>
    </div>
  );
}

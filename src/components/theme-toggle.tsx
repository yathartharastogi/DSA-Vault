"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-md bg-transparent" />;
  }

  const themes: { name: typeof theme; icon: typeof Sun; label: string }[] = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex items-center space-x-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm transition-colors">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.name;
        return (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`relative flex items-center justify-center h-7 w-7 rounded-md text-muted hover:text-foreground transition-all duration-200 outline-none focus:ring-1 focus:ring-foreground ${
              isActive
                ? "bg-background text-foreground shadow-sm font-medium"
                : "opacity-60 hover:opacity-100"
            }`}
            title={`Use ${t.label} theme`}
            aria-label={`Use ${t.label} theme`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}

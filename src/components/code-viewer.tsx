"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeViewerProps {
  highlightedHtml: string;
  rawCode: string;
  language: string;
}

export default function CodeViewer({ highlightedHtml, rawCode, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const lines = rawCode.split("\n");

  return (
    <div className="relative border border-border rounded-xl bg-card overflow-hidden transition-colors duration-200">
      {/* Header bar of Code Viewer */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/80 backdrop-blur-sm">
        <span className="text-xs font-mono text-muted uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center space-x-1.5 text-xs text-muted hover:text-foreground hover:bg-background border border-transparent hover:border-border px-2 py-1 rounded-md transition-all active:scale-95"
          title="Copy solution code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Main Code Box */}
      <div className="flex font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
        {/* Line Numbers Column */}
        <div className="select-none text-right pr-4 pl-4 py-4 text-muted/50 border-r border-border bg-background/30 font-mono text-[11px] sm:text-xs min-w-[3rem]">
          {lines.map((_, i) => (
            <div key={i} className="h-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Content Column */}
        <div 
          className="flex-1 py-4 px-5 overflow-x-auto text-[11px] sm:text-xs font-mono"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }} 
        />
      </div>
    </div>
  );
}

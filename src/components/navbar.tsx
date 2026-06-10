"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import { FolderGit2 } from "lucide-react";
import { useState } from "react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Platforms", href: "/platforms" },
    { name: "Timeline", href: "/timeline" },
    { name: "Statistics", href: "/statistics" },
  ];

  const githubUrl = "https://github.com/yathartharastogi/DSA-Vault";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 text-foreground font-semibold tracking-tight hover:opacity-90">
              <FolderGit2 className="h-5 w-5 stroke-[2]" />
              <span>DSA Vault</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    isActive ? "text-foreground" : "text-muted"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            <div className="h-4 w-px bg-border" />

            <ThemeToggle />
          </div>

          {/* Mobile menu button & Theme toggle */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col justify-center items-center h-8 w-8 rounded-md border border-border bg-card text-foreground"
              aria-expanded={isOpen}
              aria-label="Toggle Navigation Menu"
            >
              <span className={`block w-4 h-0.5 bg-current transition-transform duration-200 ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`} />
              <span className={`block w-4 h-0.5 bg-current transition-opacity duration-200 my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`block w-4 h-0.5 bg-current transition-transform duration-200 ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive ? "bg-card text-foreground" : "text-muted hover:bg-card/50 hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-card/50 hover:text-foreground"
          >
            <GithubIcon className="h-5 w-5" />
            <span>GitHub Repository</span>
          </a>
        </div>
      )}
    </nav>
  );
}

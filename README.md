# DSA Vault

[![Deploy DSA Vault to GitHub Pages](https://github.com/yathartharastogi/DSA-Vault/actions/workflows/generate-and-deploy.yml/badge.svg)](https://github.com/yathartharastogi/DSA-Vault/actions/workflows/generate-and-deploy.yml)
&nbsp;&nbsp;•&nbsp;&nbsp;
**[Live Platform ↗](https://yathartharastogi.github.io/DSA-Vault/)**

DSA Vault is a personal archive and interactive portfolio engineered to organize, track and showcase solved Data Structures and Algorithms problems. 

Rather than leaving solutions buried in static repository folders, this system parses source code files dynamically to compile a structured JSON database, generating a clean, fast and content-focused knowledge portfolio.

---

## System Architecture & Engineering

The project is built with a decoupled architecture, separating the **website interface** from the **solution storage**:

1. **Solutions Repository** ([DSA-Problems](https://github.com/yathartharastogi/DSA-Problems)): A minimal repository dedicated strictly to storing raw solution files (`.cpp`, `.py`, etc.) grouped by platform. Each file contains a structured comment header detailing the metadata.
2. **Web Engine** ([DSA-Vault](https://github.com/yathartharastogi/DSA-Vault)): Built with Next.js 15, TypeScript and Tailwind CSS. It contains the parsing engine, UI dashboards and static routing compiler.
3. **Automated Pipeline**: When code is pushed to the repository, a GitHub Actions workflow automatically clones the solutions repository, parses the headers, compiles the database, commits updates and publishes the static export to GitHub Pages, removing the need of manual updation entirely.

---

## Key Features

### Custom Parsing Engine (`scripts/parse-solutions.ts`)
- **Metadata Extraction**: Scans programming files recursively, extracting fields like `Problem`, `Platform`, `Difficulty`, `Topics`, `Complexity` and `Submitted on` from comment headers.
- **Dynamic Journey Day Calculator**: Calculates relative journey progression days (e.g. `Day 1`, `Day 2`, `Day 3`) dynamically based on chronological submission dates, making it frictionless to add files without tracking absolute day numbers manually.
- **Code Stripping**: Automatically strips out metadata comments from files to render only clean, production-ready solution code.

### Performance & Server-Side Highlighting
- **Shiki Integration**: Syntax highlighting is computed entirely server-side during static page generation. It generates dual-theme variables (`github-light` and `github-dark`), which switch instantly via custom CSS when the theme toggle is clicked.
- **Zero Client Load**: Rendering syntax-highlighted solutions requires 0kB of client-side JavaScript, keeping the website resource friendly.

### Analytics Dashboard
- Interactive analytics compiled using monochrome-styled Recharts.
- Renders difficulty distributions, solved counts per platform and a horizontal frequency bar chart for topic mastery (e.g., Arrays, Hash Maps, Strings).
- Pre-initialized profiles for platforms like **LeetCode**, **Codeforces** and **Codechef** allow tracking active and empty platform profiles with clean empty-states instead of breaking page routes.

### Timeline & Filters
- **Chronological Progress**: Renders a vertical log tracking consistency day-by-day.
- **Instant Client-Side Filtering**: Supports responsive searching by problem name/ID, difficulty tabs and dynamic topic tags.

---

## Theme System
The platform implements a clean, premium and minimal design language inspired by Vercel and Linear.
- **Light Mode**: Background `#FAFAF8` | Cards `#FFFFFF` | Text `#18181B` | Borders `#E4E4E7`
- **Dark Mode**: Background `#09090B` | Cards `#18181B` | Text `#FAFAFA` | Borders `#27272A`
- Selection persistence managed seamlessly via `localStorage` and system media preferences.

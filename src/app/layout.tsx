import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSA Vault — Personal Problem Archive",
  description: "A curated archive and portfolio of Data Structures and Algorithms problems solved throughout my coding journey.",
  keywords: ["DSA", "Data Structures", "Algorithms", "LeetCode", "Codeforces", "Portfolio", "Programming"],
  authors: [{ name: "Yathartha Rastogi" }],
  openGraph: {
    title: "DSA Vault — Personal Problem Archive",
    description: "A curated archive and portfolio of Data Structures and Algorithms problems solved throughout my coding journey.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
            {children}
          </main>
          <footer className="border-t border-border bg-card/30 py-6 transition-colors duration-200">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-muted">
              <p>© {new Date().getFullYear()} Yathartha Rastogi. All rights reserved.</p>
              <p className="mt-2 md:mt-0">
                Designed with a focus on code, structure, and speed.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

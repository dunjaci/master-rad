"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/teorija", label: "Teorijske osnove" },
  { href: "/frequent-words", label: "Česte reči" },
  { href: "/clump-finding", label: "Pronalaženje grupa" },
  { href: "/skew", label: "GC-skew dijagram" },
  { href: "/mismatches", label: "Propusti" },
  { href: "/literatura", label: "Literatura" },
];

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.2-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.93.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.94c.85 0 1.7.12 2.5.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.83c0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid min-h-16 max-w-7xl items-center gap-3 px-4 py-3 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <Link
          href="/"
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
            pathname === "/"
              ? "bg-slate-950 text-white"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
          }`}
        >
          Uvod
        </Link>

        <nav className="flex flex-wrap justify-start gap-2 md:justify-end lg:justify-center">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-blue-700 ${
                  active ? "bg-blue-50 text-blue-700" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 md:col-span-2 lg:col-span-1"
          href="https://github.com/dunjaci/master-rad"
          rel="noreferrer"
          target="_blank"
        >
          <GitHubIcon />
          GitHub
        </a>
      </div>
    </header>
  );
}

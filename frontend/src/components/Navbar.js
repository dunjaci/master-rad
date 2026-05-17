"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/teorija", label: "Teorijske osnove" },
  { href: "/frequent-words", label: "Frequent Words" },
  { href: "/clump-finding", label: "Clump Finding" },
  { href: "/skew", label: "GC-skew" },
  { href: "/mismatches", label: "Mismatches" },
  { href: "/literatura", label: "Literatura" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-5 px-4 py-3 lg:px-8">
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

        <nav className="flex flex-1 flex-wrap justify-end gap-2">
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
      </div>
    </header>
  );
}

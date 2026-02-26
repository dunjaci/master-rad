"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Uvod" },
  { href: "/frequent-words", label: "Frequent Words" },
  // dodavaćemo kasnije:
  // { href: "/pattern-count", label: "Pattern Count" },
  // { href: "/mismatches", label: "Mismatches" },
  // { href: "/gc-skew", label: "GC Skew" },
  // { href: "/find-oric", label: "Find oriC" },
  { href: "/literatura", label: "Literatura" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold">
          Replikacija genoma
        </Link>

        <nav className="flex flex-wrap gap-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm hover:bg-gray-100 ${
                  active ? "bg-gray-100 font-semibold" : ""
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

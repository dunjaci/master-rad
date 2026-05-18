"use client";

import Link from "next/link";

const lessons = [
  { href: "/teorija", label: "Teorijske osnove" },
  { href: "/frequent-words", label: "Česte reči" },
  { href: "/clump-finding", label: "Pronalaženje grupa" },
  { href: "/skew", label: "GC-skew dijagram" },
  { href: "/mismatches", label: "Propusti" },
  { href: "/literatura", label: "Literatura" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-5 h-1.5 w-28 rounded-full bg-blue-600" />
          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
            Pronalaženje početnog regiona replikacije
          </h1>
          <div className="mx-auto mt-6 h-px max-w-2xl bg-slate-300" />
        </header>

        <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Ova lekcija objašnjava kako se početni region replikacije DNK može
            tražiti analizom DNK sekvenci. Fokus je na razumevanju problema,
            primeni algoritama i tumačenju dobijenih rezultata.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-bold">Pregled lekcija</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {lessons.map((lesson) => (
                <Link
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  href={lesson.href}
                  key={lesson.href}
                >
                  {lesson.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

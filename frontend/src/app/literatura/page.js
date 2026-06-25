const references = [
  {
    id: 1,
    authors: "Bruce Alberts, Alexander Johnson, Julian Lewis i saradnici",
    title: "Molecular Biology of the Cell",
    details: "4. izdanje, 2002.",
    note: "Osnovni biološki kontekst replikacije DNK, strukture genoma i ćelijskih procesa.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK26821/",
  },
  {
    id: 2,
    authors: "Jovana Kovačević",
    title: "Materijal sa predavanja „Uvod u bioinformatiku”",
    details: "Matematički fakultet, 2022.",
    note: "Nastavni materijal korišćen kao osnova za uvod u algoritamsku analizu DNK sekvenci.",
    url: "https://www.bioinformatika.matf.bg.ac.rs/predavanja/Chapter_1.pdf",
  },
  {
    id: 3,
    authors: "Philip Compeau, Pavel Pevzner",
    title:
      "Bioinformatics Algorithms: An Active Learning Approach Vol. I, Chapter 1: Where in the Genome Does DNA Replication Begin?",
    details: "2015.",
    note: "Glavni izvor za algoritme: frequent words, clump finding, skew i mismatches.",
    url: "https://www.bioinformaticsalgorithms.org/",
  },
  {
    id: 4,
    authors: "Dunja Čitlučanin",
    title: "GitHub repozitorijum elektronske lekcije",
    details: "Izvorni kod aplikacije i tekstualna verzija rada.",
    note: "Repozitorijum sadrži implementaciju frontend aplikacije, backend API-ja, prateće projektne fajlove i tekstualnu verziju master rada.",
    url: "https://github.com/dunjaci/master-rad",
  },
  {
    id: 5,
    authors: "FastAPI",
    title: "FastAPI dokumentacija",
    details: "Zvanična dokumentacija, 2026.",
    note: "Korišćeno za razvoj serverskog dela aplikacije i definisanje REST API krajnjih tačaka.",
    url: "https://fastapi.tiangolo.com/",
  },
  {
    id: 6,
    authors: "Next.js",
    title: "Next.js dokumentacija",
    details: "Zvanična dokumentacija, 2026.",
    note: "Korišćeno za razvoj klijentskog dela elektronske lekcije i organizaciju stranica u aplikaciji.",
    url: "https://nextjs.org/docs",
  },
  {
    id: 7,
    authors: "React",
    title: "React dokumentacija",
    details: "Zvanična dokumentacija, 2026.",
    note: "Korišćeno za implementaciju interaktivnih komponenti, stanja i prikaza algoritamskih koraka.",
    url: "https://react.dev/",
  },
  {
    id: 8,
    authors: "Node.js",
    title: "Node.js dokumentacija",
    details: "Zvanična dokumentacija, 2026.",
    note: "Korišćeno kao razvojno okruženje za pokretanje frontend alata i izgradnju aplikacije.",
    url: "https://nodejs.org/en/docs",
  },
  {
    id: 9,
    authors: "Tailwind CSS",
    title: "Tailwind CSS dokumentacija",
    details: "Zvanična dokumentacija, 2026.",
    note: "Korišćeno za stilizovanje korisničkog interfejsa elektronske lekcije.",
    url: "https://tailwindcss.com/docs",
  },
  {
    id: 10,
    authors: "Render",
    title: "Render dokumentacija",
    details: "Zvanična dokumentacija, 2026.",
    note: "Korišćeno za podešavanje i objavljivanje backend servisa.",
    url: "https://render.com/docs",
  },
  {
    id: 11,
    authors: "Vercel",
    title: "Vercel dokumentacija",
    details: "Zvanična dokumentacija, 2026.",
    note: "Korišćeno za objavljivanje frontend dela aplikacije.",
    url: "https://vercel.com/docs",
  },
  {
    id: 12,
    authors: "Python",
    title: "Python 3.12 dokumentacija",
    details: "Zvanična dokumentacija, 2026.",
    note: "Korišćeno za implementaciju bioinformatičkih algoritama u serverskom delu aplikacije.",
    url: "https://docs.python.org/3.12/index.html",
  },
  {
    id: 13,
    authors: "Vinod Chugani",
    title: "Hamming Distance Explained: The Theory and Applications",
    details: "DataCamp, 2025.",
    note: "Dodatni izvor za objašnjenje Hamingove distance i njene primene.",
    url: "https://www.datacamp.com/tutorial/hamming-distance",
  },
  {
    id: 14,
    authors: "Aleksandar Veljković",
    title: "Uvod u bioinformatiku: Materijali sa časova vežbi - Pronalaženje početka replikacije",
    details: "Matematički fakultet, 2022.",
    note: "Materijali sa vežbi korišćeni kao dodatna podrška za algoritme pronalaženja početka replikacije.",
    url: "https://github.com/aleksandar-veljkovic/MATF-Uvod-u-bioinformatiku/tree/master/2022",
  },
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

export default function Literatura() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
        <header className="border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Bibliografija
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Literatura
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            Ova stranica sadrži izvore korišćene za biološku motivaciju, algoritamske
            postupke i tehnologije primenjene u elektronskoj lekciji o pronalaženju
            početnog regiona replikacije.
          </p>
        </header>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-2xl font-bold">Korišćeni izvori</h2>
          </div>

          <div className="divide-y divide-slate-200">
            {references.map((reference) => (
              <article
                className="grid gap-4 px-6 py-6 md:grid-cols-[72px_1fr_auto] md:items-start"
                key={reference.id}
              >
                <div className="font-mono text-xl font-black text-blue-700">
                  [{reference.id}]
                </div>

                <div>
                  <h3 className="text-xl font-bold leading-7">{reference.title}</h3>
                  <p className="mt-2 text-base font-semibold text-slate-700">
                    {reference.authors}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{reference.details}</p>
                  <p className="mt-3 max-w-3xl leading-7 text-slate-600">{reference.note}</p>
                </div>

                <a
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  href={reference.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {reference.url.includes("github.com") && <GitHubIcon />}
                  Otvori link
                </a>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

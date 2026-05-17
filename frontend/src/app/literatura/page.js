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
];

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
            Ova stranica sadrži izvore korišćene za biološku motivaciju i algoritamske
            postupke prikazane u elektronskoj lekciji o pronalaženju početnog regiona
            replikacije.
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
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  href={reference.url}
                  rel="noreferrer"
                  target="_blank"
                >
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

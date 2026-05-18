"use client";

import { useEffect, useMemo, useState } from "react";

const EXAMPLE_GENOME = "ATGATCATGATCAAGCTTGATCAT";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const codeSamples = {
  naive: `def symbol_to_number(symbol):
    return {"A": 0, "T": 1, "C": 2, "G": 3}[symbol]

def pattern_to_number(pattern):
    number = 0
    for symbol in pattern:
        number = number * 4 + symbol_to_number(symbol)
    return number

def number_to_pattern(index, k):
    symbols = ["A", "T", "C", "G"]
    pattern = ""
    for _ in range(k):
        pattern = symbols[index % 4] + pattern
        index //= 4
    return pattern

def computing_frequencies(text, k):
    frequency_array = [0 for _ in range(4 ** k)]
    for i in range(0, len(text) - k + 1):
        pattern = text[i:i + k]
        index = pattern_to_number(pattern)
        frequency_array[index] += 1
    return frequency_array

def clump_finding(genome, k, L, t):
    frequent_patterns = set()
    clump = [0 for _ in range(4 ** k)]

    for i in range(0, len(genome) - L + 1):
        text = genome[i:i + L]
        frequency_array = computing_frequencies(text, k)

        for index in range(0, 4 ** k):
            if frequency_array[index] >= t:
                clump[index] = 1

    for index in range(0, 4 ** k):
        if clump[index] == 1:
            frequent_patterns.add(number_to_pattern(index, k))

    return sorted(frequent_patterns)`,
  better: `def better_clump_finding(genome, k, L, t):
    frequent_patterns = set()
    clump = [0 for _ in range(4 ** k)]

    text = genome[0:L]
    frequency_array = computing_frequencies(text, k)

    for index in range(0, 4 ** k):
        if frequency_array[index] >= t:
            clump[index] = 1

    for i in range(1, len(genome) - L + 1):
        first_pattern = genome[i - 1:i - 1 + k]
        index_first = pattern_to_number(first_pattern)
        frequency_array[index_first] -= 1

        last_pattern = genome[i + L - k:i + L]
        index_last = pattern_to_number(last_pattern)
        frequency_array[index_last] += 1

        if frequency_array[index_last] >= t:
            clump[index_last] = 1

    for index in range(0, 4 ** k):
        if clump[index] == 1:
            frequent_patterns.add(number_to_pattern(index, k))

    return sorted(frequent_patterns)`,
};

const approaches = [
  {
    id: "naive",
    title: "Naivni pristup",
    badge: "računa svaki prozor",
    complexity: "O((|Genome| - L + 1) * (4^k + L * k))",
    text: "Za svaki prozor dužine L iznova računa frekvencije svih k-mera i označava one koji se pojavljuju bar t puta.",
  },
  {
    id: "better",
    title: "Optimizacija kliznog prozora",
    badge: "ažurira dve vrednosti",
    complexity: "O(4^k + |Genome| * k)",
    text: "Prvi prozor se obradi jednom, a zatim se pri svakom pomeranju smanji frekvencija k-mera koji izlazi i poveća frekvencija k-mera koji ulazi.",
  },
];

function cleanDna(value) {
  return value.replace(/\s+/g, "").toUpperCase().replace(/[^ACGT]/g, "");
}

function GenomeWindow({ genome, k, L, start }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex w-max gap-1 font-mono text-sm">
        {genome.split("").map((symbol, index) => {
          const inWindow = index >= start && index < start + L;
          const entering = index >= start + L - k && index < start + L;
          const leaving = start > 0 && index >= start - 1 && index < start - 1 + k;
          return (
            <span
              className={`grid h-8 w-8 place-items-center rounded-md border ${
                entering
                  ? "border-emerald-500 bg-emerald-600 font-bold text-white"
                  : leaving
                    ? "border-rose-400 bg-rose-100 font-bold text-rose-800"
                    : inWindow
                      ? "border-blue-500 bg-blue-600 font-bold text-white"
                      : "border-slate-200 bg-white text-slate-700"
              }`}
              key={`${symbol}-${index}`}
            >
              {symbol}
            </span>
          );
        })}
      </div>
      <div className="mt-2 flex w-max gap-1 font-mono text-[11px] text-slate-500">
        {genome.split("").map((_, index) => (
          <span className="grid w-8 place-items-center" key={index}>
            {index}
          </span>
        ))}
      </div>
    </div>
  );
}

function WindowExplanation({ activeApproach, activeWindow }) {
  if (activeApproach === "better" && activeWindow.start > 0) {
    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <p className="font-semibold">Šta se menja pri pomeranju prozora?</p>
        <p className="mt-2 leading-7 text-slate-600">
          Iz prozora izlazi k-mer{" "}
          <span className="font-mono font-bold text-rose-700">
            {activeWindow.leavingPattern}
          </span>
          , a ulazi k-mer{" "}
          <span className="font-mono font-bold text-emerald-700">
            {activeWindow.enteringPattern}
          </span>
          . Sve ostale frekvencije ostaju iste.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="font-semibold">Šta radi ovaj korak?</p>
      <p className="mt-2 leading-7 text-slate-600">
        Posmatra se segment genoma od pozicije{" "}
        <span className="font-mono font-bold">{activeWindow.start}</span> do{" "}
        <span className="font-mono font-bold">
          {activeWindow.start + activeWindow.text.length - 1}
        </span>
        . U njemu se broje svi k-meri i proverava da li neki od njih formira grupu.
      </p>
    </div>
  );
}

function FrequencyTable({ activeWindow, t }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold">Frekvencije u trenutnom L-prozoru</p>
        <span className="font-mono text-sm text-slate-500">prag t = {t}</span>
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg bg-slate-50 p-4">
        <div
          className="grid w-max gap-y-2 text-center font-mono text-sm"
          style={{
            gridTemplateColumns: `88px repeat(${activeWindow.entries.length}, 62px)`,
          }}
        >
          <div className="pr-4 text-right font-sans italic text-slate-600">k-mer</div>
          {activeWindow.entries.map((item) => (
            <div
              className={item.count >= t ? "font-bold text-blue-700" : "text-slate-700"}
              key={`pattern-${item.pattern}`}
            >
              {item.pattern}
            </div>
          ))}
          <div className="pr-4 text-right font-sans text-slate-600">index</div>
          {activeWindow.entries.map((item) => (
            <div key={`index-${item.pattern}`}>{item.index}</div>
          ))}
          <div className="pr-4 text-right font-sans text-slate-600">count</div>
          {activeWindow.entries.map((item) => (
            <div
              className={`rounded-md px-2 py-1 ${
                item.count >= t ? "bg-blue-600 font-bold text-white" : "bg-white text-slate-700"
              }`}
              key={`count-${item.pattern}`}
            >
              {item.count}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ClumpFindingClient() {
  const [genome, setGenome] = useState(EXAMPLE_GENOME);
  const [k, setK] = useState(3);
  const [L, setL] = useState(10);
  const [t, setT] = useState(2);
  const [activeApproach, setActiveApproach] = useState("naive");
  const [step, setStep] = useState(0);
  const [apiAnalysis, setApiAnalysis] = useState(null);
  const [apiError, setApiError] = useState(false);

  const cleanedGenome = useMemo(() => cleanDna(genome), [genome]);
  const safeK = Math.max(1, Number(k) || 1);
  const safeL = Math.max(safeK, Number(L) || safeK);
  const safeT = Math.max(1, Number(t) || 1);
  const invalid = cleanedGenome.length === 0 || safeK > safeL || safeL > cleanedGenome.length;
  const analysis = apiAnalysis;
  const windows = activeApproach === "better" ? analysis?.betterWindows : analysis?.windows;
  const activeWindow = windows?.[Math.min(step, windows.length - 1)];
  const activeApproachData = approaches.find((item) => item.id === activeApproach);

  useEffect(() => {
    if (invalid) {
      Promise.resolve().then(() => setApiAnalysis(null));
      Promise.resolve().then(() => setApiError(false));
      return;
    }

    const controller = new AbortController();
    Promise.resolve().then(() => setApiError(false));
    fetch(`${API_BASE}/api/clump-finding`, {
      body: JSON.stringify({ genome: cleanedGenome, k: safeK, l: safeL, t: safeT }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) {
          setApiAnalysis(data);
          setApiError(false);
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setApiAnalysis(null);
        setApiError(true);
      });

    return () => controller.abort();
  }, [cleanedGenome, invalid, safeK, safeL, safeT]);

  function resetStep() {
    setStep(0);
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function nextStep() {
    if (!windows) return;
    setStep((current) => Math.min(current + 1, windows.length - 1));
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Clump Finding Problem
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Problem pronalaženja grupa
          </h1>
          <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
            <p>
              Globalna učestalost k-mera nije uvek dovoljna za otkrivanje biološki
              važnih regiona. Često je važnije da li se obrazac ponavlja lokalno,
              unutar kratkog segmenta genoma.
            </p>
            <p>
              K-mer formira (L, t)-grupu ako postoji podniska dužine L u kojoj se
              taj k-mer pojavljuje najmanje t puta. Takvo lokalno grupisanje je
              važan signal pri traženju DnaA boksova i oriC regiona.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-3 md:grid-cols-2">
          {approaches.map((approach) => (
            <button
              className={`rounded-lg border p-5 text-left shadow-sm transition ${
                activeApproach === approach.id
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
              key={approach.id}
              onClick={() => {
                setActiveApproach(approach.id);
                setStep(0);
              }}
              type="button"
            >
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                {approach.badge}
              </span>
              <h2 className="mt-3 text-xl font-bold">{approach.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{approach.text}</p>
              <p className="mt-4 font-mono text-sm font-bold text-slate-800">
                {approach.complexity}
              </p>
            </button>
          ))}
        </section>

        <section className="mt-6 grid gap-5">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Algoritam
                </p>
                <h2 className="mt-2 text-2xl font-bold">{activeApproachData.title}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-sm font-bold text-slate-700">
                {activeApproachData.complexity}
              </span>
            </div>
            <pre className="mt-4 max-h-[300px] overflow-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              <code>{codeSamples[activeApproach]}</code>
            </pre>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Vizuelni prikaz
                </p>
                <h2 className="mt-2 text-2xl font-bold">Klizni L-prozor</h2>
                <p className="mt-1 text-sm text-slate-500">{activeApproachData.title}</p>
              </div>
              <button
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                onClick={resetStep}
                type="button"
              >
                Pokreni od početka
              </button>
            </div>

            <div className="mt-5 grid gap-4 rounded-lg bg-slate-50 p-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Genome
                <textarea
                  className="min-h-20 rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  onChange={(event) => {
                    setGenome(event.target.value);
                    setStep(0);
                  }}
                  value={genome}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  k
                  <input
                    className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    min="1"
                    onChange={(event) => {
                      setK(event.target.value);
                      setStep(0);
                    }}
                    type="number"
                    value={k}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  L
                  <input
                    className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    min="1"
                    onChange={(event) => {
                      setL(event.target.value);
                      setStep(0);
                    }}
                    type="number"
                    value={L}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  t
                  <input
                    className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    min="1"
                    onChange={(event) => {
                      setT(event.target.value);
                      setStep(0);
                    }}
                    type="number"
                    value={t}
                  />
                </label>
              </div>
            </div>

            {invalid && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                Unesi DNK sekvencu sa slovima A, C, G i T, uz uslov k &lt;= L &lt;= |Genome|.
              </div>
            )}

            {apiError && (
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                Backend nije dostupan. Pokreni FastAPI server da bi se rezultati izračunali.
              </div>
            )}

            {analysis && activeWindow && (
              <div className="mt-5 space-y-4">
                <GenomeWindow genome={cleanedGenome} k={safeK} L={safeL} start={activeWindow.start} />

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">Prozor</p>
                    <p className="mt-1 text-2xl font-bold">
                      {activeWindow.start + 1}/{windows.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">Segment</p>
                    <p className="mt-1 font-mono text-xl font-bold">
                      {activeWindow.start}-{activeWindow.start + safeL - 1}
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-sm text-emerald-700">Grupe u prozoru</p>
                    <p className="mt-1 text-2xl font-bold">{activeWindow.hits.length}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
                  <button
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    onClick={previousStep}
                    type="button"
                  >
                    Prethodni prozor
                  </button>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                    Prozor {activeWindow.start + 1} od {windows.length}
                  </span>
                  <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                    onClick={nextStep}
                    type="button"
                  >
                    Sledeći prozor
                  </button>
                </div>

                <WindowExplanation activeApproach={activeApproach} activeWindow={activeWindow} />
                <FrequencyTable activeWindow={activeWindow} t={safeT} />
              </div>
            )}
          </article>
        </section>

        {analysis && (
          <section className="mt-8">
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Rezultat</h2>
              <p className="mt-3 leading-7 text-slate-600">
                K-meri koji formiraju ({safeL}, {safeT})-grupe:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.clumpPatterns.length > 0 ? (
                  analysis.clumpPatterns.map((pattern) => (
                    <span
                      className="rounded-lg bg-emerald-100 px-3 py-2 font-mono font-bold text-emerald-800"
                      key={pattern}
                    >
                      {pattern}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-semibold text-slate-500">
                    Nema k-mera koji zadovoljavaju zadati prag.
                  </span>
                )}
              </div>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}
